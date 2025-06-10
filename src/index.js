import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import leagueRoutes from "./routes/leagueRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;
job.start();

app.use("/api/auth", authRoutes);
app.use("/api/leagues", leagueRoutes);
app.use("/api/matches", matchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});
