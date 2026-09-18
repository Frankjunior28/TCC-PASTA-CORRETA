import { useState } from "react";
import { PERFIS, TIPOS } from "../constants";
import { mensagemClaraDeErro } from "../services/api";

export function LoginScreen({ perfil, modo, campos, handleChange, mudarPerfil, setModo, aoLogin, aoCadastro }) {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      if (modo === "login") {
        if (perfil === "usuario") {
          await aoLogin({ email: campos.email, senha: campos.senha, perfil });
        } else {
          await aoLogin({ email: campos.email, cpf: campos.cpf, perfil });
        }
      } else {
        await aoCadastro({ ...campos, perfil });
      }
    } catch (err) {
      setErro(mensagemClaraDeErro(err, modo === "login" ? "entrar na sua conta" : "criar sua conta"));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="page-auth">
      <div className="auth-card">
        <a className="brand" href="#top" onClick={(e) => e.preventDefault()}>
          <img className="brand-logo" src="/favicon.svg" alt="Casa Aconchego" width={40} height={40} />
          <span className="brand-nome">
            Casa <span>Aconchego</span>
          </span>
        </a>

        <p className="auth-bemvindo">
          {modo === "login" ? "Entre na sua conta para continuar" : "Crie sua conta gratuita"}
        </p>

        <div className="tabs-perfil">
          {TIPOS.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => mudarPerfil(tipo)}
              className={`tab ${perfil === tipo ? "tab-ativo" : ""}`}
            >
              {PERFIS[tipo].label}
            </button>
          ))}
        </div>

        <div className="tabs-modo">
          {["login", "cadastro"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModo(m)}
              className={`tab-modo ${modo === m ? "tab-modo-ativo" : ""}`}
            >
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {erro && (
          <p className="aviso-erro" style={{ margin: "0 0 14px" }}>
            {erro}
          </p>
        )}

        <form onSubmit={onSubmit} className="formulario">
          {modo === "login" ? (
            <>
              <div className="campo-form">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={campos.email || ""}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              {perfil === "usuario" ? (
                <div className="campo-form">
                  <label>Senha</label>
                  <input
                    name="senha"
                    type="password"
                    placeholder="Sua senha"
                    value={campos.senha || ""}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              ) : (
                <div className="campo-form">
                  <label>CPF</label>
                  <input
                    name="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={campos.cpf || ""}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              )}
            </>
          ) : (
            PERFIS[perfil].campos.map((campo) => (
              <div key={campo.name} className="campo-form">
                <label>{campo.label}</label>
                {campo.type === "select" ? (
                  <select
                    name={campo.name}
                    value={campos[campo.name] || ""}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    <option value="" disabled>
                      Selecione uma opção
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
                    className="input"
                  />
                )}
              </div>
            ))
          )}

          <button
            type="submit"
            disabled={carregando}
            className="btn btn-primario btn-grande"
            style={{ width: "100%", marginTop: 4 }}
          >
            {carregando ? "Aguarde..." : modo === "login" ? "Entrar" : `Cadastrar ${PERFIS[perfil].label}`}
          </button>
        </form>
      </div>
    </div>
  );
}