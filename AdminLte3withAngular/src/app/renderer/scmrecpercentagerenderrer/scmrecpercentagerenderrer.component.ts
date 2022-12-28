import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-scmrecpercentagerenderrer',
  templateUrl: './scmrecpercentagerenderrer.component.html',
  styleUrls: ['./scmrecpercentagerenderrer.component.sass']
})
export class ScmrecpercentagerenderrerComponent implements AgRendererComponent {

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
    if (this.data.SCMRecPercentage == 100) {
      this.PercentageGreen = true;
      this.Percentage = '%';
      this.Percentagevalue=this.data.SCMRecPercentage;
    } else if (this.data.SCMRecPercentage < 100 && this.data.SCMRecPercentage >= 80) {
      this.PercentageOrange = true;
      this.Percentage = '%';
      this.Percentagevalue=this.data.SCMRecPercentage;
    } else   {
      this.PercentageRed = true;
      this.Percentage = '%';
      this.Percentagevalue=this.data.SCMRecPercentage;
    } 
     
  }

  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }
}
