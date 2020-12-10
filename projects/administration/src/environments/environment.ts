// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  baseUrl: {
    frontEnd: {
      // main: 'https://dashboard.raybold.co/'
      main: 'http://localhost:4200/'

    },
    backend: {
      // main: 'https://backend.raybold.co/public/'
      main: 'http://localhost:3000/'

    },
  }
};

export const PAGE_SIZE = 10;
export const LENGTH = 10;
export const PAGE_SIZE_OPTION = [5, 10, 25, 100];

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
