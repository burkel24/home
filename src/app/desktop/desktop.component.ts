import { AfterViewInit, Component, ElementRef } from '@angular/core';

import { WindowManagerService } from '../window-manager.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements AfterViewInit {

  constructor(
    private ElementRef: ElementRef,
    private WindowManagerService: WindowManagerService
  ) { }

  ngAfterViewInit() {
    this.WindowManagerService.registerContainer(this.ElementRef.nativeElement);
  }

}
