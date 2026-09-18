import Administrador from "../models/Administrador.js";

export const listarAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.find();
    res.status(200).json(administradores);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar administradores", error: error.message });
  }
};

export const criarAdministrador = async (req, res) => {
  try {
    const novoAdministrador = new Administrador(req.body);
    await novoAdministrador.save();
    res.status(201).json(novoAdministrador);
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao criar administrador", error: error.message });
  }
};

export const obterAdministrador = async (req, res) => {
  try {
    const administrador = await Administrador.findById(req.params.id);
    if (!administrador) return res.status(404).json({ mensagem: "Administrador não encontrado" });
    res.status(200).json(administrador);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar administrador", error: error.message });
  }
};

export const atualizarAdministrador = async (req, res) => {
  try {
    const administradorAtualizado = await Administrador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!administradorAtualizado) return res.status(404).json({ mensagem: "Administrador não encontrado" });
    res.status(200).json(administradorAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao atualizar administrador", error: error.message });
  }
};

export const deletarAdministrador = async (req, res) => {
  try {
    const administradorDeletado = await Administrador.findByIdAndDelete(req.params.id);
    if (!administradorDeletado) return res.status(404).json({ mensagem: "Administrador não encontrado" });
    res.status(200).json({ mensagem: "Administrador removido com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar administrador", error: error.message });
  }
};