// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'tanosudokugame',
    appId: '1:746896043068:web:f084b53a0743e168d62739',
    databaseURL: 'https://tanosudokugame-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'tanosudokugame.appspot.com',
    apiKey: 'AIzaSyDdYiR9UhxKLe0ct0R_GsvRa2Lv_GtIiMY',
    authDomain: 'tanosudokugame.firebaseapp.com',
    messagingSenderId: '746896043068',
    measurementId: 'G-77TNQCQQ2T',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
