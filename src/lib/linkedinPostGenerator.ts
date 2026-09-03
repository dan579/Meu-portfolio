// Cliente para o endpoint serverless /api/generate-linkedin-post.
// A chamada de IA (Gemini) acontece inteiramente no servidor — este módulo
// só envia os dados do projeto e recebe o texto pronto.

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

export interface GenerateLinkedInPostParams {
  language: 'pt' | 'en';
  project: LinkedInPostProjectInput;
}

export async function generateLinkedInPost(params: GenerateLinkedInPostParams): Promise<string> {
  const response = await fetch('/api/generate-linkedin-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    // resposta sem corpo JSON válido — tratado abaixo pelo !response.ok
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Falha ao gerar o post (HTTP ${response.status}).`);
  }

  if (!payload?.post) {
    throw new Error('A resposta da API não trouxe o texto do post.');
  }

  return payload.post as string;
}
