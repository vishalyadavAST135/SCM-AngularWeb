import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/Service/common.service';
import { UserManagementService } from 'src/app/Service/user-management.service';
import { newUser } from 'src/app/_Model/UserManagementModel';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.sass']
})
export class NewUserComponent implements OnInit {
  model: any = {};
  disabledSaveButton: Boolean;
  UserName: any;
  loging_Id: number = 0;
    
  editUser: boolean = true;
  isUserStatus: boolean = false;
  isNewUser: boolean = false;
  @Input() UserDataList = [];
  @Output() disabledButtons = new EventEmitter();
  constructor(
    private UserManagementService: UserManagementService,
    private _Commonservices: CommonService) {
  }

  ngOnInit(): void {
    this.isNewUser = true;
    this.model.UserStatus="1";
    this.UserManagementService.GenNewUserId.subscribe(res=>{
      this.model.User_Id = res;
    })

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserName = objUserModel.User_Id;
    this.loging_Id = objUserModel.User_Id;
    if(this.UserDataList.length > 0){
      this.editUserDetail();
      
    }
   
  }

  clearEditForm() {
    this.model.User_Id = 0;
    this.model.firstName = "";
    this.model.lastName = "";
    this.model.empCode = "";
    this.model.mobileNo = "";
    this.model.email = "";
    this.model.userId = "";
    this.model.password = "";
    this.model.confirmPassword = "";
    this.model.doj = "";
    
  }

  SaveUpdateNewUser() {
    try {
      
      var objNewUser = new newUser();
      objNewUser.LogingUserId = this.loging_Id;
      objNewUser.FirstName = this.model.firstName;
      objNewUser.LastName = this.model.lastName;
      objNewUser.EmpCode = this.model.empCode;
      objNewUser.MobileNo = this.model.mobileNo;
      objNewUser.EmailId = this.model.email;
      objNewUser.UserId = this.model.userId;
      objNewUser.Password = this.model.password;
      objNewUser.UserStatus = this.model.UserStatus;
      // console.log('this.model.UserStatus:', this.model.UserStatus);
      var SDate = this._Commonservices.checkUndefined(this.model.doj);
      objNewUser.Doj = SDate.year  + '/' + SDate.month + '/' + SDate.day;
      
      if (this.model.User_Id != '') {
        objNewUser.User_Id = this.model.User_Id;
      } else {
        objNewUser.User_Id = 0;
      }      
      objNewUser.Flag = "NewUser";

      let jsonStr = JSON.stringify(objNewUser);
      //console.log(jsonStr);
      this.UserManagementService.SaveUpadteUserRoleCompanyWH(objNewUser).subscribe(
        data => {          
          if (data.Status == 1) {
            this.model.User_Id = data.Data;
            this.UserManagementService.GenNewUserId = this.model.User_Id;
              this.UserManagementService.disabledSaveButtons.next({
                disabledSaveButton: true
              })
            this.clearEditForm();
            alert(data.Remarks);
          } else {
            this.model.User_Id = 0;
            this.UserManagementService.GenNewUserId = this.model.User_Id;
            this.clearEditForm();
            alert(data.Remarks);
            window.location.reload();
          }     
        }
      )
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SaveUpadteUserRoleCompanyWH", "UserManagement");
    }
  }


 
  editUserDetail() {
    //this.model.UserStatus = "1"
    this.UserDataList.map(res => {
      var data = res.rowData;
      this.model.User_Id = data.User_Id;
      if (this.model.User_Id != "" || this.model.User_Id != 0) {
        this.UserManagementService.disabledSaveButtons.subscribe(res => {
          this.disabledSaveButton = res.disabledSaveButton;;
        })
        this.editUser = false;
      } else {
        this.editUser = true;
      }
      this.isUserStatus = true;
      this.isNewUser= false;
      this.model.firstName = data.FirstName;
      this.model.lastName = data.LastName;
      this.model.empCode = data.EmpCode;
      this.model.mobileNo = data.MobileNo;
      this.model.email = data.EmailId;
      this.model.userId = data.UserId;
      this.model.UserStatus = data.UserStatus;
      var DDate = data.DOJ.split('/');
            this.model.doj = { year: parseInt(DDate[2]), month: parseInt(DDate[1]), day: parseInt(DDate[0]) };
      // this.model.doj = data.DOJ;
  
    });
  }
}
