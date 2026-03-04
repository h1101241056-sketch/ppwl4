import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .onAfterHandle(({ response }) => {
        return {
            success: true,
            Message: "data tersedia",
            data: response
        }
    })

  .post("/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      })
    }
  )
  .listen(3000);

  app.get(
  "/products/:id",
  ({ params, query }) => {
    return {
      success: true,
      message: `Produk dengan id ${params.id}, sort: ${query.sort || "none"}`
    };
  },
  {
    params: t.Object({
      id: t.Numeric() 
    }),
    query: t.Object({
      sort: t.Optional(
        t.Union([
          t.Literal("asc"), 
          t.Literal("desc")
        ])
      )
    }),
    response: t.Object({
      success: t.Boolean(),
      message: t.String()
    })
  }
);

app.get(
  "/stats",
  () => {
    return {
      total: 100,
      active: 75
    };
  },
  {
    response: t.Object({
      total: t.Number(),
      active: t.Number()
    })
  }
)

app.get(
  "/admin",
  () => ({
    stats: 99
  }),
  {
    beforeHandle({ headers, set }) {
      if (headers.authorization !== "Bearer 123") {
        set.status = 401
        return {
          success: false,
          message: "Unauthorized"
        }
      }
    }
  }
)

.get("/product", () => {
      return { id: 1, name: "Laptop" }
    })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
