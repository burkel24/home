import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Draggable } from '@shopify/draggable';

const UPDATE_THROTTLE_WINDOW_MS = 50;
const MINIMUM_DIMENSION_PX = 250;

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

  registerWindow(title: string, iconClass: string, onUpdate: (WindowState) => void): Subscription {
    const id = Math.floor(Date.now() * Math.random()).toString();
    const store = this.stateSubject.getValue();

    store.set(id, {
      id,
      title,
      iconClass,
      zIndex: 1,
      isMinimized: false,
      top: 50,
      bottom: 150,
      left: 150,
      right: 150
    });

    this.stateSubject.next(store);
    this.focusWindow(id);

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

  removeWindow(windowId: string) {
    const store = this.stateSubject.getValue();

    if (store.delete(windowId)) {
      this.stateSubject.next(store);
    }
  }

  registerContainer(elm) {
    this.container = elm;

    let targetId, containerElm;

    new Draggable([ elm.querySelector('.desktop') ], {
      draggable: '.app-window',
      classes: ['dragging'],
      handle: '.top-bar'
    })
    .on('drag:start', evt => {
      targetId = evt.originalEvent.target.id;
      this.focusWindow(targetId);
    })
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

  minimize(windowId) {
    this.toggleMinimize(windowId, true);
  }

  unMinimize(windowId) {
    this.toggleMinimize(windowId, false);
  }

  private toggleMinimize(windowId, doMinimize) {
    const store = this.stateSubject.getValue(),
      window = store.get(windowId);

    if (!window || window.isMinimized == doMinimize) { return; }


    store.set(windowId, Object.assign({}, window, {
      isMinimized: doMinimize
    }));

    this.stateSubject.next(store);
  }

  focusWindow(windowId) {
    const store = this.stateSubject.getValue(),
      window = store.get(windowId);

    if (!window) { return; }

    const sortedWindows = Array.from(store.values()).sort((a, b) => {
      return a.zIndex < b.zIndex ? 1 : -1;
    });

    const windowIndex = sortedWindows.findIndex(
      aWindow => aWindow.id === windowId
    );

    if (windowIndex !== sortedWindows.length - 1) {
      window.zIndex = sortedWindows.length;

      for (let i = sortedWindows.length - 1; i > windowIndex; i--) {
        sortedWindows[i].zIndex = i;
      }
    } else if (window.zIndex != sortedWindows.length) {
      for (let i = sortedWindows.length - 2; i >= 0; i--) {
        sortedWindows[i].zIndex = i + 1;
      }
    }

    this.stateSubject.next(store);
  }

  maximize(windowId) {
    const store = this.stateSubject.getValue(),
      window = store.get(windowId);

    if (!window) { return; }

    store.set(windowId, Object.assign(
      {},
      window,
      {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    ));

    this.stateSubject.next(store);
  }

  resize(windowId: string, elm, dx: number, dy: number): WindowState {
    const store = this.stateSubject.getValue(),
      window = store.get(windowId);

    if (!window) { return; }

    if (dx && (elm.clientWidth + dx) >= MINIMUM_DIMENSION_PX) {
      if (window.right - dx >= 0) {
        window.right -= dx;
      } else {
        window.right = 0;
      }
    }


    if (dy && (elm.clientHeight + dy) >= MINIMUM_DIMENSION_PX) {
      if (window.bottom - dy >= 0) {
        window.bottom -= dy;
      } else {
        window.bottom = 0;
      }
    }

    store.set(windowId, Object.assign({}, window));
    this.stateSubject.next(store);
    return window;
  }

  get list() {
    return this.stateSubject
      .asObservable()
      .map(state => Array.from(state.values()));
  }
}

declare interface WindowStore extends Map<string, WindowState> { }

export interface WindowState {
  zIndex: number;
  isMinimized: boolean;
  id: string;
  title: string;
  iconClass: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
}
