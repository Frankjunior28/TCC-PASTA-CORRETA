import bcrypt from "bcryptjs";
import Gerente from "../models/gerente.js";

export const listarGerentes = async (req, res) => {
  try {
    const gerentes = await Gerente.find();
    res.status(200).json(gerentes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar gerentes", error: error.message });
  }
};

export const buscarGerentePorId = async (req, res) => {
  try {
    const gerente = await Gerente.findById(req.params.id);
    if (!gerente) return res.status(404).json({ message: "Gerente não encontrado" });
    res.status(200).json(gerente);
  } catch (error) {
    res.status(500).json({ message: "ID inválido", error: error.message });
  }
};

export const criarGerente = async (req, res) => {
  try {
    const novoGerente = await Gerente.create(req.body);
    res.status(201).json(novoGerente);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar gerente", error: error.message });
  }
};

export const atualizarGerente = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (dados.senha) {
      if (dados.senha.length < 6) {
        return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres" });
      }
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }
    const gerenteAtualizado = await Gerente.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true,
    });
    if (!gerenteAtualizado) return res.status(404).json({ message: "Gerente não encontrado" });
    res.status(200).json(gerenteAtualizado);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar gerente", error: error.message });
  }
};

export const deletarGerente = async (req, res) => {
  try {
    const gerenteDeletado = await Gerente.findByIdAndDelete(req.params.id);
    if (!gerenteDeletado) return res.status(404).json({ message: "Gerente não encontrado" });
    res.status(200).json({ message: "Gerente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar gerente", error: error.message });
  }
};