import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/Service/common.service';
import { UserManagementService } from 'src/app/Service/user-management.service';
import { CompanyStateVendorItemModel, MenuModel } from 'src/app/_Model/commonModel';
import { MenuRightModel, newUser } from 'src/app/_Model/UserManagementModel';
import { CompanyModel, UserModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-page-mapping',
  templateUrl: './page-mapping.component.html',
  styleUrls: ['./page-mapping.component.sass']
})
export class PageMappingComponent implements OnInit {
  model: any = {};
  menuName:number = 0;
  @Input() UserDataList = [];
  MenuList:any[]=[];
  checkboxList:any[] = []
  UserId: any;
  public objUserModel: UserModel;
  public objMenuModel: MenuModel[];
  UserName: string;
  CompanyId: any;
  apiCSVIData: any = {};
  MenuData: any[] =[]
  loging_Id: any = 0;
  disabledSaveButton: Boolean = false;
  constructor(
    private _Commonservices: CommonService,
    private UserManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.objUserModel=JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = this.objUserModel.User_Id;
    this.UserName = this.objUserModel.User_Id;
    this.loging_Id = this.objUserModel.User_Id;
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    this.checkboxList = [
      {id:1,name:'IsView'},
      {id:2,name:'IsSearch'},
      {id:3,name:'IsCreate'},
      {id:4,name:'IsEdit'},
      {id:5,name:'IsDelete'},
      {id:6,name:'IsApprove'},
      {id:7,name:'IsGenPdf'},
      {id:8,name:'IsPdfView'},
      {id:9,name:'IsExport' },
      {id:10,name:'IsImportExcel' },
      {id:11,name:'IsUploadDoc'},
      {id:12,name:'IsBulkPdfDwnload'},
    ]
    // this.bindMenu();
    this.BindCompanyStateVendorItem();
    this.model.User_Id = this.UserManagementService.GenNewUserId;
    if (this.model.User_Id != 0) {
      this.UserManagementService.disabledSaveButtons.subscribe(res => {
        this.disabledSaveButton = res.disabledSaveButton;
      })
    } else {
      this.model.User_Id = 0;
    }
    if (this.UserDataList.length > 0) {
      this.editPageMapping();
    }
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id:number) {
    console.log(this.model.IsView);
    this._Commonservices.GetUserPageRight(this.model.User_Id,id).subscribe(data => {
    console.log(data)   ;
    if (data.Status == 1) {
    this.model.IsView = data.Data[0].IsView;
    this.model.IsSearch= data.Data[0].IsSearch;
    this.model.IsCreate = data.Data[0].IsCreate;
    this.model.IsEdit= data.Data[0].IsEdit;
    this.model.IsDelete= data.Data[0].IsDelete;
    this.model.IsApprove= data.Data[0].IsApprove;
    this.model.IsGenPdf= data.Data[0].IsGenPdf;
    this.model.IsPdfView= data.Data[0].IsPdfView;
    this.model.IsExport= data.Data[0].IsExport;
    this.model.IsImportExcel= data.Data[0].IsImportExcel;
    this.model.IsUploadDoc= data.Data[0].IsUploadDoc;
    this.model.IsBulkPdfDwnload= data.Data[0].IsBulkPdfDwnload;
    }  
  })
  }

  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    console.log(this.apiCSVIData);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.MenuArray = this.apiCSVIData.MenuArray;
      this.MenuData = objCSVTdata.MenuArray;
    }
  }
//   bindMenu(){
//    this._Commonservices.getUserMenu(JSON.stringify(this.objUserModel)).subscribe(menu=>{  
//      this.objMenuModel=menu.Data;
//      this.SubMenu = this.objMenuModel.map(res=>res.SubMenu);
//      console.log(this.SubMenu);
//      this.SubMenuList = [].concat.apply([],this.SubMenu);
//      console.log(this.SubMenuList);
//    });
//  }

 onChangeSubMenu(e:any){
  console.log(e.target.value);
  this.GetUserPageRight(e.target.value);
 }
  SavePageMapping(form:NgForm){  
    debugger
      try {
  
        var objNewUser = new newUser();
        var objUserPageRightModel = new MenuRightModel();
        if(this._Commonservices.checkUndefined(this.model.IsView) == true){
          objUserPageRightModel.IsView = 1;
        }else{
          objUserPageRightModel.IsView = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsSearch) == true){
          objUserPageRightModel.IsSearch = 1;
        }else{
          objUserPageRightModel.IsSearch = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsCreate) == true){
          objUserPageRightModel.IsCreate = 1;
        }else{
          objUserPageRightModel.IsCreate = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsEdit) == true){
          objUserPageRightModel.IsEdit = 1;
        }else{
          objUserPageRightModel.IsEdit = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsDelete) == true){
          objUserPageRightModel.IsDelete = 1;
        }else{
          objUserPageRightModel.IsDelete = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsApprove) == true){
          objUserPageRightModel.IsApprove = 1;
        }else{
          objUserPageRightModel.IsApprove = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsGenPdf) == true){
          objUserPageRightModel.IsGenPdf = 1;
        }else{
          objUserPageRightModel.IsGenPdf = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsPdfView) == true){
          objUserPageRightModel.IsPdfView = 1;
        }else{
          objUserPageRightModel.IsPdfView = 0;
        }
        if(this._Commonservices.checkUndefined(this.model.IsExport) == true){
          objUserPageRightModel.IsExport = 1;
        }else{
          objUserPageRightModel.IsExport = 0;
        }
        if(this._Commonservices.checkUndefined(this.model.IsImportExcel) == true){
          objUserPageRightModel.IsImportExcel = 1;
        }else{
          objUserPageRightModel.IsImportExcel = 0;
        }
        if(this._Commonservices.checkUndefined(this.model.IsUploadDoc) == true){
          objUserPageRightModel.IsUploadDoc = 1;
        }else{
          objUserPageRightModel.IsUploadDoc = 0;
        }
  
        if(this._Commonservices.checkUndefined(this.model.IsBulkPdfDwnload) == true){
          objUserPageRightModel.IsBulkPdfDwnload = 1;
        }else{
          objUserPageRightModel.IsBulkPdfDwnload = 0;
        }
        this.MenuList.push(objUserPageRightModel);
        console.log(this.MenuList);
        objNewUser.LogingUserId = this.loging_Id;
        objNewUser.Flag = "MenuRight";
        objNewUser.User_Id = this.model.User_Id;
        objNewUser.Menu_Id = this.menuName;
        objNewUser.MenuRightList  = this.MenuList;
        let jsonStr = JSON.stringify(objNewUser);
      console.log(jsonStr);
     
        this.UserManagementService.SaveUpadteUserRoleCompanyWH(objNewUser).subscribe(
          data => {
            if (data.Status == 1) {
              this.clearForm();
              alert(data.Remarks);
            } else if (data.Status == 2) {
              this.clearForm();
              alert(data.Remarks);
            } else if (data.Status == 0) {
              this.clearForm();
              alert(data.Remarks);
            }
          }
  
        )
      }
      catch (Error) {
        this._Commonservices.ErrorFunction(this.UserName, Error.message, "SavePageMapping", "UserManagement");
      }
  
  }

  clearForm(){
    this.model.IsView = false;
    this.model.IsSearch= false;
    this.model.IsCreate = false;
    this.model.IsEdit= false;
    this.model.IsDelete= false;
    this.model.IsApprove= false;
    this.model.IsGenPdf= false;
    this.model.IsPdfView= false;
    this.model.IsExport= false;
    this.model.IsImportExcel= false;
    this.model.IsUploadDoc= false;
    this.model.IsBulkPdfDwnload= false;
    this.menuName = 0;
  }

  editPageMapping() {
    this.UserDataList.map(res => {
      console.log(res);
      this.model.User_Id = res.rowData.User_Id;
      if (this.model.User_Id != "" || this.model.User_Id != 0) {
        this.UserManagementService.disabledSaveButtons.subscribe(res => {
          this.disabledSaveButton = res.disabledSaveButton;;
          console.log(this.disabledSaveButton);
        });
      }
    })
  }
    
}
