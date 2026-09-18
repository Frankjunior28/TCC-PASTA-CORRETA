import Usuario from "../models/usuarios.js";

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
  }
};

export const buscarUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-senha");
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
  }
};

export const criarUsuario = async (req, res) => {
  try {
    const perfil = req.body.perfil || "usuario";
    const existe = await Usuario.findOne({ email: req.body.email, perfil });
    if (existe) return res.status(409).json({ message: "Email já cadastrado para este perfil" });

    const novoUsuario = await Usuario.create(req.body);
    const { senha, ...semSenha } = novoUsuario.toObject();
    res.status(201).json(semSenha);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email já cadastrado para este perfil" });
    }
    res.status(400).json({ message: "Erro ao criar usuário", error: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha, cpf, perfil } = req.body;
    const query = { email, ...(perfil ? { perfil } : {}) };
    const usuario = await Usuario.findOne(query);
    if (!usuario) return res.status(401).json({ message: "Email ou senha inválidos" });

    if (perfil && usuario.perfil !== perfil) {
      return res.status(401).json({ message: "Conta não encontrada para o perfil selecionado" });
    }

    const ehCorporativo = ["gerente", "administrador"].includes(usuario.perfil);

    if (ehCorporativo) {
      const cpfDigitado = String(cpf || "").replace(/\D/g, "");
      const cpfSalvo = String(usuario.cpf || "").replace(/\D/g, "");
      if (!cpfSalvo || cpfDigitado !== cpfSalvo) {
        return res.status(401).json({ message: "Email ou CPF inválidos" });
      }
    } else if (!usuario.senha || usuario.senha !== senha) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const { senha: _, ...semSenha } = usuario.toObject();
    res.status(200).json(semSenha);
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login", error: error.message });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-senha");
    if (!usuarioAtualizado) return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar usuário", error: error.message });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) return res.status(404).json({ message: "Usuário não encontrado" });
    res.status(200).json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário", error: error.message });
  }
};