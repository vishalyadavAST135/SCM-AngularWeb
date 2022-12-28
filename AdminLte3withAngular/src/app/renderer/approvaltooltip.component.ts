import { ITooltipAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'tooltip-component',
    template: `
    <div class="custom-tooltip">
    <div class="row mb-1">
    <div class="col-sm-12  text-nowrap" >
      <table id="tbltwo" class="table table-striped table-bordered">    
        <thead >    
            <tr>   
            <th></th>
              <th scope="row">Role</th>   
                <th scope="row">Name</th>  
                <th scope="row">Status</th>     
                <th scope="row">Date</th>   
                <th scope="row">Reason</th>  
                <th scope="row">Remarks</th> 
            </tr>    
        </thead>    
        <tbody>    
             <tr  *ngFor="let items of ApprovalDataList; let ndx = index">
             <td>L{{ ndx + 1 | number }}</td>
               <td>{{items.RoleName}}</td>
              <td>    
                {{items.Name}}
              </td>
                <td >    
                  <label *ngIf="items.ApprovalStatus === 'Approved'"  class="ng-scope">
                    <span  style="color: green; text-align:center">{{items.ApprovalStatus}} </span>
                </label>
                <label *ngIf="items.ApprovalStatus === 'Reject'"  class="ng-scope">
                  <span  style="color: red; text-align:center">{{items.ApprovalStatus}} </span>
              </label>
              <label *ngIf="items.ApprovalStatus === ''"  class="ng-scope">
                <span  style="color: #b19420; text-align:center">Pending</span>
            </label>
                </td>
                <td >    
                  {{items.StatusDate}} 
                </td>
                <td >  
                  {{items.ReasonName}}   
                </td> 
                <td >  
                {{items.Remarks}}   
              </td> 
            </tr> 
        </tbody>    
    </table> 
    </div>
  </div> 
    </div>
    `,
    styles: [
      `
        :host {
          position: absolute;
          width:auto;
          height: auto;
          border: 1px solid green;
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
  export class approvalTooltipComponent implements ITooltipAngularComp {
    
    private params: any;
    public data: any;
    ApprovalDataList:any;
   
    agInit(params): void {
      this.params = params;
      this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
      this.ApprovalDataList=JSON.parse(this.data.ApprovalStatusList)
      this.data.color = this.params.color || 'white';
    }
  }