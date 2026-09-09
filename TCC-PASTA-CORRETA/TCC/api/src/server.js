import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import transportadorRoutes from "./routes/TransportadorRoutes.js";
import gerenteRoutes from "./routes/gerenteRoutes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/transportadores", transportadorRoutes);
app.use("/api/gerentes", gerenteRoutes);

app.use((_req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada" });
});

app.use((erro, _req, res, _next) => {
  console.error("Erro inesperado:", erro);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tcc";

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET não definido no .env. Usando valor de desenvolvimento.");
  process.env.JWT_SECRET = "tcc-segredo-desenvolvimento";
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Banco de dados MongoDB conectado!");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => console.error("Erro no MongoDB:", error.message));