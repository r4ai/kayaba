import {
  ApplicationCommandOptionType,
  type APIApplicationCommand,
} from "discord-api-types/v10";

export type Command = {
  name: string;
  description: string;
};

export type Commands = {
  [key: string]: Partial<APIApplicationCommand> & Command;
};

export const commands = {
  ai: {
    name: "ai",
    description: "Talk to the AI",
    options: [
      {
        name: "message",
        description: "The message to send to the AI",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
} as const satisfies Commands;
