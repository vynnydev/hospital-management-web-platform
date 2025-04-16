# Docker com Next.js - Hospital Management Web Platform

Este documento fornece instruções detalhadas para executar a aplicação em ambiente Docker.

## Pré-requisitos

- Docker instalado e configurado
- Docker Compose instalado
- Arquivo `.env.local` configurado com as variáveis de ambiente necessárias

## Arquivos Docker

Este projeto contém os seguintes arquivos relacionados ao Docker:

- `Dockerfile`: Configuração multi-estágio para build e execução da aplicação
- `docker-compose.yml`: Orquestração de serviços
- `.dockerignore`: Lista de arquivos que devem ser ignorados no build

## Construir e Executar com Docker Compose

O método mais simples para iniciar a aplicação é utilizando o Docker Compose:

```bash
# Construir e iniciar os serviços em segundo plano
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar os serviços
docker-compose down
```

## Construir Manualmente com Docker

Se preferir usar Docker diretamente:

```bash
# Construir a imagem
docker build -t hospital-management-web \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<seu-valor> \
  --build-arg NEXT_PUBLIC_GEMINI_API_KEY=<seu-valor> \
  --build-arg NEXT_PUBLIC_HUGGING_FACE_API_KEY=<seu-valor> \
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN=<seu-valor> \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<seu-valor> \
  --build-arg REPLICATE_API_TOKEN=<seu-valor> \
  .

# Executar o container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<seu-valor> \
  -e CLERK_SECRET_KEY=<seu-valor> \
  -e NEXT_PUBLIC_GEMINI_API_KEY=<seu-valor> \
  -e NEXT_PUBLIC_HUGGING_FACE_API_KEY=<seu-valor> \
  -e NEXT_PUBLIC_MAPBOX_TOKEN=<seu-valor> \
  -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<seu-valor> \
  -e REPLICATE_API_TOKEN=<seu-valor> \
  hospital-management-web
```

## Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias para o funcionamento correto da aplicação:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Chave pública do Clerk
- `CLERK_SECRET_KEY`: Chave secreta do Clerk
- `NEXT_PUBLIC_GEMINI_API_KEY`: Chave da API do Gemini
- `NEXT_PUBLIC_HUGGING_FACE_API_KEY`: Chave da API do Hugging Face
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Token de acesso do Mapbox
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe
- `REPLICATE_API_TOKEN`: Token da API do Replicate

## Estrutura Multi-Estágio do Dockerfile

O Dockerfile desta aplicação utiliza uma abordagem multi-estágio para otimizar o processo de build:

1. **Base**: Imagem base com Node.js e dependências essenciais
2. **Deps**: Instalação de dependências do projeto
3. **Builder**: Compilação do projeto Next.js
4. **Runner**: Execução da aplicação em ambiente de produção

Esta abordagem resulta em uma imagem final menor e mais segura.

## Health Check

A aplicação inclui um endpoint de health check em `/api/health` que retorna o status e uptime da aplicação.

## Resolução de Problemas

Se encontrar problemas ao executar a aplicação:

1. Verifique se todas as variáveis de ambiente estão configuradas corretamente
2. Certifique-se de que as portas não estão sendo usadas por outros serviços
3. Confira os logs com `docker-compose logs -f` ou `docker logs <container-id>`
4. Verifique se o Docker tem acesso suficiente a CPU e memória 