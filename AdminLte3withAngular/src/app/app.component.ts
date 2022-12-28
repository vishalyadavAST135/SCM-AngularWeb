import { Component } from '@angular/core';
declare var $: any;
import * as XLSX from 'xlsx';
const { read, write, utils } = XLSX;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'AdminLte3withAngular';
  InputValue: any;

}
