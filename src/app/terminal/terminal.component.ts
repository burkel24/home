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
    this.schedule(`Hey, my name is Burke.`, 1);
    this.schedule(`I'm a Full-Stack Engineer based in Brooklyn, New York.`, 3);
    this.schedule(`…`, 4.5);

    this.schedule(
      `I'm Co-Founder & CTO at 
      <a href="https://www.myquantime.com/" target="_blank">Quantime</a>`,
      5.5
    );
    this.schedule(`…`, 6.5);

    this.schedule(
      `Check out my links below or
      <a href="mailto:burke@tennyson.io">send me an email</a>`,
      8
    );
  }

  schedule(message: string, timeSeconds: number): Timer {
    return setTimeout(() => {
      this.output.push(message);
    }, timeSeconds * 1000);
  }
}

declare interface Timer {}
