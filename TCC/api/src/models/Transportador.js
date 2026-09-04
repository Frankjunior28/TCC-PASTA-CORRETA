import mongoose from "mongoose";

const transportadorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cnpj: { type: String, required: true },
    telefone: { type: String },
    email: { type: String },
    status: { type: String, default: "Ativo" },
  },
  { timestamps: true }
);

export default mongoose.model("Transportador", transportadorSchema);
