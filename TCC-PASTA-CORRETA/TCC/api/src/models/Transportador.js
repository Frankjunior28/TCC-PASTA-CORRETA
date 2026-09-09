import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const transportadorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true, maxlength: 120 },
    cpf: { type: String, required: true, trim: true, maxlength: 14 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"],
    },
    senha: { type: String, required: true, minlength: 6, select: false },
    telefone: { type: String, trim: true },
    tipoVeiculo: { type: String, default: "Caminhão" },
    status: { type: String, default: "Ativo" },
  },
  { timestamps: true }
);

transportadorSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

transportadorSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

transportadorSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.senha;
    return ret;
  },
});

export default mongoose.model("Transportador", transportadorSchema);