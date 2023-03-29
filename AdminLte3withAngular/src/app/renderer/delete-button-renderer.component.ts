import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-delete-button-renderer',
    template: `
      <a (click)="onClick($event)" title="delete" style="color:red"><i class="fa fa-trash"></i></a>
      `
  })

  export class DeleteButtonRendererComponent implements ICellRendererAngularComp {

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
          rowData: this.params.node.data,
          // ...something
        }
        this.params.onClick(params);  
      }
    }
  }