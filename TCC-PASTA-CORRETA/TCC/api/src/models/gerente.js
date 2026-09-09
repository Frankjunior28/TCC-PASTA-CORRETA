import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const gerenteSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true, maxlength: 120 },
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
    cpf: { type: String, trim: true },
    cargo: { type: String, default: "Gerente" },
  },
  { timestamps: true }
);

gerenteSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

gerenteSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

gerenteSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.senha;
    return ret;
  },
});

const Gerente = mongoose.model("gerentes", gerenteSchema);

export default Gerente;