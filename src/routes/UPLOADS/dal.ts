import cloudinary from '../../config/cloudinary';
import { sql } from "drizzle-orm";
import { db } from "../../config/db";

// Upload image to Cloudinary
export const uploadToCloudinary = async (file: Express.Multer.File, folder = 'groceryplus') => {
  try {
    // Convert file buffer to base64
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: 'auto',
    });
    
    // Save upload record to database
    await saveUploadRecord({
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      resourceType: result.resource_type,
      folder,
      createdAt: new Date()
    });
    
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Get image by public ID
export const getImageByPublicId = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting image from Cloudinary:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    // Remove from database
    if (result.result === 'ok') {
      await deleteUploadRecord(publicId);
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Update image tags or folder
export const updateImageMetadata = async (publicId: string, metadata: { tags?: string[], folder?: string }) => {
  try {
    const updates: any = {};
    
    if (metadata.tags) {
      updates.tags = metadata.tags;
    }
    
    if (metadata.folder) {
      updates.folder = metadata.folder;
    }
    
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      ...updates
    });
    
    return result;
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw error;
  }
};

// Save upload record to database
const saveUploadRecord = async (uploadData: {
  publicId: string;
  url: string;
  format: string;
  resourceType: string;
  folder: string;
  createdAt: Date;
}) => {
  try {
    const result = await db.execute(sql`
      INSERT INTO image_uploads (
        public_id,
        url,
        format,
        resource_type,
        folder,
        created_at
      ) VALUES (
        ${uploadData.publicId},
        ${uploadData.url},
        ${uploadData.format},
        ${uploadData.resourceType},
        ${uploadData.folder},
        ${uploadData.createdAt}
      )
      ON CONFLICT (public_id) DO UPDATE SET
        url = ${uploadData.url},
        format = ${uploadData.format},
        resource_type = ${uploadData.resourceType},
        folder = ${uploadData.folder}
      RETURNING *
    `);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error saving upload record:', error);
    // Continue execution even if DB save fails - this is not critical
  }
};

// Delete upload record from database
const deleteUploadRecord = async (publicId: string) => {
  try {
    await db.execute(sql`
      DELETE FROM image_uploads
      WHERE public_id = ${publicId}
    `);
  } catch (error) {
    console.error('Error deleting upload record:', error);
    // Continue execution even if DB delete fails - this is not critical
  }
};

// Get all uploads from database with pagination
export const getUploads = async (page = 1, pageSize = 20, folder?: string) => {
  try {
    let query = sql`
      SELECT * FROM image_uploads
    `;
    
    if (folder) {
      query = sql`
        SELECT * FROM image_uploads
        WHERE folder = ${folder}
      `;
    }
    
    query = sql`
      ${query}
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `;
    
    const result = await db.execute(query);
    
    // Get total count for pagination
    let countQuery = sql`SELECT COUNT(*) FROM image_uploads`;
    
    if (folder) {
      countQuery = sql`
        SELECT COUNT(*) FROM image_uploads
        WHERE folder = ${folder}
      `;
    }
    
    const countResult = await db.execute(countQuery);
    const totalCount = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      pagination: {
        page,
        pageSize,
        pageCount: Math.ceil(totalCount / pageSize),
        total: totalCount
      }
    };
  } catch (error) {
    console.error('Error getting uploads:', error);
    throw error;
  }
};