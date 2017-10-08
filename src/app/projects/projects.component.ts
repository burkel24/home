import { Component, OnInit } from '@angular/core';

import { ApplicationBase } from '../applicationBase';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends ApplicationBase implements OnInit {
  ngOnInit() {
  }

}
