import { Component, ComponentFactoryResolver, OnChanges, OnInit, Input, ViewChild  } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ApplicationBase } from '../applicationBase';
import { WindowContentHostDirective } from '../window/windowContentHost.directive';
import { WindowManagerService, WindowState } from '../window-manager.service';

const RETRY_INTERVAL_MS = 200;

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnChanges, OnInit {
  private stateSubscription: Subscription;
  private state: WindowState;
  private componentRef;
  private window;
  public title: string;
  @Input() app: ApplicationBase;
  @ViewChild(WindowContentHostDirective) contentHost: WindowContentHostDirective;

  constructor(
    private resolver: ComponentFactoryResolver,
    private windowManager: WindowManagerService
  ) { }

  ngOnChanges(changes) {
    if (!changes.app) { return; }

    this.trySetComponent(changes.app.currentValue);
  }

  trySetComponent(appType) {
    if (!this.contentHost) {
      return setTimeout(() => this.trySetComponent(appType), RETRY_INTERVAL_MS)
    }

    const factory = this.resolver.resolveComponentFactory(appType),
      hostViewRef = this.contentHost.viewContainerRef;

    hostViewRef.clear();
    this.componentRef = hostViewRef.createComponent(factory);
  }

  ngOnInit() {
    this.stateSubscription = this.windowManager.registerWindow(state => {
      this.state = state;
    });
  }
}
