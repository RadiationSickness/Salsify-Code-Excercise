import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductSortComponent } from 'src/components/productSort/productSort.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductSortComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
