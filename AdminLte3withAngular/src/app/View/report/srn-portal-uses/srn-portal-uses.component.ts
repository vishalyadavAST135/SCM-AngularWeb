import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CIpercentagerendererComponent } from 'src/app/renderer/cipercentagerenderer/cipercentagerenderer.component';
import { CirpercentagerendererComponent } from 'src/app/renderer/cirpercentagerenderer/cirpercentagerenderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { HopercentagerendererComponent } from 'src/app/renderer/hopercentagerenderer/hopercentagerenderer.component';
import { PercentagerendererComponent } from 'src/app/renderer/percentagerenderer/percentagerenderer.component';
import { ScmrecpercentagerenderrerComponent } from 'src/app/renderer/scmrecpercentagerenderrer/scmrecpercentagerenderrer.component';
import { CommonService } from 'src/app/Service/common.service';
import { DispatchPdfServiceService } from 'src/app/Service/dispatch-pdf-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { StockserviceService } from 'src/app/Service/stockservice.service';
import { CompanyStateVendorItemModel, MenuName, UserRole } from 'src/app/_Model/commonModel';
import { SearchDispatchTrackerModel, SearchSRNUsesModel } from 'src/app/_Model/DispatchModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { first } from 'rxjs/operators';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-srn-portal-uses',
  templateUrl: './srn-portal-uses.component.html',
  styleUrls: ['./srn-portal-uses.component.sass'],
  providers: [DatePipe]
})
export class SrnPortalUsesComponent implements OnInit {
  rowData = [];
  tooltipShowDelay: any;
  frameworkComponents: any;
  Exportloading: boolean;
  model: any = {};
  CommonSearchPanelData: any;
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
  constructor(
    private router: Router, 
    private _Commonservices: CommonService,
    private _MaterialMovementService: MaterialMovementService,
    private _objSearchpanelService: SearchpanelService, 
    private Loader: NgxSpinnerService, 
    private _PurchaseOrderService: PurchaseOrderService,
    private datePipe: DatePipe, 
    private modalService: NgbModal, 
    private _DispatchPdfServiceService: DispatchPdfServiceService,
    private _StockserviceService: StockserviceService, 
    private _MasterService: MasterservicesService) { 
      this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent,
    }
    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
      console.log(this.CommonSearchPanelData);
    });
    }

  ngOnInit(): void {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == "4") {
      } else if (this.ArrayRoleId[i] == UserRole.DispatchCorrectionEntryRole) {
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
      { headerName: 'WH Name', field: 'WHName',  pinned: 'left', width: 110,resizable: true  },
      { headerName: 'Client', field: 'Client',  pinned: 'left', width: 120, resizable: true  },
      { headerName: 'No Of SRN', field: 'SRNQty',  pinned: 'left', width: 120, resizable: true },
      { headerName: 'SCM Received Qty', field: 'RecSRN', width: 150, resizable: true },      
      { headerName: 'Pending Qty', field: 'PendingSRN', width: 150, resizable: true },      
      { headerName: 'Sameday Received Qty', field: 'SameDaySRN', width: 150,resizable: true},
      { headerName: '7day Received Qty', field: 'WithInWeekSRN', width: 150, resizable: true },
      { headerName: '10days Received Qty', field: 'TenDaySRN', width: 150, resizable: true },
      { headerName: 'Above 10days Received Qty', field: 'Above10DaySRN', width: 150, resizable: true }      
    ];

    this.multiSortKey = 'ctrl';
    this.BindCompanyStateVendorItem();
     //brahamjot kaur 31/10/2022
     this.GetUserPageRight();
    }
  
    //brahamjot kaur 31/10/2022
    async GetUserPageRight() {
      this._Commonservices.GetUserPageRight(this.UserId, MenuName.SRNPortalUsage).subscribe(data => {
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
    console.log(this.apiCSVIData);
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

  SearchSRNUsesReportList(para: string) {
    this.gridApi.showLoadingOverlay();
    try {
      var objpara = new SearchSRNUsesModel();
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
      
      this._MaterialMovementService.SearchSRNUsesReport(objpara).pipe(first()).subscribe(data => {
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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'SRNPoratUses' + CurrentDate);
            } else {
              alert('No Data Available');
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction('', error.message, "SearchSRNUsesReportList", "SRNUsages");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction('', Error.message, "SearchSRNUsesReportList", "SRNUsages");
    }
  }
}
