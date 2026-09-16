import { useState } from "react";
import { PERFIS, TIPOS } from "../constants";

export function TrocarContaModal({ aoTrocar, aoFechar }) {
  const [perfil, setPerfil] = useState("usuario");
  const [email, setEmail] = useState("");
  const [credencial, setCredencial] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const precisaCpf = perfil !== "usuario";

  const submit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await aoTrocar({
        perfil,
        email,
        ...(precisaCpf ? { cpf: credencial } : { senha: credencial }),
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecalho">
          <h3>Trocar de conta</h3>
          <button type="button" className="modal-fechar" onClick={aoFechar} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="tabs-perfil">
          {TIPOS.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => {
                setPerfil(tipo);
                setCredencial("");
              }}
              className={`tab ${perfil === tipo ? "tab-ativo" : ""}`}
            >
              {PERFIS[tipo].label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="formulario">
          <div className="campo-form">
            <label>Email</label>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="campo-form">
            <label>{precisaCpf ? "CPF" : "Senha"}</label>
            <input
              className="input"
              type={precisaCpf ? "text" : "password"}
              required
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
              placeholder={precisaCpf ? "000.000.000-00" : "Sua senha"}
            />
          </div>

          {erro && (
            <p style={{ background: "rgba(192,57,43,0.08)", color: "#c0392b", fontSize: 13, padding: "10px 14px", borderRadius: 10, margin: 0 }}>
              {erro}
            </p>
          )}

          <button type="submit" disabled={carregando} className="btn btn-primario btn-grande" style={{ width: "100%" }}>
            {carregando ? "Entrando..." : `Entrar como ${PERFIS[perfil].label}`}
          </button>
        </form>
      </div>
    </div>
  );
}