import Pedido from "../models/pedido.js";

export const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos", error: error.message });
  }
};

export const buscarPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ message: "Pedido não encontrado" });
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedido", error: error.message });
  }
};

export const criarPedido = async (req, res) => {
  try {
    const { cliente, itens, total } = req.body;
    if (!cliente?.nome || !cliente?.email) {
      return res.status(400).json({ message: "Informe os dados do cliente" });
    }
    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ message: "O pedido precisa ter pelo menos um item" });
    }
    const novoPedido = await Pedido.create({
      cliente: { nome: cliente.nome, email: cliente.email },
      itens: itens.map((item) => ({
        produto: item.produto,
        preco: item.preco,
        qtd: item.qtd,
      })),
      total: Number(total) || 0,
    });
    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar pedido", error: error.message });
  }
};

export const atualizarStatusPedido = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pendente", "entregue", "cancelado"].includes(status)) {
      return res.status(400).json({ message: "Status inválido" });
    }
    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!pedidoAtualizado) return res.status(404).json({ message: "Pedido não encontrado" });
    res.status(200).json(pedidoAtualizado);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar pedido", error: error.message });
  }
};

export const deletarPedido = async (req, res) => {
  try {
    const pedidoDeletado = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedidoDeletado) return res.status(404).json({ message: "Pedido não encontrado" });
    res.status(200).json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar pedido", error: error.message });
  }
};