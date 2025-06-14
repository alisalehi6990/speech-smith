import express from "express";
import cors from "cors";
import { conversationRouter } from "./controllers/conversationController";
import { testController } from "./controllers/sampleCall";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/conversation", conversationRouter);
app.use("/", testController);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
