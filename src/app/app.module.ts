import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponentComponent } from './navbar-component/navbar-component.component';
import { DockComponent } from './dock/dock.component';
import { FoldersComponent } from './folders/folders.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponentComponent,
    DockComponent,
    FoldersComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
