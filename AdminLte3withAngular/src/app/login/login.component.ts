import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../Service/user.service';
import { CommonService } from '../Service/common.service';
import { UserModel, CompanyModel } from '../_Model/userModel'
import { LoginModel } from '../_Model/loginModel'
import { ChangePasswordModel, DropdownModel } from '../_Model/commonModel'
import { CookieService } from 'ngx-cookie-service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
// import { BindingFlags } from '@angular/compiler/src/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
  IsmodelShow: boolean;
  @ViewChild("content") modalContent: TemplateRef<any>;
  CompanyData1: any;
  CompanyFilterData: any;
  ipAddress: any;
  User_Id: any;
  EmailId: string;

  constructor(private cookieService: CookieService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private httpclient: HttpClient, private _UserService: UserService, private _Commonservices: CommonService, private _CommonServices: CommonService, private modalService: NgbModal) {
    if (this._UserService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    sessionStorage.removeItem("CompStatVenItmSession");
    sessionStorage.removeItem("UserSession");
    sessionStorage.removeItem("UserMenu");
    this.cookieValue = this.cookieService.get('UserCookies');
    if (this.cookieValue == null) {
      var objlogin = new LoginModel();
      objlogin = JSON.parse(this.cookieValue);
      this.username = objlogin.UserId;
      this.password = objlogin.Password;
    }
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.getIPAddress();
  }
  get loginFormControl() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    } else if (this.loginForm.valid) {
      this.loading = true;
      var objlogin = new LoginModel();
      objlogin.UserId = this.loginForm.controls.username.value;
      objlogin.Password = this.loginForm.controls.password.value;
      objlogin.SessionId = "";
      objlogin.IpAddress = this.ipAddress;
      this._UserService.postUserLogin(objlogin).subscribe(data => {
        if (data.Data[0].User_Id > 0) {
          var objUserModel = new UserModel();
          objUserModel.User_Id = data.Data[0].User_Id;
          this.User_Id = data.Data[0].User_Id;
          objUserModel.Name = data.Data[0].Name;
          objUserModel.Role_Id = data.Data[0].Role_Id;
          objUserModel.Token = data.Data[0].Token;
          objUserModel.UATActive = data.Data[0].UATActive;
          this.cookieService.set('UserCookies', JSON.stringify(objlogin));
          sessionStorage.setItem("UserSession", JSON.stringify(objUserModel));
          this.modalService.open(this.modalContent, { size: <any>'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });

          this.loading = false;
          var objdropdownmodel = new DropdownModel();
          objdropdownmodel.User_Id = this.User_Id;
          objdropdownmodel.Other_Id = "0";
          objdropdownmodel.Parent_Id = "0";
          objdropdownmodel.Company_Id = 0;
          objdropdownmodel.Flag = 'company';
          this._CommonServices.getdropdown(objdropdownmodel).subscribe(Com => {
            this.CompanyId = 0;
            this.CompanyData = Com.Data;
          });
        } else {
          alert("Invalid UserName or Password.")
          this.submitted = false;
          this.loading = false;
        }
      });
    }

  }

  getIPAddress() {
    this.httpclient.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  CompanyPopupClick(CompanyId: number) {
    if (this.ValiadtionCompany() == 0) {
      this.getDismissReason('Cross click');
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

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  OpenPopupForgetPass(content) {
    this.modalService.open(content, { size: <any>'sm', ariaLabelledBy: 'modal-basic-title', }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  SaveForget(value: any) {
    if (this.ValiadtionEmail(value) == 1) {
      return false
    }
    var objUserModel = new UserModel();
    objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    var objChangePasswordModel = new ChangePasswordModel();
    objChangePasswordModel.NewPassword = value;
    this._Commonservices.ForgetPassword(objChangePasswordModel).subscribe(data => {
      if (data.Status == 1 && data.Data != null) {
        this.EmailId="";
        this.modalService.dismissAll();
        alert("Password has been sent on your mail.");
      } else if (data.Status == 1 && data.Data == null) {
        this.modalService.dismissAll();
        alert("This email id not found in our record pls get updated Email id first in employee master then try again!")
      } else if (data.Status == 3) {
        alert(data.Remarks);
      }
    });



  }

  ValiadtionCompany() {
    var flag = 0;
    if ($('#txtSelectCompanyId').val() == "0" || $('#txtSelectCompanyId').val() == undefined) {
      $('#txtSelectCompanyId').css('border-color', 'red');
      $('#txtSelectCompanyId').focus();
      flag = 1;
    } else {
      $("#txtSelectCompanyId").css('border-color', '');
    }
    return flag;
  }

  ValiadtionEmail(value: any) {
    var flag = 0;
    if (value == "") {
      $('#txtEmailId').css('border-color', 'red');
      $('#txtEmailId').focus();
      flag = 1;
    } else {
      var emaiformat = this.CheckEmail(value);
      if (emaiformat == false) {
        alert('Please enter valid Email');
        return false;
      } else {
        $("#txtEmailId").css('border-color', '');
      }
    }
    return flag;
  }

  CheckEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
      return false;
    } else {
      return true;
    }
  }
  ChangeCompany() {
    $("#txtSelectCompanyId").css('border-color', '');
  }
}
