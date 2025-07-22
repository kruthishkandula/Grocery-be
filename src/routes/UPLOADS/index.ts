import express from 'express';
import { 
  upload,
  uploadImage,
  uploadMultipleImages,
  getImage,
  deleteImage,
  updateImage,
  getAllUploads
} from './service';

const router = express.Router();

// Upload a single image
router.post('/image', upload.single('image'), uploadImage);

// Upload multiple images
router.post('/images', upload.array('images', 10), uploadMultipleImages);

// Get image details - changed to POST
router.post('/image/details', getImage);

// Delete image - changed to POST
router.post('/image/delete', deleteImage);

// Update image metadata - changed to POST
router.post('/image/update', updateImage);

// Get all uploads - changed to POST
router.post('/images/list', getAllUploads);

export { router as UPLOADS };