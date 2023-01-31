import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApprovalButtonRendererComponent } from 'src/app/renderer/approvalbutton.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { CommonService } from 'src/app/Service/common.service';
import { DispatchInstructionService } from 'src/app/Service/dispatch-instruction.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SiteServiceService } from 'src/app/Service/site-service.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { SearchMaterialAtSiteModel } from 'src/app/_Model/BOQRequestModel';
import { CompanyStateVendorItemModel, DropdownModel, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { CompanyModel } from 'src/app/_Model/userModel';

declare var jQuery: any;

@Component({
  selector: 'app-material-at-site',
  templateUrl: './material-at-site.component.html',
  styleUrls: ['./material-at-site.component.sass'],
  providers: [DatePipe],
})
export class MaterialAtSiteComponent implements OnInit {

  apiCSVIData: any = {};
  multiDropdownSettings: {
    singleSelection: boolean;
    text: string;
    selectAllText: string;
    unSelectAllText: string;
    enableSearchFilter: boolean;
    badgeShowLimit: number;
  };
  //model: any = {};
  userId: any;
  userName: any;
  companyId: any;

  SearchCircleList: any[] = [];
  SelectedCircleList: any[] = [];

  searchItemClassList: any[] = [];
  selectedItemClassList: any[] = [];

  searchItemNameList: any[] = [];
  selectedSearchItemNameList: any[] = [];

  searchItemCapacityList: any[] = [];
  selectedSearchItemCapacityList: any[] = [];

  //SiteId: any;

  timePeriodPanelData: any;
  searchSitesPanelData: any;


  gridApi: any;
  // gridColumnApi: any;
  public rowData = [];  //  grid data
  searchData: any;
  public loadingTemplate;
  loading: boolean = false;
  public columnDefs = [];  //grid column
  public multiSortKey: string; //grid multy sort key
  frameworkComponents: any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  tooltipShowDelay: any;
  objSearch: SearchMaterialAtSiteModel = new SearchMaterialAtSiteModel();

  excelData = [];
  ItemDataArr: any[] = [];
  obj: {};


  constructor(private _commonServices: CommonService, private router: Router,
    private _dispatchInstructionService: DispatchInstructionService,
    private _purchaseOrderService: PurchaseOrderService, private _siteServiceService: SiteServiceService,
    private _objSearchpanelService: TimePeriodService, private _Commonservices: CommonService,
    private datePipe: DatePipe, private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      EditRenderer: ButtonRendererComponent,
      buttonRenderer: ApprovalButtonRendererComponent,
      PreviewbuttonRenderer: ButtonRendererComponent,
      customtooltip: CustomTooltipComponent,
    }

    this._siteServiceService.SearchSitesPanelSubject.subscribe(data => {
      this.searchSitesPanelData = data;
    });
    this._objSearchpanelService.SearchTimePeriodPanelSubject.subscribe(data => {
      this.timePeriodPanelData = data;
    });
  }

  ngOnInit(): void {
    //this.objSearch.SRNStatus = 0;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.userId = objUserModel.User_Id;
    this.userName = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.companyId = objCompanyModel.Company_Id;

    this.multiDropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };
    this.BindCompanyStateVendorItem();
    this.bindGrid();

    this.objSearch.SRNStatus = 0;
  }

  bindGrid() {
    this.columnDefs = [
      { headerName: 'Circle Name', field: 'CircleName', width: 90, pinned: 'left', resizable: true, filter: false },
      { headerName: 'Site Name', field: 'SiteName', width: 90, pinned: 'left', resizable: true, filter: false },
      { headerName: 'Item Name', field: 'ItemName', width: 80, pinned: 'left', resizable: true, filter: false },
      { headerName: 'Make Name', field: 'MakeName', width: 80, filter: false, resizable: true },
      { headerName: 'Item Code', field: 'ItemCode', width: 80, filter: false, resizable: true },
      { headerName: 'Capacity Name', field: 'CapacityName', width: 100, filter: false, resizable: true },
      { headerName: 'Qty', field: 'Qty', width: 50, filter: false, resizable: true },
      { headerName: 'Item Description', field: 'ItemDescription', width: 150, filter: false, resizable: true },
      { headerName: 'Unit Name', field: 'UnitName', width: 60, filter: false, resizable: true },
      // { headerName: 'SRN Status', field: 'SRNStatus', width: 60, filter: false, resizable: true },
      { headerName: 'EqpType Name', field: 'EqpTypeName', width: 80, resizable: true },
      { headerName: 'Eqp Owner', field: 'EqpOwner', width: 60, filter: false, resizable: true },
      { headerName: 'Shift Site Name', field: 'ShiftSiteName', width: 70, resizable: true },
      { headerName: 'Remarks', field: 'Remarks', width: 70, resizable: true },

    ];
    this.multiSortKey = 'ctrl';
    this.loadingTemplate = `<span class="ag-overlay-loading-center">loading...</span>`;
  }



  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.companyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      this.SearchCircleList = this.apiCSVIData.CircleArray;
      this.searchItemClassList = this.apiCSVIData.ItemClassArray;

    }
  }

  onClickCircle(para: string) {
    this.objSearch.circleId = '';
    if (para == "DelAll") {
      this.SelectedCircleList = [];
    } else if (this.SelectedCircleList.length > 0) {
      this.objSearch.circleId = this.SelectedCircleList.map(xx => xx.id).join(',');;
    }
  }


  bindSearchItemName(para: string) {
    this.objSearch.ItemClass = '';
    this.searchItemNameList = [];
    this.selectedSearchItemNameList = [];
    this.searchItemCapacityList = [];
    this.selectedSearchItemCapacityList = [];
    if (para == "DelAll") {
      this.selectedItemClassList = [];
    } else if (this.selectedItemClassList.length > 0) {
      this.objSearch.ItemClass = this.selectedItemClassList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objSearch.ItemClass;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.companyId;
      objdropdownmodel.Flag = 'ItemName';
      this._commonServices.getdropdown(objdropdownmodel).subscribe(item => {
        this.searchItemNameList = item.Data;
      });
    }
  }

  bindSearchItemCapacity(para: string) {

    this.objSearch.Item_Id = '';
    if (para == "DelAll") {
      this.selectedSearchItemNameList = [];
    } else if (this.selectedSearchItemNameList.length > 0) {
      this.objSearch.Item_Id = this.selectedSearchItemNameList.map(xx => xx.id).join(',');
      var objDropdownModel = new DropdownModel();
      objDropdownModel.User_Id = 0;
      objDropdownModel.Parent_Id = this.objSearch.Item_Id;
      objDropdownModel.Other_Id = "0";
      objDropdownModel.Company_Id = this.companyId;
      objDropdownModel.Flag = 'CommonSearchCapacity';
      this._commonServices.getdropdown(objDropdownModel).subscribe(item => {
        this.searchItemCapacityList = item.Data;
      });
    }
  }

  onClickCapacity(para: string) {

    this.objSearch.CapacityId = '';
    if (para == "DelAll") {
      this.selectedSearchItemCapacityList = [];
    } else if (this.selectedSearchItemCapacityList.length > 0) {
      this.objSearch.CapacityId = this.selectedSearchItemCapacityList.map(xx => xx.id).join(',');;
    }
  }
 

  onGridReady(params) {
    this.gridApi = params.api;
  }

  searchMaterialAtSite(para: string) {
    this.excelData=[];
    try {
      this.gridApi.showLoadingOverlay();
      var objSearch = new SearchMaterialAtSiteModel();
      this.objSearch.UserId = this.userId;
      this.objSearch.CompanyId = this.companyId;

      if (this._commonServices.checkUndefined(this.searchSitesPanelData) == '') {
        this.objSearch.siteId = 0;
      } else {
        this.objSearch.siteId = this.searchSitesPanelData.SiteId;
      }

      this.objSearch.fromDate = this._commonServices.ConvertDateMMYY(this.timePeriodPanelData.Startdate);
      this.objSearch.toDate = this._commonServices.ConvertDateMMYY(this.timePeriodPanelData.Enddate);
      // this.objSearch.flag = para;

      this._dispatchInstructionService.GetMaterialAtSiteList(this.objSearch).subscribe(data => {

        // this.ItemDataArr = data.Data;
        // for (let i = 0; i < this.ItemDataArr.length; i++) {

        //   let obj = {};
        //   obj = {
        //     CircleName: this.ItemDataArr[i].CircleName,
        //     SiteName: this.ItemDataArr[i].SiteName,
        //     ItemName: this.ItemDataArr[i].ItemName,
        //     CapacityName: this.ItemDataArr[i].CapacityName,
        //     ItemDescription: this.ItemDataArr[i].ItemDescription,
        //     UnitName: this.ItemDataArr[i].UnitName,
        //     Qty: this.ItemDataArr[i].Qty,
        //     EqpTypeName: this.ItemDataArr[i].EqpTypeName,
        //     EqpOwner: this.ItemDataArr[i].EqpOwner,
        //     SRNStatus: this.ItemDataArr[i].SRNStatus,
        //   }
        //   this.excelData.push(obj);

        // }
        this.gridApi.hideOverlay();
        if (data.Status == 1) {
          debugger
          if (para == "LIST") {
            if (data.Data != null) {
              this.rowData = data.Data;

            } else {
              this.rowData = null;
            }
           
          } else if (para == "Export") {
          
            if (data.Data != null) {
              let obj = {};
              this.ItemDataArr = data.Data;
              
              for (let i = 0; i < this.ItemDataArr.length; i++) {
                obj = {
                  CircleName: this.ItemDataArr[i].CircleName,
                  SiteName: this.ItemDataArr[i].SiteName,
                  ItemName: this.ItemDataArr[i].ItemName,
                  CapacityName: this.ItemDataArr[i].CapacityName,
                  ItemDescription: this.ItemDataArr[i].ItemDescription,
                  UnitName: this.ItemDataArr[i].UnitName,
                  Qty: this.ItemDataArr[i].Qty,
                  EqpTypeName: this.ItemDataArr[i].EqpTypeName,
                  EqpOwner: this.ItemDataArr[i].EqpOwner,
                  SRNStatus: this.ItemDataArr[i].SRNStatus,
                }
                this.excelData.push(obj);
                
              }

              let CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._purchaseOrderService.exportAsExcelFile(this.excelData, 'searchMaterialAtSite' + CurrentDate);
            } else {
              alert('No Data Available');
            }
          }
        } else {
          this.rowData = null;
        }

      }
      );
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.userId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetMaterialAtSiteList";
      objWebErrorLogModel.ErrorPage = "MaterialAtSite";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }




}
