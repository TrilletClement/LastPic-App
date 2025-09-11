import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import type { CapacitorConfig } from '@capacitor/cli';

export const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http, '.assets/i18n/', '.json');

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'myApp',
  webDir: 'www'
};

export default config;
