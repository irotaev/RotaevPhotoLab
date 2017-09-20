import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PhotoGridComponent } from './photo-grid/photo-grid.component';
import { MasonryModule } from 'angular2-masonry';

@NgModule({
  declarations: [
    AppComponent,
    PhotoGridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MasonryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
