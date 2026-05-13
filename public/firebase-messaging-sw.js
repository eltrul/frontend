importScripts(
   "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
   "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
   apiKey: "AIzaSyBRHOeSMYIPn6y_LfGI70svuXVfQ3ee1Sc",
   authDomain: "studio-3090417298-d80f2.firebaseapp.com",
   projectId: "studio-3090417298-d80f2",
   storageBucket: "studio-3090417298-d80f2.firebasestorage.app",
   messagingSenderId: "639985115688",
   appId: "1:639985115688:web:0ab4fe07f65aa2a1da4b1d",
});

firebase.messaging();
