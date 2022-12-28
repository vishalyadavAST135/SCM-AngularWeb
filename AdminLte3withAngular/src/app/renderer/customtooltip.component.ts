import { ITooltipAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'tooltip-component',
    template: `
      <div class="custom-tooltip">
    <span>{{this.data.ItemDescription}}</span>
      </div>
    `,
    styles: [
      `
        :host {
          position: absolute;
          width: 15%;
          height: auto;
          border: 1px solid cornflowerblue;
          overflow: hidden;
          background-color:#e6f2f5;
          pointer-events: none;
          transition: opacity 1s;
        }
  
        :host.ag-tooltip-hiding {
          opacity: 0;
        }
  
        .custom-tooltip p {
          margin: 5px;
          white-space: nowrap;
        }
  
        .custom-tooltip p:first-of-type {
           font-weight: normal;
        }
      `,
    ],
  })
  export class CustomTooltipComponent implements ITooltipAngularComp {
    
    private params: any;
    public data: any;
    ApprovalList:any;
    agInit(params): void {
      this.params = params;
      this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
      this.data.color = this.params.color || 'white';
    }
  }