# PizzaShop-Api

### Ferramentas Utilizadas
- Bun
- ElysiaJs
- Docker
- Drizzle-ORM
- postgre
- cuid2
- zod
- chalk
- faker-js

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run
```

This project was created using `bun init` in bun v1.1.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Autenticação com magic link

- Rota (/login) => enviar o email com o link de login.

- Rota (/callback) => acessada quando o usuário clicar no link do email (
  - validar o token,
  - criar o JWT,
  - redirecionar o usuário para o front-end.
  ).
