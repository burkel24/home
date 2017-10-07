import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ApplicationBase } from './applicationBase';
import { DockComponent } from './dock/dock.component';
import { FoldersComponent } from './folders/folders.component';
import { NavbarComponentComponent } from './navbar-component/navbar-component.component';
import { ProjectsComponent } from './projects/projects.component';
import { TaskManagerService } from './task-manager.service';
import { TerminalComponent } from './terminal/terminal.component';
import { WindowComponent } from './window/window.component';
import { WindowContentHostDirective } from './window/windowContentHost.directive';
import { WindowManagerService } from './window-manager.service';
import { DesktopComponent } from './desktop/desktop.component';

const appRoutes: Routes = [
  {
    path: '**',
    pathMatch: 'prefix',
    component: DesktopComponent
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
    WindowContentHostDirective,
    DesktopComponent
  ],
  entryComponents: [
    ProjectsComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    TaskManagerService,
    WindowManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export const URL_MAP = {
  '/': TerminalComponent,
  '/projects': ProjectsComponent
};
