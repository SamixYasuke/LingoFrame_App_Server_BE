import cors from "cors";
import "./jobs/handlers/email.handler";
import "./jobs/handlers/payment.handler";
import apiRouter from "./routes/index";
import specs from "./config/swagger.config";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./errors/errorHandlers";
import setupBullBoard from "./config/bullboard.config";
import initializeDatabaseandServer from "./data-source";
import express, { Request, Response, Application } from "express";
import CookieParser from "cookie-parser";

const app: Application = express();
const serverAdapter = setupBullBoard();
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://lingoframe-landing-page.vercel.app",
      ];
      console.log("Request Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(CookieParser());
app.use("/ui", serverAdapter.getRouter());
app.use("/api", apiRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1>Hello, this is an API for Vid2Srt made by Adekolu Samuel(Samixx Yasuke) 😊 </h1>"
  );
});

initializeDatabaseandServer(app);
