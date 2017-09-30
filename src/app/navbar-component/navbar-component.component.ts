import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar-component.component.html',
  styleUrls: ['./navbar-component.component.scss']
})
export class NavbarComponentComponent implements OnInit {
  public title = '';
  private urlMap = {
    '/': 'Terminal'
  };

  constructor(
    private Router: Router
  ) { }

  ngOnInit() {
    this.Router.events
      .filter(evt => evt instanceof NavigationEnd)
      .subscribe(() => this.title = this.urlMap[this.Router.url]);
  }

}
