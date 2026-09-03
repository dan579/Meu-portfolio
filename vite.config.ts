import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin, ViteDevServer} from 'vite';
import {
  getGeminiClient,
  generateLinkedInText,
  generateLinkedInImage,
} from './api/_shared/gemini.ts';

// Middleware só para desenvolvimento/preview (inclui o preview do AI Studio),
// que roda em cima do Vite puro e não conhece o formato de Serverless
// Functions da Vercel. Em produção na Vercel, essas mesmas rotas
// (/api/generate-linkedin-post e /api/generate-linkedin-image) são
// atendidas pelos arquivos correspondentes dentro de api/, não por este
// plugin — ele só existe dentro do configureServer, que não roda em
// `vite build`.
function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function linkedInApiDevPlugin(): Plugin {
  return {
    name: 'linkedin-api-dev-middleware',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/generate-linkedin-post', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'Método não permitido.' });
          return;
        }

        const client = getGeminiClient();
        if ('error' in client) {
          sendJson(res, 500, { error: client.error });
          return;
        }

        try {
          const body = await readJsonBody(req);
          if (!body?.project?.title) {
            sendJson(res, 400, { error: 'Dados do projeto ausentes na requisição.' });
            return;
          }

          const result = await generateLinkedInText(client.ai, body.language, body.project);
          if ('error' in result) {
            sendJson(res, 502, { error: result.error });
            return;
          }

          sendJson(res, 200, { post: result.text });
        } catch (error) {
          console.error('[dev-middleware] generate-linkedin-post erro:', error);
          sendJson(res, 502, {
            error: 'Falha ao gerar o post com a API Gemini. Tente novamente em instantes.',
          });
        }
      });

      server.middlewares.use('/api/generate-linkedin-image', async (req, res) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'Método não permitido.' });
          return;
        }

        const client = getGeminiClient();
        if ('error' in client) {
          sendJson(res, 500, { error: client.error });
          return;
        }

        try {
          const body = await readJsonBody(req);
          if (!body?.project?.title) {
            sendJson(res, 400, { error: 'Dados do projeto ausentes na requisição.' });
            return;
          }

          const result = await generateLinkedInImage(client.ai, body.project);
          if ('error' in result) {
            sendJson(res, 502, { error: result.error });
            return;
          }

          sendJson(res, 200, { mimeType: result.mimeType, data: result.data });
        } catch (error) {
          console.error('[dev-middleware] generate-linkedin-image erro:', error);
          sendJson(res, 502, {
            error: 'Falha ao gerar a imagem com a API Gemini. Tente novamente em instantes.',
          });
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), linkedInApiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
