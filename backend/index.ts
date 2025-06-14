import express from "express";
import cors from "cors";
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
import { conversationRouter } from "./controllers/conversationController";
import { testController } from "./controllers/sampleCall";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/conversation", conversationRouter);
app.use("/", testController);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
