import { useState } from "react";

export function FotoProduto({ foto, alt, className, largura = "100%", altura = 180 }) {
  const [falhou, setFalhou] = useState(false);

  if (!foto || falhou) {
    return (
      <div
        className="foto-placeholder"
        style={{ width: largura, height: altura }}
        role="img"
        aria-label="Foto do produto"
      >
        🛋️
      </div>
    );
  }

  return (
    <img
      src={foto}
      alt={alt || ""}
      onError={() => setFalhou(true)}
      className={className}
      style={{ width: largura, height: altura, objectFit: "cover", display: "block" }}
    />
  );
}