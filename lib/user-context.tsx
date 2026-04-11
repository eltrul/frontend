import { createContext, ReactNode, useContext, useState } from "react";
import { IUserSettings } from "./typings/users/IUserSettings";
import { Users } from "./core/users/users";
import { Configuration } from "./core/configuration/configuration";
import { se } from "date-fns/locale";

interface UserContextType {
   userSettings: IUserSettings;
   getUserSettings: () => Promise<any>;
}

const userContext = createContext<UserContextType | undefined>(undefined);

export function userProvider({ children }: { children: ReactNode }) {
   const [userSettings, setUserSettings] = useState<IUserSettings>({
      theme: "dark",
   });

   const getUserSettings = async () => {
      const users = new Users();
      const configuration = new Configuration();

      let userConfigurationKey = await users.getUserConfigurationKey(
         localStorage.getItem("token") || "n/a",
      );

      let userSettingsObjectId = localStorage.getItem("settingsObjectId");

      if (userConfigurationKey.errors || !userConfigurationKey.data) {
         return false;
      }

      let userSettings = await configuration.getConfiguration(
         "userSettings",
         userConfigurationKey.data[0].data?.accessKey || "",
         userSettingsObjectId || "",
      );

      if (userSettings.errors || !userSettings?.data) {
         return false;
      }

      setUserSettings(userSettings?.data[0].data as IUserSettings);
      return userSettings.data;
   };

   return (
      <userContext.Provider
         value={{
            userSettings,
            getUserSettings,
         }}
      >
         {children}
      </userContext.Provider>
   );
}

export function useUser() {
   const context = useContext(userContext);
   if (context === undefined) {
      throw new Error("useUser must be used within an userProvider");
   }
   return context;
}
