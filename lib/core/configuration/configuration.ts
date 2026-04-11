import { IObjectType } from "@/lib/typings/configuration/IObjectTypes";
import { IResponse } from "@/lib/typings/IResponse";
import axios from "axios";
import { config } from "../config";

export class Configuration {
   async getConfiguration(
      type: IObjectType,
      objectId: string,
      secretKey: string,
   ): Promise<IResponse<any>> {
      try {
         let response = await axios.get(
            config.baseEndpoint +
               "/configuration/" +
               type +
               "/" +
               objectId +
               "/read",
            {
               headers: {
                  "x-starfield-access-key": secretKey,
               },
            },
         );

         if (!response.data) {
            throw new Error();
         }

         let data = response.data as IResponse<any> | undefined;

         if (!data) {
            throw new Error();
         }

         return data;
      } catch {
         return {
            errors: [
               {
                  message: "failed to request.",
               },
            ],
         };
      }
   }

   async setConfigurationCombo(
      type: IObjectType,
      objectId: string,
      secretKey: string,
      editData: Record<string, any>,
   ): Promise<IResponse<any>> {
      try {
         let response = await axios.post(
            config.baseEndpoint +
               "/configuration/" +
               type +
               "/" +
               objectId +
               "/edit",
            editData,
            {
               headers: {
                  "x-starfield-access-key": secretKey,
               },
            },
         );

         if (!response.data) {
            throw new Error();
         }

         let data = response.data as IResponse<any> | undefined;

         if (!data) {
            throw new Error();
         }

         return data;
      } catch {
         return {
            errors: [
               {
                  message: "failed to request.",
               },
            ],
         };
      }
   }
}
