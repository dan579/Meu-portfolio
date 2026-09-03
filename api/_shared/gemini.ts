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
  return {
    ai: new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }),
  };
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: 'low' },
      } as any,
    });

    const text = extractGeminiText(response);

    if (text) {
      return { text };
    }

    const reason = (response as any)?.candidates?.[0]?.finishReason;
    console.error(
      '[generateLinkedInText] Resposta sem texto extraível. finishReason:',
      reason,
      'promptFeedback:',
      JSON.stringify((response as any)?.promptFeedback)
    );
    return { error: `A API Gemini não retornou nenhum conteúdo (finishReason: ${reason || 'desconhecido'}).` };
  } catch (err: any) {
    console.error('[generateLinkedInText] Erro ao chamar a API Gemini:', err?.message || err);
    return {
      error: `Falha ao gerar o post com a API Gemini. Tente novamente em instantes. (detalhe técnico: ${err?.message || 'erro desconhecido'})`,
    };
  }
}

function extractGeminiText(response: any): string {
  if (typeof response?.text === 'string' && response.text.trim()) {
    return response.text.trim();
  }

  const parts = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const joined = parts
      .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();
    if (joined) return joined;
  }

  return '';
}

