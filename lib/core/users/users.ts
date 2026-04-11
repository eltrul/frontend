import { IResponse } from "@/lib/typings/IResponse";
import axios from "axios";
import { config } from "../config";
import { Configuration } from "../configuration/configuration";

export class Users {
   constructor() {}

   async getUserConfigurationKey(
      token: string,
   ): Promise<IResponse<{ accessKey: string }>> {
      try {
         let response = await axios.get(
            config.baseEndpoint + "/users/baseUserAccountConfigurationKey",
            {
               headers: {
                  "x-starfield-session": token,
               },
            },
         );

         if (!response.data) {
            throw new Error();
         }

         let data = response.data as
            | IResponse<{ accessKey: string }>
            | undefined;

         if (!data) {
            throw new Error();
         }

         return data;
      } catch {
         return {
            errors: [
               {
                  message: "failed to send request.",
               },
            ],
         };
      }
   }

   async getUserSettings() {
      const configuration = new Configuration();

      let userConfigurationKey = await this.getUserConfigurationKey(
         localStorage.getItem("token") || "n/a",
      );

      let userSettingsObjectId = localStorage.getItem("settingsObjectId");

      if (userConfigurationKey.errors || !userConfigurationKey.data) {
         return false;
      }

      let userSettings = await configuration.getConfiguration(
         "userSettings",
         userSettingsObjectId || "",
         userConfigurationKey.data[0].data?.accessKey || "",
      );

      if (userSettings.errors || !userSettings?.data) {
         return false;
      }

      return userSettings.data;
   }

   async setUserSettings(data: Record<string, any>) {
      const configuration = new Configuration();

      let userConfigurationKey = await this.getUserConfigurationKey(
         localStorage.getItem("token") || "n/a",
      );

      let userSettingsObjectId = localStorage.getItem("settingsObjectId");

      if (userConfigurationKey.errors || !userConfigurationKey.data) {
         return false;
      }

      let userSettings = await configuration.setConfigurationCombo(
         "userSettings",
         userSettingsObjectId || "",
         userConfigurationKey.data[0].data?.accessKey || "",
         data,
      );

      if (userSettings.errors) {
         return false;
      }

      return userSettings.data;
   }
}
