import { IResponse } from "@/lib/typings/IResponse";
import axios from "axios";
import { config } from "../config";
import { IUserData } from "@/lib/typings/users/IUserData";

export class Authentication {
   constructor() {}

   async signIn(code: string): Promise<
      IResponse<{
         type: string;
         provider: string;
         userData: IUserData;
         grantToken: string;
      }>
   > {
      try {
         let response = await axios.get(
            config.baseEndpoint +
               "/authentication/oauth/discord/callback?code=" +
               code,
         );

         if (!response.data) {
            throw new Error();
         }

         let authenticationResult = response.data as
            | IResponse<{
                 type: string;
                 provider: string;
                 userData: IUserData;
                 grantToken: string;
              }>
            | undefined;

         if (!authenticationResult) {
            throw new Error();
         }

         return authenticationResult;
      } catch {
         return {
            errors: [
               {
                  message: "failed to sign in.",
               },
            ],
         };
      }
   }

   async getUserTokenData(token: string): Promise<IResponse<IUserData>> {
      try {
         let response = await axios.get(
            config.baseEndpoint + "/authentication/verification/detail",
            {
               headers: {
                  "x-starfield-session": token,
               },
            },
         );

         if (!response.data) {
            throw new Error();
         }

         let userData = response.data as IResponse<IUserData> | undefined;

         if (!userData) {
            throw new Error();
         }

         return userData;
      } catch {
         return {
            errors: [
               {
                  message: "failed to verify token.",
               },
            ],
         };
      }
   }

   async resendEmailVerificationCode(token: string): Promise<IResponse<any>> {
      try {
         let response = await axios.post(
            config.baseEndpoint +
               "/authentication/verification/requestNewAuthenticationCode",
            {},
            {
               headers: {
                  "x-starfield-session": token,
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
                  message: "Failed to send email.",
               },
            ],
         };
      }
   }

   async sumbitEmailVerificationCode(
      token: string,
      code: string,
   ): Promise<IResponse<any>> {
      try {
         let response = await axios.post(
            config.baseEndpoint + "/authentication/verification/submitCode",
            { code },
            {
               headers: {
                  "x-starfield-session": token,
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
                  message: "Failed to send email.",
               },
            ],
         };
      }
   }
}
