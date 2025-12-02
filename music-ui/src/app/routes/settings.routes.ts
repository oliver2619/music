import { Routes } from "@angular/router";
import { SettingsComponent } from "../page/settings/settings.component";
import { SettingsPlayerComponent } from "../page/settings/settings-player/settings-player.component";
import { SettingsRecorderComponent } from "../page/settings/settings-recorder/settings-recorder.component";
import { SettingsCameraComponent } from "../page/settings/settings-camera/settings-camera.component";
import { SettingsMidiComponent } from "../page/settings/settings-midi/settings-midi.component";
import { SettingsUiComponent } from "../page/settings/settings-ui/settings-ui.component";

export const routes: Routes = [{
    path: '',
    component: SettingsComponent,
    children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: 'ui',
    }, {
        path: 'camera',
        component: SettingsCameraComponent,
    }, {
        path: 'midi',
        component: SettingsMidiComponent,
    }, {
        path: 'player',
        component: SettingsPlayerComponent,
    }, {
        path: 'recorder',
        component: SettingsRecorderComponent,
    }, {
        path: 'ui',
        component: SettingsUiComponent,
    }, {
        path: '**',
        redirectTo: 'ui',
    }]
}];