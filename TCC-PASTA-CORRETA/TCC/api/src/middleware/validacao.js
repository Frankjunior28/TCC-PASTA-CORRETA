const PERFIS_VALIDOS = ["usuario", "gerente", "transportador"];

export const validarPerfil = (perfil) => PERFIS_VALIDOS.includes(perfil);

export const validarEmail = (email) =>
  typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const validarSenha = (senha) => typeof senha === "string" && senha.length >= 6;

export const verificarCamposObrigatorios = (dados, obrigatorios) =>
  obrigatorios.filter((campo) => {
    const valor = dados[campo];
    return valor === undefined || valor === null || String(valor).trim() === "";
  });