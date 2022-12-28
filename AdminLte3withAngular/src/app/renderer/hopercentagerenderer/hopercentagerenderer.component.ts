import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-hopercentagerenderer',
  templateUrl: './hopercentagerenderer.component.html',
  styleUrls: ['./hopercentagerenderer.component.sass']
})
export class HopercentagerendererComponent implements AgRendererComponent {
  private params: any;
  public data: any;
  PercentageGreen: boolean = false;
  PercentageOrange: boolean = false;
  PercentageRed: boolean = false;
  Percentage: any;
  PercentageHOvalue: any;
 
  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    if (this.data.HOPercentage == 100) {
      this.PercentageGreen = true;
      this.Percentage = '%';
      this.PercentageHOvalue=this.data.HOPercentage;
    } else if (this.data.HOPercentage < 100 && this.data.HOPercentage >= 80) {
      this.PercentageOrange = true;
      this.Percentage = '%';
      this.PercentageHOvalue=this.data.HOPercentage;
    } else   {
      this.PercentageRed = true;
      this.Percentage = '%';
      this.PercentageHOvalue=this.data.HOPercentage;
    } 
     
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }

}
