import Usuario from "../models/usuarios.js";

export const listarUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar usuários", error: error.message });
  }
};

export const buscarUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ mensagem: "ID inválido", error: error.message });
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || String(nome).trim() === "") {
      return res.status(400).json({ mensagem: "O nome é obrigatório" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ mensagem: "Email inválido" });
    }
    if (!senha || senha.length < 6) {
      return res.status(400).json({ mensagem: "A senha deve ter no mínimo 6 caracteres" });
    }

    const novoUsuario = await Usuario.create({ nome, email, senha, telefone });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao criar usuário", error: error.message });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (dados.senha && dados.senha.length < 6) {
      return res.status(400).json({ mensagem: "A senha deve ter no mínimo 6 caracteres" });
    }
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true,
    });
    if (!usuarioAtualizado) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao atualizar usuário", error: error.message });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.status(200).json({ mensagem: "Usuário removido com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar usuário", error: error.message });
  }
};