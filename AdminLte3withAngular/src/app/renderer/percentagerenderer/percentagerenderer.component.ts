import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-percentagerenderer',
  templateUrl: './percentagerenderer.component.html',
  styleUrls: ['./percentagerenderer.component.sass']
})
export class PercentagerendererComponent implements AgRendererComponent {
  private params: any;
  public data: any;
  PercentageGreen: boolean = false;
  PercentageOrange: boolean = false;
  PercentageRed: boolean = false;
  Percentage: any;
  Percentagevalue: any;
 
  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    if (this.data.InstallPercentage == 100) {
      this.PercentageGreen = true;
      this.Percentage = '%';
      this.Percentagevalue=this.data.InstallPercentage;
    } else if (this.data.InstallPercentage < 100 && this.data.InstallPercentage >= 80) {
      this.PercentageOrange = true;
      this.Percentage = '%';
      this.Percentagevalue=this.data.InstallPercentage;
    } else   {
      this.PercentageRed = true;
      this.Percentage = '%';
      this.Percentagevalue=this.data.InstallPercentage;
    } 
     
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }
}
