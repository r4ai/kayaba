import type { MiddlewareHandler } from "hono";
import type { Bindings, Env } from "./index";
import { InteractionResponseType, verifyKey } from "discord-interactions";

export const vertifyKeyMiddleware =
  (): MiddlewareHandler<{ Bindings: Bindings & Env }> => async (c, next) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");
    const body = await c.req.raw.clone().text();
    const isValidRequest =
      signature &&
      timestamp &&
      verifyKey(body, signature, timestamp, c.env.DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
      return c.json(
        {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { message: "Invalid request" },
        },
        401
      );
    }
    return next();
  };
