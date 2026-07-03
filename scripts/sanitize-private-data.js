import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const providersPath = path.join(root, "internal/providers/funding-providers.registry.json");
const productsPath = path.join(root, "internal/products/funding-products.registry.json");

const providersRegistry = readJson(providersPath);
const productsRegistry = readJson(productsPath);

const providerNameById = new Map();
const providerIdMap = new Map();

providersRegistry.generatedFrom = "Sanitized demo provider dataset";
providersRegistry.entries = (providersRegistry.entries || []).map((provider, index) => {
  const demoProviderId = `demo-provider-${String(index + 1).padStart(2, "0")}`;
  const demoProviderName = `Demo Provider ${String(index + 1).padStart(2, "0")}`;

  providerNameById.set(provider.id, demoProviderName);
  providerIdMap.set(provider.id, demoProviderId);

  return {
    ...provider,
    id: demoProviderId,
    slug: demoProviderId,
    name: demoProviderName,
    affiliate: sanitizeAffiliate(provider.affiliate),
    source: sanitizeSource(provider.source)
  };
});

productsRegistry.entries = (productsRegistry.entries || []).map((product) => ({
  ...product,
  providerName: providerNameById.get(product.providerId) || "Demo Provider",
  providerId: providerIdMap.get(product.providerId) || "demo-provider-unmapped",
  source: sanitizeSource(product.source)
}));

writeJson(providersPath, providersRegistry);
writeJson(productsPath, productsRegistry);

console.log("Sanitized provider and product registry data for public repo use.");

function sanitizeAffiliate(affiliate = {}) {
  return {
    ...affiliate,
    affiliateUrl: null,
    applyUrl: null,
    commissionRate: null,
    contactEmail: null,
    keyContact: null,
    website: null
  };
}

function sanitizeSource(source = {}) {
  const sanitizedNotes = Array.isArray(source.notes) ? ["Removed from public repo. Store operational notes in a private system."] : source.notes;
  return {
    ...source,
    derivedFrom: "Private source removed from public repo",
    notionUrl: null,
    notes: sanitizedNotes
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
