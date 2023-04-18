import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IAgingModel } from 'src/app/_Model/AgingModel';
import { CommonService } from 'src/app/Service/common.service';
import { DatePipe } from '@angular/common';
import { CompanyModel } from 'src/app/_Model/userModel';
import { CompanyStateVendorItemModel, MenuName } from 'src/app/_Model/commonModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-agingreport',
  templateUrl: './agingreport.component.html',
  styleUrls: ['./agingreport.component.sass'],
  providers: [DatePipe]
})
export class AgingreportComponent implements OnInit {
  reportPath: string;
  public pdfUrl: SafeResourceUrl;

  searchModel: IAgingModel = {
    CompanyId: 0,
    ClientId: 0,
    Startdate: '',
    reportName: 'AgingReport',
    StartDateModel: undefined
  };
  UserId: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  apiCSVIData: any = {};
  ClientList: any[] = [];


  constructor(private sanitizer: DomSanitizer, private _Commonservices: CommonService,
    private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.searchModel.CompanyId = objCompanyModel.Company_Id;

    this.defaultDate();
    let SDate = this._Commonservices.checkUndefined(this.searchModel.StartDateModel);
    this.searchModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
    //brahamjot kaur 31/10/2022
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.GetUserPageRight();
    this.BindCompanyStateVendorItem();
  }

  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = this.searchModel.CompanyId;
    await this._Commonservices.getCompanyStateVendorItem(objCSVTdata).
      then(data => {
        if (data.Status == 1) {
          //this.ClientList = data.ClientArray;
          this.ClientList = data.ReportMasterArray;
          //console.log(this.ClientList);
        }
      });
  }


  //brahamjot kaur 31/10/2022
  async GetUserPageRight() {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.AgingReport).subscribe(data => {
      if (data.Status == 1) {
        //console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
      }
    })
  }

  StatDateInput(event: any) {
    let SDate = this._Commonservices.checkUndefined(this.searchModel.StartDateModel);
    this.searchModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
  }


  defaultDate() {
    var sfDate = new Date();
    var toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
    this.searchModel.StartDateModel = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
    let SDate = this._Commonservices.checkUndefined(this.searchModel.StartDateModel);
    this.searchModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
  }

  Validation() {
    var flag = 0;
    if (this.searchModel.ClientId == null || this.searchModel.ClientId == 0) {
      flag = 1;
    }
    if (this.searchModel.Startdate == null || this.searchModel.Startdate == '') {
      flag = 1;
    }
    return flag;
  }

  SearchReport() {
    if (this.Validation() == 1) {
      alert('Client / Date Can not be blank');
      return false;
    }
    this.reportPath = "https://api.astnoc.com/SCMReports/AgingReport.aspx?reportName=" + this.searchModel.reportName +
      "&Startdate=" + this.searchModel.Startdate + "&Client=" + this.searchModel.ClientId + "&CompanyId=" + this.searchModel.CompanyId;

    //if (this.searchModel.CompanyId == 4) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportPath);
    // } else {
    //   this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportPath);
    // }
  }
}
