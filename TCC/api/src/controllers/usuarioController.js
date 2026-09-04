// src/controllers/usuariocontroller.js

export const listarUsuarios = async (req, res) => {
    try {
      return res.status(200).json({ message: "Lista de usuários" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuários", error: error.message });
    }
  };
  
  export const buscarUsuarioPorId = async (req, res) => {
    try {
      const { id } = req.params;
      return res.status(200).json({ message: `Buscando usuário ${id}` });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
  };
  
  export const criarUsuario = async (req, res) => {
    try {
      return res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
    }
  };
  
  export const atualizarUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      return res.status(200).json({ message: `Usuário ${id} atualizado com sucesso!` });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar usuário", error: error.message });
    }
  };
  
  export const deletarUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      return res.status(200).json({ message: `Usuário ${id} deletado` });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar usuário", error: error.message });
    }
  };