import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApprovalButtonRendererComponent } from 'src/app/renderer/approvalbutton.component';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CreateDispatchRendererComponent } from 'src/app/renderer/createdispatchbydirenderer';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { BOQRequestequestService } from 'src/app/Service/boqrequestequest.service';
import { CommonService } from 'src/app/Service/common.service';
import { CommonpdfService } from 'src/app/Service/commonpdf.service';
import { DispatchInstructionService } from 'src/app/Service/dispatch-instruction.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SiteServiceService } from 'src/app/Service/site-service.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { BOQModel, BOQNOListModel, SearchDIRequestModel } from 'src/app/_Model/BOQRequestModel';
import { ApprovelStatusModel, CompanyStateVendorItemModel, DropdownModel, JsonModel, MenuName, MRNOAutoModel, UserRole } from 'src/app/_Model/commonModel';
import { VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
declare var jQuery: any;

@Component({
  selector: 'app-dispatch-instruction',
  templateUrl: './dispatch-instruction.component.html',
  styleUrls: ['./dispatch-instruction.component.sass'],
  providers: [DatePipe],
})
export class DispatchInstructionComponent implements OnInit {
  public columnDefs = [];  //grid column
  public rowData = [];  //  grid data
  public multiSortKey: string; //grid multy sort key
  tooltipShowDelay: any;
  gridApi: any;
  gridColumnApi: any;
  public loadingTemplate;
  loading: boolean = false;
  frameworkComponents: any;
  userId: any;
  userName: any;
  companyId: any;
  model: any = {};
  reasonDataList: any;
  approvalStatusDetail: any;
  //TabSearchData: any;
  scmPendingCount: number;
  scmApprovedCount: number;
  scmRejectCount: number;
  arrayRoleId: any;
  userRoleId: any;
  isApprovalTab: boolean = false;
  apiCSVIData: any = {};
  multiDropdownSettings: {
    singleSelection: boolean;
    text: string;
    selectAllText: string;
    unSelectAllText: string;
    enableSearchFilter: boolean;
    badgeShowLimit: number;
  };

  searchStateList: any[] = [];
  selectedSearchStateList: any[] = [];
  //==add by Hemant 17/08/2022
  searchItemClassList: any[] = [];
  selectedItemClassList: any[] = [];
  //==========================
  searchItemNameList: any[] = [];
  selectedSearchItemNameList: any[] = [];
  searchItemCapacityList: any[] = [];
  selectedSearchItemCapacityList: any[] = [];

  searchSitesPanelData: any;
  timePeriodPanelData: any;
  keyword = 'Text';
  autoCompleteMRNOList = [];
  searchData: any;
  srnList = [];
  astSRNDoc: any;
  customerSRNDoc: any;
  @ViewChild('ASTSRNDoc') astSRNDocFile: ElementRef;
  @ViewChild('CustomerSRNDoc') customerSRNDocFile: ElementRef;
  isReqASTSRNDoc: boolean = true;
  isReqCustomerSRNDoc: boolean = true;
  isRecvSRNButton: boolean = true;
  isASTfileView: boolean = true;
  IsCustomerfileView: boolean = true;
  astFilePath: string = "";
  customerFilePath: string = "";
  public rowSelection: 'single' | 'multiple' = 'multiple';
  isApprovalEnable: boolean = true;
  isRejectEnable: boolean = true;

  requestedId: any;
  isUploadFileBtn: boolean;

  // created by hemant tyagi Add Project/O&M filter
  projectTypeList: any[] = [];

  //created by vishal yadav Add Dispatches Status filter
  DispatchedStatusList: any[] = [];
  dispatchedStatus: string;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private datePipe: DatePipe, private router: Router,
    private _objSearchpanelService: TimePeriodService,
    private _dispatchInstructionService: DispatchInstructionService,
    private _commonServices: CommonService,
    private _BOQService: BOQRequestequestService,
    private _siteServiceService: SiteServiceService,
    private _purchaseOrderService: PurchaseOrderService,
    private _MaterialService: MaterialMovementService,
    private _commonPdfService: CommonpdfService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      EditRenderer: ButtonRendererComponent,
      buttonRenderer: ApprovalButtonRendererComponent,
      PreviewbuttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      approvalTooltip: approvalTooltipComponent,
      CreateDispatchRenderer: CreateDispatchRendererComponent,
    }
    this._siteServiceService.SearchSitesPanelSubject.subscribe(data => {
      this.searchSitesPanelData = data;
    });
    this._objSearchpanelService.SearchTimePeriodPanelSubject.subscribe(data => {
      this.timePeriodPanelData = data;
    });
  }

  ngOnInit(): void {
    this.model.indentType = "0";
    this.model.dIType = "0";
    this.model.dIStatus = "0";
    this.model.dispatchedStatus= "1";

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.userId = objUserModel.User_Id;
    this.userName = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.companyId = objCompanyModel.Company_Id;
    this.bindGrid();
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = '0';
    objVendormodel.flag = '1460';
    this.model.ApprovalStatus = "0";
    this.model.ApprovalReason = "0";
    this._commonServices.GettApprovalStatusAndReasondropdown(objVendormodel).subscribe(st1 => {
      
      if (st1.Status == 1 && st1.ReasonData != null) {
        this.reasonDataList = st1.ReasonData;
      }
      if (st1.Status == 1 && st1.ApprovalStatusData != null) {
        this.approvalStatusDetail = st1.ApprovalStatusData;
      }
    });
    this.bindCompanyStateVendorItem();
     //brahamjot kaur 31/10/2022
     this.GetUserPageRight();
    }
  
    //brahamjot kaur 31/10/2022
    async GetUserPageRight() {
      this._commonServices.GetUserPageRight(this.userId, MenuName.DispatchInstruction).subscribe(data => {
        if (data.Status == 1) {
          console.log(data);
          this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
          this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
          this.ObjUserPageRight.IsApprove = data.Data[0].IsApprove;
          // this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
          // this.ObjUserPageRight.IsEdit = data.Data[0].IsEdit;
          // if(this.ObjUserPageRight.IsCreate == 1){
          //   this.Save = 1;
          // }else if(this.ObjUserPageRight.IsEdit == 1){
          //   this.Save = 1;
          // }else{
          //   this.Save = 0
          // }
        }
      })
    }

  bindGrid() {
    this.columnDefs = [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        pinned: 'left',
        width: 100,
        filter: false
      },
      {
        headerName: 'Approved  Rejected',
        cellRendererSelector: function (params) {
          var showFile = {
            component: 'buttonRenderer'
          };
          var hideFile = {
            component: ''
          };
          if (params.data.ApprovalRole == 0) {
            return hideFile
          }
          else {
            return showFile;
          }
        },
        cellRendererParams: {
          onClick: this.approvedClick.bind(this),
          onRejectClick: this.rejectedClick.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 100,
        filter: false
      },

      {
        headerName: 'Preview',
        cellRendererSelector: function (params) {
          var showFile = {
            component: 'fileRenderer'
          };
          var hideFile = {
            component: ''
          };
          if (params.data.RequestId == null || params.data.RequestId == '') {
            return hideFile
          }
          else {
            return showFile;
          }
        },
        cellRendererParams: {
          onClick: this.showMRPdfPreviewDetail.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 90,
        filter: false
      },

      {
        headerName: 'Dispatch',
        cellRendererSelector: function (params) {
          var showFile = {
            component: 'CreateDispatchRenderer'
          };
          var hideFile = {
            component: ''
          };
          if (params.data.SCMApprovalStatusId == null || params.data.SCMApprovalStatusId == '' || params.data.SCMApprovalStatusId != 1472) {
            return hideFile
          }
          else {
            return showFile;
          }
        },
        cellRendererParams: {
          onClick: this.createDispatch.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 90,
        filter: false
      },

      {
        headerName: 'ViewSRN',
        cellRendererSelector: function (params) {
          var showFile = {
            component: 'EditRenderer'
          };
          var hideFile = {
            component: ''
          };
          if (params.data.IsSRN == null || params.data.IsSRN == '0' || params.data.IsSRN == 0) {
            return hideFile
          }
          else {
            return showFile;
          }
        },
        cellRendererParams: {
          onClick: this.showSRNDetail.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 90,
        filter: false
      },

      {
        headerName: 'Status (L1|L2)',
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
      { headerName: 'DI No', field: 'DINo', width: 100, filter: false, resizable: true },
      { headerName: 'DI Date', field: 'DIDate', width: 100, filter: false, resizable: true },
      { headerName: 'DI By', field: 'DIBy', width: 100, filter: false, resizable: true },
      { headerName: 'MR Type', field: 'MRType', width: 150, filter: false, resizable: true },
      { headerName: 'Item Name', field: 'ItemName', width: 150, filter: false, resizable: true },
      {
        headerName: 'Capacity Name', field: 'CapacityName', cellClass: "cell-wrap-text",
        tooltipField: 'CapacityName', tooltipComponent: 'customtooltip', width: 150, resizable: true
      },
      { headerName: 'Item Qty', field: 'ItemQuantity', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approval No', field: 'SMARTApprovalNo', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approval Status', field: 'SMARTApprovalStatus', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approval Date', field: 'SMARTApprovalDate', width: 130, filter: false, resizable: true },
      { headerName: 'Smart Approver', field: 'SMARTApprover', width: 130, filter: false, resizable: true },
      { headerName: 'Dispatched Status', field: 'DispatchStatus', width: 130, filter: false, resizable: true },
      { headerName: 'Dispatched Date', field: 'DispatchStatusDate', width: 130, filter: false, resizable: true },
      { headerName: 'Circle', field: 'CircleName', width: 130, filter: false, resizable: true },
      { headerName: 'Customer', field: 'Customer', width: 130, filter: false, resizable: true },
      { headerName: 'Project Type', field: 'ProjectType', width: 150, filter: false, resizable: true },
      { headerName: 'SRNStatus', field: 'SRNStatus', width: 150, filter: false, resizable: true },
      { headerName: 'Billing To', field: 'BillingTo', width: 150, filter: false, resizable: true },
      { headerName: 'Expense Type', field: 'ExpenseType', width: 150, filter: false, resizable: true },
      { headerName: 'EMI Type', field: 'EMIType', width: 150, filter: false, resizable: true },
      { headerName: 'Recovery Type', field: 'RecoveryType', width: 150, filter: false, resizable: true },
    ];
    this.multiSortKey = 'ctrl';
    this.loadingTemplate = `<span class="ag-overlay-loading-center">loading...</span>`;
  }


  async bindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.companyId);
    this.apiCSVIData = await this._commonServices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      this.searchStateList = this.apiCSVIData.StateArray;
      this.searchItemClassList = this.apiCSVIData.ItemClassArray;
      this.projectTypeList = this.apiCSVIData.ProjectArray;
      this.DispatchedStatusList = this.apiCSVIData.DispatchedStatusArray; //By vishal yadav 14/09/2022
    
    }

    this.multiDropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.rowData;
  }

  bindSearchWHList(para: string) {
    this.model.StateId = '';
    if (para == "DelAll") {
      this.selectedSearchStateList = [];
    } else if (this.selectedSearchStateList.length > 0) {
      this.model.StateId = this.selectedSearchStateList.map(xx => xx.id).join(',');
    }
  }

  BindSearchItemName(para: string) {
    this.model.ItemClassId = '';
    this.searchItemNameList = [];
    this.selectedSearchItemNameList = [];
    this.searchItemCapacityList = [];
    this.selectedSearchItemCapacityList = [];
    if (para == "DelAll") {
      this.selectedItemClassList = [];
    } else if (this.selectedItemClassList.length > 0) {
      this.model.ItemClassId = this.selectedItemClassList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.model.ItemClassId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.companyId;
      objdropdownmodel.Flag = 'ItemName';
      this._commonServices.getdropdown(objdropdownmodel).subscribe(item => {
        this.searchItemNameList = item.Data;
      });
    }
  }

  bindSearchItemMake(para: string) {
    this.model.ItemId = '';
    if (para == "DelAll") {
      this.selectedSearchItemNameList = [];
    } else if (this.selectedSearchItemNameList.length > 0) {
      this.model.ItemId = this.selectedSearchItemNameList.map(xx => xx.id).join(',');
      var objDropdownModel = new DropdownModel();
      objDropdownModel.User_Id = 0;
      objDropdownModel.Parent_Id = this.model.ItemId;
      objDropdownModel.Other_Id = "0";
      objDropdownModel.Company_Id = this.companyId;
      objDropdownModel.Flag = 'ItemDescription';
      this._commonServices.getdropdown(objDropdownModel).subscribe(item => {
        this.searchItemCapacityList = item.Data;
      });
    }
  }

  onClickCapacity(para: string) {
    this.model.CapacityId = '';
    if (para == "DelAll") {
      this.selectedSearchItemCapacityList = [];
    } else if (this.selectedSearchItemCapacityList.length > 0) {
      this.model.CapacityId = this.selectedSearchItemCapacityList.map(xx => xx.id).join(',');;
    }
  }

  onFocused(e) {
  }

  onChangeMRNOId(val: string) {
    try {
      //this.ObjBOQReqModel.BOQId=0;
      var objModel = new BOQNOListModel();
      objModel.CompanyId = this.companyId;
      objModel.SearchText = val;
      objModel.Flag = 4;
      this._BOQService.GetBOQNoORBOQRequestNo(objModel).subscribe((data) => {
        if (data.Data != "") {
          this.autoCompleteMRNOList = data.Data;
        }
      })
    } catch (Error) {
      this._commonServices.ErrorFunction(this.userName, Error.message, "GetAutoCompleteMRNO", "ApprovalStatus");
    }
  }

  selectMRNO(items) {
    this.model.MRId = items.Id;
  }

  clearedMRNO() {
    this.autoCompleteMRNOList = [];
    this.model.MRId = "";
  }

  searchApprovalMRStatus(para: string) {
    debugger
    try {
      
      this.gridApi.showLoadingOverlay();
      var objSearchDIRequestModel = new SearchDIRequestModel();
      objSearchDIRequestModel.UserId = this.userId;
      objSearchDIRequestModel.CompanyId = this.companyId;
      if (this._commonServices.checkUndefined(this.searchSitesPanelData) == '') {
        objSearchDIRequestModel.SiteId = 0;
      } else {
        objSearchDIRequestModel.SiteId = this.searchSitesPanelData.SiteId;
      }
      objSearchDIRequestModel.fromDate = this._commonServices.ConvertDateMMYY(this.timePeriodPanelData.Startdate);
      objSearchDIRequestModel.toDate = this._commonServices.ConvertDateMMYY(this.timePeriodPanelData.Enddate);
      if (this._commonServices.checkUndefined(this.model.StateId) == '') {
        objSearchDIRequestModel.State_Id = '0';
      } else {
        objSearchDIRequestModel.State_Id = this.model.StateId;
      }

      if (this._commonServices.checkUndefined(this.model.ItemClassId) == '') {
        objSearchDIRequestModel.ItemClass = '0';
      } else {
        objSearchDIRequestModel.ItemClass = this.model.ItemClassId;
      }

      if (this._commonServices.checkUndefined(this.model.ItemId) == '') {
        objSearchDIRequestModel.Item_Id = '0';
      } else {
        objSearchDIRequestModel.Item_Id = this.model.ItemId;
      }

      if (this._commonServices.checkUndefined(this.model.CapacityId) == '') {
        objSearchDIRequestModel.CapacityId_Id = '0';
      } else {
        objSearchDIRequestModel.CapacityId_Id = this.model.CapacityId;
      }

      if (this._commonServices.checkUndefined(this.model.MRId) == '') {
        objSearchDIRequestModel.MRNo = '0';
      } else {
        objSearchDIRequestModel.MRNo = this.model.MRId;
      }
      objSearchDIRequestModel.IsSRN = this.model.indentType;
      objSearchDIRequestModel.DIType = this.model.dIType;
      objSearchDIRequestModel.DispatchStatus= this.model.dispatchedStatus;
       //vishal 14/09/2022
      objSearchDIRequestModel.flag2 = para;
      this._dispatchInstructionService.GetDIRequestList(objSearchDIRequestModel).subscribe(data => {
        this.rowData=null;
        this.searchData =null;
        this.scmPendingCount = 0;
        this.scmApprovedCount = 0;
        this.scmRejectCount = 0;

        this.gridApi.hideOverlay();
        if (data.Status == 1) {
          if (para == "LIST") {
            this.isApprovalTab = true;
            // this.scmPendingCount = 0;
            // this.scmApprovedCount = 0;
            // this.scmRejectCount = 0;
            if (data.Data != null) {
              this.searchData = data.Data;
              const filterValue = null;
              const pending = this.searchData.filter(element => {
                return element.SCMApprovalStatusId === filterValue;
              });
              this.scmPendingCount = pending.length;
              this.rowData = pending;

              const scmApprove = this.searchData.filter(element => {
                return element.SCMApprovalStatusId === 1472;
              });
              this.scmApprovedCount = scmApprove.length;

              const scmReject = this.searchData.filter(element => {
                return element.SCMApprovalStatusId === 1471;
              });
              this.scmRejectCount = scmReject.length;
            } else {
              this.searchData = null;
              this.rowData = null;
            }
          }
          else if (para == "Export") {
            if (data.Data != null) {
              var currentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._purchaseOrderService.exportAsExcelFile(data.Data, 'DispatchInstruction' + currentDate);
            } else {
              alert('try again');
            }
          }
        }
      });
    } catch (Error) {
      this._commonServices.ErrorFunction(this.userName, Error.message, "SearchApprovalMRStatusList", "ApprovalStatus");
    }
  }

  searchTabTypeData(Id: any) {
    if (Id == null) {
      var filterTabGridData = this.searchData.filter(
        m => m.SCMApprovalStatusId === null);
      this.rowData = filterTabGridData;
    } else if (Id == 1471) {
      var filterTabGridData = this.searchData.filter(
        m => m.SCMApprovalStatusId === parseInt(Id));
      this.rowData = filterTabGridData;
    } else if (Id == 1472) {
      var filterTabGridData = this.searchData.filter(
        m => m.SCMApprovalStatusId === parseInt(Id));
      this.rowData = filterTabGridData;
    }
  }

  createDispatch(e) {
    this.model.MRRequestId = e.rowData.RequestId;
    localStorage.setItem('DIRequestId', this.model.MRRequestId);
    window.location.href = "/WHToSite"
  }

  showMRPdfPreviewDetail(e) {
    this.model.MRRequestId = e.rowData.RequestId;
    try {
      var objModel = new SearchDIRequestModel();
      objModel.RequestId = e.rowData.RequestId;
      objModel.CompanyId = this.companyId;

      this._dispatchInstructionService.GetDIRequestPdfDetail(objModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null) {
            this._commonPdfService.DIGeneratePDF(data.Data);
          }
        }
      });
    } catch (Error) {
      this._commonServices.ErrorFunction('', Error.message, "ShowMRPdfPreviewDetail", "BOQRequest");
    }
  }

  showSRNDetail(e) {
    this.model.MRRequestId = e.rowData.RequestId;
    try {
      var objModel = new SearchDIRequestModel();
      objModel.RequestId = e.rowData.RequestId;
      objModel.CompanyId = this.companyId;

      this._dispatchInstructionService.GetDIRequestPdfDetail(objModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null) {
            this.srnList = data.Data[0].SRNList;
            this.isReqASTSRNDoc = data.Data[0].IsReqASTSRNDoc;
            this.isReqCustomerSRNDoc = data.Data[0].IsReqCustomerSRNDoc;
            var DDate = data.Data[0].SRNDate.split('/');
            this.model.RecSRNDate = { year: parseInt(DDate[2]), month: parseInt(DDate[1]), day: parseInt(DDate[0]) };

            this.astFilePath = data.Data[0].ASTSRNDoc;
            this.customerFilePath = data.Data[0].CustomerSRNDoc;

            if (data.Data[0].IsReqASTSRNDoc == 1) {
              this.astSRNDocFile.nativeElement.value = '';
            }
            if (data.Data[0].IsReqCustomerSRNDoc == 1) {
              this.customerSRNDocFile.nativeElement.value = '';
            }

            if (data.Data[0].IsReqASTSRNDoc == 1 || data.Data[0].IsReqCustomerSRNDoc == 1) {
              this.isUploadFileBtn = true;
            } else {
              this.isUploadFileBtn = false;
            }

            if (data.Data[0].IsReqASTSRNDoc == 0 && data.Data[0].IsReqCustomerSRNDoc == 0
              && data.Data[0].IsSRNDoc == 0) {
              this.isRecvSRNButton = false;
            } else if (data.Data[0].IsSRNDoc == 1) {
              this.isRecvSRNButton = false;
            } else {
              this.isRecvSRNButton = true;
            }

            if (data.Data[0].IsReqASTSRNDoc == 1 && data.Data[0].IsSRNDoc == 1) {
              this.isASTfileView = true;
            } else {
              this.isASTfileView = false;
            }

            if (data.Data[0].IsReqCustomerSRNDoc == 1 && data.Data[0].IsSRNDoc == 1) {
              this.IsCustomerfileView = true;
            } else {
              this.IsCustomerfileView = false;
            }

            jQuery('#SRNModel').modal('show');
          }
        }
      });
    } catch (Error) {
      this._commonServices.ErrorFunction('', Error.message, "ShowSRNDetail", "DispatchInstraction");
    }
  }

  approvedClick(e?) {
    console.log(e);
    this.model.MRRequestId = e.rowData.MREqId;
    jQuery('#Approveconfirm').modal('show');
  }

  rejectedClick(e?) {
    this.model.MRRequestId = e.rowData.MREqId;
    jQuery('#confirm').modal('show');
  }

  approvedAllClick(id: any) {
    console.log(id);
    this.model.MRRequestId = id;
    jQuery('#Approveconfirm').modal('show');
  }

  rejectedAllClick(id: any) {
    this.model.MRRequestId = id;
    jQuery('#confirm').modal('show');
  }

  saveApprovalStatus(ApprovalStatusId: any) {
    try {
      if (ApprovalStatusId == 1471) {
        if (this.validationApprovalStatus() == 1) {
          return false;
        }
      }
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.Menu_Id = 31;
      objApprovelStatusModel.Table_Id = this.model.MRRequestId;
      objApprovelStatusModel.User_Id = this.userId;
      objApprovelStatusModel.ApprovalStatus_Id = ApprovalStatusId;
      objApprovelStatusModel.Reason_Id = this.model.ApprovalReason;
      objApprovelStatusModel.Remarks = this.model.Remarks;
      objApprovelStatusModel.CompanyId = this.companyId;
      this._commonServices.SaveApprovalStatusHistory(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#Approveconfirm').modal('hide');
          jQuery('#confirm').modal('hide');
          setTimeout(() => {
            alert('Approval Status SuccessFully Save')
          }, 300);
          this.clearApprovalStatus();
        } else if (data.Status == 2) {
          jQuery('#Approveconfirm').modal('hide');
          jQuery('#confirm').modal('hide');
          setTimeout(() => {
            alert('Approval Status SuccessFully Update')
          }, 300);
        }
      });

    } catch (Error) {
      this._commonServices.ErrorFunction(this.userName, Error.message, "SaveApprovalStatus", "ApprovalStatus");
    }
  }

  clearApprovalStatus() {
    this.model.ApprovalStatus = "0";
    this.model.ApprovalReason = "0";
    this.model.Remarks = "";
  }

  validationApprovalStatus() {
    var flag = 0;
    if (this.model.ApprovalReason == "0") {
      $('#txtReason').css('border-color', 'red')
      $('#txtReason').focus();
      flag = 1;
    } else {
      $("#txtReason").css('border-color', '')
    }

    if (this._commonServices.checkUndefined(this.model.Remarks) == "") {
      $('#txtRemarks').css('border-color', 'red')
      $('#txtRemarks').focus();
      flag = 1;
    } else {
      $("#txtRemarks").css('border-color', '')
    }
    return flag;
  }

  reasonChange() {
    $("#txtReason").css('border-color', '')
  }
  keypressRemarks() {
    $("#txtRemarks").css('border-color', '')
  }

  updateSRNStatus() {
    try {
      if (isNaN(this.model.RecSRNDate.day) == true) {
        alert("Please select any srn date.")
        return false;
      }

      var srnDate = this._commonServices.ConvertDateFormat(this.model.RecSRNDate);
      var newJson = { RequestId: this.model.MRRequestId, SRNDate: srnDate, SRNList: this.srnList };
      var objJson = new JsonModel();
      objJson.UserId = this.userId;
      objJson.JsonStr = JSON.stringify(newJson);

      this._dispatchInstructionService.UpdateDISRNStatus(objJson).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#SRNModel').modal('hide');
          setTimeout(() => {
            alert(data.Remarks)
          }, 300);
        } else if (data.Status == 2) {
          setTimeout(() => {
            alert(data.Remarks);
          }, 300);
        }
      });
    } catch (Error) {
      this._commonServices.ErrorFunction(this.userName, Error.message, "UpdateSRNStatus", "DispatchInstruction");
    }
  }

  onASTSRNDocSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.astSRNDoc = event.target.files[0];
    }
  }

  onCustomerSRNDocSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.customerSRNDoc = event.target.files[0];
    }
  }

  uploadSRNDoc() {
    if (this.isReqASTSRNDoc == true) {
      var astSRNFile = this._commonServices.checkUndefined(this.astSRNDoc);
      if (astSRNFile == "") {
        alert('Please Select Ast SRN File !!');
        return false;
      }
    }

    if (this.isReqCustomerSRNDoc == true) {
      var customerSRNFile = this._commonServices.checkUndefined(this.customerSRNDoc);
      if (customerSRNFile == "") {
        alert('Please Select Customer SRN File !!');
        return false;
      }
    }

    var formdata = new FormData();
    if (this.astSRNDoc == null) {
      formdata.append('ASTfile', this.astSRNDoc);
    } else {
      formdata.append('ASTfile', this.astSRNDoc, this.astSRNDoc.name);
    }

    if (this.customerSRNDoc == null) {
      formdata.append('Customerfile', this.customerSRNDoc);
    } else {
      formdata.append('Customerfile', this.customerSRNDoc, this.customerSRNDoc.name);
    }

    var objpara = new SearchDIRequestModel();
    objpara.RequestId = this.model.MRRequestId;
    objpara.UserId = this.userId;
    formdata.append('jsonDetail', JSON.stringify(objpara));
    this._dispatchInstructionService.UploadSRNDoc(formdata).pipe(first()).subscribe(data => {
      if (data.Status == 1) {
        jQuery('#SRNModel').modal('hide');
        setTimeout(() => {
          alert(data.Remarks)
        }, 300);
      } else if (data.Status == 0) {
        setTimeout(() => {
          alert(data.Remarks);
        }, 300);
      }
    }, error => {
      this._commonServices.ErrorFunction(this.userName, error.message, "UploadSRNDoc", "DispatchInstruction");
    });
  }

  viewfileClick(path: any) {
    window.open(path);
  }

  onSelectionChanged(event) {
    // verify that the method is fired upon selection
    // do the rest
    this.isApprovalEnable = false;
    this.isRejectEnable = false;
    var selectedRows = this.gridApi.getSelectedRows();
    this.requestedId = selectedRows.map(x => x.MREqId).toString();

  }
}


