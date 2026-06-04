import wheyMax900g from "@/assets/whey-max-900g.jpeg";
import creatinaProbiotica from "@/assets/creatina-probiotica-300g.jpeg";
import massTitanium from "@/assets/mass-titanium-17500.jpeg";
import massaNitro from "@/assets/massa-nitro.jpeg";
import preTreinoHorus from "@/assets/pre-treino-horus.jpeg";
import superWhey from "@/assets/super-whey-900g.jpeg";
import pureWhey from "@/assets/pure-whey-probiotica.jpeg";
import creatinaMax from "@/assets/creatina-max-300g.jpeg";

const map: Record<string, string> = {
  "whey-max-900g.jpeg": wheyMax900g,
  "creatina-probiotica-300g.jpeg": creatinaProbiotica,
  "mass-titanium-17500.jpeg": massTitanium,
  "massa-nitro.jpeg": massaNitro,
  "pre-treino-horus.jpeg": preTreinoHorus,
  "super-whey-900g.jpeg": superWhey,
  "pure-whey-probiotica.jpeg": pureWhey,
  "creatina-max-300g.jpeg": creatinaMax,
};

export function resolveProductImage(image: string | null | undefined): string {
  if (!image) return wheyMax900g;
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return map[image] ?? wheyMax900g;
}
