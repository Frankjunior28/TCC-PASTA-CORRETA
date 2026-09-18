import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { formatarPreco } from "../constants";
import * as api from "../services/api";

const CONFIGURACOES = [
  { id: "manutencao", rotulo: "Modo manutenção da plataforma", descricao: "Pausa temporariamente a loja e os cadastros enquanto ajustes técnicos são feitos.", tipo: "tecnica" },
  { id: "certificado", rotulo: "Certificado SSL / Segurança HTTPS", descricao: "Valida o certificado de segurança aplicado em todos os domínios da plataforma.", tipo: "tecnica" },
  { id: "backup", rotulo: "Backup automático do banco de dados", descricao: "Agenda cópias de segurança completas dos dados estratégicos da plataforma.", tipo: "tecnica" },
  { id: "pagamentos", rotulo: "Gateway de pagamento", descricao: "Integra o novo sistema de pagamentos para centralizar os dados financeiros.", tipo: "integracao" },
  { id: "logistica", rotulo: "Sistema de logística externo", descricao: "Integra parceiros logísticos para otimizar entregas em todo o território.", tipo: "integracao" },
  { id: "relatorios", rotulo: "Exportação de relatórios financeiros", descricao: "Habilita a exportação de relatórios estratégicos de vendas e faturamento.", tipo: "integracao" },
];

export function AdministradorScreen({ usuario, onSair, onTrocarConta }) {
  const [aba, setAba] = useState("financeiro");
  const [pedidos, setPedidos] = useState([]);
  const [gerentes, setGerentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoGerentes, setCarregandoGerentes] = useState(true);
  const [configs, setConfigs] = useState(() => {
    const inicial = {};
    CONFIGURACOES.forEach((c) => (inicial[c.id] = false));
    return inicial;
  });
  const [formGerente, setFormGerente] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    cargo: "Gerente",
  });

  useEffect(() => {
    api
      .listarPedidos()
      .then(setPedidos)
      .catch(() => setPedidos([]))
      .finally(() => setCarregando(false));
  }, []);

  const carregarGerentes = () => {
    setCarregandoGerentes(true);
    api
      .listarGerentes()
      .then(setGerentes)
      .catch(() => setGerentes([]))
      .finally(() => setCarregandoGerentes(false));
  };

  useEffect(() => {
    if (aba !== "gerentes") return;
    api
      .listarGerentes()
      .then(setGerentes)
      .catch(() => setGerentes([]))
      .finally(() => setCarregandoGerentes(false));
  }, [aba]);

  const handleGerente = (e) => {
    const { name, value } = e.target;
    setFormGerente((prev) => ({ ...prev, [name]: value }));
  };

  const criarGerente = async (e) => {
    e.preventDefault();
    if (!formGerente.nome.trim() || !formGerente.email.trim() || !formGerente.senha.trim()) {
      alert("Preencha nome, email e senha do gerente.");
      return;
    }
    try {
      await api.criarGerente(formGerente);
      alert("Gerente criado com sucesso!");
      setFormGerente({ nome: "", email: "", senha: "", cpf: "", cargo: "Gerente" });
      carregarGerentes();
    } catch (err) {
      alert(api.mensagemClaraDeErro(err, "criar o gerente"));
    }
  };

  const excluirGerente = async (id, nome) => {
    if (!window.confirm(`Excluir o gerente "${nome}"?`)) return;
    try {
      await api.deletarGerente(id);
      setGerentes((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      alert(api.mensagemClaraDeErro(err, "excluir o gerente"));
    }
  };

  const alternarConfig = (id) => {
    setConfigs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const entregues = pedidos.filter((p) => p.status === "entregue").length;
  const pendentes = pedidos.filter((p) => p.status === "pendente").length;
  const faturamento = pedidos.reduce((soma, p) => soma + (p.total || 0), 0);
  const integracoesAtivas = CONFIGURACOES.filter((c) => configs[c.id] && c.tipo === "integracao").length;
  const configsAtivas = CONFIGURACOES.filter((c) => configs[c.id]).length;

  return (
    <div className="page">
      <Header usuario={usuario} onSair={onSair} onTrocarConta={onTrocarConta} />

      <main className="shell">
        <h1 className="titulo-pagina">Painel Master — Administrador</h1>
        <p className="subtitulo-pagina">
          Controle total e irrestrito sobre a plataforma: finanças, configurações técnicas, integrações e contas de gerentes.
        </p>

        <div className="cards-stats">
          {[
            { rotulo: "Faturamento total", valor: formatarPreco(faturamento) },
            { rotulo: "Pedidos", valor: String(pedidos.length) },
            { rotulo: "Entregues", valor: String(entregues) },
            { rotulo: "Pendentes", valor: String(pendentes) },
            { rotulo: "Gerentes", valor: String(gerentes.length) },
            { rotulo: "Sistemas integrados", valor: String(integracoesAtivas) },
          ].map((card) => (
            <div key={card.rotulo} className="card-stat">
              <span className="card-stat-rotulo">{card.rotulo}</span>
              <span className="card-stat-valor">{card.valor}</span>
            </div>
          ))}
        </div>

        <div className="tabs-gerente">
          <button
            type="button"
            className={`tab-gerente ${aba === "financeiro" ? "tab-gerente-ativo" : ""}`}
            onClick={() => setAba("financeiro")}
          >
            💰 Dados financeiros
          </button>
          <button
            type="button"
            className={`tab-gerente ${aba === "gerentes" ? "tab-gerente-ativo" : ""}`}
            onClick={() => setAba("gerentes")}
          >
            👥 Contas de gerentes
          </button>
          <button
            type="button"
            className={`tab-gerente ${aba === "configuracoes" ? "tab-gerente-ativo" : ""}`}
            onClick={() => setAba("configuracoes")}
          >
            ⚙️ Configurações e integrações
          </button>
        </div>

        {aba === "financeiro" && (
          <div className="lista-vendas">
            {carregando ? (
              <div className="estado">Carregando dados financeiros...</div>
            ) : pedidos.length === 0 ? (
              <div className="vazio">
                <span style={{ fontSize: 32 }}>💰</span>
                <p>Nenhum dado financeiro registrado ainda.</p>
              </div>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido._id} className="linha-produto">
                  <div className="linha-produto-info">
                    <span className="linha-produto-nome">
                      {pedido.cliente?.nome} — {formatarPreco(pedido.total)}
                    </span>
                    <span className="linha-produto-meta">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                      {pedido.itens.map((i) => i.produto).join(", ")}
                      <span
                        className={`badge ${pedido.status === "entregue" ? "badge-publicado" : pedido.status === "cancelado" ? "badge-rascunho" : "badge-pendente"}`}
                      >
                        {pedido.status === "entregue"
                          ? "Entregue"
                          : pedido.status === "cancelado"
                            ? "Cancelado"
                            : "Pendente"}
                      </span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {aba === "gerentes" && (
          <>
            <div className="form-produto">
              <h3 className="form-titulo">Cadastrar gerente</h3>
              <div className="campo-form">
                <label>Nome</label>
                <input name="nome" placeholder="Nome do gerente" value={formGerente.nome} onChange={handleGerente} className="input" />
              </div>
              <div className="campo-form">
                <label>Email</label>
                <input name="email" type="email" placeholder="gerente@empresa.com" value={formGerente.email} onChange={handleGerente} className="input" />
              </div>
              <div className="campo-form">
                <label>Senha</label>
                <input name="senha" type="password" placeholder="Sua senha" value={formGerente.senha} onChange={handleGerente} className="input" />
              </div>
              <div className="campo-form">
                <label>CPF</label>
                <input name="cpf" placeholder="000.000.000-00" value={formGerente.cpf} onChange={handleGerente} className="input" />
              </div>
              <div className="form-acoes">
                <button type="button" onClick={criarGerente} className="btn btn-primario">
                  Criar conta de gerente
                </button>
              </div>
            </div>

            <h2 className="secao-titulo">Gerentes cadastrados ({gerentes.length})</h2>

            {carregandoGerentes ? (
              <div className="estado">Carregando gerentes...</div>
            ) : gerentes.length === 0 ? (
              <div className="vazio">
                <span style={{ fontSize: 32 }}>👥</span>
                <p>Nenhum gerente cadastrado.</p>
              </div>
            ) : (
              <div className="lista-vendas">
                {gerentes.map((gerente) => (
                  <div key={gerente._id} className="linha-produto">
                    <div className="linha-produto-info">
                      <span className="linha-produto-nome">{gerente.nome}</span>
                      <span className="linha-produto-meta">
                        {gerente.email} · {gerente.cargo || "Gerente"}
                      </span>
                    </div>
                    <div className="linha-produto-acoes">
                      <button
                        type="button"
                        onClick={() => excluirGerente(gerente._id, gerente.nome)}
                        className="btn btn-perigo"
                        style={{ fontSize: 12 }}
                      >
                        Excluir conta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {aba === "configuracoes" && (
          <div className="lista-vendas">
            <p className="subtitulo-pagina" style={{ marginBottom: 14 }}>
              Apenas o perfil Administrador (Master) tem permissão para alterar estas configurações técnicas vitais e integrar novos sistemas.
            </p>
            {CONFIGURACOES.map((config) => (
              <div key={config.id} className="linha-produto">
                <div className="linha-produto-info">
                  <span className="linha-produto-nome">{config.rotulo}</span>
                  <span className="linha-produto-meta">
                    {config.descricao}
                    <span className={`badge ${config.tipo === "tecnica" ? "badge-pendente" : "badge-publicado"}`}>
                      {config.tipo === "tecnica" ? "Técnica" : "Integração"}
                    </span>
                  </span>
                </div>
                <div className="linha-produto-acoes">
                  <button
                    type="button"
                    onClick={() => alternarConfig(config.id)}
                    className={`btn ${configs[config.id] ? "btn-primario" : "btn-secundario"}`}
                    style={{ fontSize: 12 }}
                  >
                    {configs[config.id] ? "✓ Ativo" : "Ativar"}
                  </button>
                </div>
              </div>
            ))}
            <div className="vazio" style={{ marginTop: 14 }}>
              <span style={{ fontSize: 32 }}>⚙️</span>
              <p>{configsAtivas} configuração(ões)/integração(ões) ativa(s) nesta sessão.</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}