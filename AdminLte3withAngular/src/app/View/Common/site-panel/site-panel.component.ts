import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { SiteServiceService } from 'src/app/Service/site-service.service';
import { CommonSiteSearchPanelModel, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { CompanyModel } from 'src/app/_Model/userModel';

@Component({
  selector: 'app-site-panel',
  templateUrl: './site-panel.component.html',
  styleUrls: ['./site-panel.component.sass']
})
export class SitePanelComponent implements OnInit {
  model: any = {};
  keyword = 'SiteName';
  AutoCompleteSiteCustomerList = [];
  CustomerSitekeyword = 'CustomerSiteId';
  AutoCompleteCustomerSiteIdList = [];
  UniqueSitekeyword = 'SiteId';
  AutoCompleteUniqueSiteIdList = [];
  AutoCompleteOldSiteIdList = []; //vishal, 20/03/2023
  CompanyId: any;
  UserId: any;
  SearchSiteId: any;
  TransferDataList: any;
  objCommonSiteSearchPanelModel:CommonSiteSearchPanelModel={
    SiteId:0, PageFlag:'0', Site_Id:0

  }
  constructor(private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService, private _Commonservices: CommonService,
    private _GrncrnService: GrncrnService, private _SiteServiceService: SiteServiceService, private _MaterialMovementService: MaterialMovementService,) { }

  ngOnInit(): void {
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.model.DispatchTo = "0";
    this.GettAllVechTransModeTransfertypeDispatch();
  }


  GettAllVechTransModeTransfertypeDispatch() {
    try {
      this._MaterialMovementService.GetVechileTypeAndTransPortMode().pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.TransferData != null && data.TransferData != "") {
            this.TransferDataList = data.TransferData;
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "GettAllVechTransModeTransfertypeDispatch", "SitePanel");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "GettAllVechTransModeTransfertypeDispatch", "SitePanel");
    }
  }

  onChangeSearchCustomerSiteId(val: string) {
    try {
      this.ClearedCustomerSiteId(2);
      let objSiteCustomerAutoModel = new SiteCustomerAutoModel();
      objSiteCustomerAutoModel.SCNo = val;
      objSiteCustomerAutoModel.CompanyId = this.CompanyId;
      objSiteCustomerAutoModel.flag = "CustomerSiteId";
      objSiteCustomerAutoModel.StateId = this.model.ddlStateId;
      this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
        this.AutoCompleteCustomerSiteIdList = data.Data;
      })
    }
    catch (Error) {
      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "onChangeSearchCustomerSiteId";
      objWebErrorLogModel.ErrorPage = "SitePanel";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  onFocused(e) {
  }
  onChangeSearchUniqueSiteId(val: string) {
    try {
      this.ClearedCustomerSiteId(1);
      let objSiteCustomerAutoModel = new SiteCustomerAutoModel();
      objSiteCustomerAutoModel.SCNo = val;
      objSiteCustomerAutoModel.CompanyId = this.CompanyId;
      objSiteCustomerAutoModel.flag = "UniqueSiteId";
      objSiteCustomerAutoModel.StateId = this.model.ddlStateId;
      this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
        if (data.Data != "") {
          this.AutoCompleteUniqueSiteIdList = data.Data;
        }
      })
    } catch (Error) {
      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "onChangeSearchUniqueSiteId";
      objWebErrorLogModel.ErrorPage = "SitePanel";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  SelectCustomerSiteId(items) {
    this.model.CuValueSiteId = items.CustomerSiteId;
    this.model.SiteName = items.SiteName;
    this.model.SiteId = items.Id;
    this.objCommonSiteSearchPanelModel.SiteId = items.Id;
    this._SiteServiceService.SearchSitesChanges(this.objCommonSiteSearchPanelModel);
    this.model.CuUniqueSiteId = items.Id;
   
  }

  ClearedCustomerSiteId(val: any) {
    this.AutoCompleteCustomerSiteIdList = [];
    this.AutoCompleteUniqueSiteIdList = [];
    this.AutoCompleteOldSiteIdList = [];
    this.model.CustomerSiteName = "";
    if (val == 1) {
      this.model.CuValueSiteId = "";
    } else if (val == 2) {
      this.model.CuUniqueSiteId = "";
    } else if(val == 3) {
      this.model.oldCuValueSiteId = "";
    }
     else {
      this.model.CuValueSiteId = "";
      this.model.CuUniqueSiteId = "";
      this.model.oldCuValueSiteId = "";
    }
    this.model.SiteId = 0;
    this.model.SiteName = "";
    this.SearchSiteId = 0;
    this._SiteServiceService.SearchSitesChanges(this.SearchSiteId);
  }


  SelectSiteName(item) {
    this.model.SiteAddress = item.Address
    this.objCommonSiteSearchPanelModel.SiteId = item.Id;
    this._SiteServiceService.SearchSitesChanges(this.objCommonSiteSearchPanelModel);
    this.model.CustomerSiteId = item.CustomerSiteId;
  }
  ChangeDispatchTo(PageFlag: any) {
    this.objCommonSiteSearchPanelModel.PageFlag=PageFlag;
    this._SiteServiceService.SearchSitesChanges(this.objCommonSiteSearchPanelModel);
  }


  //By:vishal, 20-01-2023, Desc: Function used for autosearch original customer site Id
  onChangeSearchOldCustomerSiteId(val: string) {
    try {
  
      this.ClearedCustomerSiteId(3);
      let objSiteCustomerAutoModel = new SiteCustomerAutoModel();
      objSiteCustomerAutoModel.SCNo = val;
      objSiteCustomerAutoModel.CompanyId = this.CompanyId;
      objSiteCustomerAutoModel.flag = "OriginalSiteId";
      objSiteCustomerAutoModel.StateId = this.model.ddlStateId;
      this._GrncrnService.GetAutoCompleteOldSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
        if (data.Data != "") {
          this.AutoCompleteOldSiteIdList = data.Data;
        }
      })
    } catch (Error) {
      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "onChangeSearchOldCustomerSiteId";
      objWebErrorLogModel.ErrorPage = "SitePanel";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  SelectOldCustomerSiteId(items) {
    this.objCommonSiteSearchPanelModel.Site_Id = items.Id;
    this._SiteServiceService.SearchSitesChanges(this.objCommonSiteSearchPanelModel);
    this.model.oldCuValueSiteId = items.Id;
    this.model.CuUniqueSiteId = items.Site_Id;
    
    
    
  }
//end-vishal
}
