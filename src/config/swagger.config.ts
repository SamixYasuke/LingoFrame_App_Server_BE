import swaggerJsdoc, { OAS3Definition } from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV === "development";
const swaggerJsonUrl = NODE_ENV ? process.env.DEV_URL : process.env.PROD_URL;

const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "Vid2Srt Docs",
    version: "1.0.0",
    description:
      "The Vid2Srt API enables seamless integration, providing endpoints for managing user authentication and video subtitle generation/merging",
  },
  servers: [
    {
      url: swaggerJsonUrl,
      description: NODE_ENV ? "Local Server" : "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/docs/*.ts"],
};

const specs = swaggerJsdoc(options);

export default specs;
