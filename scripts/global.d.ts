import { Env as DiscordEnv } from "../src";

declare module "bun" {
  interface Env extends Partial<Readonly<DiscordEnv>> {}
}
