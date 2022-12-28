import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApprovalButtonRendererComponent } from 'src/app/renderer/approvalbutton.component';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { CommonpdfService } from 'src/app/Service/commonpdf.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { SiteServiceService } from 'src/app/Service/site-service.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { ApprovelStatusModel, CompanyStateVendorItemModel, DropdownModel, MRNOAutoModel } from 'src/app/_Model/commonModel';
import { SearchMaterialRequisitionModel } from 'src/app/_Model/DispatchModel';
import { VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
declare var jQuery: any;

@Component({
  selector: 'app-approval-status-report',
  templateUrl: './approval-status-report.component.html',
  styleUrls: ['./approval-status-report.component.sass'],
  providers: [DatePipe],
})
export class ApprovalStatusReportComponent implements OnInit {
  public isShownPOList: boolean; // 
  public isShownPOEdit: boolean; // 
  public columnDefs = [];  //grid column
  public rowData = [];  //  grid data
  public multiSortKey: string; //grid multy sort key
  CommonSearchPanelData: any;
  tooltipShowDelay: any;
  gridApi: any;
  gridColumnApi: any;
  public loadingTemplate;
  SearchSitesPanelData: any;
  loading: boolean = false
  UserId: any;
  CompanyId: any;
  UserName: any;
  model: any = {};
  ReasonDataList: any;
  ApprovalStatusDetail: any;
  frameworkComponents: any;
  TabSearchData: any;
  SCMPendingCount: number;
  SCMApprovedCount: number;
  SCMRejectCount: number;
  ArrayRoleId: any;
  UserRoleId: any;
  IsApprovalTab: boolean = false;
  apiCSVIData: any = {};
  SearchStateList: any;
  SearchItemNameList: any;
  MultidropdownSettings: {
    singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean;
    // limitSelection:1
    badgeShowLimit: number;
  };
  SelectedSearchStateList: any[];
  SearchItemClassList: any;
  SelectedItemClassList: any[];
  SelectedSearchItemNameList: any[];
  SearchItemCapacityList: any;
  SelectedSearchItemCapacityList: any[];
  keyword = 'Text';
  AutoCompleteMRNOList = [];
  SearchData: any;

  constructor(private datePipe: DatePipe, private router: Router, private _objSearchpanelService: TimePeriodService,
    private _Commonservices: CommonService, private _SiteServiceService: SiteServiceService,
    private _PurchaseOrderService: PurchaseOrderService, private _MaterialService: MaterialMovementService,
    private _CommonpdfService: CommonpdfService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ApprovalButtonRendererComponent,
      PreviewbuttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent
    }
    this._SiteServiceService.SearchSitesPanelSubject.subscribe(data => {
      this.SearchSitesPanelData = data;
    });
    this._objSearchpanelService.SearchTimePeriodPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
  }

  ngOnInit(): void {
    var StateId = 0;
    this.isShownPOList = true;
    this.isShownPOEdit = false;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == "11") {
        this.UserRoleId = this.ArrayRoleId[i];
      }
    }
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.columnDefs = [
      {
        headerName: 'Approved  Rejected',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ApprovedClick.bind(this),
          onRejectClick: this.RejectedClick.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 100,
        filter: false
      },
      {
        headerName: 'Preview',
        // component: 'fileRenderer',
        cellRendererSelector: function (params) {
          var ShowFile = {
            component: 'fileRenderer'
          };
          var HideFile = {
            component: ''
          };
          if (params.data.RequestId == null || params.data.RequestId == '') {
            return HideFile
          }
          else {
            return ShowFile;
          }
        },
        cellRendererParams: {
          onClick: this.ShowMRPdfPreviewDetail.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 100,
        filter: false
      },
      {
        headerName: 'Status (L1)',
        cellRendererFramework: ApprovalrendererComponent,
        pinned: 'left',
        width: 110,
        filter: false,
        resizable: true,
        field: 'RequestId',
        tooltipField: 'RequestId', tooltipComponent: 'approvalTooltip',
      },
      { headerName: 'Site Id', field: 'SiteId', pinned: 'left', width: 110, resizable: true, filter: false, },
      { headerName: 'Site Name', field: 'SiteName', width: 130, pinned: 'left', resizable: true, filter: false },
      { headerName: 'State Name', field: 'StateName', width: 130, pinned: 'left', resizable: true, filter: false },
      { headerName: 'MR No', field: 'MaterialRequestNo', width: 100, filter: false, resizable: true },
      { headerName: 'Request Date', field: 'MaterialRequestDate', width: 100, filter: false, resizable: true },
      { headerName: 'Request By', field: 'MaterialRequestBy', width: 100, filter: false, resizable: true },
      { headerName: 'Purpose Of Request', field: 'RequestPurpose', width: 110, filter: false, resizable: true },
      { headerName: 'Type Of Replacement', field: 'ReplacementType', width: 120, filter: false, resizable: true },
      { headerName: 'Item Name', field: 'ItemName', width: 150, filter: false, resizable: true },
      {
        headerName: 'Item Description', field: 'CapacityName', cellClass: "cell-wrap-text",
        tooltipField: 'CapacityName', tooltipComponent: 'customtooltip', width: 150, resizable: true
      },
      { headerName: 'Item Specs', field: 'ItemSpecs', width: 130, filter: false, resizable: true },
      { headerName: 'TTNO', field: 'TTNo', width: 130, filter: false, resizable: true },
      { headerName: 'HO Approval No', field: 'HOApprovalNo', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approval No', field: 'SMARTApprovalNo', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approval Status', field: 'SMARTApprovalStatus', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approval Date', field: 'SMARTApprovalDate', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approver', field: 'SMARTApprover', width: 130, filter: false, resizable: true },
      { headerName: 'Dispatched Status', field: 'DispatchStatus', width: 130, filter: false, resizable: true },
      { headerName: 'Dispatched Date', field: 'DispatchStatusDate', width: 130, filter: false, resizable: true },
      { headerName: 'TAT (MR approved- WH dispatch)', field: 'TAT', width: 130, filter: false, resizable: true },
      { headerName: 'Circle', field: 'CircleName', width: 130, filter: false, resizable: true },
      { headerName: 'Customer', field: 'Customer', width: 130, filter: false, resizable: true },
    ];
    this.multiSortKey = 'ctrl';
    this.loadingTemplate = `<span class="ag-overlay-loading-center">loading...</span>`;

    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = '0';
    objVendormodel.flag = '1460';
    this.model.ApprovalStatus = "0";
    this.model.ApprovalReason = "0";
    this._Commonservices.GettApprovalStatusAndReasondropdown(objVendormodel).subscribe(st1 => {
      if (st1.Status == 1 && st1.ReasonData != null) {
        this.ReasonDataList = st1.ReasonData;
      }
      if (st1.Status == 1 && st1.ApprovalStatusData != null) {
        this.ApprovalStatusDetail = st1.ApprovalStatusData;
      }
    });

    this.BindCompanyStateVendorItem();
  }


  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.VendorArray = this.apiCSVIData.VendorArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      objCSVTdata.WHId = this.apiCSVIData.WHId;
      objCSVTdata.ItemClassArray = this.apiCSVIData.ItemClassArray;
      this.SearchStateList = objCSVTdata.StateArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.SearchItemClassList = objCSVTdata.ItemClassArray;
    }

    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.rowData;
  }

  BindSearchWHList(para: string) {
    this.model.StateId = '';
    if (para == "DelAll") {
      this.SelectedSearchStateList = [];
    } else if (this.SelectedSearchStateList.length > 0) {
      this.model.StateId = this.SelectedSearchStateList.map(xx => xx.id).join(',');
    }

  }

  // BindSearchItemName(para: string) {
  //   this.SearchItemNameList = [];
  //   if (para == "DelAll") {
  //     this.SelectedItemClassList = [];
  //   } else if (this.SelectedItemClassList.length > 0) {
  //     var ItemClassId = this.SelectedItemClassList.map(xx => xx.id).join(',');
  //     var objdropdownmodel = new DropdownModel();
  //     objdropdownmodel.User_Id = 0;
  //     objdropdownmodel.Parent_Id = ItemClassId;
  //     objdropdownmodel.Other_Id = "0";
  //     objdropdownmodel.Company_Id = this.CompanyId;
  //     objdropdownmodel.Flag = 'ItemName';
  //     this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
  //       this.SearchItemNameList = item.Data;
  //     });
  //   }
  //   //this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  // }

  BindSearchItemMake(para: string) {
    this.model.ItemId = '';
    if (para == "DelAll") {
      this.SelectedSearchItemNameList = [];
    } else if (this.SelectedSearchItemNameList.length > 0) {
      this.model.ItemId = this.SelectedSearchItemNameList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.model.ItemId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemDescription';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemCapacityList = item.Data;
      });
    }

  }

  onClickCapacity(para: string) {
    this.model.CapacityId = '';
    if (para == "DelAll") {
      this.SelectedSearchItemCapacityList = [];
    } else if (this.SelectedSearchItemCapacityList.length > 0) {
      this.model.CapacityId = this.SelectedSearchItemCapacityList.map(xx => xx.id).join(',');;
    }

  }
  onFocused(e) {
  }

  onChangeMRNOId(val: string) {
    try {
      var objMRNOAutoModel = new MRNOAutoModel();
      objMRNOAutoModel.Ids = 0;

      objMRNOAutoModel.flag = val;
      if (this.CompanyId = 4) {
        objMRNOAutoModel.Type = 1;
      } else {
        objMRNOAutoModel.Type = 2;
      }
      this._Commonservices.GetAutoCompleteMRNO(objMRNOAutoModel).subscribe((data) => {
        if (data.Data != "") {
          this.AutoCompleteMRNOList = data.Data;
        }
      })
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAutoCompleteMRNO", "ApprovalStatus");
    }
  }

  SelectMRNO(items) {
    this.model.MRId = items.Id;
  }

  ClearedMRNO() {
    this.AutoCompleteMRNOList = [];
    this.model.MRId = "";
  }

  SearchApprovalMRStatus(para: string) {
    try {
      this.gridApi.showLoadingOverlay();
      var objSearchMaterialRequisitionModel = new SearchMaterialRequisitionModel();
      objSearchMaterialRequisitionModel.UserId = this.UserId;
      objSearchMaterialRequisitionModel.Company_Id = this.CompanyId;
      if (this._Commonservices.checkUndefined(this.SearchSitesPanelData) == '') {
        objSearchMaterialRequisitionModel.Site_Id = 0;
      } else {
        objSearchMaterialRequisitionModel.Site_Id = this.SearchSitesPanelData.SiteId;
      }
      objSearchMaterialRequisitionModel.Startdate = this.CommonSearchPanelData.Startdate;
      objSearchMaterialRequisitionModel.Enddate = this.CommonSearchPanelData.Enddate;
      if (this._Commonservices.checkUndefined(this.model.StateId) == '') {
        objSearchMaterialRequisitionModel.State_Id = '0';
      } else {
        objSearchMaterialRequisitionModel.State_Id = this.model.StateId;
      }
      if (this._Commonservices.checkUndefined(this.model.ItemId) == '') {
        objSearchMaterialRequisitionModel.Item_Id = '0';
      } else {
        objSearchMaterialRequisitionModel.Item_Id = this.model.ItemId;
      }
      if (this._Commonservices.checkUndefined(this.model.CapacityId) == '') {
        objSearchMaterialRequisitionModel.CapacityId_Id = '0';
      } else {
        objSearchMaterialRequisitionModel.CapacityId_Id = this.model.CapacityId;
      }
      if (this._Commonservices.checkUndefined(this.model.MRId) == '') {
        objSearchMaterialRequisitionModel.MRNNo = '0';
      } else {
        objSearchMaterialRequisitionModel.MRNNo = this.model.MRId;
      }
      objSearchMaterialRequisitionModel.Flag = para;
      this._MaterialService.GetAllApprovalMRStatusList(objSearchMaterialRequisitionModel).subscribe(data => {
        this.gridApi.hideOverlay();
        if (data.Status == 1) {
          if (para == "LIST") {
            this.IsApprovalTab = true;
            this.SCMPendingCount = 0;
            this.SCMApprovedCount = 0;
            this.SCMRejectCount = 0;
            if (data.Data != null) {
              //this.rowData = data.Data;
              this.SearchData = data.Data;
              const filterValue = null;
              const Pending = this.SearchData.filter(element => {
                return element.SCMApprovalStatusId === filterValue;
              });
              this.SCMPendingCount = Pending.length;
              this.rowData = Pending;

              const SCMApprove = this.SearchData.filter(element => {
                return element.SCMApprovalStatusId === 1458;
              });
              this.SCMApprovedCount = SCMApprove.length;

              const SCMReject = this.SearchData.filter(element => {
                return element.SCMApprovalStatusId === 1459;
              });
              this.SCMRejectCount = SCMReject.length;

            } else {
              this.SearchData = null;
              this.rowData=null;
            }
          }
          else if (para == "Export") {
            if (data.Data != null) {
              var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'MaterialRequisition' + CurrentDate);
            } else {
              alert('try again');
            }
          }
        }
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchApprovalMRStatusList", "ApprovalStatus");
    }
  }




  SearchTabTypeData(Id: any) {
    if (Id == null) {
      var FilterTabGridData = this.SearchData.filter(
        m => m.SCMApprovalStatusId === null);
      this.rowData = FilterTabGridData;
    } else if (Id == 1458) {
      var FilterTabGridData = this.SearchData.filter(
        m => m.SCMApprovalStatusId === parseInt(Id));
      this.rowData = FilterTabGridData;
    } else if (Id == 1459) {
      var FilterTabGridData = this.SearchData.filter(
        m => m.SCMApprovalStatusId === parseInt(Id));
      this.rowData = FilterTabGridData;
    }
  }


  ShowMRPdfPreviewDetail(e) {
    this.model.MRRequestId = e.rowData.RequestId;
    try {
      this._CommonpdfService.GenRateMRPdfByMRNo(e.rowData.RequestId)
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ShowMRPdfPreviewDetail", "Approvalstatus");
    }
  }
  ApprovedClick(e) {
    this.model.MRRequestId = e.rowData.RequestId;
    jQuery('#Approveconfirm').modal('show');
  }

  RejectedClick(e) {
    this.model.MRRequestId = e.rowData.RequestId;
    jQuery('#confirm').modal('show');
  }

  SaveApprovalStatus(ApprovalStatusId: any) {
    try {
      if (ApprovalStatusId == 1459) {
        if (this.ValidationApprovalStatus() == 1) {
          return false;
        }
      }
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.Menu_Id = 26;
      objApprovelStatusModel.Table_Id = this.model.MRRequestId;
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = ApprovalStatusId;
      objApprovelStatusModel.Reason_Id = this.model.ApprovalReason;
      objApprovelStatusModel.Remarks = this.model.Remarks;
      objApprovelStatusModel.CompanyId = this.CompanyId;
      this._Commonservices.SaveApprovalStatusHistory(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#Approveconfirm').modal('hide');
          jQuery('#confirm').modal('hide');
          setTimeout(() => {
            alert('Approval Status SuccessFully Save')
          }, 300);
          this.ClearApprovalStatus();
        } else if (data.Status == 2) {
          jQuery('#Approveconfirm').modal('hide');
          jQuery('#confirm').modal('hide');
          setTimeout(() => {
            alert('Approval Status SuccessFully Update')
          }, 300);
        }
      });

    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SaveApprovalStatus", "ApprovalStatus");
    }
  }
  ClearApprovalStatus() {
    this.model.ApprovalStatus = "0";
    this.model.ApprovalReason = "0";
    this.model.Remarks = "";
  }

  ValidationApprovalStatus() {
    var flag = 0;
    if (this.model.ApprovalReason == "0") {
      $('#txtReason').css('border-color', 'red')
      $('#txtReason').focus();
      flag = 1;
    } else {
      $("#txtReason").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.model.Remarks) == "") {
      $('#txtRemarks').css('border-color', 'red')
      $('#txtRemarks').focus();
      flag = 1;
    } else {
      $("#txtRemarks").css('border-color', '')
    }
    return flag;
  }


  Reasonchange() {
    $("#txtReason").css('border-color', '')
  }
  KeypressRemarks() {
    $("#txtRemarks").css('border-color', '')
  }
}
