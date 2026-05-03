<div align="center">
<div align="center" style="font-family: Inter, Arial, sans-serif;">
<h1>Moeda Estudantil</h1>
</div>

<br/>

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
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

## ⚙️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + Vite |
| Backend | Java + Spring Boot |
| Banco de Dados | PostgreSQL |
| ORM | Spring Data JPA |
| Segurança | Spring Security + JWT |
| Build Tool | Maven |
| Containerização | Docker + Docker Compose |

---

## 🔐 Variáveis de Ambiente

O projeto utiliza um arquivo `.env` para armazenar informações sensíveis como credenciais do banco de dados e a chave secreta do JWT. Nenhum dado sensível está hardcoded no código ou exposto no repositório.

### Por que o Docker é obrigatório para rodar o projeto?

O Spring Boot **não lê o arquivo `.env` diretamente**. Quem faz essa ponte é o **Docker Compose** — ele lê o `.env`, injeta as variáveis no ambiente do container e só então o Spring consegue acessá-las via `application.properties`.

```
.env
 └── Docker Compose lê e injeta no container
        ↓
 Variáveis de ambiente do sistema operacional
        ↓
 application.properties lê com ${VARIAVEL}
        ↓
 Spring Boot utiliza os valores em tempo de execução
```

> ⚠️ Se você tentar rodar o backend com `./mvnw spring-boot:run` fora do Docker, o Spring não encontrará as variáveis e a aplicação não iniciará corretamente.

### Configuração do `.env`

Na raiz do projeto, crie um arquivo `.env` baseado no modelo abaixo:

```bash
cp .env.example .env
```

Depois preencha com seus valores:

```env
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRATION=3600000

DB_URL=jdbc:postgresql://db:5432/moeda_estudantil
DB_USERNAME=seu-usuario
DB_PASSWORD=sua-senha
```

> ⚠️ O arquivo `.env` está no `.gitignore` e **nunca deve ser commitado** no repositório.

---

## 🐳 Como Executar com Docker (obrigatório)

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Arquivo `.env` criado e preenchido conforme a seção acima

### Subindo tudo com um comando

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Isso vai subir automaticamente:

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |

### Outros comandos úteis

```bash
# Rodar em segundo plano
docker compose up --build -d

# Parar os containers
docker compose down

# Parar e remover os volumes (apaga o banco)
docker compose down -v

# Ver logs em tempo real
docker compose logs -f

# Ver logs só do backend
docker compose logs -f backend
```

---

## 📁 Estrutura do Projeto

```
moeda-estudantil/
├── backend/            # API Spring Boot
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/           # Aplicação React + Vite
│   ├── src/
│   └── Dockerfile
├── .env                # Variáveis de ambiente (não vai pro GitHub)
├── .env.example        # Modelo do .env (vai pro GitHub)
├── docker-compose.yml
└── README.md
```

---

## 👥 Colaboradores

| Nome | GitHub |
|------|--------|
| Luiz Gustavo| [@luiz](https://github.com/luizFagundesT) |
| Erick Guedes| [@Erick](https://github.com/) |
| Ian | [@Ian](https://github.com/) |
| Caio Lima | [@Caio](https://github.com/) |