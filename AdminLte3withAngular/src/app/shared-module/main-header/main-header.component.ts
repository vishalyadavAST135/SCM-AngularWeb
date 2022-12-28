import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordModel, DropdownModel, CompanyStateVendorItemModel } from 'src/app/_Model/commonModel';
import { CommonService } from 'src/app/Service/common.service';
import { UserModel, CompanyModel } from 'src/app/_Model/userModel';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.sass']
})
export class MainHeaderComponent implements OnInit {
  closeResult: string;
  model: any;
  submitted = false;
  ChangePassform: FormGroup = new FormGroup({});
  CurrentPassword: string;
  CompanyData: any[];
  CompanyId: any;
  CompanyFilterData: any[];
  CompanyFullName: string;
  apiCSVIData: any = {};
  apiItemCodeAndDescriptionData: any = {};

  constructor(private router: Router, private modalService: NgbModal, private _CommonServices: CommonService, private _Commonservices: CommonService, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.ChangePassform = this.fb.group({
      CurrentPassword: ['', [Validators.required]],
      NewPassword: ['', [Validators.required]],
      ConfirmPassword: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('NewPassword', 'ConfirmPassword')
    })

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyFullName = objCompanyModel.FullName;
  }

  open(content) {
    this.modalService.open(content, { size: <any>'sm',ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {

      //this.ChangePassform.controls.NewPassword.value;
      return `with: ${reason}`;
    }
  }

  CompanyChange(content) {
    this.SelectCompanyPopup();
    this.modalService.open(content, { size: <any>'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  logoutclick() {
    var objUserModel = new UserModel();
    objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = parseInt(objUserModel.User_Id);
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = 0;
    objdropdownmodel.Flag = '';
    this._CommonServices.SaveUserLoginHistory(objdropdownmodel).subscribe(Com => {
    });
    sessionStorage.removeItem("UserSession");
    sessionStorage.removeItem("UserMenu");
    sessionStorage.removeItem("CompanyIdSession");
    sessionStorage.removeItem("CompStatVenItmSession");
    localStorage.removeItem('DIRequestId');
    this.router.navigate(['']);
    // this.CompanyFullName=null;
  }

  get f() {
    return this.ChangePassform.controls;
  }

  submit() {
    this.submitted = true;
    if (this.ChangePassform.invalid) {
      return false;
    } else if (this.ChangePassform.valid) {
      var objUserModel = new UserModel();
      objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
      var objChangePasswordModel = new ChangePasswordModel();
      objChangePasswordModel.UserId = objUserModel.User_Id;
      objChangePasswordModel.CurrentPassword = this.ChangePassform.controls.CurrentPassword.value;
      objChangePasswordModel.NewPassword = this.ChangePassform.controls.NewPassword.value;
      this._Commonservices.UserChangePassword(objChangePasswordModel).subscribe(data => {
        if (data.Status == 1) {
          alert("your password successfully change")
          setTimeout(() => {
            this.logoutclick();
            this.modalService.dismissAll();
          }, 500);
    
        } else if (data.Status == 0) {
          alert("your current password not match")
        }
      });
    }
  }

  SelectCompanyPopup() {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = 0;
    objdropdownmodel.Flag = 'company';
    this._CommonServices.getdropdown(objdropdownmodel).subscribe(Com => {
      this.CompanyId = 0;
      this.CompanyData = Com.Data;
    });
  }

  CompanyPopupClick(CompanyId: number) {
    if (this.ValiadtionCompany() == 0) {
      sessionStorage.removeItem("CompanyIdSession");
      this.getDismissReason('Cross click');
      this.CompanyId = CompanyId;
      this.BindCompanyStateVendorItem(CompanyId);
      this.CompanyFilterData = this.CompanyData.filter(
        m => m.Id === parseInt(this.CompanyId));
      var objCompanyModel = new CompanyModel();
      objCompanyModel.Company_Id = this.CompanyFilterData[0].Id;
      objCompanyModel.FullName = this.CompanyFilterData[0].fullName;
      objCompanyModel.Name = this.CompanyFilterData[0].Name;
      sessionStorage.setItem("CompanyIdSession", JSON.stringify(objCompanyModel));
      window.location.href = '/dashboard';
    }
  }

  // All page use for bind State Vendor,Item and EqpType
  BindCompanyStateVendorItem(CompanyId) {
    sessionStorage.removeItem("CompStatVenItmSession");
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(CompanyId);
    this.apiCSVIData = this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.VendorArray = this.apiCSVIData.VendorArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      objCSVTdata.WHId = this.apiCSVIData.WHId;
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
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

  ChangeCompanyvalidation() {
    $("#txtSelectCompanyId").css('border-color', '');
  }

}

export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

export interface NgbModalOptions {
  size?: 'sm' | 'lg' | 'xl';
}