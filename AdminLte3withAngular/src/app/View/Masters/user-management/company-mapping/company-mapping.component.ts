import { Component, Input, OnInit } from '@angular/core';
import { prototype } from 'events';
import { AlertPromise } from 'selenium-webdriver';
import { CommonService } from 'src/app/Service/common.service';
import { UserManagementService } from 'src/app/Service/user-management.service';
import { DropdownModel } from 'src/app/_Model/commonModel';
import { newUser } from 'src/app/_Model/UserManagementModel';

@Component({
  selector: 'app-company-mapping',
  templateUrl: './company-mapping.component.html',
  styleUrls: ['./company-mapping.component.sass']
})
export class CompanyMappingComponent implements OnInit {
  model: any = {};
  disabledSaveButton: Boolean = false;
  CompanyData: any[] = [];
  //CompanyId: string = '0';
  SelectedCompanyList: any[] = [];
  public MultidropdownSettings = {};
  @Input() UserDataList = [];
  UserName: any;
  loging_Id: number = 0;
  EmpCmpArr: any[]=[];
  // GenNewUserId: any = 0;
  constructor(
    private UserManagementService: UserManagementService,
    private _CommonServices: CommonService) {
  }

  ngOnInit(): void {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserName = objUserModel.User_Id;
    this.loging_Id = objUserModel.User_Id;

    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      labelKey: 'CompanyName',
      primaryKey: 'CompanyId',
      // limitSelection:1
      badgeShowLimit: 1,
    };

    this.model.User_Id = this.UserManagementService.GenNewUserId;
    if (this.model.User_Id != 0) {
      this.UserManagementService.disabledSaveButtons.subscribe(res => {
        this.disabledSaveButton = res.disabledSaveButton;
      })
    } else {
      this.model.User_Id = 0;
    }

    this.BindCompanyList();
    if(this.UserDataList.length > 0){
    this.editCompanyMapping();
    }
  }

  BindCompanyList() {
    this.UserManagementService.GetAllRoleCompanyWH().subscribe((res: any) => {
      this.CompanyData = res.CompanyArray;
    });
  }

  clearEditForm() {
    this.SelectedCompanyList = [];
  }

  BindSearchCompany(para: string) {
    if (para == "DelAll") {
      this.SelectedCompanyList = [];
    }
  }

  SaveUpdateCompanyMapping() {
    try {
      var objNewUser = new newUser();
      objNewUser.LogingUserId = this.loging_Id;
      objNewUser.User_Id = this.model.User_Id;
      if (this.SelectedCompanyList.length > 0) {
        objNewUser.CompanyId = this.SelectedCompanyList.map(xx => xx.CompanyId).join(',');
      } else {
        objNewUser.CompanyId = "0";
        alert("Please select companyName");
        return false;
      }
      objNewUser.Flag = "Company";
      this.UserManagementService.SaveUpadteUserRoleCompanyWH(objNewUser).subscribe(
        data => {
          if (data.Status == 1) {
            this.clearEditForm();
            alert(data.Remarks);
          }else{
            this.clearEditForm();
            alert(data.Remarks);
          }
        }
      )
    } catch (Error) {
      this._CommonServices.ErrorFunction(this.UserName, Error.message, "SaveUpadteUserRoleCompanyWH", "UserManagement");
    }
  }

  editCompanyMapping() {
    this.UserDataList.map(data => {
      this.model.User_Id = data.rowData.User_Id;
      if (this.model.User_Id != "" || this.model.User_Id != 0) {
        this.UserManagementService.disabledSaveButtons.subscribe(res => {
          this.disabledSaveButton = res.disabledSaveButton;
        })
      }
        if(data.rowData.EmpCompanyList == "[{}]"){
        this.SelectedCompanyList=[];
        
        
      }else{
        this.SelectedCompanyList = JSON.parse(data.rowData.EmpCompanyList);
      }
     })
  }
}
