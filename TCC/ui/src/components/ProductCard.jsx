import { FotoProduto } from "./FotoProduto";
import { formatarPreco } from "../constants";

export function ProductCard({ produto, onAbrir, onAdicionar }) {
  return (
    <div
      className="card-produto"
      role="button"
      tabIndex={0}
      onClick={() => onAbrir(produto)}
      onKeyDown={(e) => e.key === "Enter" && onAbrir(produto)}
    >
      <FotoProduto foto={produto.foto} alt={produto.nome} className="card-produto-img" altura={180} />

      <div className="card-produto-body">
        <span className="card-produto-tipo">{produto.tipo}</span>
        <span className="card-produto-nome">{produto.nome}</span>
        <span className="card-produto-preco">{formatarPreco(produto.preco)}</span>
        {produto.estoque > 0 && <span className="card-produto-estoque">Em estoque</span>}
      </div>

      <div className="card-produto-acoes">
        <button
          type="button"
          className="btn btn-contorno btn-card"
          onClick={(e) => {
            e.stopPropagation();
            onAdicionar(produto);
          }}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}