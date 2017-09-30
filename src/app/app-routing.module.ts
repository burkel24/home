import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { TerminalComponent } from './terminal/terminal.component';

const appRoutes: Routes = [
  {
    path: '',
    component: TerminalComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  }
];

@NgModule({
  declarations: [
    TerminalComponent,
    ProjectsComponent
  ],
  exports: [
    RouterModule
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ]
})
export class AppRoutingModule {}
