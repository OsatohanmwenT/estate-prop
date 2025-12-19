import "dotenv";

export const APP_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "",
  IMAGEKIT: {
    URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "",
  }
};
