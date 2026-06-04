import { db, productsTable, usersTable, type InsertProduct } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword } from "./auth";
import { logger } from "./logger";

const SEED_PRODUCTS: Array<Omit<InsertProduct, "price"> & { price: string }> = [
  {
    slug: "whey-max-900g",
    name: "100% Whey Protein",
    brand: "Max Titanium",
    category: "Whey Protein",
    type: "Whey Protein Concentrado (WPC)",
    weight: "900g",
    price: "134.99",
    description: "Suplemento proteico de alta qualidade, ideal para ganho de massa muscular, recuperação pós-treino e desempenho.",
    image: "whey-max-900g.jpeg",
    flavors: ["Baunilha", "Chocolate", "Morango", "Cookies", "Outros sabores"],
  },
  {
    slug: "creatina-max-300g",
    name: "Creatina Monohidratada",
    brand: "Max Titanium",
    category: "Creatina",
    type: "Creatina Monohidratada",
    weight: "300g",
    price: "54.99",
    description: "Ideal para quem busca aumento de força, resistência e desempenho nos treinos.",
    image: "creatina-max-300g.jpeg",
    flavors: [],
  },
  {
    slug: "pre-treino-horus",
    name: "Pré-Treino Hórus",
    brand: "Max Titanium",
    category: "Pré-treino",
    type: "Pré-treino em pó",
    weight: "300g",
    price: "99.99",
    description: "Desenvolvido para aumentar energia, foco e desempenho durante treinos intensos.",
    image: "pre-treino-horus.jpeg",
    flavors: ["Limão Yuzu", "Algodão Doce", "Maçã Verde", "Framboesa"],
  },
  {
    slug: "mass-titanium-17500",
    name: "Mass Titanium 17500",
    brand: "Max Titanium",
    category: "Hipercalóricos",
    type: "Hipercalórico",
    weight: "3kg",
    price: "119.90",
    description: "Hipercalórico completo para ganho de peso e massa muscular eficiente.",
    image: "mass-titanium-17500.jpeg",
    flavors: ["Chocolate", "Morango", "Vitamina de Frutas", "Baunilha", "Leite Condensado"],
  },
  {
    slug: "creatina-probiotica-300g",
    name: "Creatina Monohidratada",
    brand: "Probiótica",
    category: "Creatina",
    type: "Creatina Monohidratada",
    weight: "300g",
    price: "62.90",
    description: "Creatina pura de alta absorção para força e evolução nos treinos.",
    image: "creatina-probiotica-300g.jpeg",
    flavors: [],
  },
  {
    slug: "pure-whey-probiotica",
    name: "100% Pure Whey",
    brand: "Probiótica",
    category: "Whey Protein",
    type: "Whey Protein Concentrado (WPC)",
    weight: "900g",
    price: "135.00",
    description: "Whey Protein Concentrado popular com excelente aporte de BCAA.",
    image: "pure-whey-probiotica.jpeg",
    flavors: ["Baunilha", "Chocolate", "Cookies & Cream", "Morango", "Iogurte com Coco", "Iogurte com Limão", "Iogurte com Morango"],
  },
  {
    slug: "massa-nitro",
    name: "Massa Nitro",
    brand: "Probiótica",
    category: "Hipercalóricos",
    type: "Hipercalórico",
    weight: "2.52kg",
    price: "119.00",
    description: "Hipercalórico com blend proteico para aporte extra de calorias.",
    image: "massa-nitro.jpeg",
    flavors: ["Baunilha", "Chocolate", "Morango"],
  },
  {
    slug: "super-whey-900g",
    name: "Super Whey",
    brand: "Max Titanium",
    category: "Whey Protein",
    type: "Suplemento alimentar de carboidratos e proteínas",
    weight: "900g",
    price: "99.99",
    description: "Combina proteínas e carboidratos para energia extra e suporte ao ganho de massa.",
    image: "super-whey-900g.jpeg",
    flavors: ["Baunilha", "Chocolate", "Morango"],
  },
];

export async function runSeed() {
  // Seed products if empty
  const existingProducts = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
  if (existingProducts.length === 0) {
    logger.info("Seeding products...");
    await db.insert(productsTable).values(SEED_PRODUCTS);
  }

  // Remove legacy test product if it still exists in the database
  await db.delete(productsTable).where(eq(productsTable.slug, "produto-teste"));

  // Seed admin user if not present
  const adminEmail = "admin@paixaosuplementos.com";
  const existingAdmin = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, adminEmail)).limit(1);
  if (existingAdmin.length === 0) {
    logger.info("Seeding admin user...");
    const passwordHash = await hashPassword("admin123");
    await db.insert(usersTable).values({
      name: "Administrador",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });
  }
}
