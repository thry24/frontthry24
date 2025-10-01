import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private router: Router) {
    // this.setStartRoute();
  }

  private setStartRoute() {
    const isAndroid = Capacitor.getPlatform() === 'android';
    if (isAndroid) {
      this.router.navigateByUrl('/agente/dashboard', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }
}
