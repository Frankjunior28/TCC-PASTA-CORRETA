const API_URL = "/api";

const request = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição");
  }
  return data;
};

export const fetchProdutos = () => request("/produtos");

export const createProduto = (produto) =>
  request("/produtos", { method: "POST", body: JSON.stringify(produto) });

export const updateProduto = (id, produto) =>
  request(`/produtos/${id}`, { method: "PUT", body: JSON.stringify(produto) });

export const deleteProduto = (id) => request(`/produtos/${id}`, { method: "DELETE" });

export const login = ({ email, senha }) =>
  request("/usuarios/login", { method: "POST", body: JSON.stringify({ email, senha }) });

export const cadastro = (dados) =>
  request("/usuarios", { method: "POST", body: JSON.stringify(dados) });