import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/Service/common.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { DropdownModel, MenuName } from 'src/app/_Model/commonModel';
import { SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import * as $ from 'jquery';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
declare var jQuery: any;
@Component({
  selector: 'app-material-reconciliation',
  templateUrl: './material-reconciliation.component.html',
  styleUrls: ['./material-reconciliation.component.sass']
})
export class MaterialReconciliationComponent implements OnInit {
  public Pdfurl: SafeResourceUrl;
  path1: string;
  model: any = {};
  StockSearchPanelData: any;
  TimeSearchPanelData: any;
  CompanyId: number;
  WHIds: string;
  ReconcileStatusData: any;
  ReplaceUrl: any[];
  FinancialYearData: any;
  UserId: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;


  constructor(private sanitizer: DomSanitizer, private _objStockSearchpanelService: SearchpanelService,
    private _objTimePeriodService: TimePeriodService, private _Commonservices: CommonService) {
    this._objStockSearchpanelService.StockSearchPanelSubject.subscribe(data => {
      this.StockSearchPanelData = data;
    });
    this._objTimePeriodService.SearchTimePeriodPanelSubject.subscribe(timedata => {
      this.TimeSearchPanelData = timedata;
    });
  }

  ngOnInit(): void {
    this.model.FinalStatusId = "";
    this.model.DatebySelection = '0';
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.ItemReason();
        //brahamjot kaur 31/10/2022
        this.GetUserPageRight();
      }
    
      //brahamjot kaur 31/10/2022
      async GetUserPageRight() {
        this._Commonservices.GetUserPageRight(this.UserId, MenuName.MaterialReconciliation).subscribe(data => {
          if (data.Status == 1) {
            console.log(data);
            this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
            this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
          }
        })
      }
    
  ItemReason() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "1469";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'Reconcile';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.ReconcileStatusData = item.Data
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "Materialreconcilliation", "Materialreconcilliation");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "Materialreconcilliation", "Materialreconcilliation");
    }
  }

  FinancialExport() {
    this.model.ddlFinancialYears = "0";
    jQuery('#Fincialyear').modal('show');
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'FinancialYear';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.FinancialYearData = item.Data
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "FinancialExport", "Materialreconcilliation");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "FinancialExport", "Materialreconcilliation");
    }
  }


  DownloadAllFinancialExcelZip() {
    if (this.FinancialyearValidation() == 1) {
      return false;
    }
    var value;
    if (this.CompanyId == 4) {
      value = 'http://api.astnoc.com/scmimages/SCMExcel/Telecom/Reconcile' + this.model.ddlFinancialYears + '.xlsx';
    } else {
      value = 'http://api.astnoc.com/scmimages/SCMExcel/ATM/Reconcile' + this.model.ddlFinancialYears + '.xlsx';
    }
    var formdata = new FormData();
    formdata.append("SendDownloadFile", JSON.stringify(value));
    this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
      jQuery('#Fincialyear').modal('hide');
      var zip = new JSZip();
      var imgFolder = zip.folder("Reconcilefile");
      for (var i = 0; i < data.lstUrlDetail.length; i++) {
        const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
        imgFolder.file(this.GetFilename(data.lstUrlDetail[i].Url), byteArray, { base64: true });
      }
      zip.generateAsync({ type: "blob" })
        .then(function (content) {
          FileSaver.saveAs(content, "Reconcile.zip");
        });
    });

  }

  GetFilename(url) {
    var m = url.substring(url.lastIndexOf('/') + 1);
    this.ReplaceUrl = m.split('.');
    var R = 'Reconcile' + ('.') + this.ReplaceUrl[1];
    return R;
  }

  ChangeFinancialyear() {
    $("#txtFinancialYear").css('border-color', '');
  }
  
  FinancialyearValidation() {
    var flag = 0;
    if (this.model.ddlFinancialYears == "0" || this.model.ddlFinancialYears == null) {
      $('#txtFinancialYear').css('border-color', 'red');
      $('#txtFinancialYear').focus();
      flag = 1;
    } else {
      $("#txtFinancialYear").css('border-color', '');
    }
    return flag;
  }

  SearchReport() {
    this.WHIds = sessionStorage.getItem("WareHouseIdes");
    if (this.Validation() == 1) {
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
    objpara.ItemClassId = this.StockSearchPanelData.ItemClassId;
    objpara.ItemId = this.StockSearchPanelData.ItemId;
    objpara.MakeId = this.StockSearchPanelData.MakeId;
    objpara.ItemCodeId = this.StockSearchPanelData.ItemCodeId;
    objpara.CapacityId = this.StockSearchPanelData.CapacityId;
    objpara.Startdate = this.TimeSearchPanelData.Startdate;
    objpara.Enddate = this.TimeSearchPanelData.Enddate;
    objpara.PageFlag = this.model.DatebySelection;
    objpara.SiteId = '0';
    objpara.DispatchNo = this.model.DispatchNo;
    objpara.CircleId = '0';
    objpara.CustomerId = '0';
    objpara.FinalStatusId = this.model.FinalStatusId;
    let reportName = "MaterialInstallationReconcilationReportNew";
    this.path1 = "https://api.astnoc.com/SCMReports/MaterialReconcilationNew.aspx?reportName=" + reportName +
      "&CompanyId=" + objpara.CompanyId + "&StateId=" + objpara.State_Id + "&WHId=" + objpara.WHId +
      "&ItemClassId=" + objpara.ItemClassId + "&ItemId=" + objpara.ItemId + "&MakeId=" + objpara.MakeId +
      "&ItemCodeId=" + objpara.ItemCodeId + "&CapacityId=" + objpara.CapacityId + "&DateType=" + objpara.PageFlag +
      "&Startdate=" + objpara.Startdate + "&Enddate=" + objpara.Enddate + "&SiteId=" + objpara.SiteId +
      "&DispatchNo=" + objpara.DispatchNo + "&CircleId=" + objpara.CircleId +
      "&CustomerId=" + objpara.CustomerId + "&FinalStatus=" + objpara.FinalStatusId + "";;
    this.Pdfurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.path1);
  }

  Validation() {
    var flag = 0;
    if (this.model.DatebySelection == null || this.model.DatebySelection == "0") {
      flag = 1;
      alert('Please select any Date by Filter')
    } else if (this.TimeSearchPanelData.Startdate == null || this.TimeSearchPanelData.Startdate == "") {
      flag = 1;
      alert('StartDate Can not be blank');
    } else if (this.TimeSearchPanelData.Enddate == null || this.TimeSearchPanelData.Enddate == "") {
      flag = 1;
      alert('EndDate Can not be blank');
    }
    return flag;
  }
}
