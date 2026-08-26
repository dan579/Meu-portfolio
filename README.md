# Meu Portfolio — Documentação Técnica

**Autor:** Daniel Santos da Silva  
**Versão atual:** v0.5 (CMS completo)  
**URL de produção:** https://meu-portfolio-dusky-ten.vercel.app  
**Repositório:** github.com/dan579/Meu-portfolio (privado)  
**Última atualização:** 21 de agosto de 2026

---

## O que é este projeto

O Interactive CV é um currículo profissional digital, interativo e administrável, construído como um sistema próprio. Ele apresenta a trajetória, competências, experiência em infraestrutura, projetos e métricas profissionais de Daniel Santos da Silva, e é, ao mesmo tempo, uma demonstração prática da capacidade técnica de quem o construiu.

> "O currículo é também um produto. Meu currículo é um sistema que eu mesmo construí e mantenho."

Isso significa que numa entrevista, Daniel pode abrir o site, entrar no painel administrativo e demonstrar ao vivo: autenticação, autorização, banco de dados relacional, storage, arquitetura de conteúdo e CMS próprio — tudo funcionando em produção.

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
StaticContentProvider → dados estáticos (desenvolvimento)
```

Isso permite trocar a fonte de dados sem alterar nenhuma página pública. A troca de `StaticContentProvider` para `CloudContentProvider` foi feita sem modificar uma única linha de código de página.

### Modelo de segurança

Existe apenas uma conta autorizada a administrar o sistema. A segurança opera em duas camadas independentes:

**Frontend (`AdminAuthGuard`):** bloqueia visualmente o acesso a `/admin/*` se o usuário não estiver autenticado.

**Backend (RLS no PostgreSQL):** a função `is_authorized_admin()` valida o e-mail do JWT autenticado contra a tabela `app_config`. Todas as políticas de `INSERT`/`UPDATE`/`DELETE` em todas as tabelas dependem dessa função. A leitura pública é sempre restrita a registros com `status = 'published'`.

```sql
CREATE OR REPLACE FUNCTION is_authorized_admin()
RETURNS BOOLEAN AS $$
DECLARE admin_email TEXT;
BEGIN
    SELECT value INTO admin_email FROM app_config WHERE key = 'admin_email';
    RETURN (
        auth.role() = 'authenticated' AND
        admin_email IS NOT NULL AND
        admin_email = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

O banco recusa qualquer escrita de contas não autorizadas, mesmo que alguém manipule o frontend ou chame a API diretamente.

---

## Banco de dados

### Tabelas principais

| Tabela | Descrição |
|---|---|
| `profiles` | Linha única com identidade, biografia, foco profissional e referência à foto |
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
| `metrics_snapshots` | Períodos de métricas agregadas (origem: Operis) |
| `metric_items` | Métricas individuais dentro de cada snapshot |
| `app_config` | Configurações internas (e-mail de admin) |
| `contact_info` | Dados de contato público |

### Padrões aplicados em todas as tabelas de conteúdo

- `status TEXT CHECK (status IN ('draft', 'published', 'archived'))` — publicação controlada
- `sort_order INTEGER` — ordenação manual sem alterar código
- RLS habilitado com leitura pública de `published` e escrita restrita ao admin

### Storage

Bucket `media` (público para leitura, escrito apenas pelo admin via RLS de Storage). Arquivos físicos separados de metadados: o banco guarda apenas referências em `media_assets`, nunca o arquivo em si.

---

## Rotas do site público

| Rota | Descrição |
|---|---|
| `/` | Home — identidade, foco profissional, stack principal, projetos em destaque |
| `/sobre` | Trajetória completa, formação, competências por categoria |
| `/experiencia` | Histórico profissional cronológico |
| `/infraestrutura` | Catálogo por área operacional com contexto de uso real |
| `/projetos` | Lista de cases de projeto |
| `/projetos/:slug` | Case detalhado: Problema → Solução → Arquitetura → Features → Tech → Papel → Galeria → Links |
| `/metricas` | Métricas agregadas de atuação (origem: Operis) |
| `/contato` | Canais de contato |

---

## Painel administrativo (`/admin`)

### Autenticação

Email + senha via `supabase.auth.signInWithPassword()`. Sessão gerenciada pelo Supabase Auth com `onAuthStateChange`.

### Áreas disponíveis

| Rota | Descrição |
|---|---|
| `/admin` | Dashboard com status e atalhos |
| `/admin/perfil` | Edição de identidade, foto (via MediaPicker), foco profissional, formação, certificações |
| `/admin/experiencia` | CRUD de experiências com status e ordenação |
| `/admin/infraestrutura` | Gestão em dois níveis: áreas → tecnologias |
| `/admin/competencias` | Gestão em dois níveis: categorias → competências (sem porcentagem) |
| `/admin/projetos` | CRUD completo de cases com galeria real de imagens |
| `/admin/midia` | Biblioteca de mídia com upload, busca e gestão |
| `/admin/metricas` | CRUD de snapshots de métricas profissionais |

### Componente MediaPicker

Componente reutilizável para seleção/upload de imagens. Usado tanto na galeria de projetos quanto na foto de perfil. Características:
- Upload com drag-and-drop
- Validação de tamanho (5MB) e tipo (JPEG, PNG, WEBP, GIF, SVG)
- Busca de assets existentes
- Preview antes de confirmar
- Exclusão com confirmação (arquivo preservado em `media_assets` por padrão)

---

## Decisões de design importantes

### Competências sem porcentagem

O sistema não usa barras de progresso, estrelas ou porcentagens para competências técnicas. Em vez disso, cada competência tem:
- **Nome** da tecnologia ou prática
- **Categoria** (infra, systems, devops, tools, methods)
- **Contexto de aplicação** (texto livre descrevendo onde e como foi usado)

Isso é defensável numa entrevista. "Active Directory 75%" não é.

### Foco profissional com percentual

O único lugar do sistema com percentual é o bloco de **Composição de Atuação** (ex: 60% Infraestrutura / 40% Sistemas). Esse número representa composição de dedicação/escopo, não nível de domínio técnico. O formulário exige que a soma seja exatamente 100% e tem label explícito explicando a distinção.

### Projetos como evidência

Cada projeto segue obrigatoriamente a estrutura:
**Problema → Solução → Arquitetura → Funcionalidades → Tecnologias → Papel de Daniel → Galeria → Links**

Não são "itens de portfólio decorativos" — são cases que demonstram processo de pensamento, decisões técnicas e participação real.

### Métricas via snapshot manual

As métricas do Operis são inseridas manualmente no CMS como snapshots periódicos. Cada snapshot tem `entry_method` (`manual`/`automated`) e a constraint `UNIQUE (source_system, period_start, period_end)` previne duplicação e permite futura automação via job sem alterar schema.

---

## Configuração e deploy

### Variáveis de ambiente (Vercel)

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anon do Supabase |
| `VITE_ADMIN_EMAIL` | E-mail do administrador autorizado |

### Configuração do banco (passo único após criar projeto Supabase)

```sql
-- 1. Executar schema.sql
-- 2. Executar migrations em ordem: 002, 003, 004, 005
-- 3. Configurar e-mail de admin
INSERT INTO app_config (key, value) VALUES ('admin_email', 'seu@email.com');
-- 4. Criar usuário admin
UPDATE auth.users 
SET encrypted_password = crypt('sua_senha', gen_salt('bf'))
WHERE email = 'seu@email.com';
```

### Criar bucket de Storage

No painel do Supabase → Storage → New bucket → nome: `media` → Public bucket.

---

## Migrations

| Arquivo | Descrição |
|---|---|
| `schema.sql` | Schema completo — todas as tabelas, RLS, função `is_authorized_admin()` |
| `002_fix_admin_email_config.sql` | Tabela `app_config` substituindo `ALTER DATABASE` (sem permissão no Supabase hospedado) |
| `003_media_assets_and_projects.sql` | Tabelas de mídia, projetos e políticas de Storage RLS |
| `004_profile_avatar_media.sql` | Coluna `avatar_media_id` em `profiles` |
| `005_metrics_snapshots.sql` | Tabelas de métricas com `entry_method` e constraint de unicidade por período |

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
| 5 — Métricas | ✅ | Snapshots manuais do Operis, preparado para automação |
| 6 — Histórico | ⏳ | Evolução do sistema exposta ao visitante |
| 7 — PDF | ⏳ | Geração de currículo PDF a partir do CMS |
| Refinamento | ⏳ | Performance, SEO, acessibilidade, otimização |

---

## Projetos apresentados no currículo

### Operis
SaaS multi-tenant para gestão operacional. Construído com Row-Level Security para isolamento total entre tenants, lógica de SLA e homologação documentada de segurança. O próprio currículo consome métricas agregadas do Operis via snapshots.

### Sistema de Agendamento Acadêmico (UNIFENAS)
Sistema institucional para agendamento de salas desenvolvido internamente na UNIFENAS. Apresentado como case de experiência profissional (não portfólio pessoal, dado que a propriedade é institucional).

### Interactive CV (este site)
O currículo em si é um dos cases. Meta-demonstração: o sistema que apresenta os projetos é ele mesmo um projeto, construído, mantido e evoluído por Daniel.

---

*Documentação gerada em 21/08/2026. Para dúvidas ou contribuições, entre em contato via danielsan579@gmail.com*

---

## Estado atual do conteúdo (22/08/2026)

O CMS foi preenchido com conteúdo real. O site está em produção em `https://meu-portfolio-dusky-ten.vercel.app`.

### Conteúdo publicado

**Perfil:** foto real, composição de atuação 60/40, bio completa, disponível em PT-BR e EN-US.

**Experiência:** 4 cargos (UNIFENAS, iBeautty, Selpe/INSS, AeC), todos com responsabilidades reais, tecnologias e destaques operacionais.

**Infraestrutura:** 4 áreas operacionais, 9 tecnologias, cada uma com finalidade técnica + contexto real de aplicação na UNIFENAS.

**Competências:** 3 categorias, sem porcentagem, com contexto de uso real em cada item.

**Projetos:** 3 cases completos (Operis, Sistema de Agendamento Acadêmico, Interactive CV).

### Pendências

| Item | Status |
|---|---|
| Imagens reais nos mockups de projetos | ⏳ Pendente |
| Seção de Métricas | ⏳ A esconder do menu (sem dados reais) |
| Campo de e-mail na tela de login | ⏳ A remover |
