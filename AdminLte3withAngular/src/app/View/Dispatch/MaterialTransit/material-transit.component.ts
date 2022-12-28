import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GRNDynamicItemGrid, DynamicItemGrid, VendorOrWhModel, PoSearchModel, DynamicPdfItemGrid } from 'src/app/_Model/purchaseOrderModel';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { Router } from '@angular/router';
import { CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { MaterialMovementModel, SearchMaterialModel } from 'src/app/_Model/MaterialMovementTracker';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import * as $ from 'jquery';
import { isNumeric } from 'jquery';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CompanyModel } from 'src/app/_Model/userModel';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var jQuery: any;
@Component({
  selector: 'app-material-transit',
  templateUrl: './material-transit.component.html',
  styleUrls: ['./material-transit.component.sass'],
  providers: [DatePipe]
})
export class MaterialTransitComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  apiItemCodeAndDescriptionData: any = {};
  dynamicArray: Array<DynamicItemGrid> = [];
  dynamicPdfArrayData: Array<DynamicPdfItemGrid> = [];

  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  CompanyData = [];
  SearchStateList = [];
  SearchVendorList = [];
  SearchItemNameList = [];

  //#region Edit Part Multi select drop down 
  TrackerId: number = 0;
  EditWHList = [];
  SelectedEditVendorList = [];
  totalSumQuantity: any;
  totalSumAmount: any;
  totalSumPOQuantity: any;
  //#endregion

  public MultidropdownSettings = {};
  public SingledropdownSettings = {};
  public columnDefs = [];  //grid column
  public GridrowData = [];  //  grid data
  public multiSortKey: string;
  tooltipShowDelay: any;
  frameworkComponents: any;
  public columnDefsSearchPOId = [];
  GridItemDataWithPoIdsearch = [];
  //#region Auto Complete
  SearchPokeyword = 'PoName';
  AutoCompleteSearchPOList = [];
  AutoCompleteEditPOList = [];
  //#endregion
  keyword = 'SiteName';
  CustomerSiteIdkeyword = 'CustomerSiteId';
  AutoCompleteSiteCustomerList = [];
  AutoCompleteCustomerSiteIdList = [];

  InvoiceUploadFile: File = null;
  EwayBillUploadFile: File = null;
  CommonSearchPanelData: any;
  CompanyId: any;
  VoucherTypeDetail: any;
  ItemAddrowhideshow: boolean;
  IsAutoCompleteDesabled: boolean;
  IsHistoryGridDesabled: boolean;
  UserId: any;
  MaterialMovementEditData: any;
  Dynamicdata = [];
  MaterialHistoryData: any;
  NewMaterial: any;
  UpdateMaterial: any;
  closeResult: string;
  @ViewChild("content") modalContent: TemplateRef<any>;
  EquipmentTypeList: any;
  ManueId: number;
  CreateName: any;
  CreatedDate: any;
  ModifiedName: any;
  ModifiedDate: any;
  ApprovalList: any;
  ApproveStatusDataList: any;
  TableId: any;
  public loadingTemplate;
  public overlayNoRowsTemplate;
  gridApi: any;
  PageMenuId: any = 10;
  ArrayRoleId: any;
  IsApprovalstatusbtnhideShow: boolean;
  WareHouseId: any;
  ValidationerrorMessage: string;
  IsHiddenSearchCustomer: boolean = false;
  Exportloading: boolean;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private router: Router, private _Commonservices: CommonService,
    private _PurchaseOrderService: PurchaseOrderService, private _GrncrnService: GrncrnService,
    private _MaterialMovementService: MaterialMovementService,
    private _objSearchpanelService: SearchpanelService, private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private Loader: NgxSpinnerService, private modalService: NgbModal,
    private datePipe: DatePipe) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent
    }

    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
  }


  ngOnInit(): void {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.IsApprovalstatusbtnhideShow = false;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');

    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    this.isShownList = true;
    this.isShownEdit = false;
    this.BindCompanyStateVendorItem();
    // if (sessionStorage.getItem("CompStatVenItmSession") == null || sessionStorage.getItem("CompStatVenItmSession") == "null") {
    //   this.BindCompanyStateVendorItem();
    // } else {
    //   var objCSVTdata = new CompanyStateVendorItemModel();
    //   objCSVTdata = JSON.parse(sessionStorage.getItem("CompStatVenItmSession"));
    //   this.CompanyData = objCSVTdata.CompanyArray;
    //   this.SearchStateList = objCSVTdata.StateArray;
    //   this.SearchVendorList = objCSVTdata.VendorArray;
    //   this.SearchItemNameList = objCSVTdata.ItemArray;
    //   this.EquipmentTypeList = objCSVTdata.EquipmentArray;
    // }
    setTimeout(() => {
      this.SearchMaterialMovementHistoryCountList();
    }, 100);
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center"> loading...</span>`;

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowMovementTrackerDetail.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      {
        headerName: 'Approval',
        cellRendererFramework: ApprovalrendererComponent,
        pinned: 'left',
        width: 100,
        filter: false,
        resizable: true,
        field: 'TrackerId',
        tooltipField: 'TrackerId', tooltipComponent: 'approvalTooltip',
      },
      { headerName: 'PO Date', field: 'PoDate', width: 100 },
      { headerName: 'PO No', field: 'PoNo', width: 160, resizable: true },
      { headerName: 'Voucher Type', field: 'VoucherType', width: 180, resizable: true, filter: false },
      { headerName: 'Invoice No', field: 'InvoiceNo', width: 150 },
      { headerName: 'Inv. Amt', field: 'InvoiceAmount', width: 150, filter: false },
      { headerName: 'Invoice Date', field: 'InvoiceDate', width: 150 },
      { headerName: 'Item Name', field: 'ItemName', width: 150 },
      { headerName: 'Item Description', field: 'ItemDescription', tooltipField: 'ItemDescription', tooltipComponent: 'customtooltip', width: 150, resizable: true },
      { headerName: 'Quantity', field: 'Quantity', width: 120 },
      { headerName: 'Gross Total', field: 'GrossTotal', width: 120 },
      { headerName: 'Vendor Name', field: 'VendorName', width: 150 },
      { headerName: 'WH Name', field: 'WHName', width: 150 },
      { headerName: 'Dispatch Thr', field: 'DispatchThrough', width: 150 },
      { headerName: 'Dispatch Date', field: 'DispatchDate', width: 150 },
      { headerName: 'Expected Date', field: 'ExpectedDeliveryDate', width: 150 }
    ];
    this.multiSortKey = 'ctrl';

    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };

    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      enableSearchFilter: true,
      badgeShowLimit: 1
      //limitSelection:1
    };
    setTimeout(() => {
      this.BindVoucherType();
    }, 1000);

    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.TrackerId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.MaterialInTransit).subscribe(data => {
      if (data.Status == 1) {
        console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
        this.ObjUserPageRight.IsEdit = data.Data[0].IsEdit;

        if (this.ObjUserPageRight.IsCreate == 1 && id == 0) {
          this.Save = 1;
        } else if (this.ObjUserPageRight.IsEdit == 1 && id != 0) {
          this.Save = 1;
        } else {
          this.Save = 0
        }
      }
    })
  }

  BindVoucherType() {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    var User_Id = objUserModel.User_Id;
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'VoucherMaster';
    this.model.VoucherTypeId = "0";
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(vouc => {
      this.VoucherTypeDetail = vouc.Data;
    });
  }

  SearchMaterialMovementHistoryCountList() {
    try {
      //this.Loader.show();
      var objPoSearchModel = new PoSearchModel();
      objPoSearchModel.CompanyId = this.CompanyId;
      objPoSearchModel.UserId = this.UserId;
      objPoSearchModel.VendorId = this.CommonSearchPanelData.VendorId;
      objPoSearchModel.WHId = this.CommonSearchPanelData.WHId;
      objPoSearchModel.ItemId = this.CommonSearchPanelData.ItemId;
      objPoSearchModel.Startdate = this.CommonSearchPanelData.Startdate;
      objPoSearchModel.Enddate = this.CommonSearchPanelData.Enddate;
      objPoSearchModel.State_Id = this.CommonSearchPanelData.State_Id;
      objPoSearchModel.MakeId = this.CommonSearchPanelData.MakeId;
      objPoSearchModel.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objPoSearchModel.CapacityId = this.CommonSearchPanelData.CapacityId;
      this._MaterialMovementService.GetMaterialMovementCountHistory(objPoSearchModel).subscribe(data => {
        if (data.Status == 1) {
          this.MaterialHistoryData = data.Data;
          this.NewMaterial = data.Data[0].NewMaterialMovement;
          this.UpdateMaterial = data.Data[0].UpdateMaterialMovement;
        }
      });
    } catch (Error) {
      console.log(Error.message)
    }

  }
  //#region default call function on page Load
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
      this.WareHouseId = this.apiCSVIData.WHId;
      this.CompanyData = objCSVTdata.CompanyArray;
      this.SearchStateList = objCSVTdata.StateArray;
      this.SearchVendorList = objCSVTdata.VendorArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      //sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }

  //#endregion

  //#region Search WH Drop down function

  SearchPoCleared() {
    this.SearchPoId = 0;
    this.AutoCompleteSearchPOList = [];
    this.AutoCompleteEditPOList = [];
  }

  SearchPoId: number;
  SearchPoSelectEvent(item) {
    this.SearchPoId = item.id;
  }

  BindAutoCompletePOList(val: string, FlagId: any) {
    //////debugger
    this.SearchPoId = 0;
    this.EditPoId = 0;
    this.clearEditForm();
    this.AutoCompleteSearchPOList = [];
    this.AutoCompleteEditPOList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = FlagId;
    this._PurchaseOrderService.GetAutoCompletePurchaseOrder(objdropdownmodel).subscribe((data) => {
      this.AutoCompleteSearchPOList = data.Data;
      this.AutoCompleteEditPOList = data.Data;
    })
  }
  //#endregion



  //#region auto complete Site Name and Customer Site ID
  onChangeSiteNameSearch(val: string, index: any) {
    this.dynamicArray[index].SiteId = 0;
    this.dynamicArray[index].CustomerSiteId = "";
    this.dynamicArray[index].SiteName = "";
    this.dynamicArray[index].ValueCustomerSite = "";
    this.dynamicArray[index].ValueSiteName = "";
    this.dynamicArray[index].CustomerId = 0;
    this.dynamicArray[index].CustomerCode = "";

    this.AutoCompleteSiteCustomerList = [];
    var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
    objSiteCustomerAutoModel.SCNo = val;
    objSiteCustomerAutoModel.CompanyId = this.CompanyId;
    objSiteCustomerAutoModel.flag = "Site";
    this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
      this.AutoCompleteSiteCustomerList = data.Data;

    })
  }



  searchCleared(index: any) {
    this.AutoCompleteSiteCustomerList = [];
    this.dynamicArray[index].SiteId = 0;
    this.dynamicArray[index].CustomerSiteId = "";
    this.dynamicArray[index].SiteName = "";
    this.dynamicArray[index].ValueCustomerSite = "";
    this.dynamicArray[index].CustomerId = 0;
    this.dynamicArray[index].CustomerCode = "";
  }

  SelectSiteName(item, index: any) {
    this.dynamicArray[index].ValueCustomerSite = item.CustomerSiteId;
    this.dynamicArray[index].SiteId = item.Id;
    //this.dynamicArray[index].ValueSiteName=item.SiteName;
    this.dynamicArray[index].SiteName = item.SiteName;
    this.dynamicArray[index].CustomerSiteId = item.CustomerSiteId;
    this.dynamicArray[index].CustomerId = item.ClientId;
    this.dynamicArray[index].CustomerCode = item.ClientCode;

  }

  onFocused(e) {
  }

  onChangeSearchCustomerSiteId(val: string, index: any) {
    this.dynamicArray[index].SiteId = 0;
    this.dynamicArray[index].CustomerSiteId = "";
    this.dynamicArray[index].SiteName = "";
    this.dynamicArray[index].ValueCustomerSite = "";
    this.dynamicArray[index].ValueSiteName = "";
    this.dynamicArray[index].CustomerId = 0;
    this.dynamicArray[index].CustomerCode = "";

    this.AutoCompleteCustomerSiteIdList = [];
    var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
    objSiteCustomerAutoModel.SCNo = val;
    objSiteCustomerAutoModel.CompanyId = this.CompanyId;
    objSiteCustomerAutoModel.flag = "CustomerSiteId";
    this._GrncrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((data) => {
      this.AutoCompleteCustomerSiteIdList = data.Data;

    })
  }

  SelectCustomerSiteId(items, i: any) {
    //this.AutoCompleteCustomerSiteIdList=[];
    this.dynamicArray[i].CustomerSiteId = items.CustomerSiteId;
    this.dynamicArray[i].SiteId = items.Id;
    this.dynamicArray[i].ValueSiteName = items.SiteName;
    this.dynamicArray[i].SiteName = items.SiteName;
    this.dynamicArray[i].CustomerId = items.ClientId;
    this.dynamicArray[i].CustomerCode = items.ClientCode;
  }

  ClearedCustomerSiteId(index: any) {
    this.dynamicArray[index].SiteId = 0;
    this.dynamicArray[index].CustomerSiteId = "";
    this.dynamicArray[index].SiteName = "";
    this.dynamicArray[index].ValueSiteName = "";
    this.dynamicArray[index].ValueCustomerSite = "";
    this.dynamicArray[index].CustomerId = 0;
    this.dynamicArray[index].CustomerCode = "";
    this.AutoCompleteCustomerSiteIdList = [];
  }
  //#endregion


  onGridReady(params) {
    this.gridApi = params.api;
  }

  SearchMaterialTrackerList(para: string) {
    this.gridApi.showLoadingOverlay();
    try {
      var objpara = new SearchMaterialModel();
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
      objpara.ItemClassId = this.CommonSearchPanelData.ItemClassId;
      objpara.ItemCodeId = this.CommonSearchPanelData.ItemCodeId;
      objpara.CapacityId = this.CommonSearchPanelData.CapacityId;
      objpara.DescriptionId = this.CommonSearchPanelData.DescriptionId;
      objpara.Startdate = this.CommonSearchPanelData.Startdate;
      objpara.Enddate = this.CommonSearchPanelData.Enddate;
      // objpara.PoId=0;
      var PoId = this._Commonservices.checkUndefined(this.SearchPoId);
      if (PoId != '') {
        objpara.PoId = PoId;
      } else {
        objpara.PoId = 0;
      }
      objpara.InvoiceNo = this.model.SearchInvoiceNo;
      var VoucherTypeid = this._Commonservices.checkUndefined(this.model.VoucherTypeId);
      if (VoucherTypeid != '') {
        objpara.VoucherTypeId = this.model.VoucherTypeId;
      } else {
        objpara.VoucherTypeId = 0;
      }
      objpara.Flag = para;
      if (para == "Export") {
        this.Exportloading = true;
      }
      this._MaterialMovementService.GetMaterialTrackerList(objpara).subscribe(data => {
        this.Exportloading = false;
        if (data.Status == 1) {
          if (para == "List") {
            this.GridrowData = data.Data;
            this.gridApi.hideOverlay();
          } else if (para == "Export") {
            this.gridApi.hideOverlay();
            this._PurchaseOrderService.exportAsExcelFile(data.Data, 'MaterialInTransit');
          }
        } else if (data.Status == 2) {
          if (para == "List") {
            this.gridApi.hideOverlay();
            this.GridrowData = [];
          } else if (para == "Export") {
            this.gridApi.hideOverlay();
            alert("Please try again.")
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SearchDispatchTrackerList";
      objWebErrorLogModel.ErrorPage = "WHTOSite";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  ShowMovementTrackerDetail(e) {
    //this.Loader.show();
    this.CreateNew();
    this.BindEditPageDetailbyTrackerId(e.rowData.TrackerId);
  }

  BindEditPageDetailbyTrackerId(trackerId: number) {
    this.Loader.show();
    this.TrackerId = trackerId;
    this.GetUserPageRight(this.TrackerId);
    this.IsAutoCompleteDesabled = true;
    this.ItemAddrowhideshow = false;
    this.model.EditPONo = "";
    var objModel = new MaterialMovementModel();
    objModel.TrackerId = trackerId;
    this._MaterialMovementService.GetMaterialMovementDetailbyTrackerId(objModel).subscribe((data) => {
      if (data.Status == 1) {
        this.Loader.hide();
        this.MaterialMovementEditData = data.Data;
        this.model.EditPONo = data.Data[0].PoNo;
        this.EditPoId = data.Data[0].PoId;
        this.TableId = data.Data[0].TrackerId;
        this.ManueId = this.PageMenuId;
        this.CreateName = data.Data[0].CreateName;
        this.CreatedDate = data.Data[0].CreatedDate;
        this.ModifiedName = data.Data[0].ModifiedName;
        this.ModifiedDate = data.Data[0].ModifiedDate;
        this.ApprovalList = null;
        this.ApprovalList = JSON.parse(data.Data[0].ApprovalStatusList);
        for (let i = 0; i < this.ArrayRoleId?.length; i++) {
          for (let j = 0; j < this.ApprovalList?.length; j++) {
            if (parseInt(this.ArrayRoleId[i]) == this.ApprovalList[j].RoleId) {
              this.IsApprovalstatusbtnhideShow = true;
            }
          }
        }
        if (this.ApprovalList != null) {
          this.ApproveStatusDataList = this.ApprovalList;
        } else {
          this.ApproveStatusDataList = null;
        }
        //  this.BindPoRelatedDetailbyPoId(this.EditPoId);
        var PODate = data.Data[0].Podate.split('/');
        this.model.Podate = { year: parseInt(PODate[2]), month: parseInt(PODate[1]), day: parseInt(PODate[0]) };

        if (data.Data[0].CompanyMaster_Id != null && data.Data[0].CompanyMaster_Id > 0) {
          this.model.EditCompanyId = '' + data.Data[0].CompanyMaster_Id + '';
        }

        if (data.Data[0].VendorMaster_Id != null && data.Data[0].VendorMaster_Id > 0) {
          this.SelectedEditVendorList = [{ "id": '' + data.Data[0].VendorMaster_Id + '', "itemName": '' + data.Data[0].VendorCode + '' }]
        } else {
          this.SelectedEditVendorList = [];
        }

        this.model.VendorAddress = data.Data[0].VendorAddress;
        if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
          this.EditWHList = data.WHData;
        }

        if (data.Data[0].WHState_Id != null && data.Data[0].WHState_Id > 0) {
          this.model.EditStateId = '' + data.Data[0].WHState_Id + '';
        }

        if (data.Data[0].WHState_Id != null && data.Data[0].WHState_Id > 0) {
          this.model.EditWHId = '' + data.Data[0].WH_Id + '';
        }
        this.model.WHAddress = data.Data[0].WHAddress;
        this.model.DispatchThr = data.Data[0].DispatchThrough;
        this.model.InvoiceNo = data.Data[0].InvoiceNo;


        if (data.Data[0].InvoiceDate != null && data.Data[0].InvoiceDate != "") {
          var InvoiceDate = data.Data[0].InvoiceDate.split('/');
          this.model.InvoiceDate = { year: parseInt(InvoiceDate[2]), month: parseInt(InvoiceDate[1]), day: parseInt(InvoiceDate[0]) };
        }
        this.model.InvoiceAmount = data.Data[0].InvoiceAmount;
        this.model.EwayBillNo = data.Data[0].EwayBillNo;


        if (data.Data[0].EwayBillDate != null && data.Data[0].EwayBillDate != "") {
          var EwayBillDate = data.Data[0].EwayBillDate.split('/');
          this.model.EwayBillDate = { year: parseInt(EwayBillDate[2]), month: parseInt(EwayBillDate[1]), day: parseInt(EwayBillDate[0]) };
        }

        if (data.Data[0].DispatchDate != null && data.Data[0].DispatchDate != "") {
          var DispatchDate = data.Data[0].DispatchDate.split('/');
          this.model.DispatchDate = { year: parseInt(DispatchDate[2]), month: parseInt(DispatchDate[1]), day: parseInt(DispatchDate[0]) };
        }

        if (data.Data[0].ExpectedDeliveryDate != null && data.Data[0].ExpectedDeliveryDate != "") {
          var ExpectedDate = data.Data[0].ExpectedDeliveryDate.split('/');
          this.model.ExpectedDeliveryDate = { year: parseInt(ExpectedDate[2]), month: parseInt(ExpectedDate[1]), day: parseInt(ExpectedDate[0]) };
        }

        if (data.Data[0].ActualReceivedDate != null && data.Data[0].ActualReceivedDate != "") {
          var ActualRecdDate = data.Data[0].ActualReceivedDate.split('/');
          this.model.ActualReceivedDate = { year: parseInt(ActualRecdDate[2]), month: parseInt(ActualRecdDate[1]), day: parseInt(ActualRecdDate[0]) };
        }
        this.model.TrackRef = data.Data[0].TrackRef;
        this.model.Remarks = data.Data[0].Remarks;
        this.model.TransporterName = data.Data[0].TransporterName;
        this.model.VehicleNo = data.Data[0].VehicleNo;
        this.model.DocketNo = data.Data[0].DocketNo;
        this.model.MobileNo = data.Data[0].MobileNo;
        if (data.GridItemData != null) {
          this.IsHistoryGridDesabled = true;
          this.GridItemDataWithPoIdsearch = data.GridItemData;
        }
        this.BindItemArray(data.ItemData, 'edit');
      }
    });
  }

  CreateNew() {
    //////debugger
    this.EditPoId = 0;
    this.TrackerId = 0;
    this.isShownList = false;
    this.isShownEdit = true;
    this.clearEditForm();
    this.model.EditPONo = "";
    this.model.Podate = "";
    this.ItemAddrowhideshow = true;
    this.IsHistoryGridDesabled = false;
    this.IsAutoCompleteDesabled = false;
    this.IsAutoCompleteDesabled = false;
  }

  BackPage() {
    this.TrackerId = 0;
    this.isShownList = true;
    this.isShownEdit = false;
    this.GridItemDataWithPoIdsearch = [];
    this.IsAutoCompleteDesabled = false;
    this.clearEditForm();
  }
  EwayBillDateClick(event: any) {
    var InvDate = this._Commonservices.checkUndefined(this.model.InvoiceDate);
    if (InvDate == '') {
      alert("first select invoice date ");
      this.model.EwayBillDate = "";
    } else {
      var InvoiceDate = InvDate.day + '/' + InvDate.month + '/' + InvDate.year;
    }
    var BillDate = this._Commonservices.checkUndefined(this.model.EwayBillDate);
    if (BillDate != '') {
      var EwayBillDate = BillDate.day + '/' + BillDate.month + '/' + BillDate.year;
    }
    if (InvoiceDate > EwayBillDate) {
      alert("eway bill date should be not greater than invoice date");
      this.model.EwayBillDate = "";
      this.model.InvoiceDate = "";
    }

  }
  InvDateClick(event: any) {
    var InvDate = this._Commonservices.checkUndefined(this.model.InvoiceDate);

    var BillDate = this._Commonservices.checkUndefined(this.model.EwayBillDate);
    if (BillDate != '') {
      var EwayBillDate = BillDate.day + '/' + BillDate.month + '/' + BillDate.year;
    }
    if (InvDate > EwayBillDate) {
      alert("eway bill date should be not greater than invoice date");
      this.model.EwayBillDate = "";
      this.model.InvoiceDate = "";
    }

  }
  //#region Edit Part Code 
  clearEditForm() {
    this.model.Podate = "";
    //this.model.EditPONo="";
    this.SelectedEditVendorList = [];
    this.model.VendorAddress = "";
    this.model.EditStateId = '0';
    this.model.EditWHId = '0';
    this.model.WHAddress = "";
    this.model.DispatchThr = "";
    this.model.InvoiceNo = "";
    this.model.InvoiceDate = "";
    this.model.InvoiceAmount = "";
    this.InvoiceUploadFile = null;
    this.model.EwayBillNo = "";
    this.model.EwayBillDate = "";
    this.EwayBillUploadFile = null;
    this.model.DispatchDate = "";
    this.model.ExpectedDeliveryDate = "";
    this.model.ActualReceivedDate = "";
    this.model.TrackRef = "";
    this.model.Remarks = "";
    this.dynamicArray = [];
    this.totalSumQuantity = "";
    this.totalSumAmount = "";
    this.totalSumPOQuantity = "";
    this.IsHistoryGridDesabled = false;
  }

  onEditVenDeSelectAll(item: any) {
    this.SelectedEditVendorList = [];
  }

  EditPoId: number;
  EditPoSelectEvent(item) {
    this.EditPoId = item.id;
    this.BindPoRelatedDetailbyPoId(this.EditPoId);
  }

  EditPoCleared() {
    this.EditPoId = 0
    this.ItemAddrowhideshow = true;
    this.IsHistoryGridDesabled = false;
    this.GridItemDataWithPoIdsearch = [];
    this.clearEditForm();
  }

  BindVendorOrWhAddess(para: string, val: string): void {
    //$('#TxtVendorEdit .selected-list .c-btn').attr('style', 'border-color: ');
    if (val == "Dell") {
      this.SelectedEditVendorList = [];
    }
    var VendorId = '0'
    if (this.SelectedEditVendorList.length > 0) {
      VendorId = this.SelectedEditVendorList[0].id;
    }
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.flag = para;
    if (para == "vendor") {
      objVendormodel.Id = VendorId;
    } else if (para == "WHMaster") {
      objVendormodel.Id = val;
    }
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      if (data.Status == 1) {
        if (para == "vendor") {
          this.model.VendorAddress = data.Data[0].VendorAddress;
        } else if (para == "WHMaster") {
          this.model.WHAddress = data.Data[0].WHAddress;
        }
      } else {
        if (para == "vendor") {
          this.model.VendorAddress = "";
        } else if (para == "WHMaster") {
          this.model.WHAddress = "";
        }
      }
    });
  }

  BindEditWHList() {
    try {
      var StateId = this._Commonservices.checkUndefined(this.model.EditStateId);
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = 'WHMaster';
      this.model.EditWHId = '0'
      this.model.WHAddress = '';
      this.EditWHList = [];
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
        this.EditWHList = wh.Data;
      });
    } catch (Error) {
      console.log(Error.message)
    }
  }

  BindPoRelatedDetailbyPoId(PoId: number) {
    try {
      var objModel = new PoSearchModel();
      objModel.PoId = PoId;
      objModel.Flag = "";
      this.ItemAddrowhideshow = false;
      this._PurchaseOrderService.GetPoListandOtherDetailByPoId(objModel).subscribe((data) => {

        if (data.Status == 1) {
          var PODate = data.Data[0].Podate.split('/');
          this.model.Podate = { year: parseInt(PODate[2]), month: parseInt(PODate[1]), day: parseInt(PODate[0]) };
          if (data.Data[0].CompanyMaster_Id != null && data.Data[0].CompanyMaster_Id > 0) {
            //this.model.EditCompanyId=''+data.Data[0].CompanyMaster_Id+'';
          }

          if (data.Data[0].VendorMaster_Id != null && data.Data[0].VendorMaster_Id > 0) {
            this.SelectedEditVendorList = [{ "id": '' + data.Data[0].VendorMaster_Id + '', "itemName": '' + data.Data[0].VendorCode + '' }]
          } else {
            this.SelectedEditVendorList = [];
          }

          this.model.VendorAddress = data.Data[0].VendorAddress;
          if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
            this.EditWHList = data.WHData;
          }

          if (data.Data[0].WHState_Id != null && data.Data[0].WHState_Id > 0) {
            this.model.EditStateId = '' + data.Data[0].WHState_Id + '';
          }

          if (data.Data[0].WH_Id != null && data.Data[0].WH_Id > 0) {
            this.model.EditWHId = '' + data.Data[0].WH_Id + ''
          }

          this.model.WHAddress = data.Data[0].WHAddress;
          if (data.GridItemData != null) {
            this.IsHistoryGridDesabled = true;
            this.GridItemDataWithPoIdsearch = data.GridItemData;
          }
          if (data.ItemData != null) {
            this.BindItemArray(data.ItemData, 'PO');
          } else {
            alert('There is no item list available for this PO! Pls check PO details in PO report. If any changes required in PO pls ask PO maker to modify and same will be reflected here.');
          }

        }
      });
    } catch (Error) {
      console.log(Error.message)
    }

  }



  async BindItemArray(ItemEditDataArr: any, flag: any) {
    this.dynamicArray = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        if (ItemEditDataArr[i].MTQty != "0.00" || ItemEditDataArr[i].MTQty != "0") {
          var objdynamic = new DynamicItemGrid();
          objdynamic.ItemNameId = ItemEditDataArr[i].ItemNameId;
          objdynamic.PoItemListId = ItemEditDataArr[i].PoItemListId;
          objdynamic.MtlId = ItemEditDataArr[i].MtlId;
          objdynamic.EditItemMake = JSON.parse(ItemEditDataArr[i].ItemMakeList);
          objdynamic.ItemMakeId = ItemEditDataArr[i].MakeMaster_Id;
          objdynamic.EditItemCode = JSON.parse(ItemEditDataArr[i].ItemCodeList)
          objdynamic.UnitList = JSON.parse(ItemEditDataArr[i].UnitList)
          objdynamic.ItemId = ItemEditDataArr[i].ItemId;
          objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
          objdynamic.ValueQty = ItemEditDataArr[i].ValueQty;
          objdynamic.TaxWith = "1";
          objdynamic.MTQty = parseFloat(ItemEditDataArr[i].MTQty).toFixed(2);
          objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
          objdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
          objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          if (ItemEditDataArr[i].UnitMaster_Id != null) {
            objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
          } else {
            objdynamic.UnitName = "0";
          }
          objdynamic.ValueSiteName = ItemEditDataArr[i].SiteName;
          objdynamic.ValueCustomerSite = ItemEditDataArr[i].CustomerSiteId;
          objdynamic.SiteId = ItemEditDataArr[i].SiteId;
          objdynamic.SiteName = ItemEditDataArr[i].SiteName;
          objdynamic.CustomerSiteId = ItemEditDataArr[i].CustomerSiteId;
          objdynamic.ReasonCode = ItemEditDataArr[i].ReasonCode;
          objdynamic.CustomerId = ItemEditDataArr[i].CustomerId;
          objdynamic.CustomerCode = ItemEditDataArr[i].CustomerCode;
          if (flag == 'edit') {
            objdynamic.CGSTRate = ItemEditDataArr[i].CGSTRate;
            objdynamic.CGST = ItemEditDataArr[i].CGST;
            objdynamic.SGSTRate = ItemEditDataArr[i].SGSTRate;
            objdynamic.SGST = ItemEditDataArr[i].SGST;
            objdynamic.TCSRate = ItemEditDataArr[i].TCSRate;
            objdynamic.TCS = ItemEditDataArr[i].TCS;
            objdynamic.IGSTRate = ItemEditDataArr[i].IGSTRate;
            objdynamic.IGST = ItemEditDataArr[i].IGST;
            objdynamic.TaxWith = ItemEditDataArr[i].TaxWith;
            objdynamic.TotalInvoiceValue = ItemEditDataArr[i].TotalInvoiceValue;
            objdynamic.FreightCharge = ItemEditDataArr[i].FreightCharge;
            objdynamic.TotalAmountWithFreightCharge = ItemEditDataArr[i].TotalAmountWithFreightCharge;
          } else {
            objdynamic.FreightCharge = 0.00;
          }
          this.dynamicPdfArrayData.push(objdynamic);
          this.dynamicArray.push(objdynamic);
          this.fnBindItemGrossToatl();
        } else {
          this.modalService.open(this.modalContent, { size: <any>'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        }
      }
    }
  }


  ConfirmmationClick() {
    this.getDismissReason('Cross click');
    window.location.href = '/GRNDetail'
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ItemRateOnblur() {
    this.fnBindItemGrossToatl();
  }
  fnBindItemGrossToatl() {
    var totalamount = 0.0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var mqty = 0.0;
    var Rate = 0.0;
    var cgstRate = 0.00;
    var sgstRate = 0.00;
    var tcsRate = 0.00;
    var igstrate = 0.00;
    this.totalSumQuantity = 0.0;
    var _rowAmount = 0.0;
    var taxWith;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      _rowAmount = 0.0;
      if (this.dynamicArray[i].SGSTRate != 0) {
        this.dynamicArray[i].CGSTRate = this.dynamicArray[i].SGSTRate;
      }
      if (this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].SGSTRate = this.dynamicArray[i].CGSTRate;
      }
      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].IGSTRate != 0) {
        this.ValidationerrorMessage = 'Invalid Tax Detail';
        jQuery('#Validationerror').modal('show');
        this.dynamicArray[i].SGSTRate = 0.00;
        this.dynamicArray[i].CGSTRate = 0.00;
        this.dynamicArray[i].IGSTRate = 0.00;
      }


      poqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      mqty = parseFloat(this.dynamicArray[i].MTQty == "" ? 0.0 : this.dynamicArray[i].MTQty);
      Rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      cgstRate = parseFloat(this.dynamicArray[i].CGSTRate == "" ? 0.0 : this.dynamicArray[i].CGSTRate);
      sgstRate = parseFloat(this.dynamicArray[i].SGSTRate == "" ? 0.0 : this.dynamicArray[i].SGSTRate);
      tcsRate = parseFloat(this.dynamicArray[i].TCSRate == "" ? 0.0 : this.dynamicArray[i].TCSRate);
      igstrate = parseFloat(this.dynamicArray[i].IGSTRate == "" ? 0.0 : this.dynamicArray[i].IGSTRate);

      totalqty += mqty;
      totalpoqty += poqty;
      totalamount += (mqty * Rate);
      _rowAmount = (mqty * Rate);
      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(mqty * Rate);
      taxWith = this.dynamicArray[i].TaxWith;

      //this.dynamicArray[i].TotalAmountWithFreightCharge = parseFloat(totalamount.toString()) + parseFloat(this.dynamicArray[i].FreightCharge);
      if (taxWith == "1") {
        this.dynamicArray[i].TotalAmountWithFreightCharge = _rowAmount + parseFloat(this.dynamicArray[i].FreightCharge);
        this.dynamicArray[i].CGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * cgstRate) / 100;
        this.dynamicArray[i].SGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * sgstRate) / 100;
        this.dynamicArray[i].IGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * igstrate) / 100;
        this.dynamicArray[i].TCS = (this.dynamicArray[i].TotalAmountWithFreightCharge * tcsRate) / 100
      } else {
        this.dynamicArray[i].TotalAmountWithFreightCharge = _rowAmount + parseFloat(this.dynamicArray[i].FreightCharge);
        this.dynamicArray[i].CGST = (_rowAmount * cgstRate) / 100;
        this.dynamicArray[i].SGST = (_rowAmount * sgstRate) / 100;
        this.dynamicArray[i].IGST = (_rowAmount * igstrate) / 100;
        this.dynamicArray[i].TCS = (_rowAmount * tcsRate) / 100;
      }

      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].CGST + this.dynamicArray[i].SGST + this.dynamicArray[i].TCS)
      }
      if (this.dynamicArray[i].SGSTRate == 0 && this.dynamicArray[i].CGSTRate == 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].IGST)
      }
      if (this.dynamicArray[i].TCSRate == '') {
        this.dynamicArray[i].TCSRate = 0;
      }
      if (this.dynamicArray[i].IGSTRate == '') {
        this.dynamicArray[i].IGSTRate = 0;
      }
      if (this.dynamicArray[i].CGSTRate == '') {
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (this.dynamicArray[i].SGSTRate == '') {
        this.dynamicArray[i].SGSTRate = 0;
      }
      this.dynamicArray[i].TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue.toFixed(2);
      var chekValidation = (parseFloat(this.dynamicArray[i].SGSTRate) + parseFloat(this.dynamicArray[i].CGSTRate))
      var chekValidationIgst = (parseFloat(this.dynamicArray[i].IGSTRate))
      if (chekValidation > 28) {
        alert('Please enter tax detail less then or equal to 14');
        this.dynamicArray[i].SGSTRate = 0;
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (chekValidationIgst > 28) {
        alert('Please enter tax detail less then or equal to 28');
        this.dynamicArray[i].IGSTRate = 0;
      }
    }
    this.totalSumPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    //this.totalSumAmount=totalamount.toFixed(2);
    this.totalSumAmount = this._Commonservices.thousands_separators(totalamount);
  }


  OnblurMTQty(index: any) {
    var mtqty = 0;
    var qty = 0;
    var vqty = 0;
    if (this.TrackerId != 0) {
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        vqty = parseInt(this.dynamicArray[i].ValueQty == "" ? 0 : this.dynamicArray[i].ValueQty);
        mtqty = parseInt(this.dynamicArray[i].MTQty == "" ? 0 : this.dynamicArray[i].MTQty)
        if (mtqty > vqty) {
          alert("transit qty should not be greater than PO qty ");
          this.dynamicArray[i].MTQty = "0.00";
          this.fnBindItemGrossToatl();
        }
      }
    } else {
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        mtqty = parseInt(this.dynamicArray[i].MTQty == "" ? 0 : this.dynamicArray[i].MTQty) + parseInt(this.dynamicArray[i].ValueQty == "" ? 0 : this.dynamicArray[i].ValueQty);
        qty = parseInt(this.dynamicArray[i].Qty == "" ? 0 : this.dynamicArray[i].Qty);
        if (mtqty > qty) {
          alert("transit qty should not be greater than PO qty ");
          this.dynamicArray[i].MTQty = "0.00";
          this.fnBindItemGrossToatl();
        }
      }
    }
  }

  ChangeEditItemName(ItemNameId: any, index: any) {
    this.dynamicArray[index].EditItemMake = [];
    this.dynamicArray[index].EditItemCode = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = ItemNameId;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'ItemMake';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      this.dynamicArray[index].EditItemMake = item.Data
      this.dynamicArray[index].ItemMakeId = "0"
    });

  }

  ChangeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = ItemNameId;
    objdropdownmodel.Other_Id = ItemMakeId;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'ItemCode';
    this.dynamicArray[index].EditItemCode = [];
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      this.dynamicArray[index].EditItemCode = item.Data
      this.dynamicArray[index].ItemId = "0";
    });
  }

  ChangeEditItemCode(ItemId: any, index: any) {
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = ItemId;
    objVendormodel.flag = 'ItemMaster';
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      if (data.Data[0].UnitList.length == 1) {
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
        this.dynamicArray[index].UnitName = this.dynamicArray[index].UnitList[0].Id;
      } else {
        this.dynamicArray[index].UnitName = "0";
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
      }
      // this.dynamicArray[index].UnitName = data.Data[0].UnitName;
      this.dynamicArray[index].ItemDescription = data.Data[0].ItemDescription;
    });
  }

  onInvoiceImageSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.InvoiceUploadFile = event.target.files[0];
    }
  }

  onEwayBillImageSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.EwayBillUploadFile = event.target.files[0];
    }
  }

  SaveMaterialTracker() {
    if (this.validation() == 1) {
      return false;
    } else if (this.dynamicArray.length < 1) {
      alert('please fill atleast one item');
      return false;
    }
    this.Loader.show();
    var objdata = new MaterialMovementModel();
    objdata.TrackerId = this.TrackerId;
    objdata.PoId = this.EditPoId;
    objdata.CompanyId = parseInt(this.CompanyId);
    objdata.VendorId = this.SelectedEditVendorList[0].id;
    objdata.WHStateId = this.model.EditStateId;
    objdata.WHId = this.model.EditWHId;
    objdata.DispatchThrough = this.model.DispatchThr;
    objdata.InvoiceNo = this.model.InvoiceNo;
    objdata.UserId = this.UserId

    var InvDate = this._Commonservices.checkUndefined(this.model.InvoiceDate);
    if (InvDate != '') {
      objdata.InvoiceDate = InvDate.day + '/' + InvDate.month + '/' + InvDate.year;
    }
    objdata.InvoiceAmount = this.model.InvoiceAmount;
    objdata.EwayBillNo = this.model.EwayBillNo;

    var EwayDate = this._Commonservices.checkUndefined(this.model.EwayBillDate);
    if (EwayDate != '') {
      objdata.EwayBillDate = EwayDate.day + '/' + EwayDate.month + '/' + EwayDate.year;
    }
    var DispatchDate = this._Commonservices.checkUndefined(this.model.DispatchDate);
    if (DispatchDate != '') {
      objdata.DispatchDate = DispatchDate.day + '/' + DispatchDate.month + '/' + DispatchDate.year;
    }
    var ExpDeliveryDate = this._Commonservices.checkUndefined(this.model.ExpectedDeliveryDate);
    if (ExpDeliveryDate != '') {
      objdata.ExpectedDeliveryDate = ExpDeliveryDate.day + '/' + ExpDeliveryDate.month + '/' + ExpDeliveryDate.year;
    }
    var ActualRecDate = this._Commonservices.checkUndefined(this.model.ActualReceivedDate);
    if (ActualRecDate != '') {
      objdata.ActualReceivedDate = ActualRecDate.day + '/' + ActualRecDate.month + '/' + ActualRecDate.year;
    }
    objdata.TrackRef = this.model.TrackRef;
    objdata.Remarks = this.model.Remarks;
    objdata.TransporterName = this.model.TransporterName;
    objdata.VehicleNo = this.model.VehicleNo;
    objdata.DocketNo = this.model.DocketNo;
    objdata.MobileNo = this.model.MobileNo;
    var ItemArray: Array<DynamicItemGrid> = [];
    var objQty = 0.0;
    var objAmount = 0.0;
    for (var icount = 0, len = this.dynamicArray.length; icount < len; icount++) {
      var objItem = new DynamicItemGrid();
      objItem.ItemId = this.dynamicArray[icount].ItemId;
      objItem.PoItemListId = this.dynamicArray[icount].PoItemListId;
      objItem.UnitId = this.dynamicArray[icount].UnitName;
      if (this.dynamicArray[icount].MtlId != null) {
        objItem.MtlId = this.dynamicArray[icount].MtlId;
      } else {
        objItem.MtlId = 0;
      }
      objItem.SubDescription = this.dynamicArray[icount].SubDescription;
      objItem.Rate = this.dynamicArray[icount].Rate;
      objItem.MTQty = this.dynamicArray[icount].MTQty;
      objQty += parseFloat(objItem.MTQty);
      objAmount += (objItem.Rate * objItem.MTQty)
      objItem.ReasonCode = this.dynamicArray[icount].ReasonCode;
      var SiteData = this.dynamicArray[icount].SiteId;
      if (SiteData == 0) {
        objItem.SiteId = this.dynamicArray[icount].SiteId;
        objItem.SiteName = this.dynamicArray[icount].SiteName;
        objItem.CustomerSiteId = this.dynamicArray[icount].CustomerSiteId;
        objItem.CustomerCode = this.dynamicArray[icount].CustomerCode;
        objItem.CustomerId = this.dynamicArray[icount].CustomerId;
      }
      else if (SiteData != 0 && this.dynamicArray[icount].CustomerSiteId != null && this.dynamicArray[icount].CustomerSiteId != "") {
        objItem.SiteId = this.dynamicArray[icount].SiteId;
        objItem.SiteName = this.dynamicArray[icount].SiteName;
        objItem.CustomerSiteId = this.dynamicArray[icount].CustomerSiteId;
        objItem.CustomerCode = this.dynamicArray[icount].CustomerCode;
        objItem.CustomerId = this.dynamicArray[icount].CustomerId;
      }

      objItem.CGSTRate = this.dynamicArray[icount].CGSTRate;
      objItem.CGST = this.dynamicArray[icount].CGST;
      objItem.SGSTRate = this.dynamicArray[icount].SGSTRate;
      objItem.SGST = this.dynamicArray[icount].SGST;
      objItem.TCSRate = this.dynamicArray[icount].TCSRate;
      objItem.TCS = this.dynamicArray[icount].TCS;
      objItem.IGSTRate = this.dynamicArray[icount].IGSTRate;
      objItem.IGST = this.dynamicArray[icount].IGST;
      objItem.TaxWith = this.dynamicArray[icount].TaxWith;
      objItem.FreightCharge = this.dynamicArray[icount].FreightCharge;
      objItem.TotalAmountWithFreightCharge = this.dynamicArray[icount].TotalAmountWithFreightCharge;
      objItem.TotalInvoiceValue = this.dynamicArray[icount].TotalInvoiceValue;
      ItemArray.push(objItem);
    }

    objdata.ItemList = ItemArray;
    objdata.TotalQty = objQty;
    objdata.TotalAmount = objAmount;
    var formdata = new FormData();
    if (this.InvoiceUploadFile == null) {
      formdata.append('Invoicefile', this.InvoiceUploadFile);
    } else {
      formdata.append('Invoicefile', this.InvoiceUploadFile, this.InvoiceUploadFile.name);
    }

    if (this.EwayBillUploadFile == null) {
      formdata.append('EwayBillfile', this.EwayBillUploadFile);
    } else {
      formdata.append('EwayBillfile', this.EwayBillUploadFile, this.EwayBillUploadFile.name);
    }
    formdata.append('jsonDetail', JSON.stringify(objdata));
    this._MaterialMovementService.AddUpdateMaterialTrackerDetail(formdata).subscribe(data => {
      this.Loader.hide();
      if (data.Status == 1) {
        this.Loader.hide();
        setTimeout(() => {
          alert('your data has been save successfully');
        }, 300);
        this.model.EditPONo = "";
        this.clearEditForm();
      } else if (data.Status == 2) {
        this.Loader.hide();
        setTimeout(() => {
          alert('your data update successfully')
        }, 300);
      }
      else if (data.Status == 3) {
        this.Loader.hide();
        setTimeout(() => {
          alert('your invoice no already exists')
        }, 300);
      } else if (data.Status == 0) {
        this.Loader.hide();
        alert(data.Remarks)

      }
    });
  }


  addRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.SiteName = "";
    objNewItemGrid.CustomerSiteId = "";
    objNewItemGrid.ReasonCode = "";
    objNewItemGrid.CustomerCode = "";
    objNewItemGrid.CustomerId = 0;
    objNewItemGrid.MTQty = "";
    objNewItemGrid.Qty = "";
    objNewItemGrid.Rate = "";
    objNewItemGrid.ValueQty = "";
    objNewItemGrid.TotalAmount = "";
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.TaxWith = "1";
    this.dynamicArray.push(objNewItemGrid);
    return true;
  }

  deleteRow(index) {
    ////////debugger

    if (this.dynamicArray.length == 1) {
      //this.toastr.error("Can't delete the row when there is only one row", 'Warning');  
      return false;

    } else {
      this.dynamicArray.splice(index, 1);
      //this.toastr.warning('Row deleted successfully', 'Delete row');  
      this.fnBindItemGrossToatl();
      return true;
    }

  }

  ChangeUnit() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.UnitName').val();
      if (valueItem != "0") {
        $(this).find('.UnitName').css('border-color', '');
      }
    });
  }

  InvoiceNoKeyPress() {
    $("#txtInvoiceNo").css('border-color', '');
  }
  onKeypressChallanDate(event: any) {
    $("#txtInvoiceDate").css('border-color', '');
  }
  validation() {
    var flag = 0;
    var totalamount = 0.0;

    // if (this.model.EditCompanyId == "null" || this.model.EditCompanyId== "0") {
    //   $('#ddlEditCompanyId').css('border-color', 'red');
    //   $('#ddlEditCompanyId').focus();
    //   flag = 1;
    // } else {
    // $("#ddlEditCompanyId").css('border-color', '');
    // }

    if (this.SelectedEditVendorList == [] || this.SelectedEditVendorList.length == 0 || this.SelectedEditVendorList == null) {
      $('#ddlEditVendor .selected-list .c-btn').css('border-color', 'red');
      $('#ddlEditVendor .selected-list .c-btn').focus();
      flag = 1;
    } else {
      $("#ddlEditVendor .selected-list .c-btn").css('border-color', '');
    }

    if (this.model.EditStateId == "null" || this.model.EditStateId == "0") {
      $('#ddlEditStateId').css('border-color', 'red');
      $('#ddlEditStateId').focus();
      flag = 1;
    } else {
      $("#ddlEditStateId").css('border-color', '');
    }

    if (this.model.EditWHId == "null" || this.model.EditWHId == "0") {
      $('#ddlEditWHId').css('border-color', 'red');
      $('#ddlEditWHId').focus();
      flag = 1;
    } else {
      $("#ddlEditWHId").css('border-color', '');
    }

    if (this.model.InvoiceNo == "") {
      $('#txtInvoiceNo').css('border-color', 'red');
      $('#txtInvoiceNo').focus();
      flag = 1;
    } else {
      $("#txtInvoiceNo").css('border-color', '');
    }

    if (this.model.InvoiceDate == "") {
      $('#txtInvoiceDate').css('border-color', 'red');
      $('#txtInvoiceDate').focus();
      flag = 1;
    } else {
      $("#txtInvoiceDate").css('border-color', '');
    }

    for (var icount = 0, len = this.dynamicArray.length; icount < len; icount++) {
      if (this.dynamicArray[icount].ItemNameId == "" || this.dynamicArray[icount].ItemNameId == "null" || this.dynamicArray[icount].ItemNameId == "0") {

        $('#ddlItemNameId_' + icount).css('border-color', 'red');
        $('#ddlItemNameId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemNameId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemMakeId == "" || this.dynamicArray[icount].ItemMakeId == "null" || this.dynamicArray[icount].ItemMakeId == "0") {
        $('#ddlItemMake_' + icount).css('border-color', 'red');
        $('#ddlItemMake_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemMake_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemId == "" || this.dynamicArray[icount].ItemId == "null" || this.dynamicArray[icount].ItemId == "0") {
        $('#ddlItemId_' + icount).css('border-color', 'red');
        $('#ddlItemId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemId_" + icount).css('border-color', '');
      }
      if (this.dynamicArray[icount].UnitName == "" || this.dynamicArray[icount].UnitName == "0") {
        $('#ddlUnitName_' + icount).css('border-color', 'red');
        $('#ddlUnitName_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlUnitName_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].MTQty == "0" || this.dynamicArray[icount].MTQty == "0.00" || this.dynamicArray[icount].MTQty == "") {
        alert("Please delete item Row ");
        // $('#txtQty_'+icount).css('border-color', 'red');
        $('#txtQty_' + icount).focus();
        flag = 1;
      } else {
        $("#txtQty_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].Rate == "0" || !isNumeric(this.dynamicArray[icount].Rate) == true || this.dynamicArray[icount].Rate == "") {

        $('#txtRate_' + icount).css('border-color', 'red');
        $('#txtRate_' + icount).focus();
        flag = 1;
      } else {
        $("#txtRate_" + icount).css('border-color', '');
      }

      // if (this.dynamicArray[icount].SGSTRate == "0" && this.dynamicArray[icount].IGSTRate == "0") {
      //   $('#txtIGSTRate_' + icount).css('border-color', 'red');
      //   $('#txtSGSTRate_' + icount).css('border-color', 'red');
      //   flag = 1;
      // } else {
      //   $("#txtIGSTRate_" + icount).css('border-color', '');
      //   $("#txtSGSTRate_" + icount).css('border-color', '');
      // }





      var qty = 0.0;
      var Rate = 0.0;
      if (isNumeric(this.dynamicArray[icount].Qty) == true) {
        qty = parseFloat(this.dynamicArray[icount].Qty);
      }
      if (isNumeric(this.dynamicArray[icount].Qty) == true) {
        Rate = parseFloat(this.dynamicArray[icount].Rate);
      }
      totalamount += (qty * Rate);
    }

    if (totalamount > 5000 && this.EditPoId == 0) {
      flag = 1;
      alert("Please Add PO No.");
    }
    return flag;
  }
  //#endregion
}
