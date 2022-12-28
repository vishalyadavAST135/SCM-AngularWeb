import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-approvalrenderer',
  templateUrl: './approvalrenderer.component.html',
  styleUrls: ['./approvalrenderer.component.sass']
})
export class ApprovalrendererComponent implements AgRendererComponent {
  private params: any;
  public data: any;
  ApprovalList: any;

  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    this.ApprovalList=JSON.parse(this.data.ApprovalStatusList);
  }





  refresh(params: any): boolean {
    params.api.refreshCells(params);
    return false;
  }
}
