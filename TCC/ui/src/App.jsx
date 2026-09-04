import { useEffect, useState } from "react";

const PERFIS = {
  usuario: {
    label: "Usuário",
    campos: [
      { name: "nome", label: "Nome", type: "text", placeholder: "Seu nome completo" },
      { name: "email", label: "Email", type: "email", placeholder: "seu@email.com" },
      { name: "senha", label: "Senha", type: "password", placeholder: "Sua senha" },
      { name: "telefone", label: "Número de telefone", type: "tel", placeholder: "(00) 00000-0000" },
    ],
  },
  gerente: {
    label: "Gerente",
    campos: [
      { name: "nome", label: "Nome", type: "text", placeholder: "Seu nome completo" },
      { name: "email", label: "Email", type: "email", placeholder: "seu@empresa.com" },
      { name: "senha", label: "Senha", type: "password", placeholder: "Sua senha" },
      { name: "telefone", label: "Número de telefone", type: "tel", placeholder: "(00) 00000-0000" },
      { name: "cpf", label: "CPF", type: "text", placeholder: "000.000.000-00" },
    ],
  },
  transportador: {
    label: "Transportador",
    campos: [
      { name: "nome", label: "Nome", type: "text", placeholder: "Seu nome completo" },
      { name: "email", label: "Email", type: "email", placeholder: "seu@email.com" },
      { name: "senha", label: "Senha", type: "password", placeholder: "Sua senha" },
      { name: "cpf", label: "CPF", type: "text", placeholder: "000.000.000-00" },
      { name: "telefone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000" },
      {
        name: "tipoVeiculo",
        label: "Tipo de veículo",
        type: "select",
        options: ["Caminhão", "Van", "Carreta", "Moto", "Ônibus"],
      },
    ],
  },
};

const TIPOS = Object.keys(PERFIS);

const TIPOS_PRODUTO = ["Eletrônicos", "Roupas", "Casa e Cozinha", "Ferramentas", "Beleza", "Brinquedos", "Alimentos"];

const PRODUTOS_INICIAIS = [
  { id: 1, nome: "Fone Bluetooth", tipo: "Eletrônicos", preco: 129.9, foto: "https://picsum.photos/seed/fone/300/300", publicado: true },
  { id: 2, nome: "Camiseta Básica", tipo: "Roupas", preco: 49.9, foto: "https://picsum.photos/seed/camiseta/300/300", publicado: true },
  { id: 3, nome: "Panela de Pressão", tipo: "Casa e Cozinha", preco: 159.9, foto: "https://picsum.photos/seed/panela/300/300", publicado: true },
  { id: 4, nome: "Jogo de Chaves", tipo: "Ferramentas", preco: 79.9, foto: "https://picsum.photos/seed/chaves/300/300", publicado: true },
  { id: 5, nome: "Perfume 100ml", tipo: "Beleza", preco: 219.9, foto: "https://picsum.photos/seed/perfume/300/300", publicado: true },
  { id: 6, nome: "Boneco de Pelúcia", tipo: "Brinquedos", preco: 89.9, foto: "https://picsum.photos/seed/pelucia/300/300", publicado: true },
  { id: 7, nome: "Café Torrado 500g", tipo: "Alimentos", preco: 24.9, foto: "https://picsum.photos/seed/cafe/300/300", publicado: true },
  { id: 8, nome: "Smartwatch", tipo: "Eletrônicos", preco: 399.9, foto: "https://picsum.photos/seed/watch/300/300", publicado: true },
  { id: 9, nome: "Tênis Corrida", tipo: "Roupas", preco: 259.9, foto: "https://picsum.photos/seed/tenis/300/300", publicado: true },
];

const carregarState = (chave, padrao) => {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
};

const formatarPreco = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function App() {
  const [view, setView] = useState("login");
  const [perfil, setPerfil] = useState("usuario");
  const [modo, setModo] = useState("login");
  const [campos, setCampos] = useState({});
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [produtos, setProdutos] = useState(() => carregarState("tccProdutos", PRODUTOS_INICIAIS));
  const [carrinho, setCarrinho] = useState(() => carregarState("tccCarrinho", []));
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  useEffect(() => {
    localStorage.setItem("tccProdutos", JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem("tccCarrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsuarioLogado({ nome: campos.nome || "Visitante", perfil });
    setView(perfil === "gerente" ? "gerente" : perfil === "transportador" ? "entregador" : "loja");
  };

  const mudarPerfil = (tipo) => {
    setPerfil(tipo);
    setCampos({});
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
  };

  return (
    <div style={styles.page}>
      {view === "login" && (
        <LoginScreen
          perfil={perfil}
          modo={modo}
          campos={campos}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          mudarPerfil={mudarPerfil}
          setModo={setModo}
        />
      )}

      {view === "loja" && (
        <LojaScreen
          usuario={usuarioLogado}
          produtos={produtos}
          carrinho={carrinho}
          onAbrirProduto={(p) => {
            setProdutoSelecionado(p);
            setView("produto");
          }}
          onAbrirCarrinho={() => setView("carrinho")}
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
            alert("Produto adicionado ao carrinho!");
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
          setProdutos={setProdutos}
          onVerLoja={() => setView("loja")}
          onSair={sair}
        />
      )}

      {view === "entregador" && (
        <EntregadorDashboard usuario={usuarioLogado} onSair={sair} />
      )}
    </div>
  );
}

function LoginScreen({ perfil, modo, campos, handleChange, handleSubmit, mudarPerfil, setModo }) {
  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Tela de Login</h1>

      <div style={styles.tabsPerfil}>
        {TIPOS.map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => mudarPerfil(tipo)}
            style={{ ...styles.tabPerfil, ...(perfil === tipo ? styles.tabPerfilAtivo : {}) }}
          >
            {PERFIS[tipo].label}
          </button>
        ))}
      </div>

      <div style={styles.tabsModo}>
        {["login", "cadastro"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModo(m)}
            style={{ ...styles.tabModo, ...(modo === m ? styles.tabModoAtivo : {}) }}
          >
            {m === "login" ? "Login" : "Cadastro"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {modo === "login" ? (
          <>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={campos.email || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="senha"
              type="password"
              placeholder="Senha"
              value={campos.senha || ""}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </>
        ) : (
          PERFIS[perfil].campos.map((campo) => (
            <div key={campo.name} style={styles.campo}>
              <label style={styles.label}>{campo.label}</label>
              {campo.type === "select" ? (
                <select
                  name={campo.name}
                  value={campos[campo.name] || ""}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="" disabled>
                    Selecione o tipo de veículo
                  </option>
                  {campo.options.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={campo.name}
                  type={campo.type}
                  placeholder={campo.placeholder}
                  value={campos[campo.name] || ""}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              )}
            </div>
          ))
        )}

        <button type="submit" style={styles.botao}>
          {modo === "login" ? "Entrar" : `Cadastrar ${PERFIS[perfil].label}`}
        </button>
      </form>
    </div>
  );
}

function Cabecalho({ usuario, onSair, onCarrinho, itensCarrinho, extra }) {
  return (
    <div style={styles.cabecalho}>
      <div style={styles.infoCabecalho}>
        <span style={styles.saudacao}>
          Olá, <strong>{usuario?.nome}</strong> ({PERFIS[usuario?.perfil]?.label})
        </span>
        {extra}
      </div>
      <div style={styles.acoesCabecalho}>
        {onCarrinho && (
          <button type="button" onClick={onCarrinho} style={styles.botaoCarrinho}>
            🛒 Carrinho{itensCarrinho > 0 ? ` (${itensCarrinho})` : ""}
          </button>
        )}
        <button type="button" onClick={onSair} style={styles.botaoSair}>
          Sair
        </button>
      </div>
    </div>
  );
}

function FotoProduto({ foto, tamanho }) {
  const [falhou, setFalhou] = useState(false);

  if (!foto || falhou) {
    return (
      <div
        style={{
          ...styles.fotoPlaceholder,
          width: tamanho,
          height: tamanho,
          fontSize: tamanho < 120 ? 32 : 64,
        }}
      >
        🛒
      </div>
    );
  }

  return (
    <img
      src={foto}
      alt="Produto"
      onError={() => setFalhou(true)}
      style={{ ...styles.foto, width: tamanho, height: tamanho, objectFit: "cover" }}
    />
  );
}

function LojaScreen({ usuario, produtos, carrinho, onAbrirProduto, onAbrirCarrinho, onSair }) {
  const publicados = produtos.filter((p) => p.publicado);
  const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);

  return (
    <div style={styles.loja}>
      <Cabecalho usuario={usuario} onSair={onSair} onCarrinho={onAbrirCarrinho} itensCarrinho={totalItens} extra={null} />

      <h2 style={styles.tituloLoja}>Nossos produtos</h2>

      <div style={styles.gridRolagem}>
        {publicados.length === 0 ? (
          <p style={styles.semProdutos}>Nenhum produto publicado ainda.</p>
        ) : (
          publicados.map((produto) => (
            <button
              key={produto.id}
              type="button"
              onClick={() => onAbrirProduto(produto)}
              style={styles.cardProduto}
            >
              <FotoProduto foto={produto.foto} tamanho={140} />
              <strong style={styles.nomeProduto}>{produto.nome}</strong>
              <span style={styles.tipoProduto}>{produto.tipo}</span>
              <span style={styles.precoProduto}>{formatarPreco(produto.preco)}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ProdutoScreen({ usuario, produto, onComprar, onAdicionar, onVoltar, onSair }) {
  return (
    <div style={styles.loja}>
      <Cabecalho usuario={usuario} onSair={onSair} extra={null} />

      <button type="button" onClick={onVoltar} style={styles.botaoVoltar}>
        ← Voltar à loja
      </button>

      {produto ? (
        <>
          <div style={styles.detalhe}>
            <FotoProduto foto={produto.foto} tamanho={260} />
            <div style={styles.infoDetalhe}>
              <span style={styles.tipoProduto}>{produto.tipo}</span>
              <h2 style={styles.nomeDetalhe}>{produto.nome}</h2>
              <span style={styles.precoDetalhe}>{formatarPreco(produto.preco)}</span>
              <p style={styles.descDetalhe}>
                Informações do produto: {"\u201c"}
                {produto.nome}
                {"\u201d"} da categoria {produto.tipo}. Produto disponível para compra nesta loja.
              </p>
            </div>
          </div>

          <div style={styles.acoesCompra}>
            <button type="button" onClick={onComprar} style={styles.botaoComprar}>
              Comprar
            </button>
            <button type="button" onClick={onAdicionar} style={styles.botaoAdicionar}>
              Adicionar ao carrinho
            </button>
          </div>
        </>
      ) : (
        <p style={styles.semProdutos}>Produto não encontrado.</p>
      )}
    </div>
  );
}

function CarrinhoScreen({ usuario, carrinho, setCarrinho, onVoltar, onSair }) {
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

  return (
    <div style={styles.loja}>
      <Cabecalho usuario={usuario} onSair={onSair} extra={null} />

      <h2 style={styles.tituloLoja}>Carrinho de compras</h2>

      {carrinho.length === 0 ? (
        <p style={styles.semProdutos}>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div style={styles.listaCarrinho}>
            {carrinho.map((item) => (
              <div key={item.id} style={styles.itemCarrinho}>
                <FotoProduto foto={item.foto} tamanho={60} />
                <div style={styles.infoCarrinho}>
                  <strong>{item.nome}</strong>
                  <span style={styles.precoProduto}>{formatarPreco(item.preco)}</span>
                </div>
                <div style={styles.controleQtd}>
                  <button type="button" onClick={() => alterarQtd(item.id, -1)} style={styles.botaoQtd}>
                    −
                  </button>
                  <span style={styles.qtd}>{item.qtd}</span>
                  <button type="button" onClick={() => alterarQtd(item.id, 1)} style={styles.botaoQtd}>
                    +
                  </button>
                </div>
                <button type="button" onClick={() => remover(item.id)} style={styles.botaoRemover}>
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div style={styles.rodapeCarrinho}>
            <strong style={styles.totalCarrinho}>Total: {formatarPreco(total)}</strong>
            <div style={styles.acoesCarrinho}>
              <button type="button" onClick={onVoltar} style={styles.botaoVoltar}>
                ← Continuar comprando
              </button>
              <button
                type="button"
                onClick={() => {
                  setCarrinho([]);
                  alert("Compra finalizada com sucesso!");
                }}
                style={styles.botaoComprar}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GerenteScreen({ usuario, produtos, setProdutos, onVerLoja, onSair }) {
  const [form, setForm] = useState({ nome: "", tipo: "", preco: "", foto: "" });
  const [editandoId, setEditandoId] = useState(null);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limparForm = () => {
    setForm({ nome: "", tipo: "", preco: "", foto: "" });
    setEditandoId(null);
  };

  const salvarProduto = (publicar) => {
    if (!form.nome.trim() || !form.tipo || !form.preco) {
      alert("Preencha nome, tipo e preço do produto.");
      return;
    }

    const dados = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      preco: Number(form.preco),
      foto: form.foto.trim(),
      publicado: publicar,
    };

    if (editandoId) {
      setProdutos((prev) => prev.map((p) => (p.id === editandoId ? { ...p, ...dados } : p)));
      alert(publicar ? "Produto atualizado e publicado no site!" : "Produto atualizado como rascunho.");
    } else {
      setProdutos((prev) => [...prev, { id: Date.now(), ...dados }]);
      alert(publicar ? "Produto publicado no site!" : "Produto salvo como rascunho.");
    }
    limparForm();
  };

  const excluirProduto = (id, nome) => {
    if (confirm(`Excluir o produto "${nome}"?`)) {
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const alternarPublicacao = (produto) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === produto.id ? { ...p, publicado: !p.publicado } : p))
    );
  };

  const editarProduto = (produto) => {
    setEditandoId(produto.id);
    setForm({ nome: produto.nome, tipo: produto.tipo, preco: String(produto.preco), foto: produto.foto });
  };

  return (
    <div style={styles.loja}>
      <Cabecalho
        usuario={usuario}
        onSair={onSair}
        extra={
          <span style={styles.saudacaoAcao}>
            <button type="button" onClick={onVerLoja} style={styles.botaoVerLoja}>
              🏪 Ver loja
            </button>
          </span>
        }
      />

      <h2 style={styles.tituloLoja}>Gestão de produtos</h2>

      <div style={styles.formProduto}>
        <h3 style={styles.tituloForm}>{editandoId ? "Editar produto" : "Cadastrar produto"}</h3>

        <input
          name="nome"
          type="text"
          placeholder="Nome do produto"
          value={form.nome}
          onChange={handleForm}
          style={styles.input}
        />
        <input
          name="foto"
          type="text"
          placeholder="URL da foto do produto"
          value={form.foto}
          onChange={handleForm}
          style={styles.input}
        />
        <select name="tipo" value={form.tipo} onChange={handleForm} style={styles.input}>
          <option value="" disabled>
            Selecione o tipo do produto
          </option>
          {TIPOS_PRODUTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <input
          name="preco"
          type="number"
          min="0"
          step="0.01"
          placeholder="Preço (R$)"
          value={form.preco}
          onChange={handleForm}
          style={styles.input}
        />

        <div style={styles.acoesForm}>
          <button type="button" onClick={() => salvarProduto(false)} style={styles.botaoRascunho}>
            Salvar rascunho
          </button>
          <button type="button" onClick={() => salvarProduto(true)} style={styles.botaoPublicar}>
            Publicar no site
          </button>
          {editandoId && (
            <button type="button" onClick={limparForm} style={styles.botaoCancelar}>
              Cancelar edição
            </button>
          )}
        </div>
      </div>

      <h3 style={styles.tituloLista}>Produtos cadastrados ({produtos.length})</h3>

      <div style={styles.listaProdutos}>
        {produtos.length === 0 ? (
          <p style={styles.semProdutos}>Nenhum produto cadastrado.</p>
        ) : (
          produtos.map((produto) => (
            <div key={produto.id} style={styles.linhaProduto}>
              <FotoProduto foto={produto.foto} tamanho={56} />
              <div style={styles.infoLinha}>
                <strong>{produto.nome}</strong>
                <span style={styles.tipoProduto}>
                  {produto.tipo} — {formatarPreco(produto.preco)}
                </span>
                <span
                  style={{
                    ...styles.badge,
                    ...(produto.publicado ? styles.badgePublicado : styles.badgeRascunho),
                  }}
                >
                  {produto.publicado ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div style={styles.acoesLinha}>
                <button type="button" onClick={() => editarProduto(produto)} style={styles.botaoAcao}>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => alternarPublicacao(produto)}
                  style={styles.botaoAcao}
                >
                  {produto.publicado ? "Remover do site" : "Publicar"}
                </button>
                <button type="button" onClick={() => excluirProduto(produto.id, produto.nome)} style={styles.botaoExcluir}>
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EntregadorDashboard({ usuario, onSair }) {
  return (
    <div style={styles.loja}>
      <Cabecalho usuario={usuario} onSair={onSair} extra={null} />

      <h2 style={styles.tituloLoja}>Dashboard — Entregador</h2>

      <div style={styles.cards}>
        {[
          { rotulo: "Entregas do dia", valor: "6" },
          { rotulo: "Concluídas", valor: "3" },
          { rotulo: "Pendentes", valor: "3" },
          { rotulo: "Km percorridos", valor: "42 km" },
        ].map((card) => (
          <div key={card.rotulo} style={styles.cardNumero}>
            <span style={styles.rotuloNumero}>{card.rotulo}</span>
            <span style={styles.valorNumero}>{card.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #aa3bff 0%, #7b2ff7 100%)",
  },
  card: {
    width: "420px",
    maxWidth: "100%",
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
    textAlign: "center",
  },
  title: {
    margin: "0 0 24px",
    fontSize: "28px",
    color: "#08060d",
  },
  tabsPerfil: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginBottom: "16px",
  },
  tabPerfil: {
    padding: "10px 4px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#f9f8fb",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#6b6375",
    transition: "all 0.2s",
  },
  tabPerfilAtivo: {
    background: "#aa3bff",
    borderColor: "#aa3bff",
    color: "#fff",
  },
  tabsModo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
    marginBottom: "20px",
  },
  tabModo: {
    padding: "10px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#f9f8fb",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#6b6375",
    transition: "all 0.2s",
  },
  tabModoAtivo: {
    background: "#08060d",
    borderColor: "#08060d",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "left",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b6375",
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#08060d",
    background: "#fff",
    boxSizing: "border-box",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  },
  botao: {
    marginTop: "6px",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    background: "#aa3bff",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  loja: {
    width: "960px",
    maxWidth: "100%",
    minHeight: "80vh",
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
    boxSizing: "border-box",
  },
  cabecalho: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e4e7",
  },
  infoCabecalho: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left",
  },
  saudacao: {
    fontSize: "14px",
    color: "#6b6375",
  },
  saudacaoAcao: {
    display: "inline-flex",
  },
  acoesCabecalho: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  botaoSair: {
    padding: "10px 18px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#f9f8fb",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#6b6375",
  },
  botaoCarrinho: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#aa3bff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
  },
  botaoVerLoja: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#08060d",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
  },
  tituloLoja: {
    margin: "0 0 18px",
    fontSize: "24px",
    color: "#08060d",
    textAlign: "center",
  },
  gridRolagem: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    maxHeight: "56vh",
    overflowY: "auto",
    padding: "8px",
    boxSizing: "border-box",
  },
  cardProduto: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "16px",
    border: "1px solid #e5e4e7",
    borderRadius: "12px",
    background: "#fff",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s",
  },
  foto: {
    borderRadius: "10px",
    display: "block",
    background: "#f9f8fb",
  },
  fotoPlaceholder: {
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9f8fb",
    border: "1px dashed #e5e4e7",
  },
  nomeProduto: {
    fontSize: "14px",
    color: "#08060d",
  },
  tipoProduto: {
    fontSize: "12px",
    color: "#6b6375",
  },
  precoProduto: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#aa3bff",
  },
  semProdutos: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#6b6375",
    fontSize: "15px",
  },
  botaoVoltar: {
    padding: "10px 18px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#f9f8fb",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#6b6375",
    marginBottom: "18px",
  },
  detalhe: {
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
    padding: "24px",
    border: "1px solid #e5e4e7",
    borderRadius: "16px",
    background: "#f9f8fb",
  },
  infoDetalhe: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    textAlign: "left",
    flex: "1",
  },
  nomeDetalhe: {
    margin: "0",
    fontSize: "26px",
    color: "#08060d",
  },
  precoDetalhe: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#aa3bff",
  },
  descDetalhe: {
    fontSize: "14px",
    color: "#6b6375",
    margin: "0",
  },
  acoesCompra: {
    display: "flex",
    gap: "14px",
    marginTop: "20px",
    justifyContent: "center",
  },
  botaoComprar: {
    padding: "14px 32px",
    border: "none",
    borderRadius: "8px",
    background: "#aa3bff",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  botaoAdicionar: {
    padding: "14px 32px",
    border: "2px solid #aa3bff",
    borderRadius: "8px",
    background: "#fff",
    color: "#aa3bff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  listaCarrinho: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  itemCarrinho: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px",
    border: "1px solid #e5e4e7",
    borderRadius: "12px",
    background: "#f9f8fb",
  },
  infoCarrinho: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    textAlign: "left",
    gap: "2px",
    fontSize: "14px",
    color: "#08060d",
  },
  controleQtd: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  botaoQtd: {
    width: "30px",
    height: "30px",
    border: "1px solid #e5e4e7",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 700,
    color: "#6b6375",
  },
  qtd: {
    minWidth: "20px",
    textAlign: "center",
    fontWeight: 700,
    color: "#08060d",
  },
  botaoRemover: {
    padding: "8px 14px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: "#c0392b",
  },
  rodapeCarrinho: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginTop: "20px",
    paddingTop: "18px",
    borderTop: "1px solid #e5e4e7",
  },
  totalCarrinho: {
    fontSize: "20px",
    color: "#08060d",
  },
  acoesCarrinho: {
    display: "flex",
    gap: "10px",
  },
  formProduto: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    border: "1px solid #e5e4e7",
    borderRadius: "12px",
    background: "#f9f8fb",
    marginBottom: "22px",
  },
  tituloForm: {
    margin: "0 0 4px",
    fontSize: "18px",
    color: "#08060d",
  },
  acoesForm: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  botaoRascunho: {
    padding: "12px 20px",
    border: "1px solid #6b6375",
    borderRadius: "8px",
    background: "#fff",
    color: "#6b6375",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  botaoPublicar: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#aa3bff",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  botaoCancelar: {
    padding: "12px 20px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#fff",
    color: "#6b6375",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  tituloLista: {
    margin: "0 0 12px",
    fontSize: "16px",
    color: "#08060d",
  },
  listaProdutos: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "40vh",
    overflowY: "auto",
    padding: "4px",
  },
  linhaProduto: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "10px",
    border: "1px solid #e5e4e7",
    borderRadius: "12px",
    background: "#fff",
  },
  infoLinha: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: "1",
    textAlign: "left",
    fontSize: "14px",
    color: "#08060d",
  },
  badge: {
    alignSelf: "flex-start",
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
  },
  badgePublicado: {
    background: "rgba(39, 174, 96, 0.15)",
    color: "#27ae60",
  },
  badgeRascunho: {
    background: "rgba(107, 99, 117, 0.15)",
    color: "#6b6375",
  },
  acoesLinha: {
    display: "flex",
    gap: "8px",
  },
  botaoAcao: {
    padding: "8px 12px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b6375",
  },
  botaoExcluir: {
    padding: "8px 12px",
    border: "1px solid #e5e4e7",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    color: "#c0392b",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  cardNumero: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f9f8fb",
    border: "1px solid #e5e4e7",
    textAlign: "left",
  },
  rotuloNumero: {
    fontSize: "12px",
    color: "#6b6375",
  },
  valorNumero: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#aa3bff",
  },
};

export default App;