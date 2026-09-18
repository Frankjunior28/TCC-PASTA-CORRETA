const API_URL = "/api";

const MENSAGENS_POR_STATUS = {
  400: "Os dados enviados estão inválidos ou incompletos.",
  401: "Credenciais incorretas. Verifique email, senha e CPF e tente novamente.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "O recurso solicitado não foi encontrado.",
  409: "Este registro já existe no sistema. Use outro valor ou entre na conta correspondente.",
  500: "O servidor encontrou um erro interno. Tente novamente em instantes.",
};

const extrairDetalhe = (data) => {
  if (!data || data.error == null) return "";
  const detalhe =
    typeof data.error === "string" ? data.error : data.error?.message || String(data.error);
  return detalhe ? ` (${detalhe})` : "";
};

const montarMensagem = (status, data) => {
  const texto = data?.message || data?.mensagem || "";
  if (texto) return texto + extrairDetalhe(data);
  return MENSAGENS_POR_STATUS[status] || `Erro ${status}${data?.statusText ? ` — ${data.statusText}` : ""}`;
};

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
      throw new Error(montarMensagem(response.status, data), { cause: new Error(`HTTP ${response.status}`) });
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
};

export const mensagemClaraDeErro = (erro, contexto = "concluir esta operação") => {
  const causa = (erro?.message || "").trim();
  if (!causa) return `Não foi possível ${contexto}. Ocorreu um erro inesperado; tente novamente.`;
  return `Não foi possível ${contexto}: ${causa}`;
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

export const listarGerentes = () => request("/gerentes");

export const criarGerente = (gerente) =>
  request("/gerentes", { method: "POST", body: JSON.stringify(gerente) });

export const deletarGerente = (id) => request(`/gerentes/${id}`, { method: "DELETE" });