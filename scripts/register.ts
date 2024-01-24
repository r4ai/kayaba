import { commands } from "../src/command";

const TOKEN = process.env.DISCORD_TOKEN;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;

if (!TOKEN) {
  throw new Error("DISCORD_TOKEN env variable is required");
}
if (!APPLICATION_ID) {
  throw new Error("DISCORD_APPLICATION_ID env variable is required");
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
const registerGlobalCommands = async () => {
  const url = `https://discord.com/api/v10/applications/${APPLICATION_ID}/commands`;
  await registerCommands(url);
};

const registerCommands = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${TOKEN}`,
    },
    method: "PUT",
    body: JSON.stringify(Array.from(Object.values(commands))),
  });
  if (response.ok) {
    console.log("Successfully registered commands");
  } else {
    console.error("Error registering commands");
    const text = await response.text();
    console.error(text);
  }
};

await registerGlobalCommands();
