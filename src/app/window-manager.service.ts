import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class WindowManagerService {
  private stateSubject = new BehaviorSubject<{ [key: number]: WindowState }>({});
  private container;

  constructor() { }

  static boundsCheck(window, containerWidth, containerHeight) {
    if (window.top < 0
      || window.bottom < 0
      || window.left < 0
      || window.right < 0) {
      return false;
    }
  }

  registerWindow(onUpdate: (WindowState) => void): Subscription {
    const id = Math.floor(Date.now() * Math.random());
    const lastValue = this.stateSubject.getValue();

    lastValue[id] = {
      id,
      zIndex: 1,
      isMinimized: false,
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    };

    this.stateSubject.next(lastValue);

    let previousState = null;
    return this.stateSubject.asObservable()
      .map(state => state[id])
      .filter(state => {
        if (state !== previousState) {
          previousState = state;
          return true;
        }
        return false;
      })
      .subscribe(onUpdate);
  }

  registerContainer(elm) {
    this.container = elm;
  }

  tryWindowUpdate(windowId, dx, dy, isResize) {
    const lastValue = this.stateSubject.getValue(),
      state = lastValue[windowId];

    if (!this.container || !state) { return; }

    const newDimensions = {
      top: state.top - (isResize ? 0 : dy),
      bottom: state.bottom + dy,
      left: state.left + (isResize ? 0 : dx),
      right: state.right - dx
    };

    const isInBounds = WindowManagerService.boundsCheck(
      newDimensions,
      this.container.innerWidth,
      this.container.innerHeight
    );

    if (!isInBounds) { return; }
    lastValue[windowId] = Object.assign({}, state, newDimensions);
    this.stateSubject.next(lastValue);
  }

  moveWindow(windowId, dx, dy) {
    this.tryWindowUpdate(windowId, dx, dy, false);
  }

  resize(windowId, dx, dy) {
    this.tryWindowUpdate(windowId, dx, dy, true);
  }
}

export interface WindowState {
  zIndex: number;
  isMinimized: boolean;
  id: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}
