import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/Service/common.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { MenuName } from 'src/app/_Model/commonModel';
import { SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-stockreport',
  templateUrl: './stockreport.component.html',
  styleUrls: ['./stockreport.component.sass']
})

export class StockreportComponent implements OnInit {
  public Pdfurl: SafeResourceUrl;
  path1: string;
  StockSearchPanelData: any;
  CompanyId: number;
  WHIds: string;
  UserId: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private sanitizer: DomSanitizer, private _objStockSearchpanelService: SearchpanelService,
    private _Commonservices: CommonService) {
    this._objStockSearchpanelService.StockSearchPanelSubject.subscribe(data => {
      this.StockSearchPanelData = data;
    });
    
  }

  ngOnInit(): void {
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    //  this.CompanyData=objCSVTdata.CompanyArray;
        //brahamjot kaur 31/10/2022
        this.GetUserPageRight();
      }
    
      //brahamjot kaur 31/10/2022
      async GetUserPageRight() {
        this._Commonservices.GetUserPageRight(this.UserId, MenuName.StockRegister).subscribe(data => {
          if (data.Status == 1) {
            console.log(data);
            this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
          }
        })
      }
    

  SearchReport() {
    this.WHIds = sessionStorage.getItem("WareHouseIdes");
    if (this.Validation() == 1) {
      alert('StartDate And EndDate Can not be blank');
      return false;
    }
    var objpara = new SearchDispatchTrackerModel();
    objpara.CompanyId = this.CompanyId;
    objpara.State_Id = this.StockSearchPanelData.State_Id;
    if (this.StockSearchPanelData.WHId != '') {
      objpara.WHId = this.StockSearchPanelData.WHId;
    } else {
      objpara.WHId = this.WHIds;
    }
    objpara.ClientId = this.StockSearchPanelData.ClientId;
    objpara.ItemClassId = this.StockSearchPanelData.ItemClassId;
    objpara.ItemId = this.StockSearchPanelData.ItemId;
    objpara.MakeId = this.StockSearchPanelData.MakeId;
    objpara.ItemCodeId = this.StockSearchPanelData.ItemCodeId;
    objpara.CapacityId = this.StockSearchPanelData.CapacityId;
    objpara.Startdate = this.StockSearchPanelData.Startdate;
    objpara.Enddate = this.StockSearchPanelData.Enddate;
    
    let reportName="";
    if(this.StockSearchPanelData.ReportTypeId=="1"){
      reportName="CircleWiseStockReport"
    }else if(this.StockSearchPanelData.ReportTypeId=="2"){
      reportName="CircleWiseRepairFaultyStockReport"
    }else if(this.StockSearchPanelData.ReportTypeId=="3"){
      reportName="CircleWiseClosingStock"
    }else if(this.StockSearchPanelData.ReportTypeId=="4"){
      reportName="PanIndiaStockReport"
    }else if(this.StockSearchPanelData.ReportTypeId=="5"){
      reportName="PanIndiaRepairFaultyStockReport"
    }else {
      reportName="PanIndiaClosingStock"
    }
    

    this.path1 = "https://api.astnoc.com/SCMReports/StockReport.aspx?reportName="+reportName+
    "&CompanyId=" + objpara.CompanyId +"&StateId=" + objpara.State_Id +"&WHId=" + objpara.WHId+
    "&ClientId="+objpara.ClientId+"&ItemClassId="+objpara.ItemClassId+"&ItemId="+objpara.ItemId+"&MakeId="+objpara.MakeId+
    "&ItemCodeId="+objpara.ItemCodeId+"&CapacityId="+objpara.CapacityId+
    "&Startdate="+objpara.Startdate+"&Enddate="+objpara.Enddate;
    this.Pdfurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.path1);
  }

  Validation() {
    var flag = 0;
    if (this.StockSearchPanelData.Startdate == null || this.StockSearchPanelData.Startdate == "") {
      flag = 1;
    }
    if (this.StockSearchPanelData.Enddate == null || this.StockSearchPanelData.Enddate == "") {
      flag = 1;
    }
    if (this.StockSearchPanelData.ClientId == null || this.StockSearchPanelData.ClientId == "") {
      flag = 1;
      alert('Please select any client')
    }
   
    return flag;
  }
}
