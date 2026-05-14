import { IResponse } from "@/lib/typings/IResponse";
import axios from "axios";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
   getMessaging,
   getToken,
   Messaging,
   onMessage,
} from "firebase/messaging";
import { config } from "../config";

export class Firebase {
   public app: FirebaseApp;
   public message: Messaging;

   constructor() {
      this.app = initializeApp({
         apiKey: "AIzaSyBRHOeSMYIPn6y_LfGI70svuXVfQ3ee1Sc",
         authDomain: "studio-3090417298-d80f2.firebaseapp.com",
         projectId: "studio-3090417298-d80f2",
         storageBucket: "studio-3090417298-d80f2.firebasestorage.app",
         messagingSenderId: "639985115688",
         appId: "1:639985115688:web:0ab4fe07f65aa2a1da4b1d",
      });

      this.message = getMessaging(this.app);

      onMessage(this.message, (payload) => {
         console.log("NOTIFICATION RECEIVED", payload);
         new Notification(payload?.notification?.title || "Hello", {
            body: payload?.notification?.body || "Hello",
         });
      });
   }

   getApp(): FirebaseApp {
      return this.app;
   }

   async requestToken(): Promise<string> {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
         throw new Error("Notification denied");
      }

      const registration = await navigator.serviceWorker.register(
         "/firebase-messaging-sw.js",
      );

      const readyRegistration = await navigator.serviceWorker.ready;

      const token = await getToken(this.message, {
         vapidKey:
            "BJbtOwvcE41J8cRNDqCFi-ahe--HYlO2UHFwSFuqYyAU04aeTcMP5X52SfB3rce_BVtxHyJf8r1i_GajHtlCZWY",
         serviceWorkerRegistration: readyRegistration,
      });

      return token;
   }

   async registerDevice(
      deviceName: string,
      token: string,
      requestToken: string,
   ): Promise<IResponse<{ accessKey: string }>> {
      try {
         console.log(deviceName, token, requestToken);
         const response = await axios.post(
            config.baseEndpoint + "/pushNotification/register",
            {
               deviceName,
               secret: requestToken,
            },
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
}
