import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Draggable } from '@shopify/draggable';

const UPDATE_THROTTLE_WINDOW_MS = 50;
const MINIMUM_DIMENSION_PX = 250;
const WINDOW_PADDING_PX = 25;

@Injectable()
export class WindowManagerService {
  private stateSubject = new BehaviorSubject<WindowStore>(new Map());
  private container;
  private lastUpdateTime: number;

  constructor() { }

  static snapToContainer(window, container) {
    let { top, bottom, left, right } = window;

    if (top < container.top + WINDOW_PADDING_PX) {
      const offset = container.top - top + WINDOW_PADDING_PX;
      top = container.top + WINDOW_PADDING_PX;
      bottom = bottom + offset > container.bottomn - WINDOW_PADDING_PX ?
        container.bottom - WINDOW_PADDING_PX : bottom + offset;
    }

    if (bottom > container.bottom - WINDOW_PADDING_PX) {
      const offset = bottom - container.bottom - WINDOW_PADDING_PX;
      bottom = container.bottom - WINDOW_PADDING_PX;
      top = top - offset < container.top + WINDOW_PADDING_PX ?
        container.top + WINDOW_PADDING_PX : top - offset;
    }

    if (left < container.left + WINDOW_PADDING_PX) {
      const offset = container.left - left + WINDOW_PADDING_PX;
      left = container.left + WINDOW_PADDING_PX;
      right = right + offset > container.right - WINDOW_PADDING_PX ?
        container.right - WINDOW_PADDING_PX : right + offset;
    }

    if (right > container.right - WINDOW_PADDING_PX) {
      const offset = right - container.right - WINDOW_PADDING_PX;
      right = container.right - WINDOW_PADDING_PX;
      left = left - offset < container.left + WINDOW_PADDING_PX ?
        container.left + WINDOW_PADDING_PX : left - offset;
    }

    return { top, bottom, left, right };
  }

  registerWindow(title: string, iconClass: string, onUpdate: (WindowState) => void): Subscription {
    const id = Math.floor(Date.now() * Math.random()).toString(),
      store = this.stateSubject.getValue();

    // Center the window at an appropriate width
    const boundingRect = this.container.getBoundingClientRect(),
      widthScalar  = boundingRect.width > 1100 ? .6 : .9,
      initialWidth = boundingRect.width * widthScalar,
      sidePosition = (boundingRect.width - initialWidth) / 2;

    store.set(id, {
      id,
      title,
      iconClass,
      zIndex: 1,
      isMinimized: false,
      top: 100,
      bottom: 150,
      left: sidePosition,
      right: sidePosition
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

    new Draggable([ this.container ], {
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
        snappedBox = WindowManagerService.snapToContainer(
          evt.mirror.getBoundingClientRect(),
          containerBox
        );

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

    if (!window || window.isMinimized === doMinimize) { return; }


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
    } else if (window.zIndex !== sortedWindows.length) {
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
        top: WINDOW_PADDING_PX,
        bottom: WINDOW_PADDING_PX,
        left: WINDOW_PADDING_PX,
        right: WINDOW_PADDING_PX
      }
    ));

    this.stateSubject.next(store);
  }

  resize(windowId: string, elm, dx: number, dy: number): WindowState {
    const store = this.stateSubject.getValue(),
      window = store.get(windowId);

    if (!window) { return; }

    if (dx && (elm.clientWidth + dx) >= MINIMUM_DIMENSION_PX) {
      if (window.right - dx >= WINDOW_PADDING_PX) {
        window.right -= dx;
      } else {
        window.right = WINDOW_PADDING_PX;
      }
    }


    if (dy && (elm.clientHeight + dy) >= MINIMUM_DIMENSION_PX) {
      if (window.bottom - dy >= WINDOW_PADDING_PX) {
        window.bottom -= dy;
      } else {
        window.bottom = WINDOW_PADDING_PX;
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
