import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WindowContentHostDirective } from './windowContentHost.directive';
import { ApplicationBase } from '../applicationBase';
import { TaskManagerService } from '../task-manager.service';
import { WindowManagerService, WindowState } from '../window-manager.service';


const RETRY_INTERVAL_MS = 200;
const MINIMIZE_ANIMATION_TIME_MS = 400;

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnChanges, OnDestroy {
  public isAnimating = false;
  private stateSubscription: Subscription;
  private state: WindowState;
  private tempState: WindowState;
  private lastMouseCoords: { x: number, y: number };
  private componentRef;
  private lockX = false;
  private lockY = false;

  @Input() app: ApplicationBase;
  @Output() onClose = new EventEmitter<boolean>();
  @ViewChild(WindowContentHostDirective) contentHost: WindowContentHostDirective;
  @ViewChild('appWindow') window;

  constructor(
    private resolver: ComponentFactoryResolver,
    private taskManager: TaskManagerService,
    private windowManager: WindowManagerService
  ) { }

  ngOnChanges(changes) {
    if (!changes.app) { return; }

    this.trySetComponent(changes.app.currentValue);
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }

    this.windowManager.removeWindow(this.state.id);
  }

  trySetComponent(appType) {
    if (!this.contentHost) {
      return setTimeout(() => this.trySetComponent(appType), RETRY_INTERVAL_MS);
    }

    const factory = this.resolver.resolveComponentFactory(appType),
      hostViewRef = this.contentHost.viewContainerRef;

    hostViewRef.clear();
    this.componentRef = hostViewRef.createComponent(factory);

    this.stateSubscription = this.windowManager.registerWindow(
      appType.appName,
      appType.iconClass,
      (state: WindowState) => this.updateState(state)
    );
  }

  private updateState(state: WindowState) {
    if (this.state && state.isMinimized != this.state.isMinimized) {
        this.isAnimating = true;
        setTimeout(() => this.isAnimating = false, MINIMIZE_ANIMATION_TIME_MS);
      }

    this.state = state;
  }

  focusWindow() {
    this.windowManager.focusWindow(this.state.id);
  }

  get isMinimized() {
    if (!this.state) { return; }
    return this.state.isMinimized;
  }

  get id() {
    if (!this.state) { return; }
    return this.state.id;
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

  get zIndex() {
    if (!this.state) { return; }
    return this.state.isMinimized ? -1 : this.state.zIndex;
  }

  maximize() {
    this.windowManager.maximize(this.state.id);
  }

  minimize() {
    this.windowManager.minimize(this.state.id);
  }

  close() {
    this.onClose.emit(true);
  }

  onResizeStart(evt, lockX= false, lockY= false) {
    this.tempState = Object.assign({}, this.state);
    this.lockX = lockX;
    this.lockY = lockY;

    if (evt instanceof TouchEvent) {
      const touch = evt.touches[0];
      this.lastMouseCoords = { x: touch.clientX, y: touch.clientY };
    } else {
      this.lastMouseCoords = { x: evt.clientX, y: evt.clientY };
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(evt) {
    if (!this.tempState || !this.lastMouseCoords) { return; }
    this.resize(evt.clientX, evt.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(evt) {
    if (!this.tempState || !this.lastMouseCoords) { return; }
    this.resize(evt.touches[0].clientX, evt.touches[0].clientY);
  }

  private resize(clientX, clientY) {
    const mouseCoords = { x: clientX, y: clientY },
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

  @HostListener('document:touchend', [])
  onTouchStop() {
    if (!this.tempState) { return; }
    this.tempState = null;
    this.lastMouseCoords = null;
  }
}
