# Guia de Configuração do Supabase (Interactive CV)

Este documento descreve as etapas para configurar o banco de dados Supabase e a segurança de conta única para o painel de administração do **Interactive CV**.

---

## 1. Executar o Esquema Inicial

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com/).
2. Vá até o **SQL Editor**.
3. Copie e cole todo o conteúdo do arquivo `supabase/schema.sql` e execute o script (**Run**).

---

## 2. Configurar a Regra de Conta Única de Administrador (Segurança RLS)

Para garantir que apenas o proprietário do currículo consiga inserir, alterar ou excluir registros, a função `is_authorized_admin()` valida o e-mail contido no token JWT do usuário autenticado contra o parâmetro de configuração `app.admin_email` do PostgreSQL.

### Passo Manual Obrigatório no Supabase SQL Editor:
No **SQL Editor** do Supabase, execute o comando abaixo substituindo com seu e-mail de administrador real:

```sql
ALTER DATABASE postgres SET app.admin_email = 'seu_email_real@exemplo.com';
```

> **Por que este método é seguro?**
> - O e-mail de administrador fica armazenado exclusivamente na configuração interna do PostgreSQL.
> - Nenhum e-mail pessoal ou sensível fica commitado no repositório de código ou exposto em arquivos públicos.
> - Mesmo que um invasor tente burlar as rotas de interface ou enviar requisições diretas via REST API / GraphQL, o kernel do PostgreSQL com Row Level Security (RLS) rejeitará qualquer operação que não pertença a este e-mail.

---

## 3. Aplicar Migrações Futuras

Se o banco já estiver em produção com a versão anterior do esquema, basta executar o arquivo de migração incremental `supabase/migrations/002_fix_admin_email_config.sql`:

```sql
CREATE OR REPLACE FUNCTION is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        current_setting('app.admin_email', true) = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Configurar Variáveis de Ambiente no Frontend

No arquivo `.env` local (arquivo que não é versionado pelo Git), defina:

```env
# URL e Chave Pública Anônima do Supabase (obtidas em Project Settings > API)
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-anon-key"

# E-mail do Administrador (utilizado pelos guards de rota client-side)
VITE_ADMIN_EMAIL="seu_email_real@exemplo.com"
```

> **Nota:** Certifique-se de que o valor de `VITE_ADMIN_EMAIL` no `.env` seja idêntico ao e-mail configurado no `ALTER DATABASE postgres SET app.admin_email = '...'`.
