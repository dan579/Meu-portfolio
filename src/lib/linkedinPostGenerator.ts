// Cliente para o endpoint serverless /api/generate-linkedin-post.
// A chamada de IA (Gemini) acontece inteiramente no servidor — este módulo
// só envia os dados do projeto e recebe o texto pronto.
//
// Inclui repetição automática (até 2 tentativas extras) quando a falha é de
// rede (ex: "Failed to fetch" em conexão de celular instável) e um limite de
// tempo de 45s por tentativa, para nunca ficar esperando indefinidamente.

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

const REQUEST_TIMEOUT_MS = 45000;
const MAX_ATTEMPTS = 3;

async function requestLinkedInPost(params: GenerateLinkedInPostParams): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('/api/generate-linkedin-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
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
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRetryableNetworkError(err: any): boolean {
  // "Failed to fetch" chega como TypeError; nosso próprio timeout (AbortController)
  // chega como AbortError/DOMException. Os dois valem tentar de novo sozinho.
  return err instanceof TypeError || err?.name === 'AbortError';
}

export async function generateLinkedInPost(params: GenerateLinkedInPostParams): Promise<string> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await requestLinkedInPost(params);
    } catch (err: any) {
      lastError = err;
      const isLastAttempt = attempt === MAX_ATTEMPTS;

      if (!isRetryableNetworkError(err) || isLastAttempt) {
        throw err;
      }

      // Espera um pouco antes de tentar de novo (backoff simples).
      await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }

  throw lastError;
}
