import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  public output: string[] = [];

  constructor() { }

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
