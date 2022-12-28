
import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'app-CheckBoxRenderer',
    template: `
      <input type="checkbox" (click)="onClick($event)"[checked]="params.value" >
      `
  })

  export class CheckBoxRendererComponent implements ICellRendererAngularComp {
    
    params;
    label: string;
  
    agInit(params): void {
      this.params = params;
      this.label = this.params.label || null;
    }
   
    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    // public onClick(event) {
    //     this.params.data[this.params.colDef.field] = event.currentTarget.checked;
    // }

    refresh(params: ICellRendererParams): boolean {
        return true;
    }
  
    onClick($event) {
        debugger
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


    // checkedHandler(event) {
    //     debugger
    //     let checked = event.target.checked;
    //     let colId = this.params.column.colId;
    //     this.params.node.setDataValue(colId, checked);
    // }
    // refresh(params: any): boolean {
    //     debugger
    //     params.data.amount++;
    //     params.data.cbox = params.value
    //     console.log(params.value);
    //     params.api.refreshCells(params);
    //     return false;
    //   }
  }