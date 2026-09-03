// Vercel Serverless Function (Node.js runtime) — usada em PRODUÇÃO na Vercel.
// Em desenvolvimento/preview (inclusive dentro do AI Studio), quem responde
// esta mesma rota é o middleware adicionado em vite.config.ts, usando a
// mesma lógica compartilhada em api/_shared/gemini.ts.

import { getGeminiClient, generateLinkedInImage, LinkedInPostProjectInput } from './_shared/gemini.ts';

interface RequestBody {
  project: LinkedInPostProjectInput;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const client = getGeminiClient();
  if ('error' in client) {
    res.status(500).json({ error: client.error });
    return;
  }

  let body: RequestBody;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: 'Corpo da requisição inválido.' });
    return;
  }

  if (!body?.project?.title) {
    res.status(400).json({ error: 'Dados do projeto ausentes na requisição.' });
    return;
  }

  const result = await generateLinkedInImage(client.ai, body.project);

  if ('error' in result) {
    res.status(502).json({ error: result.error });
    return;
  }

  res.status(200).json({ mimeType: result.mimeType, data: result.data });
}
