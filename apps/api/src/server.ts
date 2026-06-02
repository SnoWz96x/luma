// Servidor de sync do LUMA — Node HTTP puro (sem framework, leve e offline).
// Rotas: GET /health, POST /sync/push, GET /sync/pull?entity=&since=.
// Store em memória por padrão (troca por Postgres no futuro). Veja docs/16.
import { createServer } from "node:http";
import { InMemorySyncStore } from "./syncStore.js";
import type { OutboxEntry } from "@luma/shared";

const store = new InMemorySyncStore();
const PORT = Number(process.env.PORT ?? 4000);

function json(res: import("node:http").ServerResponse, code: number, body: unknown) {
  const data = JSON.stringify(body);
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

async function readBody(req: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") return json(res, 204, {});

  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, { ok: true, service: "luma-sync", ts: new Date().toISOString() });
  }

  if (req.method === "POST" && url.pathname === "/sync/push") {
    const body = (await readBody(req)) as { entity?: string; changes?: OutboxEntry[] };
    if (!body.entity || !Array.isArray(body.changes)) {
      return json(res, 400, { error: "entity e changes[] obrigatórios" });
    }
    return json(res, 200, store.push(body.entity, body.changes));
  }

  if (req.method === "GET" && url.pathname === "/sync/pull") {
    const entity = url.searchParams.get("entity");
    const since = Number(url.searchParams.get("since") ?? "0");
    if (!entity) return json(res, 400, { error: "entity obrigatório" });
    return json(res, 200, { entity, ...store.pull(entity, since) });
  }

  json(res, 404, { error: "rota não encontrada" });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`LUMA sync API ouvindo em http://localhost:${PORT}`);
});
