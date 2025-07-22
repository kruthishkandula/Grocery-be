import { Request, Response } from 'express';
import multer from 'multer';
import { _sendResponse } from '../../common/common';
import {
  uploadToCloudinary,
  getImageByPublicId,
  deleteFromCloudinary,
  updateImageMetadata,
  getUploads
} from './dal';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Upload image
export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: 'FAILURE',
        message: 'NO_FILE_UPLOADED',
      });
    }
    
    const folder = req.body.folder || 'groceryplus';
    const result = await uploadToCloudinary(req.file, folder);
    
    return _sendResponse({
      req,
      res,
      statusCode: 201,
      title: 'SUCCESS',
      message: 'IMAGE_UPLOAD_SUCCESS',
      result: {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
        folder: result.folder,
        created_at: result.created_at
      },
    });
  } catch (error: any) {
    console.error('Error in uploadImage:', error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: 'ERROR',
      message: error.message || 'Failed to upload image',
    });
  }
};

// Upload multiple images
export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: 'FAILURE',
        message: 'NO_FILES_UPLOADED',
      });
    }
    
    const folder = req.body.folder || 'groceryplus';
    const uploadPromises = (req.files as Express.Multer.File[]).map(file => 
      uploadToCloudinary(file, folder)
    );
    
    const results = await Promise.all(uploadPromises);
    
    return _sendResponse({
      req,
      res,
      statusCode: 201,
      title: 'SUCCESS',
      message: 'IMAGES_UPLOAD_SUCCESS',
      result: results.map(result => ({
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
        folder: result.folder,
        created_at: result.created_at
      })),
    });
  } catch (error: any) {
    console.error('Error in uploadMultipleImages:', error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: 'ERROR',
      message: error.message || 'Failed to upload images',
    });
  }
};

// Get image details - modified to use POST and body instead of params
export const getImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: 'FAILURE',
        message: 'PUBLIC_ID_REQUIRED',
      });
    }
    
    const result = await getImageByPublicId(publicId);
    
    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: 'SUCCESS',
      message: 'IMAGE_DETAILS_FETCHED',
      result,
    });
  } catch (error: any) {
    console.error('Error in getImage:', error);
    return _sendResponse({
      req,
      res,
      statusCode: error.http_code || 500,
      title: 'ERROR',
      message: error.message || 'Failed to get image',
    });
  }
};

// Delete image - modified to use POST and body instead of params
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: 'FAILURE',
        message: 'PUBLIC_ID_REQUIRED',
      });
    }
    
    const result = await deleteFromCloudinary(publicId);
    
    if (result.result !== 'ok') {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: 'FAILURE',
        message: 'IMAGE_DELETE_ERROR',
        result,
      });
    }
    
    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: 'SUCCESS',
      message: 'IMAGE_DELETED',
      result,
    });
  } catch (error: any) {
    console.error('Error in deleteImage:', error);
    return _sendResponse({
      req,
      res,
      statusCode: error.http_code || 500,
      title: 'ERROR',
      message: error.message || 'Failed to delete image',
    });
  }
};

// Update image metadata - modified to use POST and body for all parameters
export const updateImage = async (req: Request, res: Response) => {
  try {
    const { publicId, tags, folder } = req.body;
    
    if (!publicId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: 'FAILURE',
        message: 'PUBLIC_ID_REQUIRED',
      });
    }
    
    if (!tags && !folder) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: 'FAILURE',
        message: 'NOTHING_TO_UPDATE',
      });
    }
    
    const metadata: { tags?: string[], folder?: string } = {};
    
    if (tags) {
      metadata.tags = Array.isArray(tags) ? tags : [tags];
    }
    
    if (folder) {
      metadata.folder = folder;
    }
    
    const result = await updateImageMetadata(publicId, metadata);
    
    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: 'SUCCESS',
      message: 'IMAGE_UPDATED',
      result,
    });
  } catch (error: any) {
    console.error('Error in updateImage:', error);
    return _sendResponse({
      req,
      res,
      statusCode: error.http_code || 500,
      title: 'ERROR',
      message: error.message || 'Failed to update image',
    });
  }
};

// Get all uploads - modified to use POST and body for pagination parameters
export const getAllUploads = async (req: Request, res: Response) => {
  try {
    const { page = '1', pageSize = '20', folder } = req.body;

    // Convert to numbers in case they come as strings
    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    
    const result = await getUploads(pageNum, pageSizeNum, folder);
    
    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: 'SUCCESS',
      message: 'UPLOADS_FETCHED',
      result,
    });
  } catch (error: any) {
    console.error('Error in getAllUploads:', error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: 'ERROR',
      message: error.message || 'Failed to get uploads',
    });
  }
};