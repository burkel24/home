import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { URL_MAP } from '../app.module';
import { Task, TaskManagerService } from '../task-manager.service';
import { WindowManagerService } from '../window-manager.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements AfterViewInit, OnInit {
  public tasks: Task[] = [];

  constructor(
    private ElementRef: ElementRef,
    private Router: Router,
    private TaskManagerService: TaskManagerService,
    private WindowManagerService: WindowManagerService
  ) { 
    this.Router.events
      .filter(evt => evt instanceof NavigationEnd)
      .subscribe((evt: NavigationEnd) => {
        if (URL_MAP[evt.url]) {
          this.TaskManagerService.startTask(URL_MAP[evt.url]);
        }
      });
  }

  ngOnInit() {
    this.TaskManagerService.subscribeToTaskList(tasks => this.tasks = tasks);

  }

  ngAfterViewInit() {
    this.WindowManagerService.registerContainer(this.ElementRef.nativeElement);
  }

}
