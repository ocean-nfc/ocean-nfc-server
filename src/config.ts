import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  notify: process.env.NOTIFY == "no",
  developmentMode: process.env.NODE_ENV == "development",
  deploymentUrl: "https://oceannfc.herokuapp.com",
};