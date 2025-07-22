import axios from "axios";
import { ENV } from "./env";

// Add cmsApi to your ENV or config if not already present
export const cmsApi = axios.create({
  baseURL: ENV.CMS_API, // Make sure process.env.CMS_API is set in your .env
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${ENV.CMS_TOKEN}`,
  },
});
