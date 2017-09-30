import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent {

  constructor(
    private Router: Router
  ) { }

  isActive(path: string): boolean {
    return this.Router.url === path;
  }

  open(path: string) {
    this.Router.navigate([path]);
  }
}
