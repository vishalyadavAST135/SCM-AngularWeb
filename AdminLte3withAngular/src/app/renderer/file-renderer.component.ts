import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
    selector: 'app-file-renderer',
    template: `
      <a (click)="onClick($event)" title="view" style="color:green; margin-left:-12px"><i class="fa fa-eye"></i></a>
      `
  })

  export class FileRendererComponent implements ICellRendererAngularComp {

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
  }