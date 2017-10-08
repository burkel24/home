import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApplicationBase } from './applicationBase';

@Injectable()
export class TaskManagerService {
  private store: BehaviorSubject<TaskStore> = new BehaviorSubject<TaskStore>(new Map());


  subscribeToTaskList(cb: (tasks: Task[]) => void) {
    return this.store.asObservable()
      .map(store => Array.from(store.values()))
      .subscribe((tasks: Task[]) => cb(tasks));
  }

  startTask(newTask: ApplicationBase) {
    const data = this.store.getValue(),
      name = Date.now().toString(); // TODO

    data.set(name, {
      id: name,
      component: newTask
    });

    this.store.next(data);
  }

  endTask(taskId) {
    const data = this.store.getValue();

    if (data.delete(taskId)) {
      this.store.next(data);
    }
  }
}

export interface Task {
  component: ApplicationBase;
  id: string;
}

declare interface TaskStore extends Map<string, Task> { }
