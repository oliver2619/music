import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from "@angular/router";

@Component({
  selector: 'm-main-navbar',
  imports: [RouterLinkActive, RouterModule],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent {

}
