import wheyMax900g from "@/assets/whey-max-900g.jpeg";
import creatinaProbiotica from "@/assets/creatina-probiotica-300g.jpeg";
import massTitanium from "@/assets/mass-titanium-17500.jpeg";
import massaNitro from "@/assets/massa-nitro.jpeg";
import preTreinoHorus from "@/assets/pre-treino-horus.jpeg";
import superWhey from "@/assets/super-whey-900g.jpeg";
import pureWhey from "@/assets/pure-whey-probiotica.jpeg";
import maxTitaniumImg from "@/assets/creatina-max-300g.jpeg";

export interface Product {
  id: string;
  name: string;
  title: string;
  brand: "Max Titanium" | "Probiótica";
  category: "Whey Protein" | "Creatina" | "Pré-treino" | "Hipercalóricos";
  price: number;
  weight: string;
  type: string;
  servings?: string;
  flavors?: string[];
  benefits: string[];
  image: string;
  description: string;
  longDescription: string[];
  nutrition?: string[];
  usage: string;
  important?: string[];
  indicatedFor?: string[];
  highlights?: string[];
}

export const products: Product[] = [
  {
    id: "whey-max-900g",
    name: "100% Whey Protein",
    title: "100% Whey Protein Max Titanium 900g – Alta Qualidade e Performance",
    brand: "Max Titanium",
    category: "Whey Protein",
    price: 134.99,
    weight: "900g",
    type: "Whey Protein Concentrado (WPC)",
    servings: "Cerca de 30 porções",
    flavors: ["Baunilha", "Chocolate", "Morango", "Cookies", "Outros sabores"],
    benefits: [
      "Auxilia no ganho de massa muscular",
      "Contribui para recuperação muscular mais rápida",
      "Alto teor de proteínas por porção",
      "Rico em BCAA, aminoácidos essenciais",
      "Baixo teor de gorduras",
      "Não contém glúten"
    ],
    image: wheyMax900g,
    description: "Suplemento proteico de alta qualidade, ideal para ganho de massa muscular, recuperação pós-treino e desempenho.",
    longDescription: [
      "O 100% Whey Protein da Max Titanium é um suplemento proteico de alta qualidade, ideal para quem busca ganho de massa muscular, recuperação pós-treino e melhor desempenho nos treinos.",
      "Produzido com proteína do soro do leite, oferece excelente absorção e ótimo custo-benefício para quem quer resultado sem gastar muito."
    ],
    nutrition: ["Proteína: 21g por porção", "BCAA: 4.669mg", "Aminoácidos essenciais presentes", "Baixo teor de carboidratos"],
    usage: "Misturar 1 scoop, cerca de 30g, em 150 a 200ml de água ou leite. Consumir preferencialmente após o treino ou conforme orientação profissional.",
    important: ["Contém derivados do leite e lactose", "Este produto não substitui uma alimentação equilibrada"],
    indicatedFor: ["Quem busca hipertrofia", "Praticantes de musculação", "Pessoas que precisam aumentar a ingestão diária de proteína"]
  },
  {
    id: "creatina-max-300g",
    name: "Creatina Monohidratada",
    title: "Creatina Monohidratada Max Titanium 300g – Força, Volume e Performance",
    brand: "Max Titanium",
    category: "Creatina",
    price: 54.99,
    weight: "300g",
    type: "Creatina Monohidratada",
    benefits: [
      "Aumento de força e explosão",
      "Melhora do desempenho nos treinos",
      "Auxilia no ganho de massa muscular",
      "Maior resistência física",
      "0% sódio",
      "Creatina monohidratada pura"
    ],
    image: maxTitaniumImg,
    description: "Ideal para quem busca aumento de força, resistência e desempenho nos treinos.",
    longDescription: [
      "A Creatina Monohidratada da Max Titanium é ideal para quem busca aumento de força, resistência e desempenho nos treinos.",
      "Com fórmula pura e eficaz, auxilia na melhora da performance em exercícios de alta intensidade e contribui para o ganho de massa muscular ao longo do tempo."
    ],
    highlights: ["Forma: Pó", "Pureza: Alta", "Sem adição de sódio"],
    usage: "Diluir 3g a 5g por dia em água ou bebida de sua preferência. Pode ser consumida em qualquer horário, preferencialmente próximo ao treino.",
    important: ["Produto indicado para maiores de 18 anos", "Manter boa hidratação durante o uso", "Este produto não substitui uma alimentação equilibrada"],
    indicatedFor: ["Ganho de força", "Hipertrofia muscular", "Treinos de alta intensidade", "Atletas e praticantes de musculação"]
  },
  {
    id: "pre-treino-horus",
    name: "Pré-Treino Hórus",
    title: "Pré-Treino Hórus Max Titanium 300g – Energia, Foco e Performance",
    brand: "Max Titanium",
    category: "Pré-treino",
    price: 99.99,
    weight: "300g",
    type: "Pré-treino em pó",
    flavors: ["Limão Yuzu", "Algodão Doce", "Maçã Verde", "Framboesa"],
    benefits: [
      "Mais energia e disposição para treinar",
      "Aumento de foco e concentração",
      "Melhora da resistência muscular",
      "Auxilia na performance e intensidade do treino",
      "Redução da fadiga"
    ],
    image: preTreinoHorus,
    description: "Desenvolvido para aumentar energia, foco e desempenho durante treinos intensos.",
    longDescription: [
      "O Pré-Treino Hórus da Max Titanium foi desenvolvido para aumentar sua energia, foco e desempenho durante os treinos mais intensos.",
      "Com fórmula potente que combina cafeína, beta-alanina, taurina e arginina, ajuda a melhorar resistência, concentração e explosão muscular."
    ],
    nutrition: ["Beta-Alanina: 2g", "Cafeína: 150mg", "Taurina: 1.000mg", "Arginina: 1.000mg"],
    usage: "Diluir 1 dose em água e consumir cerca de 20 a 30 minutos antes do treino.",
    highlights: ["Sabor original informado: Blue Ice", "Forma: Pó"]
  },
  {
    id: "mass-titanium-17500",
    name: "Mass Titanium 17500",
    title: "Mass Titanium 17500 Max Titanium 3kg – Hipercalórico para Ganho de Massa",
    brand: "Max Titanium",
    category: "Hipercalóricos",
    price: 119.90,
    weight: "3kg",
    type: "Hipercalórico",
    flavors: ["Chocolate", "Morango", "Vitamina de Frutas", "Baunilha", "Leite Condensado"],
    benefits: [
      "Auxilia no ganho de massa muscular",
      "Alto valor calórico por porção",
      "Ideal para quem tem metabolismo acelerado",
      "Ajuda no aumento de peso de forma prática",
      "Combinação de proteínas e carboidratos",
      "Ideal para metabolismo acelerado"
    ],
    image: massTitanium,
    description: "Hipercalórico completo para ganho de peso e massa muscular eficiente.",
    longDescription: [
      "O Mass Titanium 17500 da Max Titanium é um hipercalórico completo desenvolvido para quem busca ganho de peso e massa muscular de forma eficiente.",
      "Com uma combinação de carboidratos, proteínas de alta qualidade e alto valor calórico, é ideal para pessoas com dificuldade em ganhar peso ou que precisam aumentar a ingestão diária de calorias."
    ],
    nutrition: ["Proteína: 17g", "Calorias: 609 kcal", "Contém Whey Protein Concentrado", "Contém Albumina", "Contém Colágeno Hidrolisado"],
    usage: "Misturar a dose recomendada com água ou leite. Consumir 1 a 2 vezes ao dia, preferencialmente entre refeições.",
    highlights: ["Forma: Pó"]
  },
  {
    id: "creatina-probiotica-300g",
    name: "Creatina Monohidratada",
    title: "Creatina Monohidratada Probiótica 300g – Força e Performance",
    brand: "Probiótica",
    category: "Creatina",
    price: 62.90,
    weight: "300g",
    type: "Creatina Monohidratada",
    benefits: [
      "Aumento de força e potência",
      "Melhora do desempenho",
      "Auxilia no ganho de massa muscular",
      "Alta pureza",
      "Maior resistência física",
      "Creatina monohidratada pura"
    ],
    image: creatinaProbiotica,
    description: "Creatina pura de alta absorção para força e evolução nos treinos.",
    longDescription: [
      "A Creatina Monohidratada da Probiótica é ideal para quem busca mais força, resistência e evolução nos treinos.",
      "Com alta pureza e excelente absorção, auxilia diretamente no aumento do desempenho físico em exercícios de alta intensidade."
    ],
    highlights: ["Forma: Pó", "Alta pureza"],
    usage: "Diluir 3g a 5g por dia em água ou bebida de sua preferência. Consumir diariamente para melhores resultados.",
    important: ["Indicado para maiores de 18 anos", "Manter boa hidratação durante o uso", "Este produto não substitui uma alimentação equilibrada"],
    indicatedFor: ["Ganho de força", "Hipertrofia muscular", "Treinos de alta intensidade", "Praticantes de musculação"]
  },
  {
    id: "pure-whey-probiotica",
    name: "100% Pure Whey",
    title: "100% Pure Whey Probiótica 900g – Proteína de Alta Qualidade",
    brand: "Probiótica",
    category: "Whey Protein",
    price: 135.00,
    weight: "900g",
    type: "Whey Protein Concentrado (WPC)",
    servings: "Formato econômico refil 900g",
    flavors: ["Baunilha", "Chocolate", "Cookies & Cream", "Morango", "Iogurte com Coco", "Iogurte com Limão", "Iogurte com Morango"],
    benefits: [
      "Proteína de alta qualidade",
      "Recuperação muscular",
      "Controle do apetite",
      "Versatilidade de uso",
      "Opções variadas de sabor"
    ],
    image: pureWhey,
    description: "Whey Protein Concentrado popular com excelente aporte de BCAA.",
    longDescription: [
      "O 100% Pure Whey da Probiótica é um suplemento proteico em pó feito principalmente de whey protein concentrado, proteína do soro do leite.",
      "Ele oferece boa quantidade de proteína por dose, entre 21g e 24g, além de aminoácidos essenciais como BCAAs, que ajudam na recuperação e no crescimento muscular."
    ],
    highlights: ["Pode ser consumido em shakes", "Pode ser usado em receitas", "Formato econômico em refil"],
    usage: "Misturar 30g, cerca de 2 dosadores, em aproximadamente 150ml de água ou leite desnatado. Indicado principalmente após o treino.",
    indicatedFor: ["Formação de músculos e ossos", "Recuperação após treinos intensos", "Dietas com maior controle de saciedade"]
  },
  {
    id: "massa-nitro",
    name: "Massa Nitro",
    title: "Massa Nitro Probiótica 2,52kg – Hipercalórico para Ganho de Massa",
    brand: "Probiótica",
    category: "Hipercalóricos",
    price: 119.00,
    weight: "2.52kg",
    type: "Hipercalórico",
    flavors: ["Baunilha", "Chocolate", "Morango"],
    benefits: [
      "Apoio no ganho de massa muscular e peso corporal",
      "Energia extra para treinos e recuperação",
      "Perfil de aminoácidos completo",
      "Saúde muscular e óssea",
      "Rápida absorção"
    ],
    image: massaNitro,
    description: "Hipercalórico com blend proteico para aporte extra de calorias.",
    longDescription: [
      "O Massa Nitro da Probiótica é um suplemento hipercalórico desenvolvido para quem busca ganho de massa muscular e precisa de um aporte extra de calorias, proteínas e carboidratos.",
      "É bastante usado por praticantes de musculação que têm dificuldade em ganhar peso ou precisam de energia adicional para treinos intensos."
    ],
    nutrition: ["Proteína por porção: 16g", "BCAA: 3.162mg por dose", "Carboidratos em alta quantidade", "Vitaminas e minerais"],
    highlights: ["Whey protein concentrado e isolado", "Proteína isolada de soja", "Colágeno hidrolisado", "Não contém glúten", "Contém lactose e derivados de leite e soja"],
    usage: "Misturar 4 dosadores rasos, cerca de 120g, em 250ml de água gelada ou leite desnatado. Recomendação de 1 porção ao dia ou conforme orientação profissional.",
    indicatedFor: ["Alto gasto energético", "Dificuldade em atingir calorias pela alimentação", "Ganho de peso corporal"]
  },
  {
    id: "super-whey-900g",
    name: "Super Whey",
    title: "Super Whey 900g Max Titanium – Proteínas e Carboidratos",
    brand: "Max Titanium",
    category: "Whey Protein",
    price: 99.99,
    weight: "900g",
    type: "Suplemento alimentar de carboidratos e proteínas",
    flavors: ["Baunilha", "Chocolate", "Morango"],
    benefits: [
      "Apoio no ganho de massa muscular",
      "Energia adicional para treinos intensos",
      "Recuperação muscular após exercícios",
      "Fonte de vitaminas e minerais"
    ],
    image: superWhey,
    description: "Combina proteínas e carboidratos para energia extra e suporte ao ganho de massa.",
    longDescription: [
      "O Super Whey 900g da Max Titanium é um suplemento alimentar que combina proteínas e carboidratos, pensado para quem busca energia extra nos treinos e suporte ao ganho de massa muscular."
    ],
    nutrition: ["30g de proteína por porção", "79g de carboidratos por dose", "6.100mg de BCAA naturalmente presentes nas proteínas", "Blend com whey concentrado, whey isolado, colágeno hidrolisado e proteína de soja"],
    usage: "Misturar 120g, cerca de 5 dosadores, em 300ml de água gelada. Recomendação de 1 porção ao dia ou conforme orientação profissional.",
    important: ["Sem glúten", "Contém lactose e derivados de leite e soja"]
  }
];
