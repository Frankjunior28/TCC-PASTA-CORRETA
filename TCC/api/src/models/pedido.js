import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      nome: { type: String, required: true },
      email: { type: String, required: true },
    },
    itens: [
      {
        produto: { type: String, required: true },
        preco: { type: Number, required: true },
        qtd: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pendente", "entregue", "cancelado"],
      default: "pendente",
    },
  },
  { timestamps: true }
);

const Pedido = mongoose.model("pedidos", pedidoSchema);

export default Pedido;