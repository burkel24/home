import { Component, OnInit } from '@angular/core';

import { WindowManagerService, WindowState } from '../window-manager.service';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss']
})
export class DockComponent implements OnInit { 
  minimizedWindows: WindowState[];

  constructor(
    private WindowManagerService: WindowManagerService
  ) { }

  ngOnInit() {
    this.WindowManagerService.list
      .map(windows => windows.filter(aWindow => aWindow.isMinimized))
      .subscribe(
        windows => this.minimizedWindows = windows
      )
  }
}
