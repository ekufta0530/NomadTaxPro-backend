import dotenv from "dotenv";
dotenv.config();

export const base_url = process.env.BASE_URL;
export const api_host = process.env.API_HOST;
export const email_address = process.env.EMAIL_ADDRESS;
export const jwt_secret = process.env.JWT_SECRET;
