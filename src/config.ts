import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  developmentMode: process.env.NODE_ENV == "development"
};