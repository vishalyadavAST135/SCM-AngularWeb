import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-cirpercentagerenderer',
  templateUrl: './cirpercentagerenderer.component.html',
  styleUrls: ['./cirpercentagerenderer.component.sass']
})
export class CirpercentagerendererComponent implements AgRendererComponent {

  private params: any;
  public data: any;
  PercentageGreen: boolean = false;
  PercentageOrange: boolean = false;
  PercentageRed: boolean = false;
  Percentage: any;
  PercentageCirvalue: any;
 
  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    if (this.data.CirPercentage == 100) {
      this.PercentageGreen = true;
      this.Percentage = '%';
      this.PercentageCirvalue=this.data.CirPercentage;
    } else if (this.data.CirPercentage < 100 && this.data.CirPercentage >= 80) {
      this.PercentageOrange = true;
      this.Percentage = '%';
      this.PercentageCirvalue=this.data.CirPercentage;
    } else   {
      this.PercentageRed = true;
      this.Percentage = '%';
      this.PercentageCirvalue=this.data.CirPercentage;
    } 
     
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }

}
