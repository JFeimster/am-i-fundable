import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toPublicProductsRegistry, toPublicProviderCategories } from "../lib/public-transform.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(relativePath, data) {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

const internalProducts = readJson("internal/products/funding-products.registry.json");

writeJson("data/products.public.json", toPublicProductsRegistry(internalProducts));
writeJson("data/provider-categories.public.json", toPublicProviderCategories());

console.log("Public funding data generated without provider names, affiliate URLs, commissions, or contacts.");
