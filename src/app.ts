import express from "express";
import cors from "cors";
import morgan from "morgan";

const PORT = 3000;
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check route
app.get("/", (req, res) => {
  res.json({ hello: "world1" });
});

export default app;
