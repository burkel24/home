import { Component, ComponentFactoryResolver, HostListener, OnChanges, OnInit, Input, ViewChild  } from '@angular/core';
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
  private tempState: WindowState;
  private lastMouseCoords: { x: number, y: number };
  private componentRef;
  private lockX = false;
  private lockY = false;

  @Input() app: ApplicationBase;
  @ViewChild(WindowContentHostDirective) contentHost: WindowContentHostDirective;
  @ViewChild('appWindow') window;

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
      return setTimeout(() => this.trySetComponent(appType), RETRY_INTERVAL_MS);
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

  focusWindow() {
    this.windowManager.focusWindow(this.state.id);
  }

  get top() {
    if (!this.state) { return; }
    return `${this.tempState ? this.tempState.top : this.state.top }px`;
  }

  get bottom() {
    if (!this.state) { return; }
    return `${this.tempState ? this.tempState.bottom : this.state.bottom }px`;
  }

  get left() {
    if (!this.state) { return; }
    return `${this.tempState ? this.tempState.left : this.state.left }px`;
  }

  get right() {
    if (!this.state) { return; }
    return `${this.tempState ? this.tempState.right : this.state.right }px`;
  }

  maximize() {
    this.windowManager.maximize(this.state.id);
  }

  onResizeStart(evt, lockX= false, lockY= false) {
    this.tempState = Object.assign({}, this.state);
    this.lockX = lockX;
    this.lockY = lockY;

    this.lastMouseCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(evt) {
    if (!this.tempState || !this.lastMouseCoords) { return; }

    const mouseCoords = { x: evt.clientX, y: evt.clientY },
      dx = this.lockX ? 0 : mouseCoords.x - this.lastMouseCoords.x,
      dy = this.lockY ? 0 : mouseCoords.y - this.lastMouseCoords.y;

    if (!dx && !dy) { return; }

    const elm = this.window.nativeElement;
    this.tempState = Object.assign(
      {},
      this.tempState,
      this.windowManager.resize(this.state.id, elm, dx, dy)
    );

    this.lastMouseCoords = mouseCoords;
  }

  @HostListener('document:mouseup', [])
  onMouseUp() {
    if (!this.tempState) { return; }

    this.tempState = null;
    this.lastMouseCoords = null;
  }
}
