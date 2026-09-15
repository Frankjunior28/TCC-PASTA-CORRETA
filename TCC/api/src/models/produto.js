import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    descricao: { type: String, default: "" },
    tipo: { type: String, required: true },
    preco: { type: Number, required: true },
    foto: { type: String, default: "" },
    fotos: { type: [String], default: [] },
    estoque: { type: Number, default: 0 },
    publicado: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Produto = mongoose.model("produtos", produtoSchema);

export default Produto;
