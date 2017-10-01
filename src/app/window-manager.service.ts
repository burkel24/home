import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class WindowManagerService {
  private stateSubject = new BehaviorSubject<{ [key: number]: WindowState }>({});

  constructor() { }

  registerWindow(onUpdate: (WindowState) => void): Subscription {
    const id = Math.floor(Date.now() * Math.random());
    const lastValue = this.stateSubject.getValue();

    lastValue[id] = {
      id,
      zIndex: 1,
      isMinimized: false
    };

    this.stateSubject.next(lastValue);

    return this.stateSubject.asObservable()
      .map(state => state[id])
      .subscribe(onUpdate);
  }
}

export interface WindowState {
  zIndex: number;
  isMinimized: boolean;
  id: number;
}
