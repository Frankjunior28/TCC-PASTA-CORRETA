import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FotoProduto } from "./FotoProduto";
import { CATEGORIAS, formatarPreco } from "../constants";

export function GerenteScreen({ usuario, produtos, onSalvar, onExcluir, onAlternar, onVerLoja, onSair, offline }) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    tipo: "",
    preco: "",
    foto1: "",
    foto2: "",
    foto3: "",
    estoque: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limparForm = () => {
    setForm({ nome: "", descricao: "", tipo: "", preco: "", foto1: "", foto2: "", foto3: "", estoque: "" });
    setEditandoId(null);
  };

  const preencher = (produto) => {
    const fotos = (produto.fotos && produto.fotos.length > 0)
      ? produto.fotos
      : produto.foto
        ? [produto.foto]
        : [];
    setEditandoId(produto.id);
    setForm({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      tipo: produto.tipo || "",
      preco: String(produto.preco || ""),
      foto1: fotos[0] || "",
      foto2: fotos[1] || "",
      foto3: fotos[2] || "",
      estoque: String(produto.estoque || ""),
    });
  };

  const salvar = (publicar) => {
    if (!form.nome.trim() || !form.tipo || !form.preco) {
      alert("Preencha nome, tipo e preço do produto.");
      return;
    }
    const fotos = [form.foto1, form.foto2, form.foto3]
      .map((f) => f.trim())
      .filter(Boolean)
      .slice(0, 3);
    const dados = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      tipo: form.tipo,
      preco: Number(form.preco),
      foto: fotos[0] || "",
      fotos,
      estoque: Number(form.estoque) || 0,
      publicado: publicar,
    };
    onSalvar(dados, editandoId);
    limparForm();
  };

  const excluir = (id, nome) => {
    if (window.confirm(`Excluir o produto "${nome}"?`)) {
      onExcluir(id);
      if (id === editandoId) limparForm();
    }
  };

  return (
    <div className="page">
      <Header
        usuario={usuario}
        onSair={onSair}
        extra={
          <button type="button" onClick={onVerLoja} className="btn btn-escuro">
            🏪 Ver loja
          </button>
        }
      />

      <main className="shell">
        {offline && (
          <div style={{ background: "rgba(217,185,138,0.35)", color: "#6b4423", fontSize: 13, fontWeight: 600, padding: "10px 16px", borderRadius: 10, marginBottom: 18 }}>
            ⚠ Modo off-line — alterações são locais.
          </div>
        )}

        <h1 className="titulo-pagina">Gestão de produtos</h1>

        <div className="form-produto">
          <h3 className="form-titulo">{editandoId ? "Editar produto" : "Cadastrar produto"}</h3>

          <div className="campo-form">
            <label>Nome *</label>
            <input name="nome" placeholder="Ex: Sofá Retrátil" value={form.nome} onChange={handleForm} className="input" />
          </div>

          <div className="campo-form">
            <label>Foto 1 (URL) *</label>
            <input name="foto1" placeholder="https://... (imagem principal)" value={form.foto1} onChange={handleForm} className="input" />
          </div>

          <div className="campo-form">
            <label>Foto 2 (URL)</label>
            <input name="foto2" placeholder="https://..." value={form.foto2} onChange={handleForm} className="input" />
          </div>

          <div className="campo-form">
            <label>Foto 3 (URL)</label>
            <input name="foto3" placeholder="https://..." value={form.foto3} onChange={handleForm} className="input" />
          </div>

          <div className="campo-form">
            <label>Categoria *</label>
            <select name="tipo" value={form.tipo} onChange={handleForm} className="select">
              <option value="">Selecione</option>
              {CATEGORIAS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-form">
            <label>Preço (R$) *</label>
            <input name="preco" type="number" min="0" step="0.01" placeholder="0.00" value={form.preco} onChange={handleForm} className="input" />
          </div>

          <div className="campo-form">
            <label>Estoque</label>
            <input name="estoque" type="number" min="0" placeholder="0" value={form.estoque} onChange={handleForm} className="input" />
          </div>

          <div className="campo-form">
            <label>Descrição</label>
            <input name="descricao" placeholder="Descrição do produto" value={form.descricao} onChange={handleForm} className="input" />
          </div>

          <div className="form-acoes">
            <button type="button" onClick={() => salvar(false)} className="btn btn-secundario">
              Salvar rascunho
            </button>
            <button type="button" onClick={() => salvar(true)} className="btn btn-primario">
              Publicar no site
            </button>
            {editandoId && (
              <button type="button" onClick={limparForm} className="btn btn-secundario">
                Cancelar edição
              </button>
            )}
          </div>
        </div>

        <h2 className="secao-titulo">Produtos cadastrados ({produtos.length})</h2>

        <div className="lista-produtos">
          {produtos.length === 0 ? (
            <div className="vazio">Nenhum produto cadastrado.</div>
          ) : (
            produtos.map((produto) => (
              <div key={produto.id} className="linha-produto">
                <FotoProduto foto={produto.foto} alt={produto.nome} largura={52} altura={52} />
                <div className="linha-produto-info">
                  <span className="linha-produto-nome">{produto.nome}</span>
                  <span className="linha-produto-meta">
                    {produto.tipo} — {formatarPreco(produto.preco)}
                    <span className={`badge ${produto.publicado ? "badge-publicado" : "badge-rascunho"}`}>
                      {produto.publicado ? "Publicado" : "Rascunho"}
                    </span>
                  </span>
                </div>
                <div className="linha-produto-acoes">
                  <button type="button" onClick={() => preencher(produto)} className="btn btn-secundario" style={{ fontSize: 12 }}>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onAlternar(produto)}
                    className="btn btn-secundario"
                    style={{ fontSize: 12 }}
                  >
                    {produto.publicado ? "Remover" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(produto.id, produto.nome)}
                    className="btn btn-perigo"
                    style={{ fontSize: 12 }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}