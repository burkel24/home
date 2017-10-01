import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WindowManagerService, WindowState } from '../window-manager.service';

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  private stateSubscription: Subscription;
  private state: WindowState;
  @Input() title: string;

  constructor(
    private windowManager: WindowManagerService
  ) { }

  ngOnInit() {
    this.stateSubscription = this.windowManager.registerWindow(state => {
      if (this.state && state.isMinimized !== this.state.isMinimized) {
        if (state.isMinimized) {
          this.doMinimize();
        } else {
          this.doMaximize();
        }
      }

      this.state = state;
    });
  }

  requestMinimze() {

  }

  doMinimize() {

  }


  requestMaximize() {

  }

  doMaximize() {

  }
}
