<div align="center">
<div align="center" style="font-family: Inter, Arial, sans-serif;">
<h1>Moeda Estudantil</h1>
</div>

<br/>

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Spring Security](https://img.shields.io/badge/SpringSecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

# 🎓 Moeda Estudantil

> **Nome do Projeto:** Moeda Estudantil  
> **Disciplina:** Laboratório de Desenvolvimento de Software  
> **Curso:** Engenharia de Software  
> **Instituição:** PUC Minas  
> **Professor:** João Paulo Aramuni  

---

## 🧾 Sobre o Projeto

O **Moeda Estudantil** é uma plataforma web criada para incentivar o desempenho acadêmico e a participação universitária.

Alunos recebem **moedas virtuais** ao realizarem atividades relevantes, como:

- Excelente desempenho em disciplinas
- Participação em eventos acadêmicos
- Projetos de extensão
- Monitorias
- Iniciação científica
- Ações sociais e institucionais

Essas moedas poderão ser trocadas por **benefícios em empresas parceiras**, como descontos, brindes, serviços ou experiências.

---

## 🎯 Objetivo

Criar um ecossistema que valorize o esforço estudantil, promova engajamento acadêmico e fortaleça a relação entre universidade, alunos e mercado.

---

# 🚀 Funcionalidades

- ✅ Cadastro e autenticação de usuários
- ✅ Segurança com JWT
- ✅ API REST com Spring Boot
- ✅ Persistência de dados com PostgreSQL
- ✅ Containerização completa com Docker
- ✅ Integração assíncrona com RabbitMQ
- ✅ Envio de notificações por e-mail
- ✅ Swagger para documentação da API

---

## ⚙️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + Vite |
| Backend | Java + Spring Boot |
| Banco de Dados | PostgreSQL |
| ORM | Spring Data JPA |
| Segurança | Spring Security + JWT |
| Mensageria | RabbitMQ |
| E-mail | Spring Mail |
| Build Tool | Maven |
| Containerização | Docker + Docker Compose |

---

# 📨 RabbitMQ e Comunicação Assíncrona

O projeto utiliza o **RabbitMQ** como broker de mensageria para permitir comunicação assíncrona entre serviços da aplicação.

Isso torna o sistema mais:

- Escalável
- Desacoplado
- Performático
- Resiliente

## 📌 O que está sendo utilizado no projeto?

Atualmente o RabbitMQ é utilizado para:

- Processamento assíncrono de eventos
- Envio de notificações
- Disparo de e-mails
- Comunicação entre módulos do backend

---

## 🔄 Fluxo da Mensageria

```text
Usuário realiza ação
        ↓
Backend publica mensagem no RabbitMQ
        ↓
Fila recebe a mensagem
        ↓
Consumer processa a mensagem
        ↓
Sistema executa tarefa assíncrona
(ex: envio de e-mail)
```

---

## 🐰 Serviços RabbitMQ

Quando o Docker Compose é iniciado, o container do RabbitMQ também é criado automaticamente.

| Serviço | Porta |
|---------|--------|
| RabbitMQ AMQP | 5672 |
| RabbitMQ Management UI | 15672 |

### Acesso ao painel administrativo

```txt
http://localhost:15672
```

### Credenciais padrão

```txt
Usuário: guest
Senha: guest
```

---

## 🔐 Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para armazenar informações sensíveis como:

- Credenciais do banco
- Chave JWT
- Configurações do RabbitMQ
- Credenciais de e-mail

Nenhum dado sensível está hardcoded no código ou exposto no repositório.

---

## ⚠️ Por que o Docker é obrigatório para rodar o projeto?

O Spring Boot **não lê o arquivo `.env` diretamente**.

Quem faz essa ponte é o **Docker Compose** — ele lê o `.env`, injeta as variáveis no ambiente do container e só então o Spring consegue acessá-las via `application.properties`.

```text
.env
 └── Docker Compose lê e injeta no container
        ↓
 Variáveis de ambiente do sistema operacional
        ↓
 application.properties lê com ${VARIAVEL}
        ↓
 Spring Boot utiliza os valores em tempo de execução
```

> ⚠️ Se você tentar rodar o backend com `./mvnw spring-boot:run` fora do Docker, o Spring não encontrará as variáveis corretamente.

---

# 📄 Configuração do `.env`

Na raiz do projeto:

```bash
cp .env.example .env
```

Depois configure:

```env
# JWT
JWT_SECRET=MinhaChaveSuperSecretaMinhaChaveSuperSecreta123
JWT_EXPIRATION=3600000

# PostgreSQL
DB_URL=jdbc:postgresql://db:5432/moeda_estudantil
DB_USERNAME=postgres
DB_PASSWORD=1234

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# E-mail (Gmail)
MAIL_USERNAME=seuemail@gmail.com
MAIL_PASSWORD=sua-senha-de-app-gmail
```

> ⚠️ O arquivo `.env` está no `.gitignore` e nunca deve ser commitado.

---

# 🐳 Como Executar com Docker

## Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Arquivo `.env` criado

---

## ▶️ Subindo o projeto

Na raiz do projeto:

```bash
docker compose up --build
```

---

## 🌐 Serviços disponíveis

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| PostgreSQL | localhost:5432 |
| RabbitMQ UI | http://localhost:15672 |

---

## 🛠️ Comandos úteis

```bash
# Rodar em segundo plano
docker compose up --build -d

# Parar containers
docker compose down

# Parar e remover volumes
docker compose down -v

# Ver logs em tempo real
docker compose logs -f

# Logs apenas do backend
docker compose logs -f backend

# Logs do RabbitMQ
docker compose logs -f rabbitmq
```

---

# 📁 Estrutura do Projeto

```text
moeda-estudantil/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   └── Dockerfile
│
├── .env
├── .env.example
├── docker-compose.yml
└── README.md
```

---

# 🔒 Segurança

O sistema utiliza:

- Spring Security
- JWT Authentication
- Variáveis de ambiente
- Containers isolados com Docker

---

# 📚 Documentação da API

A documentação da API pode ser acessada via Swagger:

```txt
http://localhost:8080/swagger-ui/index.html
```

---

# 👥 Colaboradores

| Nome | GitHub |
|------|--------|
| Luiz Gustavo | [@luizFagundesT](https://github.com/luizFagundesT) |
| Erick Guedes | [@Erick](https://github.com/) |
| Ian | [@Ian](https://github.com/) |
| Caio Lima | [@Caio](https://github.com/) |

---

# 📌 Observações

- O projeto foi desenvolvido com foco acadêmico.
- Toda a infraestrutura roda via Docker.
- O RabbitMQ foi implementado para estudar arquitetura orientada a eventos e comunicação assíncrona.
- O envio de e-mails utiliza senha de aplicativo do Gmail.
