import { Component, Input, OnInit } from '@angular/core';
import { element } from 'protractor';
import { CommonService } from 'src/app/Service/common.service';
import { UserManagementService } from 'src/app/Service/user-management.service';
import { DropdownModel } from 'src/app/_Model/commonModel';
import { CompanyWHMapping, DynamicWHMappingGrid, newUser } from 'src/app/_Model/UserManagementModel';

@Component({
  selector: 'app-whmapping',
  templateUrl: './whmapping.component.html',
  styleUrls: ['./whmapping.component.sass']
})
export class WHMappingComponent implements OnInit {
  model: any = {};
  disabledSaveButton: Boolean = false;
  public MultidropdownSettings = {};
  CompanyData: any[] = [];
  dynamicArray: Array<DynamicWHMappingGrid> = [];
  WareHouseData: any[] = [];
  @Input() UserDataList = [];
  UserName: any;
  loging_Id: number = 0;
  CompanyWHList: any[];
  constructor(
    private UserManagementService: UserManagementService,
    private _CommonServices: CommonService,
  ) {
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
      labelKey: 'WHName',
      primaryKey: 'WHId',
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

    if (this.UserDataList.length > 0) {
      this.editCompanyWHMapping();
    }
    this.BindCompanyList();
  }

  addRow() {
    debugger
    let objWHMappingGrid = new DynamicWHMappingGrid();
    objWHMappingGrid.CompanyId = 0;
    objWHMappingGrid.SelectWHId = [];
    objWHMappingGrid.WHList = [];
    this.dynamicArray.push(objWHMappingGrid);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArray.length == 1) {
      return false;

    } else {
      this.dynamicArray.splice(index, 1);
      return true;
    }
  }

  BindCompanyList() {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = 0;
    objdropdownmodel.Flag = 'company';
    this._CommonServices.getdropdown(objdropdownmodel).subscribe(Com => {
      this.CompanyData = Com.Data;
    });
  }

  onChangeCompanyId(CompanyId: any, index: any) {
    this.BindWHList(CompanyId, index);
  }

  BindWHList(CompanyId: any, index: number) {
    this.UserManagementService.GetAllRoleCompanyWH().subscribe((res: any) => {
      this.dynamicArray[index].WHList = res.WareHouseArray.filter(element => {
        return element.CompanyMaster_Id == CompanyId;
      })
    });
  }

  onChangehWHId(para: string, index: any) {
    if (para == "DelAll") {
      this.dynamicArray[index].SelectWHId = [];
    }
  }

  SaveUpdateCompanyWhMapping() {
    try {

      var objNewUser = new newUser();
      this.CompanyWHList = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        var objdynamic = new CompanyWHMapping();
        objdynamic.CompanyId = this.dynamicArray[i].CompanyId;
        objdynamic.WHId = this.dynamicArray[i].SelectWHId.map(xx => xx.WHId).join(',');
        this.CompanyWHList.push(objdynamic);
      }

      objNewUser.Flag = "WH";
      objNewUser.User_Id = this.model.User_Id;
      objNewUser.CompanyWHMappingList = this.CompanyWHList;
      this.UserManagementService.SaveUpadteUserRoleCompanyWH(objNewUser).subscribe(
        data => {
          if (data.Status == 1) {
            alert(data.Remarks);

          } else if (data.Status == 2) {

            alert(data.Remarks);
          } else if (data.Status == 0) {

            alert(data.Remarks);
          }
        }

      )

    } catch (Error) {
      this._CommonServices.ErrorFunction(this.UserName, Error.message, "SaveUpDateDispatchRequest", "UserManagement");
    }
  }

  editCompanyWHMapping() {
    this.UserDataList.map(res => {
      console.log(res);
      this.model.User_Id = res.rowData.User_Id;
      if (this.model.User_Id != "" || this.model.User_Id != 0) {
        this.UserManagementService.disabledSaveButtons.subscribe(res => {
          this.disabledSaveButton = res.disabledSaveButton;;
          console.log(this.disabledSaveButton);
        })
      }
      if(res.rowData.EmpWHList == "[{}]"){
        this.dynamicArray = [];
      }else{
        var data = JSON.parse(res.rowData.EmpWHList);
        for (var i = 0, len = data.length; i < len; i++) {
          var objdynamic = new DynamicWHMappingGrid();
          objdynamic.CompanyId = data[i].CompanyId;
          objdynamic.WHList = data[i].WHList;
          objdynamic.SelectWHId = data[i].WHList;
          this.dynamicArray.push(objdynamic);
        }
      }
     

    })
  }

}
