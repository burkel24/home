import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

const BATTERY_DECAY_INTERVAL_MS = 2500;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar-component.component.html',
  styleUrls: ['./navbar-component.component.scss']
})
export class NavbarComponentComponent implements OnInit {
  public title = '';
  public batteryPercent = 100;

  private urlMap = {
    '/': 'Terminal'
  };

  constructor(
    private Router: Router
  ) { }

  ngOnInit() {
    this.Router.events
      .filter(evt => evt instanceof NavigationEnd)
      .subscribe(() => this.title = this.urlMap[this.Router.url]);

    const intervalId = setInterval(() => {
      if (this.batteryPercent <= 1) {
        clearInterval(intervalId);
        return;
      }

      this.batteryPercent--;
    }, BATTERY_DECAY_INTERVAL_MS);
  }

  get batteryIconClass() {
    if (this.batteryPercent < 10) {
      return 'fa-battery-0';
    } else if (this.batteryPercent < 35) {
      return 'fa-battery-1';
    } else if (this.batteryPercent < 55) {
      return 'fa-battery-2';
    } else if (this.batteryPercent < 85) {
      return 'fa-battery-3';
    }

    return 'fa-battery';
  }
}
