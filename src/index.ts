import { Hono } from "hono";
import { Ai } from "@cloudflare/ai";
import {
  InteractionResponseType,
  InteractionType,
} from "discord-api-types/v10";
import type { commands } from "./command";
import type { APIInteraction } from "discord-api-types/v10";
import { vertifyKeyMiddleware } from "./middleware";
import dedent from "dedent";

export type Env = {
  DISCORD_TOKEN: string;
  DISCORD_APPLICATION_ID: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_GUILD_ID: string;
};

export type Bindings = {
  AI: any;
};

type Answer = {
  response: string;
};

const prompt = (message: string) =>
  dedent`
    ${message.replaceAll("?", ".")}

    You must respond in less than 100 words in English or you will get confused.
  `;

const app = new Hono<{ Bindings: Bindings & Env }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hi", async (c) => {
  const ai = new Ai(c.env.AI);
  const answer: Answer = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
    messages: [
      {
        role: "user",
        content: "Hello, how are you?",
      },
    ],
  });
  return c.text(answer.response);
});

app.use("/", vertifyKeyMiddleware());

app.post("/", async (c) => {
  const message: APIInteraction = await c.req.json();

  if (message.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    console.log("Handling Ping request");
    return c.json({
      type: InteractionResponseType.Pong,
    });
  }

  if (message.type === InteractionType.ApplicationCommand) {
    type Names = (typeof commands)[keyof typeof commands]["name"] & string;
    switch (message.data.name.toLocaleLowerCase() as Names) {
      case "ai": {
        if (
          !(
            "options" in message.data &&
            message.data.options?.length === 1 &&
            "value" in message.data.options[0] &&
            typeof message.data.options[0].value === "string"
          )
        ) {
          return c.text("Invalid command", 400);
        }

        const ai = new Ai(c.env.AI);
        const answer: Answer = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
          messages: [
            {
              role: "user",
              content: prompt(message.data.options[0].value),
            },
          ],
        });

        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: dedent`
              Q. ${message.data.options[0].value}
              A. ${answer.response}
            `,
          },
        });
      }
      default: {
        return c.text("Unknown command", 400);
      }
    }
  }

  console.error("Unknown message type");
  return c.text("Unknown message type", 400);
});

export default app;
