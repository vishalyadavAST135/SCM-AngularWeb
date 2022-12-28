import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { param } from 'jquery';

@Component({
  selector: 'app-ag-grid-checkbox',
  templateUrl: './ag-grid-checkbox.component.html',
  styleUrls: ['./ag-grid-checkbox.component.sass']
})
export class AgGridCheckboxComponent implements AgRendererComponent {

  public params: any;


  agInit(params: any): void {
    this.params = params;
    

  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    
  }

  refresh(params: any): boolean {
    params.data.cbox = params.value;
   
    // console.log('paramsvalue', params.value);
    params.api.refreshCells(params);
    return false;
  }


}
