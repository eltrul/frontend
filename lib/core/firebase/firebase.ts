import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

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

      await navigator.serviceWorker.ready;

      const token = await getToken(this.message, {
         vapidKey:
            "BJbtOwvcE41J8cRNDqCFi-ahe--HYlO2UHFwSFuqYyAU04aeTcMP5X52SfB3rce_BVtxHyJf8r1i_GajHtlCZWY",

         serviceWorkerRegistration: registration,
      });

      return token;
   }
}
