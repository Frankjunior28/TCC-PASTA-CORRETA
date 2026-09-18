import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    telefone: { type: String, default: "" },
    cpf: { type: String, default: "" },
    perfil: { type: String, default: "usuario" },
  },
  { timestamps: true }
);

usuarioSchema.index({ email: 1, perfil: 1 }, { unique: true });

const Usuario = mongoose.model("usuarios", usuarioSchema);

export default Usuario;