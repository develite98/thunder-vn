import { Component } from '@angular/core';
import { injectAppConfig } from '@mixcore/app-config';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  public appSetting = injectAppConfig().appSetting;
}
