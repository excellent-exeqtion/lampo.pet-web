import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    MAILTRAP_URL: process.env.MAILTRAP_URL,
    MAILTRAP_TO: process.env.MAILTRAP_TO,
    MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
    MAILTRAP_FROM: process.env.MAILTRAP_FROM,
    MAILTRAP_PROJECT: process.env.MAILTRAP_PROJECT,
    MAILTRAP_SUBJECT: process.env.MAILTRAP_SUBJECT,
  }
};

export default nextConfig;
