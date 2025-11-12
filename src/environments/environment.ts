// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// src/environments/firebase.config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyASMoY0vTrNgFjyGkmQfQw4-YrFPfHnN0w",
    authDomain: "clap-c767f.firebaseapp.com",
    projectId: "clap-c767f",
    storageBucket: "clap-c767f.firebasestorage.app",
    messagingSenderId: "836484119429",
    appId: "1:836484119429:web:58da07d914be3ecfe8e2ec"
  },
  
  // 👇 ADICIONE ESTA LINHA
  tmdbApiKey: '77c38bc86cd424db480ddbe638e4b466'
};

const app = initializeApp(environment.firebaseConfig); // Inicializa o Firebase
export const auth = getAuth(app); // Aquivai usar para login, cadastro, logout
export const db = getFirestore(app);// Aqui você salva ou busca dados do usuário


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
