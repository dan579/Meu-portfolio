# Meu Portfolio — Documentação Técnica

**Autor:** Daniel Santos da Silva
**Versão atual:** v1.0.0 (Lançamento inicial)
**URL de produção:** https://meu-portfolio-dusky-ten.vercel.app
**Repositório:** github.com/dan579/Meu-portfolio (público, MIT)
**Última atualização:** 26 de agosto de 2026

---

## O que é este projeto

O Interactive CV é um currículo profissional digital, interativo e administrável, construído como um sistema próprio. Ele apresenta a trajetória, competências, experiência em infraestrutura e projetos de Daniel Santos da Silva, e é, ao mesmo tempo, uma demonstração prática da capacidade técnica de quem o construiu.

> "O currículo é também um produto. Meu currículo é um sistema que eu mesmo construí e mantenho."

Isso significa que numa entrevista, Daniel pode abrir o site, entrar no painel administrativo e demonstrar ao vivo: autenticação, autorização, banco de dados relacional, storage, arquitetura de conteúdo e CMS próprio — tudo funcionando em produção. A versão v1.0.0 foi testada ao vivo, incluindo tentativas reais de ataque contra as políticas de segurança do banco (ver seção Segurança).

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Estilização | Tailwind CSS |
| Roteamento | React Router |
| Backend / Banco | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (email + senha) |
| Autorização | Row-Level Security (RLS) no PostgreSQL |
| Storage de mídia | Supabase Storage |
| Geração de PDF | @react-pdf/renderer + qrcode |
| Deploy | Vercel |
| CI/CD | GitHub → Vercel (automático a cada push na `main`) |

---

## Arquitetura

### Camada de conteúdo desacoplada

O ponto arquitetural mais importante do projeto: nenhuma página de UI lê dados diretamente. Toda leitura passa por hooks que consultam um `ContentContext` abstrato.

```
Páginas (UI)
     ↓
Hooks (useProfile, useExperiences, useProjects, ...)
     ↓
ContentContext (interface abstrata)
     ↓
CloudContentProvider → Supabase (produção)
StaticContentProvider → dados estáticos (desenvolvimento/fallback)
```

Isso permite trocar a fonte de dados sem alterar nenhuma página pública. A troca de `StaticContentProvider` para `CloudContentProvider` foi feita sem modificar uma única linha de código de página.

### Modelo de segurança

O acesso administrativo é multi-admin: uma lista de e-mails autorizados fica na tabela `authorized_admins`, e não em uma única conta fixa. A segurança opera em duas camadas independentes:

**Frontend (`AdminAuthGuard`):** bloqueia visualmente o acesso a `/admin/*` se o usuário não estiver autenticado.

**Backend (RLS no PostgreSQL):** a função `is_authorized_admin()` verifica se o e-mail do JWT autenticado existe na tabela `authorized_admins`. Todas as políticas de `INSERT`/`UPDATE`/`DELETE` em todas as tabelas administráveis dependem dessa função. A leitura pública é sempre liberada para o conteúdo publicado do site.

```sql
CREATE OR REPLACE FUNCTION is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM authorized_admins
        WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Um gatilho (`prevent_delete_last_admin`) impede a remoção do último administrador da lista, evitando que o sistema fique sem nenhum acesso administrativo por engano. O banco recusa qualquer escrita de contas não autorizadas, mesmo que alguém manipule o frontend ou chame a API diretamente — isso foi validado ao vivo em produção (ver seção Segurança).

Hoje a gestão da lista de `authorized_admins` é feita diretamente no banco (SQL Editor do Supabase ou pelas funções auxiliares em `src/lib/supabase.ts`); ainda não existe uma tela dedicada no painel admin para adicionar/remover administradores pela interface.

### Segurança testada em produção

Além da revisão de código, o RLS foi validado com tentativas reais de ataque contra o ambiente de produção, usando a chave pública (anon key) sem nenhuma sessão autenticada: tentativas de `UPDATE` em `profiles` e `DELETE` de um projeto real foram bloqueadas silenciosamente (0 linhas afetadas, comportamento correto do RLS), e uma tentativa de `INSERT` de um projeto falso foi rejeitada explicitamente com HTTP 401 e código Postgres `42501`. Esse processo revelou e permitiu corrigir, antes do lançamento, um bug real: a tabela `authorized_admins` nunca havia sido criada em produção porque a migração 007 nunca tinha sido executada manualmente — só existia no código exportado.

---

## Banco de dados

### Tabelas principais

| Tabela | Descrição |
|---|---|
| `profiles` | Linha única com identidade, biografia e referência à foto |
| `education_items` | Formação acadêmica |
| `certification_items` | Certificações |
| `experiences` | Histórico profissional |
| `infrastructure_areas` | Áreas de infraestrutura (ex: Redes, Servidores) |
| `infrastructure_tech_items` | Tecnologias dentro de cada área, com `purpose` e `applied_context` |
| `skill_categories` | Categorias de competência |
| `skill_items` | Competências individuais com contexto de aplicação (sem porcentagem) |
| `projects` | Cases de projeto completos |
| `media_assets` | Metadados de arquivos de mídia |
| `project_media` | Relação normalizada entre projetos e imagens de galeria |
| `authorized_admins` | Lista de e-mails autorizados a administrar o sistema — base do RLS de escrita |
| `contact_info` | Dados de contato público |
| `metrics_snapshots` / `metric_items` | Legado do antigo painel de Métricas, removido do produto (ver Roadmap). Tabelas mantidas no banco sem uso pela aplicação. |
| `app_config` | Configuração interna legada (armazenava o e-mail de admin antes do modelo multi-admin) |

### Padrões aplicados em todas as tabelas de conteúdo

- `status TEXT CHECK (status IN ('draft', 'published', 'archived'))` — publicação controlada
- `sort_order INTEGER` — ordenação manual sem alterar código
- RLS habilitado com leitura pública liberada e escrita restrita ao admin autorizado

### Storage

Bucket `media` (público para leitura, escrito apenas por administradores autorizados via RLS de Storage, limite de 5MB por arquivo). Arquivos físicos separados de metadados: o banco guarda apenas referências em `media_assets`, nunca o arquivo em si.

---

## Rotas do site público

| Rota | Descrição |
|---|---|
| `/` | Home — identidade, foco profissional, stack principal, projetos em destaque, download de CV em PDF |
| `/sobre` | Trajetória completa, formação, competências por categoria |
| `/experiencia` | Histórico profissional cronológico |
| `/infraestrutura` | Catálogo por área operacional com contexto de uso real |
| `/projetos` | Lista de cases de projeto |
| `/projetos/:slug` | Case detalhado: Problema → Solução → Arquitetura → Features → Tech → Papel → Galeria → Links |
| `/contato` | Canais de contato e download de CV em PDF |
| `/metricas` | Descontinuada — mantida apenas como redirecionamento para a Home |

---

## Painel administrativo (`/admin`)

### Autenticação

Email + senha via `supabase.auth.signInWithPassword()`. Sessão gerenciada pelo Supabase Auth com `onAuthStateChange`. Qualquer e-mail presente na tabela `authorized_admins` pode entrar.

### Áreas disponíveis

| Rota | Descrição |
|---|---|
| `/admin` | Dashboard com status e atalhos |
| `/admin/perfil` | Edição de identidade, foto (via MediaPicker), formação, certificações |
| `/admin/experiencia` | CRUD de experiências com status e ordenação |
| `/admin/infraestrutura` | Gestão em dois níveis: áreas → tecnologias |
| `/admin/competencias` | Gestão em dois níveis: categorias → competências (sem porcentagem) |
| `/admin/projetos` | CRUD completo de cases com galeria real de imagens e geração de PDF |
| `/admin/media` | Biblioteca de mídia com upload, busca e gestão |

### Componente MediaPicker

Componente reutilizável para seleção/upload de imagens. Usado tanto na galeria de projetos quanto na foto de perfil. Características:
- Upload com drag-and-drop
- Validação de tamanho (5MB) e tipo (JPEG, PNG, WEBP, GIF, SVG)
- Busca de assets existentes
- Preview antes de confirmar
- Exclusão com confirmação (arquivo preservado em `media_assets` por padrão)

### Geração de currículo em PDF

Dois formatos, gerados sob demanda a partir do mesmo conteúdo cadastrado no CMS, com @react-pdf/renderer: **Currículo Tradicional** (formato ATS, enxuto) e **Portfólio Completo** (com projetos, arquitetura e QR Code de acesso ao site). Disponível por um menu suspenso a partir de um único botão em três pontos do site: Home, Contato e Admin.

---

## Decisões de design importantes

### Competências sem porcentagem

O sistema não usa barras de progresso, estrelas ou porcentagens para competências técnicas. Em vez disso, cada competência tem:
- **Nome** da tecnologia ou prática
- **Categoria** (infra, systems, devops, tools, methods)
- **Contexto de aplicação** (texto livre descrevendo onde e como foi usado)

Isso é defensável numa entrevista. "Active Directory 75%" não é.

### Evolução do Foco Profissional: de percentual à remoção completa

O sistema teve, em versões anteriores, um bloco de "Composição de Atuação" que expressava a dedicação entre Infraestrutura e Sistemas como um percentual (ex: 60%/40%). Essa abordagem foi abandonada em duas etapas: primeiro a migração 006 substituiu a exigência de percentual por uma descrição qualitativa em texto livre (mantendo as colunas numéricas apenas por compatibilidade, sem restrição de soma); depois, para manter consistência com o princípio de "sem autoavaliação numérica" já aplicado às competências, o bloco foi removido por completo da interface pública e do painel admin. As colunas `work_focus_*` continuam existindo em `profiles` sem uso pela aplicação.

### Projetos como evidência

Cada projeto segue obrigatoriamente a estrutura:
**Problema → Solução → Arquitetura → Funcionalidades → Tecnologias → Papel de Daniel → Galeria → Links**

Não são "itens de portfólio decorativos" — são cases que demonstram processo de pensamento, decisões técnicas e participação real.

### Métricas: feature descontinuada

O projeto teve, em versões anteriores, um painel de Métricas com snapshots agregados (origem: Operis). Essa feature foi descontinuada e removida do produto — nav, rota pública e painel admin — antes do lançamento da v1.0.0, para manter o foco do currículo no que está efetivamente validado e evitar exibir números sem lastro atualizado. As tabelas `metrics_snapshots`/`metric_items` continuam no banco, sem uso pela aplicação.

---

## Configuração e deploy

### Variáveis de ambiente (Vercel)

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anon do Supabase |
| `VITE_ADMIN_EMAIL` | E-mail de administrador usado como referência/fallback de bootstrap |
| `GEMINI_API_KEY` | Chave da API Gemini, injetada automaticamente pelo ambiente do Google AI Studio |
| `APP_URL` | URL pública da aplicação |

### Configuração do banco (passo único após criar projeto Supabase)

```sql
-- 1. Executar schema.sql
-- 2. Executar as migrations em ordem: 002, 003, 004, 005, 006, 007
-- 3. A migração 007 já inclui um bootstrap anti-lockout que tenta preencher
--    authorized_admins automaticamente a partir do e-mail configurado; se
--    precisar adicionar manualmente:
INSERT INTO authorized_admins (email, added_by) VALUES ('seu@email.com', 'setup');
-- 4. Criar usuário admin
UPDATE auth.users
SET encrypted_password = crypt('sua_senha', gen_salt('bf'))
WHERE email = 'seu@email.com';
```

### Criar bucket de Storage

No painel do Supabase → Storage → New bucket → nome: `media` → Public bucket. (A migração 003 também cria o bucket e suas políticas de RLS automaticamente, caso ainda não exista.)

---

## Migrations

| Arquivo | Descrição |
|---|---|
| `schema.sql` | Schema inicial — tabelas base e RLS |
| `002_fix_admin_email_config.sql` | Tabela `app_config` substituindo `ALTER DATABASE` (sem permissão no Supabase hospedado) |
| `003_media_assets_and_projects.sql` | Bucket de Storage, tabelas de mídia, projetos e políticas de RLS |
| `004_profile_avatar_media.sql` | Coluna `avatar_media_id` em `profiles` |
| `005_metrics_snapshots.sql` | Tabelas de métricas com `entry_method` e constraint de unicidade por período (feature depois descontinuada) |
| `006_qualitative_work_focus.sql` | Substitui a exigência de percentual de foco profissional por descrição qualitativa |
| `007_authorized_admins_list.sql` | Cria a tabela `authorized_admins`, redefine `is_authorized_admin()` para multi-admin e adiciona o gatilho anti-lockout |

---

## Bilinguismo

O site suporta PT-BR e EN-US. A separação é:
- **Conteúdo profissional** (descrições, títulos, competências): colunas `_pt` e `_en` no banco
- **Rótulos de interface** (botões, labels): i18n no código

O `ContentProvider` expõe os dados no idioma selecionado. A troca de idioma não recarrega a página.

---

## Roadmap

| Fase | Status | Descrição |
|---|---|---|
| 0 — Arquitetura | ✅ | Planejamento, modelo de dados, definição de segurança |
| 1 — Conteúdo | ✅ | Camada de conteúdo desacoplada, dados estáticos |
| 2 — Site público | ✅ | Todas as rotas públicas |
| 3 — Admin núcleo | ✅ | Auth, perfil, experiência |
| 4 — CMS completo | ✅ | Infraestrutura, competências, projetos, mídia, foto |
| 4.2 — Consolidação | ✅ | Foto por upload, competências sem porcentagem |
| 4.6 — Multi-admin | ✅ | Tabela `authorized_admins`, RLS multi-admin, anti-lockout |
| 5 — Métricas | ❌ Descontinuada | Removida do produto antes da v1.0.0 (ver Decisões de design) |
| 7 — PDF | ✅ | Geração de currículo em dois formatos (ATS e Portfólio Completo), disponível em Home/Contato/Admin |
| Lançamento v1.0.0 | ✅ | Testes de segurança reais em produção, licença MIT, release publicada, histórico de commits auditado |
| 6 — Histórico | ⏳ | Evolução do sistema exposta ao visitante |
| Conteúdo de imagens | ⏳ | Imagens reais nos cases de Sistema de Agendamento Acadêmico e Interactive CV |
| Refinamento | ⏳ | Cross-browser (Firefox/Safari), responsividade completa, auditoria Lighthouse, domínio customizado |

---

## Projetos apresentados no currículo

### Operis
SaaS multi-tenant para gestão operacional. Construído com Row-Level Security para isolamento total entre tenants, lógica de SLA e homologação documentada de segurança.

### Sistema de Agendamento Acadêmico (UNIFENAS)
Sistema institucional para agendamento de salas desenvolvido internamente na UNIFENAS. Apresentado como case de experiência profissional (não portfólio pessoal, dado que a propriedade é institucional).

### Interactive CV (este site)
O currículo em si é um dos cases. Meta-demonstração: o sistema que apresenta os projetos é ele mesmo um projeto, construído, mantido e evoluído por Daniel.

---

## Licença

Distribuído sob a licença MIT — veja [LICENSE](./LICENSE).

---

*Documentação atualizada em 26/08/2026, refletindo o estado real da v1.0.0. Para dúvidas ou contribuições, entre em contato via danielsan579@gmail.com*
