import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'tracks'
}, {
    path: 'effects',
    loadComponent: () => import('../page/effects/effects.component').then(c => c.EffectsComponent),
}, {
    path: 'midi',
    loadComponent: () => import('../page/midi-editor/midi-editor.component').then(c => c.MidiEditorComponent),
}, {
    path: 'mixer',
    loadComponent: () => import('../page/mixer/mixer.component').then(c => c.MixerComponent),
}, {
    path: 'settings',
    loadChildren: () => import('./settings.routes').then(r => r.routes),
}, {
    path: 'synthesizer',
    loadComponent: () => import('../page/synthesizer/synthesizer.component').then(c => c.SynthesizerComponent),
}, {
    path: 'tracks',
    loadComponent: () => import('../page/tracks/tracks.component').then(c => c.TracksComponent),
}, {
    path: 'wave',
    loadComponent: () => import('../page/wave-editor/wave-editor.component').then(c => c.WaveEditorComponent),
}, {
    path: '**',
    redirectTo: 'tracks',
}];
