import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CommonService } from '../Service/common.service';
import { DashBoardService } from '../Service/dash-board.service';
import { DashBoardStockModel, DropdownModel } from '../_Model/commonModel';
import { CompanyModel } from '../_Model/userModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  StateDataDetail: any;
  CompanyDataDetail: any;
  CompanyFullName: string;
  UserId: any;
  UserName: any;
  CompanyId: number;
  model: any;
  TotalItemCount: any;
  TotalWHCount: any;
  TotalPoCount: any;
  TotalVendorCount: any;
 
  constructor(private _Commonservices: CommonService, private _DashBoardService: DashBoardService) { }
  ngOnInit(): void {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.dashBoardDetail();
  }

  AllCount() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = this.UserId;
      objdropdownmodel.Parent_Id = "0";
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'SameStateWHMaster';

      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(wh1 => {
        if (wh1.Status == 1) {
          if (wh1.Data != null && wh1.Data != "") {
            this.TotalVendorCount = wh1.Data[0].VendorCount;
            this.TotalWHCount = wh1.Data[0].WHCount;
            this.TotalPoCount = wh1.Data[0].TotalPoCount;
            // this.VendorCount = wh1.Data;
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHList", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEditWHList", "WHTOSite");
    }
  }

  dashBoardDetail() {
    try {

      let objPara = new DashBoardStockModel();
      objPara.CompanyId = this.CompanyId;
      this._DashBoardService.GetDashboardMasterdet(objPara).subscribe(data => {

        if (data.Status == 1) {
          if (data.Data != null && data.Data != "" && data.Data.length > 0) {
            this.TotalItemCount = data.Data[0].ItemCount;
            this.TotalWHCount = data.Data[0].WHCount;
            this.TotalPoCount = data.Data[0].POCount;
            this.TotalVendorCount = data.Data[0].VendorCount;
          }
        }
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "dashBoardDetail", "DashBoard");
    }

  }
}
