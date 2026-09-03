// Lógica compartilhada entre a Serverless Function da Vercel (produção) e o
// middleware de desenvolvimento do Vite (preview/dev, inclusive dentro do
// AI Studio). Um "_" no nome da pasta impede a Vercel de tratá-la como uma
// rota própria — ela só existe para ser importada pelos dois lados.

import { GoogleGenAI } from '@google/genai';

export const AUTHOR_NAME = 'Daniel Santos da Silva';

export interface LinkedInPostProjectInput {
  title: string;
  subtitle_pt: string;
  subtitle_en: string;
  short_summary_pt: string;
  short_summary_en: string;
  category_pt: string;
  category_en: string;
  problem_pt: string;
  problem_en: string;
  solution_pt: string;
  solution_en: string;
  features_pt: string[];
  features_en: string[];
  technologies: string[];
  project_url?: string;
}

export function getGeminiClient(): { ai: GoogleGenAI } | { error: string } {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      error:
        'GEMINI_API_KEY não está configurada neste ambiente. No AI Studio isso costuma vir do painel de Secrets do projeto; na Vercel, configure em Project Settings → Environment Variables e refaça o deploy.',
    };
  }
  return { ai: new GoogleGenAI({ apiKey }) };
}

export function buildLinkedInTextPrompt(language: 'pt' | 'en', project: LinkedInPostProjectInput): string {
  return language === 'en' ? buildPromptEn(project) : buildPromptPt(project);
}

function buildPromptPt(project: LinkedInPostProjectInput): string {
  return `Você escreve posts para o LinkedIn em português do Brasil, em primeira pessoa, no lugar de ${AUTHOR_NAME}, um profissional de TI em transição para Análise de Sistemas e Infraestrutura.

Escreva um rascunho de post de LinkedIn anunciando o projeto abaixo. Tom: profissional, direto, sem exagero, com no máximo 2 a 3 emojis no post inteiro, sem hashtags genéricas de "motivação" — apenas 3 a 5 hashtags técnicas relevantes ao final. Estrutura sugerida: um gancho de 1 a 2 frases, um parágrafo curto sobre o problema/contexto, um parágrafo curto sobre a solução e o papel de ${AUTHOR_NAME}, uma lista curta (2 a 4 itens) de destaques técnicos, e uma chamada para ação convidando para ver o case completo no link. Tamanho alvo: 130 a 200 palavras.

Dados do projeto:
- Título: ${project.title}
- Subtítulo: ${project.subtitle_pt || '-'}
- Resumo curto: ${project.short_summary_pt || '-'}
- Categoria: ${project.category_pt || '-'}
- Problema: ${project.problem_pt || '-'}
- Solução: ${project.solution_pt || '-'}
- Principais funcionalidades: ${(project.features_pt || []).filter(Boolean).join('; ') || '-'}
- Tecnologias: ${(project.technologies || []).filter(Boolean).join(', ') || '-'}
${project.project_url ? `- Link do case: ${project.project_url}` : ''}

Retorne apenas o texto final do post, pronto para ser colado no LinkedIn, sem comentários adicionais, sem aspas ao redor do texto e sem markdown.`;
}

function buildPromptEn(project: LinkedInPostProjectInput): string {
  return `You write LinkedIn posts in English, in first person, as ${AUTHOR_NAME}, an IT professional transitioning into Systems & Infrastructure Analysis.

Write a LinkedIn post draft announcing the project below. Tone: professional, direct, not over the top, with at most 2-3 emojis in the whole post, no generic "motivational" hashtags — just 3 to 5 relevant technical hashtags at the end. Suggested structure: a 1-2 sentence hook, a short paragraph on the problem/context, a short paragraph on the solution and ${AUTHOR_NAME}'s role, a short list (2-4 items) of technical highlights, and a call to action inviting readers to check out the full case study via the link. Target length: 130-200 words.

Project data:
- Title: ${project.title}
- Subtitle: ${project.subtitle_en || '-'}
- Short summary: ${project.short_summary_en || '-'}
- Category: ${project.category_en || '-'}
- Problem: ${project.problem_en || '-'}
- Solution: ${project.solution_en || '-'}
- Key features: ${(project.features_en || []).filter(Boolean).join('; ') || '-'}
- Technologies: ${(project.technologies || []).filter(Boolean).join(', ') || '-'}
${project.project_url ? `- Case link: ${project.project_url}` : ''}

Return only the final post text, ready to paste into LinkedIn, with no extra commentary, no surrounding quotes, and no markdown.`;
}

export async function generateLinkedInText(
  ai: GoogleGenAI,
  language: 'pt' | 'en',
  project: LinkedInPostProjectInput
): Promise<{ text: string } | { error: string }> {
  const prompt = buildLinkedInTextPrompt(language, project);

  const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash'];
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response.text?.trim();
      if (text) {
        return { text };
      }
    } catch (err: any) {
      console.warn(`[generateLinkedInText] Falha com modelo ${model}:`, err?.message || err);
      // Se for o último modelo, propaga erro
      if (model === modelsToTry[modelsToTry.length - 1]) {
        return { error: 'Falha ao gerar o post com a API Gemini. Tente novamente em instantes.' };
      }
    }
  }

  return { error: 'A API Gemini não retornou nenhum conteúdo.' };
}

export function buildLinkedInImagePrompt(project: LinkedInPostProjectInput): string {
  const category = project.category_pt || project.category_en || 'tecnologia e infraestrutura';
  const techs = (project.technologies || []).filter(Boolean).join(', ');

  return `Crie uma imagem ilustrativa, abstrata e profissional para acompanhar um post de LinkedIn sobre um projeto de tecnologia chamado "${project.title}" (${category}). Tema visual: infraestrutura de TI, sistemas distribuídos, redes e nuvem, com elementos abstratos que remetam a ${techs || 'arquitetura de software moderna'}. Paleta escura, tons de azul e slate, estilo moderno e minimalista, iluminação sutil tipo glow, composição limpa em formato paisagem widescreen. MUITO IMPORTANTE: a imagem não pode conter nenhum texto, palavra, letra, número, logotipo ou marca d'água — apenas elementos visuais abstratos.`;
}

export async function generateLinkedInImage(
  ai: GoogleGenAI,
  project: LinkedInPostProjectInput
): Promise<{ mimeType: string; data: string } | { error: string }> {
  const prompt = buildLinkedInImagePrompt(project);

  // Tentativa primária com gemini-2.5-flash-image
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part: any) => part.inlineData?.data);

    if (imagePart?.inlineData?.data) {
      return {
        mimeType: imagePart.inlineData.mimeType || 'image/png',
        data: imagePart.inlineData.data,
      };
    }
  } catch (primaryError) {
    console.warn('[generate-linkedin-image] Tentativa com gemini-2.5-flash-image falhou, tentando fallback com imagen-3.0-generate-002:', primaryError);
  }

  // Fallback para geração via imagen-3.0-generate-002 com generateImages
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
      return {
        mimeType: 'image/jpeg',
        data: base64Data,
      };
    }
  } catch (fallbackError) {
    console.error('[generate-linkedin-image] Erro ao gerar imagem via fallback:', fallbackError);
  }

  return { error: 'Falha ao gerar a imagem com a API Gemini. Tente novamente em instantes.' };
}
