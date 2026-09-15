import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FotoProduto } from "./FotoProduto";
import { formatarPreco } from "../constants";

export function ProdutoScreen({ usuario, produto, onComprar, onAdicionar, onVoltar, onSair }) {
  const [imgIdx, setImgIdx] = useState(0);

  if (!produto) {
    return (
      <div className="page">
        <Header usuario={usuario} onSair={onSair} />
        <main className="shell">
          <div className="vazio">Produto não encontrado.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const galeria = (produto.fotos && produto.fotos.length > 0)
    ? produto.fotos
    : produto.foto
      ? [produto.foto]
      : [];

  const imagemPrincipal = galeria[imgIdx] || galeria[0] || "";

  return (
    <div className="page">
      <Header usuario={usuario} onSair={onSair} />
      <main className="shell">
        <button type="button" onClick={onVoltar} className="btn btn-secundario" style={{ marginBottom: 20 }}>
          ← Voltar à loja
        </button>

        <div className="detalhe">
          <div className="detalhe-img-col">
            <FotoProduto foto={imagemPrincipal} alt={produto.nome} className="detalhe-img" altura={340} />

            {galeria.length > 1 && (
              <div className="galeria-miniaturas">
                {galeria.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`miniatura ${i === imgIdx ? "miniatura-ativa" : ""}`}
                    onClick={() => setImgIdx(i)}
                  >
                    <img src={img} alt={`Imagem ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detalhe-info">
            <span className="detalhe-tipo">{produto.tipo}</span>
            <h2 className="detalhe-nome">{produto.nome}</h2>
            <span className="detalhe-preco">{formatarPreco(produto.preco)}</span>
            {produto.estoque > 0 && (
              <span className="detalhe-estoque">✓ {produto.estoque} unidades em estoque</span>
            )}
            <p className="detalhe-descricao">{produto.descricao}</p>

            <div className="detalhe-acoes">
              <button type="button" onClick={onComprar} className="btn btn-primario btn-grande">
                Comprar agora
              </button>
              <button type="button" onClick={onAdicionar} className="btn btn-contorno btn-grande">
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}