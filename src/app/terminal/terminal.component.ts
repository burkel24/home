import { Component, OnInit } from '@angular/core';

import { ApplicationBase } from '../applicationBase';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent extends ApplicationBase implements OnInit {
  static appName = 'Terminal';
  static iconClass = 'fa-terminal';

  public output: string[] = [];

  ngOnInit() {
    this.schedule('./burke.sh', 1);
    this.schedule('> Welcome to my homepage', 3);
  }

  schedule(message: string, timeSeconds: number): number {
    return setTimeout(() => {
      this.output.push(message);
    }, timeSeconds * 1000);
  }
}
