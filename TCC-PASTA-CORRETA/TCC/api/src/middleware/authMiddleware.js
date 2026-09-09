import jwt from "jsonwebtoken";

export const autenticar = (req, res, next) => {
  const cabecalho = req.headers.authorization;
  if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
    return res.status(401).json({ mensagem: "Token de autenticação não fornecido" });
  }

  const token = cabecalho.split(" ")[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
};

export const autorizar = (...perfisPermitidos) => (req, res, next) => {
  if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
    return res.status(403).json({ mensagem: "Acesso negado" });
  }
  next();
};