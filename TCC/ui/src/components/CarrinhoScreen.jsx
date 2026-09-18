import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FotoProduto } from "./FotoProduto";
import { formatarPreco } from "../constants";
import * as api from "../services/api";

export function CarrinhoScreen({ usuario, carrinho, setCarrinho, onVoltar, onSair, onTrocarConta, offline }) {
  const [salvando, setSalvando] = useState(false);
  const [erroPedido, setErroPedido] = useState("");

  const alterarQtd = (id, delta) => {
    setCarrinho((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qtd: item.qtd + delta } : item))
        .filter((item) => item.qtd > 0)
    );
  };

  const remover = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.qtd, 0);

  const finalizarCompra = async () => {
    if (offline) {
      setCarrinho([]);
      alert("Compra finalizada com sucesso! Obrigado pela preferência. 🪑");
      return;
    }
    setSalvando(true);
    setErroPedido("");
    try {
      await api.criarPedido({
        cliente: {
          nome: usuario?.nome || "Cliente",
          email: usuario?.email || "",
        },
        itens: carrinho.map((item) => ({
          produto: item.nome,
          preco: item.preco,
          qtd: item.qtd,
        })),
        total,
      });
      setCarrinho([]);
      alert("Compra finalizada com sucesso! Seu pedido foi registrado. 🪑");
    } catch (err) {
      setErroPedido(api.mensagemClaraDeErro(err, "registrar o pedido"));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="page">
      <Header usuario={usuario} onSair={onSair} onTrocarConta={onTrocarConta} />
      <main className="shell">
        <button type="button" onClick={onVoltar} className="btn btn-secundario" style={{ marginBottom: 20 }}>
          ← Continuar comprando
        </button>

        <h1 className="titulo-pagina">Carrinho de compras</h1>

        {carrinho.length === 0 ? (
          <div className="vazio">
            <span style={{ fontSize: 48 }}>🛒</span>
            <p>Seu carrinho está vazio.</p>
            <button type="button" onClick={onVoltar} className="btn btn-primario" style={{ marginTop: 12 }}>
              Ver produtos
            </button>
          </div>
        ) : (
          <>
            <div className="lista-carrinho">
              {carrinho.map((item) => (
                <div key={item.id} className="item-carrinho">
                  <FotoProduto foto={item.foto} alt={item.nome} largura={64} altura={64} />
                  <div className="item-carrinho-info">
                    <span className="item-carrinho-nome">{item.nome}</span>
                    <span className="item-carrinho-preco">{formatarPreco(item.preco)}</span>
                  </div>
                  <div className="controle-qtd">
                    <button type="button" onClick={() => alterarQtd(item.id, -1)}>−</button>
                    <span className="qtd">{item.qtd}</span>
                    <button type="button" onClick={() => alterarQtd(item.id, 1)}>+</button>
                  </div>
                  <button type="button" onClick={() => remover(item.id)} className="btn btn-perigo">
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="rodape-carrinho">
              <strong className="total-carrinho">
                Total: <span>{formatarPreco(total)}</span>
              </strong>
              <div className="acoes-carrinho">
                <button type="button" onClick={onVoltar} className="btn btn-secundario">
                  Continuar comprando
                </button>
                <button
                  type="button"
                  onClick={finalizarCompra}
                  disabled={salvando}
                  className="btn btn-primario btn-grande"
                >
                  {salvando ? "Finalizando..." : "Finalizar compra"}
                </button>
              </div>
            </div>

            {erroPedido && (
              <p className="aviso-erro" style={{ marginTop: 12 }}>
                {erroPedido}
              </p>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}