export enum STATUS_CODE {
  '200' = 200,
  '400' = 400,
  '401' = 401,
  '403' = 403,
  '404' = 404,
  '500' = 500,
}

export enum STATUS_TYPES {
  FAILURE = "FAILURE",
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
  NOT_FOUND = "NOT_FOUND",
  ERROR = "ERROR",
}

export enum MESSAGE_TYPES {
  FAVOURITE_NOT_FOUND = "FAVOURITE_NOT_FOUND",
  MISSING_REQUIRED_FIELDS = "MISSING_REQUIRED_FIELDS",
  SOMETHING_WENT_WRONG = "SOMETHING_WENT_WRONG",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",

  YOU_ARE_ON_SERVER = "YOU ARE ON SERVER",

  FAVOURITE_CREATED_SUCCESFULLY = "FAVOURITE_CREATED_SUCCESFULLY",
  FAVOURITE_UPDATED_SUCCESFULLY = "FAVOURITE_UPDATED_SUCCESFULLY",
  FAVOURITE_DELETED_SUCCESFULLY = "FAVOURITE_DELETED_SUCCESFULLY",
  FAVOURITES_FETCHED_SUCCESFULLY = "FAVOURITES_FETCHED_SUCCESFULLY",

  FAVOURITE_CREATE_ERROR = "FAILED TO CREATE FAVOURITE",
  FAVOURITE_UPDATE_ERROR = "FAILED TO UPDATE FAVOURITE",
  FAVOURITE_DELETE_ERROR = "FAILED TO DELETE FAVOURITE",
  FAVOURITE_FETCH_ERROR = "FAILED TO FETCH FAVOURITES",

  USER_REGISTERED_SUCCESSFULLY = "Account registered successfully",
  USER_LOGIN_SUCCESSFUL = "User successfully logged in",
  USER_ALREADY_EXISTS = "User already exists",
  USER_EMAIL_ALREADY_EXISTS = "Email already exists",
  USER_USERNAME_ALREADY_EXISTS = "Username already exists",
  USER_ID_REQUIRED = "User ID is required",

  FAILED_TO_FETCH_COUNT = "Failed to fetch count.",
  FETCHED_DASHBOARD_DATA = "Fetched dashboard data successfully",
  FAILED_TO_FETCH_DASHBOARD_DATA = "Failed to fetch dashboard data",


  QUOTE_GENERATION_FAILED = "Quote generation failed",
  ORDER_QUOTE_DETAILS_FETCHED = "Order Quote details fetched successfully",
  ORDER_DETAILS_FETCHED = "Order details fetched successfully",
  ORDER_DETAILS_FETCH_ERROR = "Failed to fetch order details",
  ORDER_CREATED = "Order created successfully",
  ORDER_CREATION_ERROR = "Failed to create order",
  ORDER_UPDATED = "Order updated successfully",
  ORDER_UPDATE_ERROR = "Failed to update order",

  PAYMENT_NOT_FOUND = "Payment not found",
  PAYMENT_CREATED = "Payment created successfully",
  PAYMENT_CREATION_ERROR = "Failed to create payment",
  PAYMENT_CREATION_FAILED = "Payment creation failed",
  PAYMENT_UPDATED = "Payment updated successfully",
  PAYMENT_UPDATE_ERROR = "Failed to update payment",
  PAYMENT_AMOUNT_MISMATCH = "Payment amount mismatch with quote details",

  UNAUTHORIZED_ACCESS = "Unauthorized access to payment",

  ALL_ORDERS_FETCHED = "All orders fetched successfully",
  ORDER_ID_AND_STATUS_REQUIRED = "Order ID and status are required for updating order status",
  ORDER_STATUS_UPDATED = "Order status updated successfully",
  ORDER_STATUS_UPDATE_ERROR = "Failed to update order status",
  ORDER_NOT_FOUND = "Order not found",
  ORDER_ALREADY_EXISTS = "Order already exists for the user",
  ORDER_ID_REQUIRED = "Order ID is required to fetch order details",
  ORDERS_FETCH_ERROR = "Failed to fetch orders for the user",
  NO_ORDERS_FOUND = "No orders found for the user",
  ORDER_CREATION_FAILED = "Failed to create order",
  ORDER_STATUS_UPDATE_FAILED = "Failed to update order status",

  PRODUCT_DETAILS_REQUIRED = "Product details are required to create a product",

  // New image upload related message types
  IMAGE_UPLOAD_SUCCESS = "Image uploaded successfully",
  IMAGES_UPLOAD_SUCCESS = "Images uploaded successfully",
  IMAGE_UPLOAD_ERROR = "Failed to upload image",
  IMAGES_UPLOAD_ERROR = "Failed to upload images",
  NO_FILE_UPLOADED = "No file uploaded",
  NO_FILES_UPLOADED = "No files uploaded",

  IMAGE_DETAILS_FETCHED = "Image details retrieved successfully",
  IMAGE_DETAILS_FETCH_ERROR = "Failed to get image details",

  IMAGE_DELETED = "Image deleted successfully",
  IMAGE_DELETE_ERROR = "Failed to delete image",

  IMAGE_UPDATED = "Image updated successfully",
  IMAGE_UPDATE_ERROR = "Failed to update image",

  PUBLIC_ID_REQUIRED = "Public ID is required",
  NOTHING_TO_UPDATE = "Nothing to update",

  UPLOADS_FETCHED = "Uploads retrieved successfully",
  UPLOADS_FETCH_ERROR = "Failed to get uploads",

  INVALID_IMAGE_FORMAT = "Only image files are allowed",
  IMAGE_SIZE_EXCEEDED = "Image size exceeds the limit"
}




export type STATUS_CODES_TYPE = 200 | 201 | 400 | 401 | 403 | 404 | 500;
export type MESSAGE_TYPES_TYPE = keyof typeof MESSAGE_TYPES;
export type STATUS_TYPES_TYPE = keyof typeof STATUS_TYPES;