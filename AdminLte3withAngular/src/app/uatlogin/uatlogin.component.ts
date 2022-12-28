import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from '../Service/common.service';
import { DropdownModel } from '../_Model/commonModel';
import { CompanyModel, UserModel } from '../_Model/userModel';

@Component({
  selector: 'app-uatlogin',
  templateUrl: './uatlogin.component.html',
  styleUrls: ['./uatlogin.component.sass']
})
export class UatloginComponent implements OnInit {
  //public objUserModel: UserModel;
  public UserName:string;
  token:string;
  loading = false;
  submitted = false;
  returnUrl: string;
  VendorDataDetail: any;
  ItemDataDetail: any;
  cookieValue = 'UNKNOWN'
  IsRemember: boolean = false;
  model: any;
  username: string;
  password: string;
  closeResult: string;
  CompanyData: any;
  CompanyId: any;
  cid: any;

  IsmodelShow: boolean;
  CompanyData1: any;
  CompanyFilterData: any;
  ipAddress: any;
  User_Id: any;
  EmailId: string;
  constructor(private cookieService: CookieService,private _CommonService: CommonService,private route: ActivatedRoute,private router: Router) {    
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.cid = params['cid'];
  }); }

  ngOnInit(): void {
    this.getUatLogin();
  }
  getUatLogin(){
    var objUserModel= new  UserModel();
    objUserModel.Token=this.token;
      this._CommonService.getUatLogin(objUserModel).subscribe(data => {
        if (data.Data[0].User_Id > 0) {
          var objUserModel = new UserModel();
          objUserModel.User_Id = data.Data[0].User_Id;
          this.User_Id = data.Data[0].User_Id;
          objUserModel.Name = data.Data[0].Name;
          objUserModel.Role_Id = data.Data[0].Role_Id;
          sessionStorage.setItem("UserSession", JSON.stringify(objUserModel));
          var objdropdownmodel = new DropdownModel();
          objdropdownmodel.User_Id = this.User_Id;
          objdropdownmodel.Other_Id = "0";
          objdropdownmodel.Parent_Id = "0";
          objdropdownmodel.Company_Id = 0;
          objdropdownmodel.Flag = 'company';
          this._CommonService.getdropdown(objdropdownmodel).subscribe(Com => {
            this.CompanyId = 0;
            this.CompanyData = Com.Data;
            this.setCompanySession(this.cid);
          });
         
        } else {
          alert("Invalid user token")
          this.submitted = false;
          this.loading = false;
          this.router.navigate(['/login']);
        }
      });
   }
   setCompanySession(CompanyId: number) {
      this.CompanyId = CompanyId;
      this.CompanyFilterData = this.CompanyData.filter(
        m => m.Id === parseInt(this.CompanyId));
      var objCompanyModel = new CompanyModel();
      objCompanyModel.Company_Id = this.CompanyFilterData[0].Id;
      objCompanyModel.FullName = this.CompanyFilterData[0].fullName;
      objCompanyModel.Name = this.CompanyFilterData[0].Name;
      sessionStorage.setItem("CompanyIdSession", JSON.stringify(objCompanyModel));
      this.router.navigate(['/dashboard']);
  }
}
