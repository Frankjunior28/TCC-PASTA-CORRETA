import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import transportadorRoutes from "./routes/transportadorRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/transportadores", transportadorRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tcc";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Banco de dados MongoDB conectado!");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => console.error("Erro no MongoDB:", error.message));