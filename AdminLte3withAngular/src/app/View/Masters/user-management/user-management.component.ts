import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { UserManagementService } from 'src/app/Service/user-management.service';
import { SearchUserModel } from 'src/app/_Model/UserManagementModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
import { NewUserComponent } from './new-user/new-user.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.sass'],
  providers: [DatePipe]
})
export class UserManagementComponent implements OnInit {
  public multiSortKey: string;
  tooltipShowDelay: any;
  frameworkComponents: any;
  public MultidropdownSettings = {};
  public loadingTemplate;
  gridApi: any;
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public columnDefs = [];
  model: any = {};
  CompanyId: any;
  UserId: any;
  UserName: any;
  Exportloading: boolean;
  rowData = [];
  data: any;
  newUser:boolean;
  roleMapping:boolean;
  companyMapping:boolean;
  whMapping:boolean;
  pageMapping:boolean;
  tabMenu: { id: number; name: string; }[];
  selectedItem: any;
  UserDataList:any[] = [];
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(
    public router: Router,
    public userApi: UserManagementService,
    public _Commonservices: CommonService,
    public _PurchaseOrderService: PurchaseOrderService,
    private Loader: NgxSpinnerService,
    private datePipe: DatePipe,) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent
    }
    this.tabMenu = [
      {id:1,name:'New User'},
      {id:2,name:'Role Mapping'},
      {id:3,name:'Company Mapping'},
      {id:4,name:'WH Mapping'},
      {id:5,name:'Page Mapping'}
    ]

   }
   
  ngOnInit(): void {
    this.isShownList = false;
    this.isShownEdit = true;
    this.newUser = false;
    this.roleMapping = false;
    this.companyMapping = false;
    this.whMapping = false;
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">loading...</span>`;
      this.addColumn();
      var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.UserName;
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
  }


  addColumn(){
    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowUserManagementDeatil.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      { headerName: 'Employee Name', field: 'Name', width: 190, resizable: true, filter: true, },
      { headerName: 'Employee Id', field: 'EmpCode', width: 130, sortable: true, filter: true, },
      { headerName: 'User Id', field: 'UserId', width: 130, filter: true, },
      { headerName: 'Email Id', field: 'EmailId', width: 130, sortable: true, filter: true, },
      { headerName: 'Date of Joining', field: 'DOJ', width: 150, filter: false, },
      { headerName: 'Created By', field: 'CreatedBy', width: 150 },
      { headerName: 'Role Name', field: 'EmpRole', width: 200, resizable: true },
      { headerName: 'Company', field: 'EmpCompany', width: 150, resizable: true },
      { headerName: 'Warehouse', field: 'EmpWH', width: 150 },

    ];
  }
  onGridReady(params) {
    this.gridApi = params.api;
  }

  SearchUserList(para: string) {
    try {
      var objpara = new SearchUserModel();
      objpara.CompanyId = this.CompanyId;
      if (this._Commonservices.checkUndefined(this.model.EmpName) != '') {
        objpara.EmpName = this.model.EmpName;
      } else {
        objpara.EmpName = '';
      }

      if (this._Commonservices.checkUndefined(this.model.EmpCode) != '') {
        objpara.EmpCode = this.model.EmpCode;
      } else {
        objpara.EmpCode = '';
      }
      this.userApi.GetUserRoleCompanyWH(objpara).pipe(first()).subscribe(data => {
        this.gridApi.hideOverlay();
        this.Exportloading = false;
        if (data.Status == 1) {
          if (para == "List") {
            this.Loader.hide();
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null
            }
          } else if (para == "Export") {
            if (data.Data != null) {
              var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'User Detail' + CurrentDate);
            } else {
              this.gridApi.hideOverlay();
              alert('No Data Available Of User Management Received');
            }

          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetSRNList", "SRN");
      });
    }
    catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchUserList", "UserManagement");
    }
  }

  CreateNew(){
    // this.router.navigate(['/UserManagement/newUser']);
    this.newUser = true;
    this.isShownList = true;
    this.isShownEdit = false;
    this.roleMapping = false;
    this.companyMapping = false;
    this.whMapping = false;
    this.pageMapping = false;

  }
 
 
  ShowUserManagementDeatil(e){
    this.userApi.EditData.next(e.rowData);
    this.UserDataList = [{
     rowData:e.rowData,
    }]
    this.userApi.disabledSaveButtons.next( {
      disabledSaveButton:true})
    this.CreateNew();
  }
  
  onClickTab(event:any,tab:any){
    //console.log(event.target.value,tab);
    this.newUser = false;
    this.roleMapping = false;
    this.companyMapping = false;
    this.whMapping = false;
    this.pageMapping =false;
    this.selectedItem = tab;
    if(tab == "New User"){
      this.newUser = true;
    } else if(tab == "Role Mapping"){
      this.roleMapping = true;
    }else if(tab == "Company Mapping"){
      this.companyMapping = true;
    }else if(tab == "WH Mapping"){
      this.whMapping = true;
    }else if(tab == "Page Mapping"){
      this.pageMapping = true;
    }
    
  }

  BackPage(){
    this.isShownList = false;
    this.isShownEdit = true;
    window.location.reload();
  }
}
