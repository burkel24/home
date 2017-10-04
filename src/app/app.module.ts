import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DockComponent } from './dock/dock.component';
import { FoldersComponent } from './folders/folders.component';
import { NavbarComponentComponent } from './navbar-component/navbar-component.component';
import { ProjectsComponent } from './projects/projects.component';
import { TerminalComponent } from './terminal/terminal.component';
import { WindowComponent } from './window/window.component';
import { WindowManagerService } from './window-manager.service';
import { DesktopComponent } from './desktop/desktop.component';


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
    AppComponent,
    NavbarComponentComponent,
    DockComponent,
    FoldersComponent,
    TerminalComponent,
    ProjectsComponent,
    WindowComponent,
    DesktopComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    WindowManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
