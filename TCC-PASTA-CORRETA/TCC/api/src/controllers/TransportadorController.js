import bcrypt from "bcryptjs";
import Transportador from "../models/Transportador.js";

export const listarTransportadores = async (req, res) => {
  try {
    const transportadores = await Transportador.find();
    res.status(200).json(transportadores);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar transportadores", error: error.message });
  }
};

export const criarTransportador = async (req, res) => {
  try {
    const novoTransportador = new Transportador(req.body);
    await novoTransportador.save();
    res.status(201).json(novoTransportador);
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao criar transportador", error: error.message });
  }
};

export const obterTransportador = async (req, res) => {
  try {
    const transportador = await Transportador.findById(req.params.id);
    if (!transportador) return res.status(404).json({ mensagem: "Transportador não encontrado" });
    res.status(200).json(transportador);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar transportador", error: error.message });
  }
};

export const atualizarTransportador = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (dados.senha) {
      if (dados.senha.length < 6) {
        return res.status(400).json({ mensagem: "A senha deve ter no mínimo 6 caracteres" });
      }
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }
    const transportadorAtualizado = await Transportador.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true,
    });
    if (!transportadorAtualizado) return res.status(404).json({ mensagem: "Transportador não encontrado" });
    res.status(200).json(transportadorAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao atualizar transportador", error: error.message });
  }
};

export const deletarTransportador = async (req, res) => {
  try {
    const transportadorDeletado = await Transportador.findByIdAndDelete(req.params.id);
    if (!transportadorDeletado) return res.status(404).json({ mensagem: "Transportador não encontrado" });
    res.status(200).json({ mensagem: "Transportador removido com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar transportador", error: error.message });
  }
};