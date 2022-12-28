import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import {  CompanyStateVendorItemModel,  MenuName,  UserRole } from 'src/app/_Model/commonModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { first } from 'rxjs/operators';
import { DispatchPdfServiceService } from 'src/app/Service/dispatch-pdf-service.service';
import { StockserviceService } from 'src/app/Service/stockservice.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { CIpercentagerendererComponent } from 'src/app/renderer/cipercentagerenderer/cipercentagerenderer.component';
import { HopercentagerendererComponent } from 'src/app/renderer/hopercentagerenderer/hopercentagerenderer.component';
import { PercentagerendererComponent } from 'src/app/renderer/percentagerenderer/percentagerenderer.component';
import { SetLeftFeature } from 'ag-grid-community';
import { CirpercentagerendererComponent } from 'src/app/renderer/cirpercentagerenderer/cirpercentagerenderer.component';
import { ScmrecpercentagerenderrerComponent } from 'src/app/renderer/scmrecpercentagerenderrer/scmrecpercentagerenderrer.component';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-dispatchreport',
  templateUrl: './dispatchreport.component.html',
  styleUrls: ['./dispatchreport.component.sass'],
  providers: [DatePipe]
})
export class DispatchreportComponent implements OnInit {
  rowData = [];
  tooltipShowDelay: any;
  frameworkComponents: any;
  CommonSearchPanelData: any;
  Exportloading: boolean;
  model: any = {};
  public loadingTemplate;
  public overlayNoRowsTemplate;
  public multiSortKey: string;
  public columnDefs = [];
  gridApi: any;
  WareHouseId: string;
  ArrayRoleId: any;
  UserId:any;
  CompanyId:any;
  apiCSVIData: any = {};
  ObjUserPageRight = new UserPageRight();
  Save: any;

  constructor(private router: Router, private _Commonservices: CommonService,
    private _MaterialMovementService: MaterialMovementService,
    private _objSearchpanelService: SearchpanelService, private Loader: NgxSpinnerService, private _PurchaseOrderService: PurchaseOrderService,
   
    private datePipe: DatePipe, private modalService: NgbModal, private _DispatchPdfServiceService: DispatchPdfServiceService,
    private _StockserviceService: StockserviceService, private _MasterService: MasterservicesService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent,
    }
    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
    // this._SiteServiceService.SearchSitesPanelSubject.subscribe(data => {
    //   this.SearchSitesPanelData = data;
    // });
  }

  ngOnInit(): void {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    //this.UserName = objUserModel.User_Id;
    //this.IsApprovalstatusbtnhideShow = false;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == "4") {
       // this.UserRoleId = this.ArrayRoleId[i];
      } else if (this.ArrayRoleId[i] == UserRole.DispatchCorrectionEntryRole) {
        //this.RoleCorrectionEntry = true;
      }
    }
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    this.columnDefs = [
      { headerName: 'State Name', field: 'Name',  pinned: 'left', width: 120,resizable: true  },
      { headerName: 'WH Name', field: 'Circle',  pinned: 'left', width: 110,resizable: true  },
      { headerName: 'Client', field: 'Client',  pinned: 'left', width: 120, resizable: true  },
      { headerName: 'No Of Dispatch', field: 'Dispatch',  pinned: 'left', width: 120, resizable: true },
      { headerName: 'Eqp Qty', field: 'EqpQty',  width: 80, resizable: true },
      { headerName: 'Dispatch To Site', field: 'SCMSiteQty',  width: 110, resizable: true },
      { headerName: 'Dispatch To Other', field: 'SCMOtherQty',  width: 110, resizable: true },
      { headerName: 'By Hand Qty', field: 'SCMByHandQty',  width: 100, resizable: true },
      
      { headerName: 'SCM Received Qty', field: 'SCMRecQty', width: 110, resizable: true },
      {
        headerName: 'SCM Received Qty (%)',
        cellRendererFramework: ScmrecpercentagerenderrerComponent,
        width: 110,
        filter: false,
        resizable: true,
      },
      { headerName: 'App Received Qty', field: 'AppRecQty', width: 110,resizable: true},
      { headerName: 'Install Qty', field: 'InstallQty', width: 100, resizable: true },
      // { headerName: 'Install (%)', field: 'Install', width: 90, resizable: true },
      {
        headerName: 'Install Qty (%)',
        cellRendererFramework: PercentagerendererComponent,
        width: 110,
        filter: false,
        resizable: true,
      },
      { headerName: 'Material Reconciliation', field: 'MatRecoQty', width: 130,resizable: true},
      { headerName: 'Material Not Reconciliation', field: 'MatNotRecoQty', width: 130,resizable: true},
      { headerName: 'CI Approved', field: 'CIApr', 
      width: 110, resizable: true },
     
      // { headerName: 'CIApr (%)', field: 'CIPen', width: 90, resizable: true },
      {
        headerName: 'CI Approved (%)',
        cellRendererFramework: CIpercentagerendererComponent,
        width: 110,
        filter: false,
        resizable: true,
      },
      { headerName: 'CI Rejected', field: 'CIRej', width: 110,resizable: true  },
      { headerName: 'Circle Approved', field: 'CirApr', width: 110,resizable: true  },
      {
        headerName: 'Circle Approved (%)',
        cellRendererFramework: CirpercentagerendererComponent,
        width: 110,
        filter: false,
        resizable: true,
      },
      { headerName: 'Circle Rejected', field: 'CirRej', width: 110,resizable: true  },
      { headerName: 'HO Approved', field: 'HOApr', width: 110,resizable: true  },
      {
        headerName: 'HO Approved (%)',
        cellRendererFramework: HopercentagerendererComponent,
        width: 110,
        filter: false,
        resizable: true,
      },
      
      { headerName: 'HO Rejected', field: 'HORej', width: 110,resizable: true  },
    ];

    this.multiSortKey = 'ctrl';
    this.BindCompanyStateVendorItem();
       //brahamjot kaur 31/10/2022
       this.GetUserPageRight();
     }
   
     //brahamjot kaur 31/10/2022
     async GetUserPageRight() {
       this._Commonservices.GetUserPageRight(this.UserId, MenuName.PortalUsage).subscribe(data => {
         if (data.Status == 1) {
           console.log(data);
           this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
           this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
         }
       })
     }

  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      this.WareHouseId = this.apiCSVIData.WHId;
    }
  }

  gridOptions = {
    animateRows: false,
    enableCellChangeFlash: false,
  };
  onGridReady(params) {
    this.gridApi = params.api;
  }

  SearchDispatchReportList(para: string) {
    this.gridApi.showLoadingOverlay();
    try {
      var objpara = new SearchDispatchTrackerModel();
      objpara.CompanyId = this.CompanyId;
      objpara.State_Id = this.CommonSearchPanelData.State_Id;
      if (this.CommonSearchPanelData.WHId != "") {
        objpara.WHId = this.CommonSearchPanelData.WHId;
      } else {
        if (this.WareHouseId == "0") {
          objpara.WHId = "";
        } else {
          objpara.WHId = this.WareHouseId;
        }
      }
      objpara.VendorId = this.CommonSearchPanelData.VendorId;
      objpara.ItemClassId = this.CommonSearchPanelData.ItemClassId;
      objpara.ItemId = this.CommonSearchPanelData.ItemId;
      objpara.MakeId = this.CommonSearchPanelData.MakeId;
      objpara.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objpara.CapacityId = this.CommonSearchPanelData.CapacityId;
      objpara.DescriptionId = this.CommonSearchPanelData.DescriptionId;
      objpara.Startdate = this.CommonSearchPanelData.Startdate;
      objpara.Enddate = this.CommonSearchPanelData.Enddate;
      if (this._Commonservices.checkUndefined(this.model.DispatchNo) == '') {
        objpara.DocumentNo = 0;
      } else {
        objpara.DocumentNo = this.model.DispatchNo;
      }
      objpara.Flag = para;
      if (para == "Export") {
        this.Exportloading = true;
        this.gridApi.hideOverlay();
      }
      //objpara.DispatchFor = this.model.DispatchFor;
      this._MaterialMovementService.SearchDispatchInstallApprovalReport(objpara).pipe(first()).subscribe(data => {
        this.gridApi.hideOverlay();
        this.Exportloading = false;;
        if (data.Status == 1) {
          if (para == "List") {
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null;
            }
          } else if (para == "Export") {
            if (data.Data != null) {
              var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'DispatchTracker' + CurrentDate);
            } else {
              alert('No Data Available');
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction('', error.message, "SearchDispatchTrackerList", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction('', Error.message, "SearchDispatchTrackerList", "WHTOSite");
    }
  }

}
