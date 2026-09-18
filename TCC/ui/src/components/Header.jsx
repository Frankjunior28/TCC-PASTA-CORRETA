import { TIPOS } from "../constants";

export function Header({ usuario, onCarrinho, itensCarrinho = 0, extra, onSair, onTrocarConta }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-inner">
        <a className="brand" href="#top" onClick={(e) => e.preventDefault()}>
          <img className="brand-logo" src="/favicon.svg" alt="Casa Aconchego" />
          <span className="brand-nome">
            Casa <span>Aconchego</span>
          </span>
        </a>

        <div className="cabecalho-info">
          {usuario && (
            <span className="saudacao">
              Olá, <strong>{usuario.nome}</strong> ·
              {PERFIS_DE_USUARIO(usuario.perfil)}
            </span>
          )}
          {extra}
        </div>

        <div className="cabecalho-acoes">
          {onCarrinho && (
            <button type="button" onClick={onCarrinho} className="btn btn-primario">
              🛒 Carrinho
              {itensCarrinho > 0 && <span className="badge-carrinho">{itensCarrinho}</span>}
            </button>
          )}
          {usuario && onTrocarConta && (
            <button type="button" onClick={onTrocarConta} className="btn btn-secundario" title="Entrar em outra conta (Usuário, Gerente ou Administrador)">
              🔁 Trocar conta
            </button>
          )}
          {usuario && onSair && (
            <button type="button" onClick={onSair} className="btn btn-secundario">
              Sair
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function PERFIS_DE_USUARIO(perfil) {
  const encontrado = TIPOS.find((t) => t === perfil);
  const labels = {
    usuario: "Usuário",
    gerente: "Gerente",
    administrador: "Administrador",
  };
  return encontrado ? labels[perfil] || perfil : "Usuário";
}