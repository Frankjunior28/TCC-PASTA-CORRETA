import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import gerenteRoutes from "./routes/gerenteRoutes.js";
import transportadorRoutes from "./routes/transportadorRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import { seedProdutos } from "./seed.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/gerentes", gerenteRoutes);
app.use("/api/transportadores", transportadorRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_PATH = path.resolve(__dirname, "../../ui/dist");

app.use(express.static(DIST_PATH));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(DIST_PATH, "index.html"));
  }
  next();
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tcc";

if (MONGO_URI.includes("TROQUE") || MONGO_URI.includes("SUBSTITUA")) {
  console.warn(
    "⚠️  MONGO_URI ainda contém o host de exemplo (TROQUE-PELO-HOST/SUBSTITUA).\n" +
      "   Edite o arquivo api/.env com o endereço real do seu MongoDB Atlas.\n" +
      "   No Atlas: Database → Connect → Drivers → copie o host entre '@' e '.mongodb.net'."
  );
}

const iniciarServidor = () =>
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

mongoose
  .connect(MONGO_URI, { bufferCommands: false })
  .then(async () => {
    console.log("Banco de dados MongoDB conectado!");
    await seedProdutos();
    iniciarServidor();
  })
  .catch((error) => {
    console.error("Erro no MongoDB:", error.message);
    console.warn("⚠️  Modo demonstração: o site abre, mas contas/produtos/vendas não serão salvos.");
    iniciarServidor();
  });