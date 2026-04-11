import axios from "axios";
import { config } from "../config";
import { IDeviceConstructor } from "@/lib/typings/devices/IDeviceConstructor";
import { type IResponse } from "@/lib/typings/IResponse";

export class Devices {
   constructor() {}

   async getDevices(secretKey: string): Promise<IResponse<any>> {
      try {
         let response = await axios.get(config.baseEndpoint + "/devices/list", {
            headers: {
               "x-starfield-session": secretKey,
            },
         });

         if (!response.data) {
            throw new Error();
         }

         let data = response.data as IResponse<any> | undefined;

         if (!data) {
            throw new Error();
         }

         return data;
      } catch (err) {
         console.error(err);
         return {
            errors: [
               {
                  message: "failed to request.",
               },
            ],
         };
      }
   }

   async getDeviceMetadata(
      deviceId: string,
      secretKey: string,
   ): Promise<IResponse<IDeviceConstructor>> {
      try {
         let response = await axios.get(
            config.baseEndpoint + "/devices/" + deviceId + "/metadata",
            {
               headers: {
                  "x-starfield-session": secretKey,
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
      } catch (err) {
         console.error(err);
         return {
            errors: [
               {
                  message: "failed to request.",
               },
            ],
         };
      }
   }

   async getDeviceSettingsKey(
      deviceId: string,
      secretKey: string,
   ): Promise<IResponse<{ accessKey: string }>> {
      try {
         let response = await axios.get(
            config.baseEndpoint +
               "/devices/" +
               deviceId +
               "/getConfigurationSecretKey",
            {
               headers: {
                  "x-starfield-session": secretKey,
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
      } catch (err) {
         console.error(err);
         return {
            errors: [
               {
                  message: "failed to request.",
               },
            ],
         };
      }
   }

   async createDevice(
      deviceName: string,
      secretKey: string,
   ): Promise<IDeviceConstructor> {
      try {
         let response = await axios.post(
            config.baseEndpoint + "/devices/new",
            {
               deviceName,
            },
            {
               headers: {
                  "x-starfield-session": secretKey,
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
      } catch (err) {
         console.error(err);
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
