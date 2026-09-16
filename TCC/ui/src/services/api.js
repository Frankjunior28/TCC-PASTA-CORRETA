const API_URL = "/api";

const request = async (url, options = {}) => {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), 12000);
  try {
    let response;
    try {
      response = await fetch(`${API_URL}${url}`, {
        headers: { "Content-Type": "application/json" },
        signal: controle.signal,
        ...options,
      });
    } catch (erro) {
      const causa =
        erro.name === "AbortError"
          ? "o servidor não respondeu a tempo (mais de 12 segundos)"
          : erro.message;
      throw new Error(
        `Não foi possível falar com o servidor (${causa}). Verifique se o backend está rodando.`,
        { cause: erro }
      );
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detalhe = data.error ? ` (${data.error})` : "";
      const mensagem =
        data.message ||
        `Erro ${response.status}${response.statusText ? ` - ${response.statusText}` : ""}`;
      throw new Error(mensagem + detalhe);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
};

export const fetchProdutos = () => request("/produtos");

export const createProduto = (produto) =>
  request("/produtos", { method: "POST", body: JSON.stringify(produto) });

export const updateProduto = (id, produto) =>
  request(`/produtos/${id}`, { method: "PUT", body: JSON.stringify(produto) });

export const deleteProduto = (id) => request(`/produtos/${id}`, { method: "DELETE" });

export const login = ({ email, senha, cpf, perfil }) =>
  request("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ email, senha, cpf, perfil }),
  });

export const cadastro = (dados) =>
  request("/usuarios", { method: "POST", body: JSON.stringify(dados) });

export const listarPedidos = () => request("/pedidos");

export const criarPedido = (pedido) =>
  request("/pedidos", { method: "POST", body: JSON.stringify(pedido) });

export const atualizarStatusPedido = (id, status) =>
  request(`/pedidos/${id}`, { method: "PUT", body: JSON.stringify({ status }) });

export const excluirPedido = (id) => request(`/pedidos/${id}`, { method: "DELETE" });