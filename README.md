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
- Authentication JWT

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


## Select

  - eq = comparar se dois valores são iguais.
  - ne = Not equal comparar se dois valores não são iguais.
  - gt = o valor do campo é maior que o valor especificado.
  - gte = o valor do campo é maior ou igual ao valor especificado.
  - lt = o valor do campo é menor que o valor especificado.
  - lte = o valor do campo é menor ou igual ao valor especificado.