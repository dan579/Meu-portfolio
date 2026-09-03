// Vercel Serverless Function (Node.js runtime).
// Autossuficiente de propósito — sem imports locais — pelo mesmo motivo do
// generate-linkedin-post.ts (ERR_MODULE_NOT_FOUND com import relativo).

import { GoogleGenAI } from '@google/genai';

interface LinkedInPostProjectInput {
  title: string;
  category_pt: string;
  category_en: string;
  technologies: string[];
  [key: string]: unknown;
}

interface RequestBody {
  project: LinkedInPostProjectInput;
}

function buildImagePrompt(project: LinkedInPostProjectInput): string {
  const category = project.category_pt || project.category_en || 'tecnologia e infraestrutura';
  const techs = (project.technologies || []).filter(Boolean).join(', ');

  return `Crie uma imagem ilustrativa, abstrata e profissional para acompanhar um post de LinkedIn sobre um projeto de tecnologia chamado "${project.title}" (${category}). Tema visual: infraestrutura de TI, sistemas distribuídos, redes e nuvem, com elementos abstratos que remetam a ${techs || 'arquitetura de software moderna'}. Paleta escura, tons de azul e slate, estilo moderno e minimalista, iluminação sutil tipo glow, composição limpa em formato paisagem widescreen. MUITO IMPORTANTE: a imagem não pode conter nenhum texto, palavra, letra, número, logotipo ou marca d'água — apenas elementos visuais abstratos.`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        'GEMINI_API_KEY não está configurada no ambiente do servidor (Vercel). Configure em Project Settings → Environment Variables e faça um novo deploy.',
    });
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

  const prompt = buildImagePrompt(body.project);
  const ai = new GoogleGenAI({ apiKey });

  // Tentativa primária: geração nativa de imagem via generateContent
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part: any) => part.inlineData?.data);

    if (imagePart?.inlineData?.data) {
      res.status(200).json({
        mimeType: imagePart.inlineData.mimeType || 'image/png',
        data: imagePart.inlineData.data,
      });
      return;
    }
  } catch (primaryError) {
    console.warn('[generate-linkedin-image] gemini-2.5-flash-image falhou, tentando imagen-3.0-generate-002:', primaryError);
  }

  // Fallback: Imagen via generateImages
  try {
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg',
      },
    });

    const base64Data = imageResponse.generatedImages?.[0]?.image?.imageBytes;
    if (base64Data) {
      res.status(200).json({ mimeType: 'image/jpeg', data: base64Data });
      return;
    }
  } catch (fallbackError) {
    console.error('[generate-linkedin-image] Erro no fallback imagen-3.0-generate-002:', fallbackError);
  }

  res.status(502).json({ error: 'Falha ao gerar a imagem com a API Gemini. Tente novamente em instantes.' });
}
