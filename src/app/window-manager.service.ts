import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Draggable } from '@shopify/draggable';

const UPDATE_THROTTLE_WINDOW_MS = 50;

@Injectable()
export class WindowManagerService {
  private stateSubject = new BehaviorSubject<WindowStore>(new Map());
  private container;
  private lastUpdateTime: number;

  constructor() { }

  static snapToContainer(window, container) {
    let { top, bottom, left, right } = window;

    if (top < container.top) {
      const offset = container.top - top;
      top = container.top;
      bottom = bottom + offset > container.bottomn ? container.bottom : bottom + offset;
    }

    if (bottom > container.bottom) {
      const offset = bottom - container.bottom;
      bottom = container.bottom;
      top = top - offset < container.top ? container.top : top - offset;
    }

    if (left < container.left) {
      const offset = container.left - left;
      left = container.left;
      right = right + offset > container.right ? container.right : right + offset;
    }

    if (right > container.right) {
      const offset = right - container.right;
      right = container.right;
      left = left - offset < container.left ? container.left : left - offset;
    }

    return { top, bottom, left, right };
  }

  registerWindow(onUpdate: (WindowState) => void): Subscription {
    const id = Math.floor(Date.now() * Math.random()).toString();
    const store = this.stateSubject.getValue();

    store.set(id, {
      id,
      zIndex: 1,
      isMinimized: false,
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    });

    this.stateSubject.next(store);

    let previousState = null;
    return this.stateSubject.asObservable()
      .map(state => state.get(id))
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

    let targetId, containerElm;

    new Draggable([ elm.querySelector('.desktop') ], {
      draggable: '.app-window',
      classes: ['dragging'],
      handle: '.top-bar'
    })
    .on('drag:start', evt => targetId = evt.originalEvent.target.id)
    .on('drag:move', evt => containerElm = evt.sourceContainer)
    .on('drag:stop', evt => {
      const store = this.stateSubject.getValue(),
        state = store.get(targetId);

      if (!state || !containerElm) { return; }

      const containerBox = containerElm.getBoundingClientRect(),
        snappedBox = WindowManagerService.snapToContainer(evt.mirror.getBoundingClientRect(), containerBox);

      store.set(targetId, Object.assign({}, state, {
        top: snappedBox.top - containerBox.top,
        bottom: containerBox.bottom - snappedBox.bottom,
        left: snappedBox.left - containerBox.left,
        right: containerBox.right - snappedBox.right
      }));

      this.stateSubject.next(store);
      containerElm = null;
      targetId = '';
    });
  }

  toggleMinimize(windowId, doMinimze=true) {
    const store = this.stateSubject.getValue(),
      window = store.get(windowId);

    if (!window) { return; }

    const lastMinimizeState = window.isMinimized;
    if (lastMinimizeState === doMinimze) { return; }

    window.isMinimized = doMinimze;
    store.set(windowId, Object.assign({}, window));
    this.stateSubject.next(store);
  }

  get list() {
    return this.stateSubject
      .asObservable()
      .map(state => Array.from(state.values()))
  }
}

declare interface WindowStore extends Map<string, WindowState> { }

export interface WindowState {
  zIndex: number;
  isMinimized: boolean;
  id: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
}
