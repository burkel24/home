import { Component, OnInit } from '@angular/core';

import { WindowManagerService, WindowState } from '../window-manager.service';

@Component({
  selector: 'app-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss']
})
export class DockComponent implements OnInit {
  minimizedWindows: WindowState[];
  links: { link: string, iconClass: string, tooltip: string }[] = [
    {
      link: 'https://github.com/burkel24',
      iconClass: 'fa-github-alt',
      tooltip: 'Github'
    },
    {
      link: 'https://codepen.io/burkel24/',
      iconClass: 'fa-codepen',
      tooltip: 'Codepen'
    },
    {
      link: 'https://www.instagram.com/burke024/',
      iconClass: 'fa-instagram',
      tooltip: 'Instagram'
    },
    {
      link: 'https://www.linkedin.com/in/burketlivingston/',
      iconClass: 'fa-linkedin-square',
      tooltip: 'Linkedin'
    }
  ];

  constructor(
    private WindowManagerService: WindowManagerService
  ) { }

  open(link) {
    window.open(link, '_blank');
  }

  ngOnInit() {
    this.WindowManagerService.list
      .map(windows => windows.filter(aWindow => aWindow.isMinimized))
      .subscribe(
        windows => this.minimizedWindows = windows
      );
  }

  unminimizeWindow(windowId: string) {
    this.WindowManagerService.unMinimize(windowId);
  }
}
