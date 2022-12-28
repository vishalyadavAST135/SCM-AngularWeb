import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-cipercentagerenderer',
  templateUrl: './cipercentagerenderer.component.html',
  styleUrls: ['./cipercentagerenderer.component.sass']
})
export class CIpercentagerendererComponent implements AgRendererComponent {

  private params: any;
  public data: any;
  PercentageGreen: boolean = false;
  PercentageOrange: boolean = false;
  PercentageRed: boolean = false;
  Percentage: any;
  PercentageCIvalue: any;
 
  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    if (this.data.CIPercentage == 100) {
      this.PercentageGreen = true;
      this.Percentage = '%';
      this.PercentageCIvalue=this.data.CIPercentage;
    } else if (this.data.CIPercentage < 100 && this.data.CIPercentage >= 80) {
      this.PercentageOrange = true;
      this.Percentage = '%';
      this.PercentageCIvalue=this.data.CIPercentage;
    } else   {
      this.PercentageRed = true;
      this.Percentage = '%';
      this.PercentageCIvalue=this.data.CIPercentage;
    } 
     
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }
}
