import Produto from "./models/produto.js";

const PRODUTOS_SEED = [
  {
    nome: "Sofá Retrátil 3 Lugares",
    descricao: "Sofá retrátil e reclinável com espuma de alta densidade, tecido suede e base em madeira de eucalipto.",
    tipo: "Sofás",
    preco: 1899.9,
    foto: "/images/produtos/sofa-1.jpg",
    fotos: ["/images/produtos/sofa-1.jpg", "/images/produtos/sofa-2.jpg", "/images/produtos/sofa-8.jpg"],
    estoque: 12,
    publicado: true,
  },
  {
    nome: "Poltrona de Leitura",
    descricao: "Poltrona reclinável com braços largos e revestimento em couro sintético premium.",
    tipo: "Sofás",
    preco: 1099.0,
    foto: "/images/produtos/poltrona-1.jpg",
    fotos: ["/images/produtos/poltrona-1.jpg", "/images/produtos/sofa-7.jpg", "/images/produtos/sala-2.jpg"],
    estoque: 10,
    publicado: true,
  },
  {
    nome: "Cama Box Queen",
    descricao: "Conjunto box + colchão Queen com molas ensacadas, garantindo conforto e firmeza.",
    tipo: "Camas",
    preco: 1549.9,
    foto: "/images/produtos/cama-1.jpg",
    fotos: ["/images/produtos/cama-1.jpg", "/images/produtos/cama-5.jpg", "/images/produtos/cama-3.jpg"],
    estoque: 8,
    publicado: true,
  },
  {
    nome: "Cabeceira Casal Estofada",
    descricao: "Cabeceira estofada para cama de casal, com capa removível e tecido aveludado.",
    tipo: "Camas",
    preco: 459.9,
    foto: "/images/produtos/cama-2.jpg",
    fotos: ["/images/produtos/cama-2.jpg", "/images/produtos/cama-6.jpg", "/images/produtos/cama-4.jpg"],
    estoque: 14,
    publicado: true,
  },
  {
    nome: "Mesa de Jantar 6 Lugares",
    descricao: "Mesa de jantar em madeira maciça com tampo liso e pés torneados, acompanha 6 cadeiras.",
    tipo: "Mesas",
    preco: 2199.9,
    foto: "/images/produtos/mesa-3.jpg",
    fotos: ["/images/produtos/mesa-3.jpg", "/images/produtos/mesa-7.jpg", "/images/produtos/mesa-8.jpg"],
    estoque: 6,
    publicado: true,
  },
  {
    nome: "Mesa Lateral de Centro",
    descricao: "Mesa de centro redonda com tampo de vidro fosco e estrutura em madeira.",
    tipo: "Mesas",
    preco: 329.9,
    foto: "/images/produtos/mesa-5.jpg",
    fotos: ["/images/produtos/mesa-5.jpg", "/images/produtos/mesa-6.jpg", "/images/produtos/mesa-4.jpg"],
    estoque: 18,
    publicado: true,
  },
  {
    nome: "Guarda-roupa 6 Portas",
    descricao: "Guarda-roupa em MDP com 6 portas, prateleiras, gavetas e espelho central.",
    tipo: "Armários",
    preco: 2499.0,
    foto: "/images/produtos/guarda-1.jpg",
    fotos: ["/images/produtos/guarda-1.jpg", "/images/produtos/guarda-2.jpg", "/images/produtos/estante-1.jpg"],
    estoque: 5,
    publicado: true,
  },
  {
    nome: "Cômoda com 4 Gavetas",
    descricao: "Cômoda auxiliar com 4 gavetas deslizantes e puxadores em metal escovado.",
    tipo: "Armários",
    preco: 899.9,
    foto: "/images/produtos/guarda-2.jpg",
    fotos: ["/images/produtos/guarda-2.jpg", "/images/produtos/guarda-1.jpg", "/images/produtos/mesa-4.jpg"],
    estoque: 9,
    publicado: true,
  },
  {
    nome: "Estante de Livros 5 Prateleiras",
    descricao: "Estante com 5 prateleiras ajustáveis em madeira de carvalho, ótima para salas e escritórios.",
    tipo: "Escritório",
    preco: 649.9,
    foto: "/images/produtos/estante-1.jpg",
    fotos: ["/images/produtos/estante-1.jpg", "/images/produtos/guarda-2.jpg", "/images/produtos/sala-1.jpg"],
    estoque: 11,
    publicado: true,
  },
  {
    nome: "Escrivaninha com Gavetas",
    descricao: "Escrivaninha compacta com 3 gavetas e passagem para cabos, ideal para home office.",
    tipo: "Escritório",
    preco: 799.9,
    foto: "/images/produtos/escrivaninha-1.jpg",
    fotos: ["/images/produtos/escrivaninha-1.jpg", "/images/produtos/escrivaninha-2.jpg", "/images/produtos/escrivaninha-4.jpg"],
    estoque: 15,
    publicado: true,
  },
  {
    nome: "Cadeira de Escritório Ergonômica",
    descricao: "Cadeira com espuma de média densidade, revestimento em courvim e base cromada.",
    tipo: "Escritório",
    preco: 499.9,
    foto: "/images/produtos/escrivaninha-3.jpg",
    fotos: ["/images/produtos/escrivaninha-3.jpg", "/images/produtos/escrivaninha-6.jpg", "/images/produtos/escrivaninha-2.jpg"],
    estoque: 20,
    publicado: true,
  },
  {
    nome: "Rack para TV e Som",
    descricao: "Rack suspenso com 2 gavetas, nicho para videogame e suporte para TV de até 60 polegadas.",
    tipo: "Decor",
    preco: 749.9,
    foto: "/images/produtos/sofa-6.jpg",
    fotos: ["/images/produtos/sofa-6.jpg", "/images/produtos/sala-1.jpg", "/images/produtos/sala-3.jpg"],
    estoque: 7,
    publicado: true,
  },
];

export const seedProdutos = async () => {
  try {
    const count = await Produto.countDocuments();

    if (count === 0) {
      await Produto.insertMany(PRODUTOS_SEED);
      console.log(`🌱 Seed executado: ${PRODUTOS_SEED.length} produtos cadastrados.`);
      return;
    }

    // atualizar produtos existentes que ainda não têm campo "fotos"
    const produtosAtualizados = await Produto.find({ fotos: { $exists: false } });
    for (const p of produtosAtualizados) {
      const match = PRODUTOS_SEED.find((s) => s.nome === p.nome);
      if (match) {
        await Produto.updateOne({ _id: p._id }, { $set: { fotos: match.fotos, foto: match.foto } });
      }
    }

    // atualizar produtos existentes com fotos vazias
    const semFotos = await Produto.find({ fotos: { $size: 0 } });
    for (const p of semFotos) {
      const match = PRODUTOS_SEED.find((s) => s.nome === p.nome);
      if (match) {
        await Produto.updateOne({ _id: p._id }, { $set: { fotos: match.fotos, foto: match.foto } });
      }
    }
  } catch (error) {
    console.error("❌ Erro no seed de produtos:", error.message);
  }
};