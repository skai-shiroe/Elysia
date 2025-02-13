import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { JWT_NAME } from "./config/constant";
import { prisma } from "./lib/prisma";
import { User } from "@prisma/client";

const authPlugin = (app: Elysia) =>
  app
    .use(
      jwt({
        name: JWT_NAME,
        secret: Bun.env.JWT_SECRET!,
      })
    )
    .derive(async ({ jwt, cookie: { accessToken }, set }) => {
      if (!accessToken.value) {
        // handle error for access token is not available
        set.status = "Unauthorized";
        throw new Error("Access token is missing");
      }
      const jwtPayload = await jwt.verify(accessToken.value);
      if (!jwtPayload) {
        // handle error for access token is tempted or incorrect
        set.status = "Forbidden";
        throw new Error("Access token is invalid");
      }

      const userId = jwtPayload.sub;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        // handle error for user not found from the provided access token
        set.status = "Forbidden";
        throw new Error("Access token is invalid");
      }
        // all is good return user
      return {
        user,
      };
    });

export { authPlugin };

// Vérifie la présence du JWT dans les cookies.
// Décode et vérifie le JWT avec la clé secrète.
// Récupère l’ID de l’utilisateur à partir du token.
// Cherche l’utilisateur dans la base de données.
// Si tout est bon, il ajoute l’utilisateur au contexte de la requête.