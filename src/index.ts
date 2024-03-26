import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
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

app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});
