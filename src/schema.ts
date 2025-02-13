import { t } from "elysia";

// Définition du schéma de validation pour l'inscription
const signupBodySchema = t.Object({
  name: t.String({ maxLength: 60, minLength: 1 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  location: t.Optional(t.Tuple([t.Number(), t.Number()])),
  isAdult: t.Boolean(),
});
// Définition du schéma de validation pour la connexion
const loginBodySchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export { loginBodySchema, signupBodySchema };
