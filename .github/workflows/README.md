# GitHub Actions Workflows

Workflows automatizados para build e deploy do frontend UsinCheck.

## Workflows

**build.yml** - Valida PRs para `develop` (linter + build)

**deploy.yml** - Deploy automático em push para `develop` (QAS) ou `main` (Produção)

## Ambientes

| Ambiente | Branch | Build Command | Deploy Path |
|----------|--------|---------------|-------------|
| QAS | `develop` | `yarn build:dev` | `/var/www/jometto.com.br/qas-usincheck/html` |
| Produção | `main` | `yarn build:production` | `/var/www/jometto.com.br/usincheck/html` |

## Configuração dos Secrets

Configure em **Settings → Secrets and variables → Actions**:

| Secret | Descrição |
|--------|-----------|
| `SSH_PRIVATE_KEY` | Chave SSH privada para deploy |
| `SERVER_IP` | IP ou hostname do servidor |
| `SERVER_USER` | Usuário SSH (ex: `development`) |

### Gerar chave SSH (se necessário)

```bash
# No servidor
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys

# Copiar chave privada para adicionar no GitHub
cat ~/.ssh/github_deploy
```

## Backup

Antes de cada deploy, um backup automático é criado:

`[deploy_path].backup.YYYYMMDD_HHMMSS`
