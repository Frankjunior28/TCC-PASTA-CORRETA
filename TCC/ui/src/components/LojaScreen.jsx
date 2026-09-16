import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProductCard } from "./ProductCard";
import { CATEGORIAS } from "../constants";

export function LojaScreen({ usuario, produtos, carrinho, onAbrirProduto, onAbrirCarrinho, onAdicionarCarrinho, onSair, offline, carregando, onTrocarConta }) {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const publicados = produtos.filter((p) => p.publicado);
  const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);

  const visiveis = publicados.filter((p) => {
    const okCat = filtro === "Todos" || p.tipo === filtro;
    const okBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return okCat && okBusca;
  });

  return (
    <div className="page">
      <Header
        usuario={usuario}
        onCarrinho={onAbrirCarrinho}
        itensCarrinho={totalItens}
        onSair={onSair}
        onTrocarConta={onTrocarConta}
      />

      <main className="shell">
        {offline && (
          <div style={{ background: "rgba(217,185,138,0.35)", color: "#6b4423", fontSize: 13, fontWeight: 600, padding: "10px 16px", borderRadius: 10, marginBottom: 18 }}>
            ⚠ Modo demonstração — banco de dados indisponível.
          </div>
        )}

        <section className="hero">
          <div>
            <h1>Bem-vindo à Casa Aconchego</h1>
            <p>
              Móveis de qualidade para transformar cada cômodo da sua casa. Encontre o
              perfeito para o seu aconchego.
            </p>
          </div>
          <div className="hero-badge">
            {publicados.length}
            <small>produtos disponíveis</small>
          </div>
        </section>

        <div className="filtros">
          <div className="busca">
            <input
              type="text"
              placeholder="Buscar móvel..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input"
            />
            <span className="busca-icone">🔍</span>
          </div>

          <button
            type="button"
            className={`chip ${filtro === "Todos" ? "chip-ativo" : ""}`}
            onClick={() => setFiltro("Todos")}
          >
            Todos
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${filtro === cat ? "chip-ativo" : ""}`}
              onClick={() => setFiltro(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grade">
          {carregando ? (
            <div className="estado">Carregando produtos...</div>
          ) : visiveis.length === 0 ? (
            <div className="vazio">Nenhum produto encontrado.</div>
          ) : (
            visiveis.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                onAbrir={onAbrirProduto}
                onAdicionar={onAdicionarCarrinho}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}