import { LinkedInPostProjectInput } from './linkedinPostGenerator.ts';

export interface GeneratedLinkedInImage {
  mimeType: string;
  dataUrl: string;
}

export async function generateLinkedInImage(project: LinkedInPostProjectInput): Promise<GeneratedLinkedInImage> {
  const response = await fetch('/api/generate-linkedin-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project }),
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    // resposta sem corpo JSON válido — tratado abaixo pelo !response.ok
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Falha ao gerar a imagem (HTTP ${response.status}).`);
  }

  if (!payload?.data) {
    throw new Error('A resposta da API não trouxe a imagem.');
  }

  const mimeType = payload.mimeType || 'image/png';
  return { mimeType, dataUrl: `data:${mimeType};base64,${payload.data}` };
}
