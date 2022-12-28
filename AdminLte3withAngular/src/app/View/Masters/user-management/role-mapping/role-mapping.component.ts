import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Service/common.service';
import { UserManagementService } from 'src/app/Service/user-management.service';
import { newUser } from 'src/app/_Model/UserManagementModel';

@Component({
  selector: 'app-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.sass']
})
export class RoleMappingComponent implements OnInit {
  model:any = {};
  disabledSaveButton:Boolean =false;
  RoleData: any[]=[];
  SelectedRoleList:any[]=[];
  public MultidropdownSettings = {};
  RoleId: string="0";
  @Input() UserDataList = [];
  UserName: any;
  loging_Id:number=0;
  constructor(
    private UserManagementService:UserManagementService,
    private _Commonservices : CommonService) {
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
      labelKey: 'RoleName',
      primaryKey: 'RoleId',
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

    this.BindRoleList();
    if(this.UserDataList.length > 0){
    this.editRoleMapping();
    }
  }

  clearEditForm(){
    this.SelectedRoleList = [];
  } 

  BindRoleList() {
    this.UserManagementService.GetAllRoleCompanyWH().subscribe((res:any)=>{
      this.RoleData = res.RoleArray;
    });
  }
  
  BindSearchRole(para: string) {
    if (para == "DelAll") {
      this.SelectedRoleList = [];
    }   
  }

  SaveUpdateRoleMapping(){
    try {
      var objNewUser = new newUser();
      objNewUser.LogingUserId = this.loging_Id;
      objNewUser.User_Id = this.model.User_Id;
      if (this.SelectedRoleList.length > 0) {
        objNewUser.RoleId = this.SelectedRoleList.map(xx => xx.RoleId).join(',');
      } else {
        objNewUser.RoleId = "0";
        alert("Please select companyName");
        return false;
      }
      objNewUser.Flag = "Role";
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
        this._Commonservices.ErrorFunction(this.UserName, Error.message, "SaveUpdateRoleMapping", "UserManagement");
      }  
  }

  editRoleMapping(){
    this.UserDataList.map(data=>{
      this.model.User_Id = data.rowData.User_Id;
      console.log( this.model.User_Id)
      if(this.model.User_Id !="" ||this.model.User_Id !=0){        
        this.UserManagementService.disabledSaveButtons.subscribe(res=>{
          this.disabledSaveButton = res.disabledSaveButton;;
          console.log(this.disabledSaveButton);
        })
      }
      if(data.rowData.EmpRoleList == "[{}]"){
        this.SelectedRoleList=[];
        
        
      }else{
        this.SelectedRoleList = JSON.parse(data.rowData.EmpRoleList);
      }
    })
  }
}
