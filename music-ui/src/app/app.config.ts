import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import localeDe from '@angular/common/locales/de-CH';
import localeDeExtra from '@angular/common/locales/extra/de-CH';

import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';

import { routes } from './routes/app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideDictionaries } from '@pluto-ngtools/i18n';
import { waveEditorReducer } from './reducer/wave-editor.reducer';
import { settingsReducer } from './reducer/settings.reducer';
import { mixReducer } from './reducer/mix.reducer';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { AudioService } from './service/audio.service';
import { provideMusicErrorHandler } from './service/error-handler';
import { errorReducer } from './reducer/error.reducer';
import { EffectsService } from './service/effects.service';
import { effectsReducer } from './reducer/effect.reducer';

registerLocaleData(localeDe, 'de-CH', localeDeExtra);
registerLocaleData(localeEn, 'en', localeEnExtra);

function init() {
  inject(AudioService).initDevices();
  inject(EffectsService).initEffects();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideDictionaries({
      'en': () => import('./i18n/en').then(i => i.EN),
      'de-CH': () => import('./i18n/de').then(i => i.DE),
    }),
    provideStore(),
    provideState('effects', effectsReducer),
    provideState('error', errorReducer),
    provideState('mix', mixReducer),
    provideState('settings', settingsReducer),
    provideState('waveEditor', waveEditorReducer),
    DecimalPipe,
    provideAppInitializer(() => init()),
    provideMusicErrorHandler(),
  ]
};
