import jwt from "jsonwebtoken";
import Usuario from "../models/usuarios.js";
import Gerente from "../models/gerente.js";
import Transportador from "../models/Transportador.js";
import {
  validarEmail,
  validarPerfil,
  validarSenha,
  verificarCamposObrigatorios,
} from "../middleware/validacao.js";

const PERFIS_MODELOS = {
  usuario: Usuario,
  gerente: Gerente,
  transportador: Transportador,
};

const gerarToken = (id, perfil) =>
  jwt.sign({ id, perfil }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });

export const registrar = async (req, res) => {
  try {
    const { perfil, nome, email, senha } = req.body;

    if (!validarPerfil(perfil)) {
      return res.status(400).json({ mensagem: "Perfil inválido" });
    }
    if (!nome || String(nome).trim() === "") {
      return res.status(400).json({ mensagem: "O nome é obrigatório" });
    }
    if (!email || !validarEmail(email)) {
      return res.status(400).json({ mensagem: "Email inválido" });
    }
    if (!senha || !validarSenha(senha)) {
      return res.status(400).json({ mensagem: "A senha deve ter no mínimo 6 caracteres" });
    }

    const obrigatorios = perfil === "transportador" ? ["nome", "email", "senha", "cpf"] : ["nome", "email", "senha"];
    const faltando = verificarCamposObrigatorios(req.body, obrigatorios);
    if (faltando.length > 0) {
      return res.status(400).json({ mensagem: `Campos obrigatórios faltando: ${faltando.join(", ")}` });
    }

    const Modelo = PERFIS_MODELOS[perfil];
    const emailExistente = await Modelo.findOne({ email: email.toLowerCase() });
    if (emailExistente) {
      return res.status(409).json({ mensagem: "Este email já está cadastrado" });
    }

    const dados = { nome, email: email.toLowerCase(), senha };
    if (req.body.telefone) dados.telefone = req.body.telefone;
    if (req.body.cpf) dados.cpf = req.body.cpf;
    if (perfil === "transportador" && req.body.tipoVeiculo) dados.tipoVeiculo = req.body.tipoVeiculo;

    const novoUsuario = await Modelo.create(dados);
    const token = gerarToken(novoUsuario._id, perfil);

    res.status(201).json({
      mensagem: "Cadastro realizado com sucesso",
      token,
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        perfil,
        telefone: novoUsuario.telefone,
        cpf: novoUsuario.cpf,
        tipoVeiculo: novoUsuario.tipoVeiculo,
        cargo: novoUsuario.cargo,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao realizar cadastro", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { perfil, email, senha } = req.body;

    if (!validarPerfil(perfil)) {
      return res.status(400).json({ mensagem: "Perfil inválido" });
    }
    if (!email || !validarEmail(email)) {
      return res.status(400).json({ mensagem: "Email inválido" });
    }
    if (!senha || typeof senha !== "string") {
      return res.status(400).json({ mensagem: "Senha é obrigatória" });
    }

    const Modelo = PERFIS_MODELOS[perfil];
    const usuario = await Modelo.findOne({ email: email.toLowerCase() }).select("+senha");

    if (!usuario) {
      return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    const token = gerarToken(usuario._id, perfil);

    res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil,
        telefone: usuario.telefone,
        cpf: usuario.cpf,
        tipoVeiculo: usuario.tipoVeiculo,
        cargo: usuario.cargo,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao realizar login", error: error.message });
  }
};