import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    telefone: { type: String, default: "" },
    cpf: { type: String, default: "" },
    tipoVeiculo: { type: String, default: "" },
    perfil: { type: String, default: "usuario" },
  },
  { timestamps: true }
);

const Usuario = mongoose.model("usuarios", usuarioSchema);

export default Usuario;