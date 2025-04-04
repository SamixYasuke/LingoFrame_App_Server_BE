import mongoose from "mongoose";
import dotenv from "dotenv";
import { Application } from "express";
import ngrok from "ngrok";

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_DEV_URI
    : process.env.MONGODB_PROD_URI;

const initializeDatabaseAndServer = async (app: Application): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI as string);
    app.listen(PORT, async () => {
      if (NODE_ENV === "development") {
        (async () => {
          try {
            const url = await ngrok.connect(Number(PORT));
            console.log(`ngrok tunnel is live at: ${url}`);
          } catch (error) {
            console.error("Error starting ngrok:", error);
          }
        })();
      }
      console.log(`App is running on port ${PORT}`);
      console.log(`Database has connected successfully`);
    });
  } catch (error) {
    console.error(`Error connecting to the server: ${error}`);
    process.exit(1);
  }
};

export default initializeDatabaseAndServer;
