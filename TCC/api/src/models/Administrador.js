import mongoose from "mongoose";

const administradorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cpf: { type: String, required: true },
    telefone: { type: String },
    cargo: { type: String, default: "Administrador Master" },
    status: { type: String, default: "Ativo" },
  },
  { timestamps: true }
);

export default mongoose.model("Administrador", administradorSchema);