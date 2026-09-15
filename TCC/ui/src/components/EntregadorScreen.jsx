import { Header } from "./Header";
import { Footer } from "./Footer";

export function EntregadorScreen({ usuario, onSair }) {
  return (
    <div className="page">
      <Header usuario={usuario} onSair={onSair} />
      <main className="shell">
        <h1 className="titulo-pagina">Dashboard — Entregador</h1>
        <p className="subtitulo-pagina">Acompanhe suas entregas do dia.</p>

        <div className="cards-stats">
          {[
            { rotulo: "Entregas do dia", valor: "6" },
            { rotulo: "Concluídas", valor: "3" },
            { rotulo: "Pendentes", valor: "3" },
            { rotulo: "Km percorridos", valor: "42 km" },
          ].map((card) => (
            <div key={card.rotulo} className="card-stat">
              <span className="card-stat-rotulo">{card.rotulo}</span>
              <span className="card-stat-valor">{card.valor}</span>
            </div>
          ))}
        </div>

        <div className="vazio" style={{ marginTop: 24 }}>
          <span style={{ fontSize: 32 }}>📦</span>
          <p>Histórico de entregas disponível em breve.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}