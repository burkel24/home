import { Component, ElementRef, OnInit, HostListener, Input, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WindowManagerService, WindowState } from '../window-manager.service';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  private stateSubscription: Subscription;
  private state: WindowState;
  private isDragging = false;
  private lastDragCoordinates;
  private window;
  @Input() title: string;

  constructor(
    private ElementRef: ElementRef,
    private windowManager: WindowManagerService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.stateSubscription = this.windowManager.registerWindow(state => {
      // if (this.state && state.isMinimized !== this.state.isMinimized) {
      //   if (state.isMinimized) {
      //     // this.doMinimize();
      //   } else {
      //     // this.doMaximize();
      //   }
      // }

      this.state = state;
    });
  }
}
