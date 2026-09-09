const API_URL = "http://localhost:3000/api";

const obterToken = () => localStorage.getItem("tccToken");

const request = async (caminho, opcoes = {}) => {
  const headers = { "Content-Type": "application/json", ...(opcoes.headers || {}) };
  const token = obterToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers,
  });

  const dados = await response.json().catch(() => null);

  if (!response.ok) {
    const erro = new Error(dados?.mensagem || "Erro na requisição");
    erro.status = response.status;
    throw erro;
  }

  return dados;
};

export const entrar = (perfil, email, senha) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ perfil, email, senha }),
  });

export const cadastrar = (perfil, dados) =>
  request("/auth/registrar", {
    method: "POST",
    body: JSON.stringify({ perfil, ...dados }),
  });

export const listarTransportadores = () => request("/transportadores");