import axios from "axios";
import { config } from "./config";
import { onMessage } from "firebase/messaging";

console.log(
   "✨ Hey there! Thanks for checking out this project — built with Next.js & Bun/Elysia. " +
      "If it made your day a little better, a ⭐ on GitHub would mean the world to us!",
);

export async function isBackendAvailable() {
   try {
      await axios.get(config.baseEndpoint);
      return true;
   } catch {
      return false;
   }
}
