import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/twig/twig';
import 'codemirror/mode/css/css';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
