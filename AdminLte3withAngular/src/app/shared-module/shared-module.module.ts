import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import { from } from 'rxjs';

@NgModule({
  declarations: [MainFooterComponent, MainHeaderComponent, MainSidebarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AngularMultiSelectModule,
    HttpClientModule,
    AppRoutingModule
  ],
  exports: [
    MainHeaderComponent, MainSidebarComponent, MainFooterComponent
  ]
})
export class SharedModuleModule { }
