import { useEffect, useState, useCallback } from "react";
import * as api from "./services/api";
import { PRODUTOS_FALLBACK } from "./constants";
import { LoginScreen } from "./components/LoginScreen";
import { LojaScreen } from "./components/LojaScreen";
import { ProdutoScreen } from "./components/ProdutoScreen";
import { CarrinhoScreen } from "./components/CarrinhoScreen";
import { GerenteScreen } from "./components/GerenteScreen";
import { EntregadorScreen } from "./components/EntregadorScreen";

const carregarState = (chave, padrao) => {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
};

const salvarState = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

function App() {
  const [view, setView] = useState("login");
  const [perfil, setPerfil] = useState("usuario");
  const [modo, setModo] = useState("login");
  const [campos, setCampos] = useState({});
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [offline, setOffline] = useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  const [carrinho, setCarrinho] = useState(() => carregarState("tccCarrinho", []));
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [toast, setToast] = useState("");

  const mostrarToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    api
      .fetchProdutos()
      .then((dados) => {
        setProdutos(dados.map((p) => ({ ...p, id: p._id })));
      })
      .catch(() => {
        setProdutos(PRODUTOS_FALLBACK);
        setOffline(true);
      })
      .finally(() => setCarregandoProdutos(false));
  }, []);

  useEffect(() => salvarState("tccCarrinho", carrinho), [carrinho]);

  const recarregarProdutos = async () => {
    try {
      const dados = await api.fetchProdutos();
      setProdutos(dados.map((p) => ({ ...p, id: p._id })));
    } catch {
      /* mantém estado atual */
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
  };

  const mudarPerfil = (tipo) => {
    setPerfil(tipo);
    setCampos({});
  };

  const entrar = (usuario) => {
    setUsuarioLogado(usuario);
    const rotas = {
      gerente: "gerente",
      transportador: "entregador",
    };
    setView(rotas[usuario.perfil] || "loja");
  };

  const aoLogin = async ({ email, senha }) => {
    const usuario = await api.login({ email, senha });
    entrar(usuario);
  };

  const aoCadastro = async (dados) => {
    const usuario = await api.cadastro({ ...dados, perfil });
    entrar({ ...usuario, perfil });
  };

  const sair = () => {
    setUsuarioLogado(null);
    setCampos({});
    setPerfil("usuario");
    setModo("login");
    setProdutoSelecionado(null);
    setView("login");
  };

  const adicionarCarrinho = (produto) => {
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === produto.id ? { ...item, qtd: item.qtd + 1 } : item
        );
      }
      return [...prev, { id: produto.id, nome: produto.nome, preco: produto.preco, foto: produto.foto, qtd: 1 }];
    });
    mostrarToast(`${produto.nome} adicionado ao carrinho!`);
  };

  const aoSalvarProduto = async (dados, id) => {
    if (offline) {
      if (id) {
        setProdutos((prev) => prev.map((p) => (p.id === id ? { ...p, ...dados } : p)));
      } else {
        setProdutos((prev) => [...prev, { id: "local-" + Date.now(), ...dados }]);
      }
      return;
    }
    try {
      if (id) {
        await api.updateProduto(id, dados);
      } else {
        await api.createProduto(dados);
      }
      await recarregarProdutos();
    } catch (err) {
      alert("Erro ao salvar produto: " + err.message);
    }
  };

  const aoExcluirProduto = async (id) => {
    if (offline) {
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    try {
      await api.deleteProduto(id);
      await recarregarProdutos();
    } catch (err) {
      alert("Erro ao excluir produto: " + err.message);
    }
  };

  const aoAlternarPublicacao = async (produto) => {
    const dados = { ...produto, publicado: !produto.publicado };
    delete dados.id;
    delete dados._id;
    delete dados.createdAt;
    delete dados.updatedAt;
    const id = produto.id;
    if (offline) {
      setProdutos((prev) => prev.map((p) => (p.id === id ? { ...p, ...dados } : p)));
      return;
    }
    try {
      await api.updateProduto(id, dados);
      await recarregarProdutos();
    } catch (err) {
      alert("Erro ao atualizar: " + err.message);
    }
  };

  return (
    <>
      {view === "login" && (
        <LoginScreen
          perfil={perfil}
          modo={modo}
          campos={campos}
          handleChange={handleChange}
          mudarPerfil={mudarPerfil}
          setModo={setModo}
          aoLogin={aoLogin}
          aoCadastro={aoCadastro}
        />
      )}

      {view === "loja" && (
        <LojaScreen
          usuario={usuarioLogado}
          produtos={produtos}
          carrinho={carrinho}
          offline={offline}
          carregando={carregandoProdutos}
          onAbrirProduto={(p) => {
            setProdutoSelecionado(p);
            setView("produto");
          }}
          onAbrirCarrinho={() => setView("carrinho")}
          onAdicionarCarrinho={adicionarCarrinho}
          onSair={sair}
        />
      )}

      {view === "produto" && (
        <ProdutoScreen
          usuario={usuarioLogado}
          produto={produtoSelecionado}
          onComprar={() => {
            adicionarCarrinho(produtoSelecionado);
            setView("carrinho");
          }}
          onAdicionar={() => {
            adicionarCarrinho(produtoSelecionado);
          }}
          onVoltar={() => setView("loja")}
          onSair={sair}
        />
      )}

      {view === "carrinho" && (
        <CarrinhoScreen
          usuario={usuarioLogado}
          carrinho={carrinho}
          setCarrinho={setCarrinho}
          onVoltar={() => setView("loja")}
          onSair={sair}
        />
      )}

      {view === "gerente" && (
        <GerenteScreen
          usuario={usuarioLogado}
          produtos={produtos}
          onSalvar={aoSalvarProduto}
          onExcluir={aoExcluirProduto}
          onAlternar={aoAlternarPublicacao}
          onVerLoja={() => setView("loja")}
          onSair={sair}
          offline={offline}
        />
      )}

      {view === "entregador" && (
        <EntregadorScreen usuario={usuarioLogado} onSair={sair} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default App;