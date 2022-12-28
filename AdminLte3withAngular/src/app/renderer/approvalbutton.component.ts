import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-approval-button-renderer',
    template: `
      <a (click)="onClick($event)" title="Approved"  style="color:green;font-size:15px;cursor:pointer"><i class="fa fa-check-circle"></i></a>
      <a></a>
      <a (click)="onRejectClick($event)" title="Rejected"  style="color:red;font-size:15px;cursor:pointer"><i class="fa fa-times-circle"></i></a>
      `
  })

  export class ApprovalButtonRendererComponent implements ICellRendererAngularComp {

    params;
    label: string;
  
    agInit(params): void {
      this.params = params;
      this.label = this.params.label || null;
    }
  
    refresh(params?: any): boolean {
      return true;
    }
  
    onClick($event) {
      if (this.params.onClick instanceof Function) {
        // put anything into params u want pass into parents component
        const params = {
          event: $event,
          rowData: this.params.node.data
          // ...something
        }
        this.params.onClick(params);  
      }
    }
    onRejectClick($event) {
      if (this.params.onRejectClick instanceof Function) {
        // put anything into params u want pass into parents component
        const params = {
          event: $event,
          rowData: this.params.node.data
          // ...something
        }
        this.params.onRejectClick(params);  
      }
    }
  }