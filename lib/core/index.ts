import axios from "axios";
import { config } from "./config";

export async function isBackendAvailable() {
   try {
      await axios.get(config.baseEndpoint);
      return true;
   } catch {
      return false;
   }
}
