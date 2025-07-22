import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env';

// Configure Cloudinary
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  api_key: ENV.CLOUDINARY_KEY,
  api_secret: ENV.CLOUDINARY_SECRET,
  secure: true
});

export default cloudinary;