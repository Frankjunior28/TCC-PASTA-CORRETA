import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import gerenteRoutes from "./routes/gerenteRoutes.js";
import transportadorRoutes from "./routes/transportadorRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import { seedProdutos } from "./seed.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/gerentes", gerenteRoutes);
app.use("/api/transportadores", transportadorRoutes);
app.use("/api/produtos", produtoRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tcc";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Banco de dados MongoDB conectado!");
    await seedProdutos();
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => console.error("Erro no MongoDB:", error.message));