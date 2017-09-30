import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TerminalComponent } from './terminal/terminal.component';

const appRoutes: Routes = [
  {
    path: '',
    component: TerminalComponent
  }
];


@NgModule({
  declarations: [
    TerminalComponent
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
