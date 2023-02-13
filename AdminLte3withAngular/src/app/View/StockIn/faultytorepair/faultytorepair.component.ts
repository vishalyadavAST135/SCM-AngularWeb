import { DatePipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { first } from 'rxjs/operators';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { StockserviceService } from 'src/app/Service/stockservice.service';
import { ApprovelStatusModel, CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, MenuName } from 'src/app/_Model/commonModel';
import { DispatchTrackingItemDetialModel, SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { CellNo, DynamicItemGrid, DynamicStockPdfGrid, GSerialNumber, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { SaveUpdateStockQtyModel, StockQtyModel } from 'src/app/_Model/StockModel';
import { CompanyModel } from 'src/app/_Model/userModel';
declare var jQuery: any;
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var PDFdata = null;

@Component({
  selector: 'app-faultytorepair',
  templateUrl: './faultytorepair.component.html',
  styleUrls: ['./faultytorepair.component.sass'],
  providers: [DatePipe]
})
export class FaultytorepairComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  dynamicArray: Array<DynamicItemGrid> = [];
  dynamicStockPdfGrid: Array<DynamicStockPdfGrid> = [];
  isShownList: boolean;
  isShownEdit: boolean;
  dynamicGSerialNumberArray: Array<GSerialNumber> = [];
  CommonSearchPanelData: any;
  CompanyId: any;
  UserId: any;
  UserName: any;
  WareHouseId: any;
  SearchItemNameList: any;
  EquipmentTypeList: any;
  ClientList: any;
  totalSumQuantity: any;
  totalSumAmount: any;
  totalSumPOQuantity: any;
  totalamount: number;
  IsUnitConversion: boolean;
  FilterEquipmentTypeList: any;
  FilterNewTypeList: any;
  WHStateList: any;
  WHList: any;
  SerialNoList: any;
  srnlst: Array<GSerialNumber> = [];
  celllst: Array<CellNo> = [];
  indexv: any;
  strcount: any;
  firstValue: any;
  lastValue: any;
  isEdit: boolean = false;
  headerItemName: string;
  BBChangeValue: string;
  errorMessage: string;
  IsError: boolean = false;
  IsSuccess: boolean = false;
  succesMessage: string;
  loading: boolean = false;
  SerialNoTableShowhide: boolean = false;
  OkFaultyStockItem: any[];
  IsSaveButtonDisable: boolean;
  public columnDefs = [];  //grid column
  public rowData = [];   //  grid data
  tooltipShowDelay: any;
  frameworkComponents: any;
  public multiSortKey: string;
  ItemEditDataArr: any = [];
  TableHeight: number[];
  FaultuRep_Id: any = 0;
  public loadingTemplate;
  DocumentNokeyword = 'DocumentNo';
  AutoCompleteDocumentNoList: any;
  IsDocumentShowHide: boolean = false;
  gridApi: any;
  UploadCertificateFile: any;
  RepairedTypeData: any;
  isPdfPreview: boolean;
  UploadInvoiceFile: any;
  VendorList: any;
  NatureFaultyList: any;
  RepairedEmployeeList: any;
  TestedEmployeeList: any;
  IsSaveDisabled: boolean;
  headerQty: any;
  IsRepaired: boolean;
  IsTested: boolean;
  searchText: any;
  NatureBerList: any;
  IsPreviewPdfHide: boolean;
  IsHideShowCancelBtn: boolean;
  CancelReasonData: any;
  DisableSerialNoField: boolean = true;
  FlagForSerialNo: number;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  constructor(private datePipe: DatePipe, private _objSearchpanelService: SearchpanelService,
    private _Commonservices: CommonService, private _StockserviceService: StockserviceService,
    private _PurchaseOrderService: PurchaseOrderService,
    private _MaterialMovementService: MaterialMovementService,
    private _GrncrnService: GrncrnService,) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
    }
    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
  }

  ngOnInit(): void {
    this.model.WHStateId = "0";
    this.model.WHId = "0";
    this.model.RepairDate = "0"
    this.model.RepairedType = "0";
    this.model.InvoiceValue = 0.00;
    this.model.VendorName = "0";
    this.model.ddlActive = "2";
    this.isShownList = true;
    this.isShownEdit = false;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.model.CompanyName = objCompanyModel.FullName;
    this.BindCompanyStateVendorItem();

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowFaultyRepDetail.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      // {
      //   headerName: 'Approval [L1,L2,L3,L4]',
      //   cellRendererFramework: ApprovalrendererComponent,
      //   pinned: 'left',
      //   width: 110,
      //   filter: false,
      //   resizable: true,
      //   field: 'DisatchTrackeringId',
      //   tooltipField: 'DisatchTrackeringId', tooltipComponent: 'approvalTooltip',
      // },
      {
        headerName: 'Document',
        cellRendererSelector: function (params) {
          var ShowFile = {
            component: 'fileRenderer'
          };
          var HideFile = {
            component: ''
          };
          if (params.data.DocumentFile == null || params.data.DocumentFile == '') {
            return HideFile
          }
          else {
            return ShowFile;
          }
        }, cellRendererParams: {
          onClick: this.onfiledownload.bind(this),
          label: 'File'
        }, pinned: 'left',
        width: 100,
        filter: false
      },
      { headerName: 'Certification No', field: 'RepairedCertificationNo', width: 180 },
      { headerName: 'WH Name', field: 'WHName', width: 150 },
      { headerName: 'Equipment Type', field: 'OldEquepmentType', width: 130, sortable: true },
      { headerName: 'Item Name', field: 'ItemName', width: 150 },
      { headerName: 'Item Description', field: 'ItemDescription', cellClass: "cell-wrap-text", tooltipField: 'ItemDescription', tooltipComponent: 'customtooltip', width: 150, resizable: true },
      { headerName: 'Unit Name', field: 'UnitName', width: 100 },
      { headerName: 'Repair Date', field: 'RepairDate', width: 120 },
      { headerName: 'Remarks', field: 'Remarks', width: 200 },

    ];
    this.multiSortKey = 'ctrl';
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">loading...</span>`;
    //this.SearchFaultyRepPDFDataById();
    this.model.InCaseReason = "0";
    this.RepairedType();
    this.ItemReason();
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.FaultuRep_Id);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.RepairedCertification).subscribe(data => {
      if (data.Status == 1) {
        console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
        this.ObjUserPageRight.IsBulkPdfDwnload = data.Data[0].IsBulkPdfDwnload;
        this.ObjUserPageRight.IsGenPdf = data.Data[0].IsGenPdf;
        this.ObjUserPageRight.IsDelete = data.Data[0].IsDelete;
        debugger
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



  SearchSTNCleared() {
    this.AutoCompleteDocumentNoList = [];
    this.model.DocumentNoData = "";
    this.dynamicArray = [];
    this.FaultyRepairedTestedBy();
  }
  onfiledownload(e) {
    window.open(e.rowData.DocumentFile);
  };

  onChangeSearch(val: string) {
    this.AutoCompleteDocumentNoList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'Faulty';
    this._GrncrnService.GetAutoCompleteDocumentNo(objdropdownmodel).subscribe((data) => {
      if (data.Data != null) {
        this.AutoCompleteDocumentNoList = data.Data;
      }
    })
  }

  FaultyRepairedTestedBy() {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Flag = '';
    this._StockserviceService.GetAllFaultyRepairedTestedBy(objdropdownmodel).subscribe((data) => {
      if (data.FaultyData != null) {
        this.NatureFaultyList = data.FaultyData;
      }
      if (data.RepairedData != null) {
        this.RepairedEmployeeList = data.RepairedData;
      }
      if (data.TestedData != null) {
        this.TestedEmployeeList = data.TestedData;
      }
      if (data.NatureBerData != null) {
        this.NatureBerList = data.NatureBerData;
      }
    })
  }


  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      objCSVTdata.VendorArray = this.apiCSVIData.VendorArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      this.VendorList = objCSVTdata.VendorArray;
      this.WHStateList = objCSVTdata.StateArray;
      this.FilterEquipmentTypeList = this.EquipmentTypeList;
      //this.FilterEquipmentTypeList = this.EquipmentTypeList.filter(m =>m.id !== 4 && m.id !== 2);
      this.ClientList = objCSVTdata.ClientArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }

  RepairedType() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "2560";//1526
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'RepairedType';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        if (item.Data != null) {
          this.RepairedTypeData = item.Data
        }

      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "DispatchItemReason", "Dispatch");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "DispatchItemReason", "Dispatch");
    }
  }

  ChangeEditItemName(ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemName').val();
        if (valueItem != '0') {
          $(this).find('.ItemName').css('border-color', '');
        }
      });

      if (this.model.WHId == "0") {
        this.dynamicArray[index].ItemNameId = "0";
        alert('please select WH Name')
        return false;
      }
      var FilterData = this.SearchItemNameList.filter(
        m => m.id === parseInt(ItemNameId));
      this.dynamicArray[index].ItemName = FilterData[0].itemName;
      this.dynamicArray[index].Class = FilterData[0].Class;
      this.dynamicArray[index].Scrap = 0;
      this.dynamicArray[index].Repaired = 0;
      this.dynamicArray[index].FaultyQty = 0;
      this.dynamicArray[index].EditItemMake = [];
      this.dynamicArray[index].EditItemCode = [];
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'ItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.dynamicArray[index].EditItemMake = item.Data
        this.dynamicArray[index].ItemMakeId = "0"
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemName", "FaultyToRepair");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemName", "FaultyToRepair");
    }
  }

  ChangeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemMake').val();
        if (valueItem != '0') {
          $(this).find('.ItemMake').css('border-color', '');
        }
      });
      var FilterData = this.dynamicArray[index].EditItemMake.filter(
        m => m.id === parseInt(ItemMakeId));
      this.dynamicArray[index].MakeName = FilterData[0].itemName;

      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Other_Id = ItemMakeId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemCode';
      this.dynamicArray[index].EditItemCode = [];
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.dynamicArray[index].EditItemCode = item.Data
        this.dynamicArray[index].ItemId = "0";
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemMake", "FaultyToRepair");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemMake", "FaultyToRepair");
    }
  }

  ChangeEditItemCode(ItemId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemCode').val();
        if (valueItem != '0') {
          $(this).find('.ItemCode').css('border-color', '');
        }
      });
      var FilterData = this.dynamicArray[index].EditItemCode.filter(
        m => m.id === parseInt(ItemId));
      this.dynamicArray[index].ItemCode = FilterData[0].itemName;

      this.dynamicArray[index].EqTypeId = "0";
      this.dynamicArray[index].ClientId = "0";
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = ItemId;
      objVendormodel.flag = 'ItemMaster';
      this._Commonservices.getVendorOrWh(objVendormodel).pipe(first()).subscribe(data => {
        this.dynamicArray[index].ItemDescription = data.Data[0].ItemDescription;
        this.dynamicArray[index].UnitList = [];
        if (data.Data[0].UnitList.length == 1) {
          this.dynamicArray[index].UnitList = data.Data[0].UnitList;
          this.dynamicArray[index].UnitName = this.dynamicArray[index].UnitList[0].Id;
          this.dynamicArray[index].Unit = this.dynamicArray[index].UnitList[0].UnitName;
        } else {
          this.dynamicArray[index].UnitName = "0";
          this.dynamicArray[index].UnitList = data.Data[0].UnitList;
        }


        // if (data.Data[0].IsConversion != null && data.Data[0].IsConversion != 0) {
        //   this.dynamicArray[index].HideShowConValue = true;
        //   this.dynamicArray[index].UnitName = data.Data[0].ConversionUnit;
        //   this.dynamicArray[index].ConversionUnit = data.Data[0].UnitName;
        //   this.dynamicArray[index].IsConversion = data.Data[0].IsConversion
        //   this.dynamicArray[index].HideConversionValue = data.Data[0].ConversionValue;
        // } else {
        //   this.dynamicArray[index].Qty = "";
        //   this.dynamicArray[index].ConversionUnit = "";
        //   this.dynamicArray[index].HideConversionValue = "";
        //   this.dynamicArray[index].IsConversion = "";
        //   this.dynamicArray[index].HideShowConValue = false;
        //   // this.dynamicArray[index].UnitName = data.Data[0].UnitName;
        // }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "ChangeEditItemCode", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "ChangeEditItemCode", "WHTOSite");
    }
  }

  ChangeEqupmnet(Id: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.EqType').val();
        if (valueItem != '0') {
          $(this).find('.EqType').css('border-color', '');
        }
      });
      var FilterData = this.FilterEquipmentTypeList.filter(
        m => m.id === parseInt(Id));
      this.dynamicArray[index].EqpType = FilterData[0].itemName;
      if (Id == 3) {
        this.FilterNewTypeList = this.EquipmentTypeList.filter(m => m.id !== parseInt(Id) && m.id !== 1);
      } else if (Id == 2) {
        this.FilterNewTypeList = this.EquipmentTypeList.filter(m => m.id !== parseInt(Id) && m.id !== 1);
      }
      else {
        this.FilterNewTypeList = this.EquipmentTypeList.filter(m => m.id !== parseInt(Id));
      }
      this.dynamicArray[index].Qty = "";
      this.dynamicArray[index].ClientId = "0";
    } catch (Error) {
      console.log(Error.message)
    }
  }

  ChangeClient(ClientId: any, index: any) {
    console.log(ClientId, index);
    this.SerialNoList = null;
    this.SerialNoTableShowhide = false;
    var FilterData = this.ClientList.filter(m => m.Id === parseInt(ClientId));
    console.log(FilterData);
    this.dynamicArray[index].CustomerName = FilterData[0].Name;
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Client').val();
      if (valueItem != '0') {
        $(this).find('.Client').css('border-color', '');
      }
      $(this).find('.Qty').css('border-color', '');
    });
    // Brahamjot kaur 27/06/2022
    // if (this.dynamicArray[index].Class == "1519" && ClientId == '60') {
    this.dynamicArray[index].IsDisabled = true;
    // } else {
    //   this.dynamicArray[index].IsDisabled = false;
    // }
    this.dynamicArray[index].Repaired = 0;
    this.dynamicArray[index].Scrap = 0;
    this.dynamicArray[index].FaultyQty = 0;
    try {
      var objStockQtyModel = new StockQtyModel();
      objStockQtyModel.Client_Id = ClientId;
      objStockQtyModel.ItemCode_Id = this.dynamicArray[index].ItemId;
      objStockQtyModel.WH_Id = this.model.WHId;
      objStockQtyModel.Equp_Id = this.dynamicArray[index].EqTypeId;
      objStockQtyModel.Company_Id = this.CompanyId;
      this.SerialNoList = [];
      this.dynamicArray[index].GSerialNumbers = [];
      this._StockserviceService.GetAllStockQtyByItemCode(objStockQtyModel).pipe(first()).subscribe(data => {
        //console.log(data);
        if (data.Status = 1) {
          if (data.Data != null) {
            this.dynamicArray[index].Qty = data.Data[0].StockQty;
            this.dynamicArray[index].FQty = data.Data[0].StockQty;
          } else {
            this.dynamicArray[index].Qty = 0;
            this.dynamicArray[index].FQty = 0;
          }
          // brahamjot kaur 28/6/2022
          if (data.SerialNoData != null) {
            this.SerialNoList = data.SerialNoData;
            //this.dynamicArray[index].GSerialNumbers= this.SerialNoList;
            if (this.SerialNoList.length > 0) {
              for (var i = 0; i < parseInt(this.SerialNoList.length); i++) {
                var srnData = new GSerialNumber();
                srnData.Ischecked = false;
                srnData.InitialSrno = this.SerialNoList[i].InitialSrno;
                srnData.UniqueId = this.SerialNoList[i].Id;
                this.dynamicArray[index].GSerialNumbers.push(srnData)
              };
            }
          } else {

            this.SerialNoList = null;
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetAlllStockQty", "FaultyToRepair");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetAlllStockQty", "FaultyToRepair");
    }


  }

  ChangeRepairedEmpType(Id: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.RepairedById').val();
        if (valueItem != '0') {
          $(this).find('.RepairedById').css('border-color', '');
        }
      });
      var FilterData = this.RepairedEmployeeList.filter(
        m => m.Id === Id);
      this.dynamicArray[index].RepairedName = FilterData[0].Name;
      if (this.dynamicArray[index].RepairedName == 'Other') {
        this.IsRepaired = true;
        $('#tblOne > tbody  > tr').each(function () {
          var valueItem = $(this).find('.RepairedBy').val();
          if (valueItem == '') {
            $(this).find('.RepairedBy').css('border-color', 'red');
          }
        });
      } else {
        this.IsRepaired = false;
        $('#tblOne > tbody  > tr').each(function () {
          $(this).find('.RepairedBy').css('border-color', '');
        });
      }
    } catch (Error) {
      console.log(Error.message)
    }
  }

  ChangeTestedType(Id: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.TestedById').val();
        if (valueItem != '0') {
          $(this).find('.TestedById').css('border-color', '');
        }
      });
      var FilterData = this.TestedEmployeeList.filter(
        m => m.Id === Id);
      this.dynamicArray[index].TestedName = FilterData[0].Name;
      if (this.dynamicArray[index].TestedName == 'Other') {
        this.IsTested = true;
        $('#tblOne > tbody  > tr').each(function () {
          var valueItem = $(this).find('.TestedBy').val();
          if (valueItem == '') {
            $(this).find('.TestedBy').css('border-color', 'red');
          }
        });
      } else {
        this.IsTested = false;
        $('#tblOne > tbody  > tr').each(function () {
          $(this).find('.TestedBy').css('border-color', '');
        });
      }
    } catch (Error) {
      console.log(Error.message)
    }
  }

  ChangeNatureBer(Id: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.NatureBerId').val();
        if (valueItem != '0') {
          $(this).find('.NatureBerId').css('border-color', '');
        }
      });
      var FilterData = this.NatureBerList.filter(
        m => m.Id === parseInt(Id));
      this.dynamicArray[index].NatureBerName = FilterData[0].Name;
    } catch (Error) {
      console.log(Error.message)
    }
  }

  HSNKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.HSN').val();
      if (valueItem != '0') {
        $(this).find('.HSN').css('border-color', '');
      }
    });
  }


  blurScrap(value: any, index: any) {
    $('#txtScrap_' + index).css('border-color', '');
    $('#txtRepaired_' + index).css('border-color', '');
    $('#txtfaulty_' + index).css('border-color', '');
    //brahamjot kaur 28/6/2022
    if (this.IsMandatory(index) == true) {
      if (this.dynamicArray[index].Scrap != '' || this.dynamicArray[index].Scrap != 0) {
        this.dynamicArray[index].Repaired = 0;
        this.dynamicArray[index].FaultyQty = 0;
      }
    }

    if ((parseInt(this.dynamicArray[index].Scrap) + parseInt(this.dynamicArray[index].Repaired)
      + parseInt(this.dynamicArray[index].FaultyQty)) > parseInt(this.dynamicArray[index].Qty)) {
      this.dynamicArray[index].Repaired = 0;
      this.dynamicArray[index].Scrap = 0;
      this.dynamicArray[index].FaultyQty = 0;
    }
  }

  blurRepaired(value: any, index: any) {
    $('#txtScrap_' + index).css('border-color', '');
    $('#txtRepaired_' + index).css('border-color', '');


    //brahamjot kaur 28/6/2022
    if (this.IsMandatory(index) == true) {
      if (this.dynamicArray[index].Repaired != '' || this.dynamicArray[index].Repaired != 0) {
        this.dynamicArray[index].Scrap = 0;
        this.dynamicArray[index].FaultyQty = 0;
      }
    }

    if ((parseInt(this.dynamicArray[index].Scrap) + parseInt(this.dynamicArray[index].Repaired)
      + parseInt(this.dynamicArray[index].FaultyQty)) > parseInt(this.dynamicArray[index].Qty)) {
      this.dynamicArray[index].Repaired = 0;
      this.dynamicArray[index].Scrap = 0;
      this.dynamicArray[index].FaultyQty = 0;
    }

  }

  QtyKeyPress(index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Qty').val();
      if (valueItem != '0') {
        $(this).find('.Qty').css('border-color', '');
      }
    });
    this.dynamicArray[index].GSerialNumbers = [];
  }


  ChangeNewType(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueReceivedQty = $(this).find('.TypeFaultyId').val();
      if (valueReceivedQty != '0') {
        $(this).find('.TypeFaultyId').css('border-color', '');
      }
    });
    var FilterData = this.ClientList.filter(m => m.Id === parseInt(Id));
    this.dynamicArray[index].TypeFaulty = FilterData[0].Name;
    if (this.dynamicArray[index].TypeFaulty = 'other') {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.MaterialUsed').val();
        if (valueItem == '') {
          $(this).find('.MaterialUsed').css('border-color', 'red');
        }
      });
    } else {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.MaterialUsed').val();
        if (valueItem != '') {
          $(this).find('.MaterialUsed').css('border-color', '');
        }
      });
    }
  }

  ChangeRepairedType(Id: any) {
    $('#txtRepairedType').attr('style', 'border-color: ');
    var FilterData = this.RepairedTypeData.filter(m => m.id === parseInt(Id));
    this.model.Repaired = FilterData[0].RepairedName;
    if (Id == 0) {
      this.IsDocumentShowHide = false;
    } else if (Id != 2561) {
      this.IsDocumentShowHide = true;
    } else {
      this.IsDocumentShowHide = false;
    }
  }

  ChangeVendorType(Id: any) {
    var FilterData = this.VendorList.filter(m => m.id === parseInt(Id));
    this.model.PreviewVendorName = FilterData[0].itemName;
    $("#txtVendorType").css('border-color', '');
  }

  onFocused(event) {

  }


  ChangeToState(StateId: any) {
    try {
      $('#txtTOWHStateId').attr('style', 'border-color: ');
      var FilterData = this.WHStateList.filter(m => m.id === parseInt(StateId));
      this.model.StateName = FilterData[0].itemName;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = 'OtherWHMaster';
      this.WHList = [];
      this.model.WHId = "0";
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(wh => {
        if (wh.Data != null && wh.Data != "") {
          this.WHList = wh.Data;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHList", "STNDetail");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEditWHList", "WHTOSite");
    }
  }


  ChangeSerialNo(value: any) {
    this.dynamicArray[this.indexv].SerialNo = value;
    $('#tblOne > tbody  > tr').each(function () {
      $(this).find('.SerialNo').css('border-color', '');
    });
  }

  ItemReason() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "1502";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'CommonReason';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.CancelReasonData = item.Data
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "CRNItemReason", "CRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "CRNItemReason", "CRN");
    }
  }

  ChangeWH(Id: any) {
    $('#txtWHId').attr('style', 'border-color: ');
    var FilterData = this.WHList.filter(m => m.id === parseInt(Id));
    this.model.WHName = FilterData[0].itemName;
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = Id;
    objVendormodel.flag = 'WHMaster';
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(Wh => {
      if (Wh.Data != null) {
        this.model.WHGSTIN = Wh.Data[0].WHGSTINNo;
        this.model.WHAddress = Wh.Data[0].WHAddress;
      }
    });
    this.dynamicArray = [];
    this.addRow();
  }

  CreateNew() {
    this.IsSaveDisabled = false;
    this.IsHideShowCancelBtn = false;
    this.dynamicArray = [];
    this.isShownList = false;
    this.isShownEdit = true;
    this.IsPreviewPdfHide = true;
    this.model.WHStateId = "0";
    this.model.WHId = "0";
    this.model.RepairedType = "0";
    this.model.InvoiceValue = "0.00";
    this.model.InvoiceDate = "";
    this.model.RepairDate = "";
    this.FaultuRep_Id = 0;
    this.model.VendorName = "0";
    this.SearchSTNCleared();
    this.SerialNoList = [];
    this.addRow();
    //this.clearEditForm();
  }
  BackPage() {
    this.isShownList = true;
    this.isShownEdit = false;
  }

  addRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.Qty = 0;
    objNewItemGrid.Remarks = "";
    objNewItemGrid.EqTypeId = "0";
    objNewItemGrid.ConversionUnit = "";
    objNewItemGrid.ConversionValue = "";
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.SerialNo = "";
    objNewItemGrid.Scrap = 0;
    objNewItemGrid.Repaired = 0;
    objNewItemGrid.FaultyQty = 0;
    if (this.CompanyId == 4) {
      objNewItemGrid.ClientId = "0";
    } else {
      objNewItemGrid.ClientId = "99999";
    }
    objNewItemGrid.TypeFaultyId = "0";
    objNewItemGrid.TestingTime = "";
    objNewItemGrid.MaterialUsed = "";
    objNewItemGrid.TestingLoad = "";
    objNewItemGrid.RepairedBy = "";
    objNewItemGrid.TestedBy = "";
    objNewItemGrid.TestedById = 0;
    objNewItemGrid.RepairedById = 0;
    objNewItemGrid.NatureBerId = 0;
    this.dynamicArray.push(objNewItemGrid);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArray.length == 1) {
      //this.toastr.error("Can't delete the row when there is only one row", 'Warning');  
      return false;

    } else {
      this.dynamicArray.splice(index, 1);
      //this.toastr.warning('Row deleted successfully', 'Delete row');  
      // this.fnBindItemGrossToatl();
      return true;
    }

  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  //#region Code By Umesh
  showModal(value, index): void {
    this.indexv = index;
    var ItemNameId = this.dynamicArray[this.indexv].ItemNameId
    const result = this.SearchItemNameList.filter(element => {
      return element.id === parseInt(ItemNameId);
    });
    this.headerItemName = result[0].itemName;
    this.headerQty = this.dynamicArray[this.indexv].Qty;


    if (ItemNameId != "4") {
      this.genrateOther(index);
    } else {
      var untName = this.dynamicArray[this.indexv].UnitName
      if (untName != 'ST') {
        this.genrateOther(index);
      }
      else {
        if (this.isEdit == false) {
          // this.genrateBb(48);
          this.genrateOther(index);
        }
        else {
          this.editBB(index);
        }
      }

    }
  }

  genrateOther(index: any) {

    // var currentAcceptQty = 0;
    // var lastAcceptQty = 0;
    // currentAcceptQty = parseInt(this.dynamicArray[index].Qty);
    // lastAcceptQty = this.srnlst.length
    // if (lastAcceptQty != currentAcceptQty) {
    //   this.srnlst = [];
    // }
    // var lngt = this.dynamicArray[index].GSerialNumbers.length;
    // if (lngt == 0) {
    //this.srnlst = [];
    //   this.dynamicArray[index].InitiallValue = ''
    //   this.dynamicArray[index].lastValue = ''
    //   for (var i = 0; i < parseInt(this.dynamicArray[index].Qty); i++) {
    //     var srnData = new GSerialNumber();
    //     srnData.InitialSrno = '';
    //     this.srnlst.push(srnData)
    //   }
    //   this.strcount = this.srnlst.length;
    // } else {

    //   this.srnlst = this.dynamicArray[index].GSerialNumbers;
    // }
    this.srnlst = [];
    for (var i = 0; i < parseInt(this.dynamicArray[index].Qty); i++) {
      var srnData = new GSerialNumber();
      srnData.Ischecked = false;
      var srnLength = this.dynamicArray[index].GSerialNumbers.length;
      if (i < srnLength) {
        srnData.InitialSrno = this.dynamicArray[index].GSerialNumbers[i].InitialSrno;
      } else {
        srnData.InitialSrno = "";
      }
      this.srnlst.push(srnData);
    };

    var id = "#myModal";
    jQuery(id).modal('show');

    jQuery('#myModal').modal({
      backdrop: 'static',
      keyboard: false  // to prevent closing with Esc button (if you want this too)
    });
  }

  addBb() {
    for (var j = 0; j < this.srnlst.length; j++) {
      for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
        var obj = new GSerialNumber();
        obj.InitialSrno = this.srnlst[j].CellNos[i].CellValue;
        obj.Sequance = j.toString();
        this.dynamicArray[this.indexv].GSerialNumbers.push(obj)
      }
    }
    jQuery("#bb").modal('hide');
  }

  genrateBb(value) {
    var cellVoltId = this.dynamicArray[this.indexv].ItemId;
    const result = this.dynamicArray[this.indexv].EditItemCode.filter(element => {
      return element.id === parseInt(cellVoltId);
    });
    var cellVolt = result[0].CellVolt;
    value = value / cellVolt;
    var lngt = this.dynamicArray[this.indexv].GSerialNumbers.length;
    var currentAcceptQty = 0;
    var lastAcceptQty = 0;
    currentAcceptQty = parseInt(this.dynamicArray[this.indexv].Qty);
    lastAcceptQty = this.srnlst.length
    if (this.isEdit == false) {
      if (lastAcceptQty != currentAcceptQty) {
        this.srnlst = [];
      }
    }
    for (var i = 0; i < parseInt(this.dynamicArray[this.indexv].Qty); i++) {
      var srnData = new GSerialNumber();
      if (lngt != parseInt(this.dynamicArray[this.indexv].Qty)) {
        srnData.InitialSrno = '';
        srnData.BBInitial = ''
        srnData.BBLast = ''
        for (var j = 0; j < value; j++) {
          var oc = new CellNo();
          oc.Sequance = i.toString();
          oc.CellValue = '';
          srnData.CellNos.push(oc);
        }
        srnData.InitialSrno = '';
        this.srnlst.push(srnData)
        //this.dynamicArray[this.indexv].GSerialNumbers.push(srnData);
      }
    }
    this.strcount = this.srnlst.length;
    jQuery('#bb').modal('show');
  }

  ChangeBBC() {
    this.dynamicArray[this.indexv].GSerialNumbers = [];
    this.srnlst = [];
    this.genrateBb(this.BBChangeValue);
  }

  editBB(index) {
    this.srnlst = this.dynamicArray[index].GSerialNumbers;
    jQuery('#bb').modal('show');
  }

  addBtn(index: any) {
    var FilterData = this.srnlst.filter(m => m.Ischecked === true);
    if (FilterData.length != 0) {
      this.dynamicArray[index].GSerialNumbers = FilterData;
    } else {
      this.dynamicArray[index].GSerialNumbers = [];
    }
    jQuery("#myModal").modal('hide');
    this.IsError = false;
  }

  bbChange(index: any) {
    this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
    var lstvale = this.getLastNumber(this.srnlst[index].BBLast);
    var firstVale = this.getLastNumber(this.srnlst[index].BBInitial);
    var inmentValue = this.srnlst[index].BBInitial;
    var diff = lstvale - firstVale;
    for (var i = 0; i < diff; i++) {
      if (i == 0) {
        this.srnlst[index].CellNos[i].CellValue = this.srnlst[index].BBInitial;
      } else {
        inmentValue = this.getAndIncrementLastNumber(inmentValue)
        this.srnlst[index].CellNos[i].CellValue = inmentValue;
      }
    }
  }

  ddlChange() {
    this.genrateBb(96)
  }

  getAndIncrementLastNumber(str) {
    return str.replace(/\d+$/, function (s) {
      return +s + 1;
    });
  }

  hidebbModal(): void {
    jQuery("#bb").modal('hide');
  }

  hideModal(): void {
    jQuery("#myModal").modal('hide');
  }

  initialsrn() {
    this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
    var lstvale = this.getLastNumber(this.lastValue);
    var firstVale = this.getLastNumber(this.firstValue);
    var diff = lstvale - firstVale;
    if (lstvale != '') {
      var incerMentValue = this.firstValue;
      for (var i = 0; i < diff; i++) {
        if (i == 0) {
          this.dynamicArray[this.indexv].GSerialNumbers[i].InitialSrno = this.firstValue;
        } else {
          incerMentValue = this.getAndIncrementLastNumber(incerMentValue);
          this.dynamicArray[this.indexv].GSerialNumbers[i].InitialSrno = incerMentValue;
        }
      }
    }
  }

  getLastNumber(source) {
    var lastNum = source.replace(/.*?(\d+)[^\d]*$/, '$1')
    return lastNum;
  }

  validateItemData() {
    var returnValue = 0;
    for (var i = 0; i < this.dynamicArray.length; i++) {
      var ItemNameId = this.dynamicArray[i].ItemNameId
      const result = this.SearchItemNameList.filter(element => {
        return element.id === parseInt(ItemNameId);
      });
      var itmName = result[0].itemName;
      if (this.IsMandatory(i) == true) {
        var srnlength = this.dynamicArray[i].GSerialNumbers;
        if (srnlength.length == 0) {
          returnValue = 1;
          this.IsError = true;
          this.errorMessage = "Serial no is required for " + itmName + " ";
        }
      }
    }
    return returnValue;
  }

  IsMandatory(index: any) {
    var ItemNameId = this.dynamicArray[index].ItemNameId
    const result = this.SearchItemNameList.filter(element => {
      return element.id === parseInt(ItemNameId);
    });
    console.log(result);
    console.log(result[0].IsSerialReq)
    return result[0].IsSerialReq;
  }
  // IsMandatory(index: any) {
  //   var ItemNameId = this.dynamicArray[index].ItemNameId
  //   var rcvdQty = this.dynamicArray[index].Qty;
  //   if (rcvdQty != "" && rcvdQty != "0.00") {
  //     const result = this.SearchItemNameList.filter(element => {
  //       console.log(element);
  //       return element.id === parseInt(ItemNameId);
  //     });
  //     console.log(result[0].IsSerialReq);
  //     return result[0].IsSerialReq;
  //   }
  // }

  //#endregion


  CheckSerialNo(SerialNo: any, index: any) {
    if (SerialNo.length < 4) {
      alert('Plz enter 4 digit serial no')
      return false;
    }
    var objGSerialNumber = new GSerialNumber();
    objGSerialNumber.InitialSrno = SerialNo;
    objGSerialNumber.WH_Id = this.model.WHId;
    objGSerialNumber.ItemCode_Id = this.dynamicArray[this.indexv].ItemId;
    objGSerialNumber.Equp_Id = this.dynamicArray[this.indexv].EqTypeId;
    objGSerialNumber.Company_Id = this.CompanyId
    try {
      this._StockserviceService.CheckFaultySerialNo(objGSerialNumber).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data == 'Save') {
            alert('Your Serial No' + data.Data);
          } else {
            alert('Your Serial No' + data.Data);
            this.srnlst[index].InitialSrno = '';
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "CheckFaultySerialNo", "Faultytorepair");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "CheckFaultySerialNo", "Faultytorepair");
    }


  }


  conformPopup() {
    // this.IsSaveButtonDisable = true;

    if (this.Validation() == 1) {
      return false;
    } else if (this.dynamicArray.length < 1) {
      alert('please fill atleast one item');
      return false;
    } else if (this.validateStockQty() == 1) {
      setTimeout(function () { this.IsError = false; }, 3000);
      return false;
    } else {

      jQuery('#confirm').modal('show');
    }
  }


  SaveUpDateOkFaultyStock() {
    try {
      jQuery('#confirm').modal('hide');
      var objSaveUpaderStockQtyModel = new SaveUpdateStockQtyModel();
      objSaveUpaderStockQtyModel.FaultuRep_Id = this.FaultuRep_Id;
      objSaveUpaderStockQtyModel.UserId = this.UserId;
      objSaveUpaderStockQtyModel.CompanyId = this.CompanyId;
      objSaveUpaderStockQtyModel.WHId = this.model.WHId;
      objSaveUpaderStockQtyModel.WHStateId = this.model.WHStateId;
      objSaveUpaderStockQtyModel.RepairDate = this._Commonservices.ConvertDateFormat(this.model.RepairDate);
      objSaveUpaderStockQtyModel.Remarks = this.model.Remarks;
      objSaveUpaderStockQtyModel.InvoiceDate = this._Commonservices.ConvertDateFormat(this.model.InvoiceDate);
      objSaveUpaderStockQtyModel.InvoiceValue = this.model.InvoiceValue;
      objSaveUpaderStockQtyModel.RepairedType = this.model.RepairedType;
      objSaveUpaderStockQtyModel.VendorId = this.model.VendorName;

      this.OkFaultyStockItem = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        this.addBtn(i);
        var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
        objDispatchTrackingItemDetialModel.Id = this.dynamicArray[i].Id;
        objDispatchTrackingItemDetialModel.ItemCode_Id = this.dynamicArray[i].ItemId;
        objDispatchTrackingItemDetialModel.ItemName = this.dynamicArray[i].ItemName;
        objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
        objDispatchTrackingItemDetialModel.EqpType_Id = this.dynamicArray[i].EqTypeId;
        objDispatchTrackingItemDetialModel.Remarks = this.dynamicArray[i].Remarks;
        objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
        objDispatchTrackingItemDetialModel.ClientId = this.dynamicArray[i].ClientId;
        objDispatchTrackingItemDetialModel.TestingTime = this.dynamicArray[i].TestingTime;
        objDispatchTrackingItemDetialModel.Scrap = this.dynamicArray[i].Scrap;
        objDispatchTrackingItemDetialModel.Repaired = this.dynamicArray[i].Repaired;
        objDispatchTrackingItemDetialModel.FaultyQty = this.dynamicArray[i].FaultyQty;
        objDispatchTrackingItemDetialModel.MaterialUsed = this.dynamicArray[i].MaterialUsed;
        objDispatchTrackingItemDetialModel.TypeFaultyId = this.dynamicArray[i].TypeFaultyId;
        objDispatchTrackingItemDetialModel.SerialNo = this.dynamicArray[i].SerialNo;
        objDispatchTrackingItemDetialModel.TestingLoad = this.dynamicArray[i].TestingLoad;
        objDispatchTrackingItemDetialModel.RepairedBy = this.dynamicArray[i].RepairedBy;
        objDispatchTrackingItemDetialModel.TestedBy = this.dynamicArray[i].TestedBy;
        objDispatchTrackingItemDetialModel.RepairedById = this.dynamicArray[i].RepairedById;
        objDispatchTrackingItemDetialModel.TestedById = this.dynamicArray[i].TestedById;
        objDispatchTrackingItemDetialModel.NatureBerId = this.dynamicArray[i].NatureBerId;
        //objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
        this.OkFaultyStockItem.push(objDispatchTrackingItemDetialModel)
      }
      objSaveUpaderStockQtyModel.OkFaultyItemList = this.OkFaultyStockItem;
      var formdata = new FormData();
      if (this.UploadCertificateFile == null) {
        formdata.append('UploadCertificatefile', this.UploadCertificateFile);
      } else {
        formdata.append('UploadCertificatefile', this.UploadCertificateFile, this.UploadCertificateFile.name);
      }
      if (this.UploadInvoiceFile == null) {
        formdata.append('UploadInvoiceFile', this.UploadInvoiceFile);
      } else {
        formdata.append('UploadInvoiceFile', this.UploadInvoiceFile, this.UploadInvoiceFile.name);
      }
      //  console.log(JSON.stringify(objSaveUpaderStockQtyModel))
      formdata.append('jsonDetail', JSON.stringify(objSaveUpaderStockQtyModel));
      this._StockserviceService.SaveUpDateStStock(formdata).pipe(first()).subscribe(data => {

        if (data.Status == 1) {
          jQuery('#confirm').modal('hide');
          alert(data.Remarks);
          this.CreateNew();
        } else if (data.Status == 2) {
          jQuery('#confirm').modal('hide');
          alert('your data update successfully');
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SaveUpDateStStock", "FailtytoRepair");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SaveUpDateStStock", "FailtytoRepair");
    }
  }

  onUploadCertificateChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.UploadCertificateFile = event.target.files[0];
    }
  }
  onUploadInvoiceFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.UploadInvoiceFile = event.target.files[0];
    }
  }

  SearchFaultyRepaired(para: string) {
    try {
      var objpara = new SearchDispatchTrackerModel();
      objpara.CompanyId = this.CompanyId;
      objpara.WHStateId = this.CommonSearchPanelData.State_Id;
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
      objpara.StatusId = parseInt(this.model.ddlActive);
      objpara.Flag = para;
      if (para == "Export") {
        this.loading = true;
      }
      this._StockserviceService.SearchGetFaultyRepaired(objpara).pipe(first()).subscribe(data => {
        debugger
        this.gridApi.hideOverlay();
        this.loading = false;
        if (data.Status == 1) {
          if (para == "List") {
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null;
            }
          } else if (para == "Export") {
            if (data.Data != null) {
              this.loading = false;
              var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'FaultyRepair' + CurrentDate);
            } else {
              alert('Please first Search Data');
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchDispatchTrackerList", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchDispatchTrackerList", "WHTOSite");
    }
  }

  ShowFaultyRepDetail(e) {
    this.isShownList = false;
    this.isShownEdit = true;
    this.isPdfPreview = false;
    this.IsPreviewPdfHide = false;
    this.IsSaveDisabled = true;
    this.IsHideShowCancelBtn = true;
    this.SearchFaultyRepById(e.rowData.FaultyId);
  }
  SearchPdfPreview() {
    this.isPdfPreview = true;
    this.isShownList = false;
    this.isShownEdit = false;
    this.model.PreviewRepairDate = this._Commonservices.ConvertDateFormat(this.model.RepairDate);
    this.model.PreviewInvoiceDate = this._Commonservices.ConvertDateFormat(this.model.InvoiceDate);
  }


  BackPreviewPage() {
    this.isShownList = false;
    this.isShownEdit = true;
    this.isPdfPreview = false;
  }

  SearchFaultyRepById(Id: any) {
    try {
      var objModel = new SaveUpdateStockQtyModel();
      objModel.FaultuRep_Id = Id;
      this.FaultuRep_Id = Id;
      this.GetUserPageRight(this.FaultuRep_Id);
      this._StockserviceService.SearchFaultyRepEditById(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          this.SerialNoList = [];
          this.model.WHStateId = data.Data[0].State_Id;
          var StateId = this._Commonservices.checkUndefined(this.model.WHStateId);
          var objdropdownmodel = new DropdownModel();
          objdropdownmodel.User_Id = 0;
          objdropdownmodel.Parent_Id = this.CompanyId;
          if (StateId != '') {
            objdropdownmodel.Other_Id = StateId;
          } else {
            objdropdownmodel.Other_Id = "0";
          }
          objdropdownmodel.Flag = 'OtherWHMaster';
          this.WHList = [];
          this.model.WHId = "0";
          this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(wh => {
            if (wh.Data != null && wh.Data != "") {
              this.WHList = wh.Data;
              this.model.WHId = data.Data[0].WH_Id;
            }
          }, error => {
            this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHList", "STNDetail");
          });
          this.model.RepairedType = data.Data[0].RepairedType;
          this.ChangeRepairedType(this.model.RepairedType);
          this.model.InvoiceValue = data.Data[0].InvoiceValue;
          this.model.Remarks = data.Data[0].Remarks;
          if (data.Data[0].InvoiceDate != null) {
            var ExpDelDate = data.Data[0].InvoiceDate.split('/');
            this.model.InvoiceDate = { year: parseInt(ExpDelDate[2]), month: parseInt(ExpDelDate[1]), day: parseInt(ExpDelDate[0]) };
          } else {
            this.model.InvoiceDate = "";
          }
          if (data.Data[0].RepairDate != null) {
            var RepairDate1 = data.Data[0].RepairDate.split('/');
            this.model.RepairDate = { year: parseInt(RepairDate1[2]), month: parseInt(RepairDate1[1]), day: parseInt(RepairDate1[0]) };
          } else {
            this.model.RepairDate = "";
          }
          this.model.DocumentId = data.Data[0].Dispatch_Id;
          this.model.DocumentNoData = data.Data[0].DocumentNo;
          this.dynamicArray = [];
          this.ItemEditDataArr = data.ItemData;
          for (var i = 0, len = this.ItemEditDataArr.length; i < len; i++) {
            var objdynamic = new DynamicItemGrid();
            objdynamic.Id = this.ItemEditDataArr[i].FaultyRepId;
            objdynamic.ItemNameId = this.ItemEditDataArr[i].ItemNameId;
            objdynamic.EditItemMake = JSON.parse(this.ItemEditDataArr[i].ItemMakeList);
            objdynamic.ItemMakeId = this.ItemEditDataArr[i].MakeMaster_Id;
            objdynamic.EditItemCode = JSON.parse(this.ItemEditDataArr[i].ItemCodeList);
            objdynamic.UnitList = JSON.parse(this.ItemEditDataArr[i].UnitList);
            objdynamic.UnitName = this.ItemEditDataArr[i].UnitMaster_Id;
            objdynamic.ItemId = this.ItemEditDataArr[i].ItemId;
            objdynamic.EqTypeId = this.ItemEditDataArr[i].OldEqup_Id;
            objdynamic.ItemDescription = this.ItemEditDataArr[i].ItemDescription;
            objdynamic.Qty = this.ItemEditDataArr[i].StockQty;
            objdynamic.TypeFaultyId = this.ItemEditDataArr[i].TypeOfFaulty;
            objdynamic.MaterialUsed = this.ItemEditDataArr[i].MaterialUsed;
            objdynamic.Remarks = this.ItemEditDataArr[i].Remarks;
            objdynamic.TestingTime = this.ItemEditDataArr[i].TestingTime;
            objdynamic.TestingLoad = this.ItemEditDataArr[i].TestingLoad;
            objdynamic.Scrap = this.ItemEditDataArr[i].ScrapQty;
            objdynamic.Repaired = this.ItemEditDataArr[i].RepairedQty;
            objdynamic.FaultyQty = this.ItemEditDataArr[i].FaultyQty;
            if (this.ItemEditDataArr[i].RepairedBy_Id == 9999) {
              this.IsRepaired = true;
              objdynamic.RepairedBy = this.ItemEditDataArr[i].RepairBy;
            } else {
              this.IsRepaired = false;
            }
            if (this.ItemEditDataArr[i].TestedBy_Id == 9999) {
              this.IsTested = true;
              objdynamic.TestedBy = this.ItemEditDataArr[i].TestedBy;
            } else {
              this.IsTested = false;
            }

            objdynamic.RepairedById = this.ItemEditDataArr[i].RepairedBy_Id;
            objdynamic.TestedById = this.ItemEditDataArr[i].TestedBy_Id;
            objdynamic.NatureBerId = this.ItemEditDataArr[i].NatureBer_Id;
            objdynamic.SerialNo = this.ItemEditDataArr[i].SerialNo;
            // if (objdynamic.EqTypeId == 3) {
            //   this.FilterNewTypeList = this.EquipmentTypeList.filter(m => m.id !== parseInt(objdynamic.EqTypeId) && m.id !== 1);
            //   objdynamic.NewEqTypeId = this.ItemEditDataArr[i].NewEqup_Id;
            // } else if (objdynamic.EqTypeId == 2) {
            //   this.FilterNewTypeList = this.EquipmentTypeList.filter(m => m.id !== parseInt(objdynamic.EqTypeId) && m.id !== 1);
            //   objdynamic.NewEqTypeId = this.ItemEditDataArr[i].NewEqup_Id;
            // }
            // else {
            //   this.FilterNewTypeList = this.EquipmentTypeList.filter(m => m.id !== parseInt(objdynamic.EqTypeId));
            //   objdynamic.NewEqTypeId = this.ItemEditDataArr[i].NewEqup_Id;
            // }

            if (this.ItemEditDataArr[i].Client_Id != "" && this.ItemEditDataArr[i].Client_Id != null) {
              objdynamic.ClientId = this.ItemEditDataArr[i].Client_Id;
            } else {
              objdynamic.ClientId = "0";
            }
            this.dynamicArray.push(objdynamic);
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchDispatchTrackerEditListByDispatchId", "SRN");
    }
  }

  SearchFaultyRepPDFDataById(Value: any,) {
    try {
      var objModel = new SaveUpdateStockQtyModel();
      objModel.FaultuRep_Id = this.FaultuRep_Id;
      this.model.FunctionFlagValue = null;
      this.model.FunctionFlagValue = Value;
      this._StockserviceService.SearchFaultyRepPDFDataById(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          this.model.CompanyName = data.Data[0].CompanyName;
          this.model.WHAddress = data.Data[0].WHAddress;
          this.model.RepairDate = data.Data[0].RepairDate;
          this.model.CertificationNo = data.Data[0].RepairedCertificationNo;
          this.model.Logo = data.Data[0].Logo;
          if (data.ItemData != null) {
            this.ItemEditDataArr = data.ItemData;
            if (this.ItemEditDataArr.length == 1) {
              this.TableHeight = [0, 340, 0, 0]
            } else if (this.ItemEditDataArr.length == 2) {
              this.TableHeight = [0, 310, 0, 0]
            }
            else if (this.ItemEditDataArr.length == 3) {
              this.TableHeight = [0, 270, 0, 0]
            }
            else if (this.ItemEditDataArr.length == 4) {
              this.TableHeight = [0, 230, 0, 0]
            }
            else if (this.ItemEditDataArr.length == 5) {
              this.TableHeight = [0, 190, 0, 0]
            }
            else if (this.ItemEditDataArr.length == 6) {
              this.TableHeight = [0, 150, 0, 0]
            }
            else if (this.ItemEditDataArr.length == 7) {
              this.TableHeight = [0, 100, 0, 0]
            }
            else if (this.ItemEditDataArr.length == 8) {
              this.TableHeight = [0, 60, 0, 0]
            }
            else {
              this.TableHeight = [0, 400, 0, 0]
            }
            this.dynamicStockPdfGrid = [];
            for (var i = 0, len = this.ItemEditDataArr.length; i < len; i++) {
              var objdynamic = new DynamicStockPdfGrid();
              objdynamic.Id = this.ItemEditDataArr[i].FaultyRepId;
              objdynamic.RowId = this.ItemEditDataArr[i].RowId;
              objdynamic.EqpName = this.ItemEditDataArr[i].EqpName;
              objdynamic.ItemDescription = this.ItemEditDataArr[i].ItemDescription;
              objdynamic.SerialNo = this.ItemEditDataArr[i].SerialNo;
              objdynamic.TypeOfFaulty = this.ItemEditDataArr[i].TypeOfFaulty;
              objdynamic.MaterialUsed = this.ItemEditDataArr[i].MaterialUsed;
              objdynamic.StockQty = this.ItemEditDataArr[i].StockQty;
              objdynamic.ScrapQty = this.ItemEditDataArr[i].ScrapQty;
              objdynamic.Load = this.ItemEditDataArr[i].TestingLoad;
              objdynamic.TestingTime = this.ItemEditDataArr[i].TestingTime;
              objdynamic.TestedBy = this.ItemEditDataArr[i].TestedBy;
              objdynamic.RepairBy = this.ItemEditDataArr[i].RepairBy;
              objdynamic.RepairedQty = this.ItemEditDataArr[i].RepairedQty;
              objdynamic.FaultyQty = this.ItemEditDataArr[i].FaultyQty;
              this.dynamicStockPdfGrid.push(objdynamic);
            }
            debugger
            this.generatePDFWithOtherState('open');
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SearchFaultyRepPDFDataById", "FaultyToRepair");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SearchFaultyRepPDFDataById", "FaultyToRepair");
    }
  }

  conformCancelPopup() {
    this.IsError = false;
    if (this.CancelValidation() == 1) {
      return false;
    }
    jQuery('#Cancleconfirm').modal('show');
  }

  UpadateCancelDispatch() {
    try {
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = this.FaultuRep_Id;
      objApprovelStatusModel.Table_Id = this.model.InCaseReason;
      objApprovelStatusModel.Flag = "RC";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          this.IsHideShowCancelBtn = false;
          jQuery('#Cancleconfirm').modal('hide');
          setTimeout(() => {
            alert('Your RC SuccessFully Cancel')
          }, 300);
        }

      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpadateCancelDispatch", "WHTOSite");
    }
  }
  
  CancelValidation() {
    var flag = 0;
    if (this.model.InCaseReason == "0") {
      $('#txtInCaseReason').css('border-color', 'red');
      $('#txtInCaseReason').focus();
      flag = 1;
    } else {
      $("#txtInCaseReason").css('border-color', '');
    }
    return flag;
  }

  changeCaseReason() {
    $("#txtInCaseReason").css('border-color', '');
  }

  generatePDFWithOtherState(action = 'open') {
    let docDefinition = {
      // pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        {
          text: 'Repaired Certificate',
          style: 'header'
        },
        {
          margin: [0, 0, 0, 0],
          border: [1, 1, 1, 1],
          table: {
            widths:['100%'],
            body: [
              [
                {
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              image: `snow`, width: 50,
                            },

                          ]
                        },
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            { text: '', fontSize: 12, bold: true, width: 60 },
                          ]
                        },
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 616,
                              text: [
                                { text: `${this.model.CompanyName}`, alignment: 'center', fontSize: 12, bold: true },
                                '\n',
                                { text: `${this.model.WHAddress}`, alignment: 'center', fontSize: 10, },
                              ]
                            },
                          ]
                        }
                      ]
                    ]
                  }
                }
              ],
              [
                {
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            { text: '', fontSize: 10, bold: true, width: 10 },

                          ]
                        },
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            // { text: '', fontSize: 10, width: 120 },
                            { text: 'Certification No', fontSize: 10, bold: true, width: 100 }, { text: `${this.model.CertificationNo}`, fontSize: 10, bold: true, width: 110 },
                          ]
                        },
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 300,
                              text: [
                                { text: 'Repairing Cerificate - Faulty to Repaired/BER', alignment: 'center', fontSize: 10, bold: true },
                              ]
                            },
                          ]
                        },
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            { text: 'Date', fontSize: 10, bold: true, width: 60 }, { text: `${this.model.RepairDate}`, fontSize: 10, bold: true, width: 60 },
                          ]
                        }
                      ]
                    ]
                  }
                }
              ],
              [
                {
                  border: [1, 0, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 1, 0],
                          columns: [
                            {
                              text: 'Material Details', alignment: 'center', fontSize: 10, bold: true, width: 380
                            },

                          ]
                        },
                        {
                          border: [0, 0, 1, 0],
                          columns: [
                            { text: 'Repairing Details', alignment: 'center', fontSize: 10, bold: true, width: 180 },
                          ]
                        },

                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            { text: 'Output', fontSize: 10, bold: true, width: 120 },
                          ]
                        }
                      ]
                    ]
                  }
                }
              ]
            ]
          }
        },
        {
          style: 'TableHeader',
          table: {
            headerRows: 1,
            widths: ['4%', '6%', '22%', '8%', '10%', '8%', '5%', '5%', '5%', '5%', '5%','5%','6%', '6%'],
            body: [
              [
                { text: 'S.No', bold: true, },
                { text: 'Eqp. Name', alignment: 'center', bold: true, }, 
                { text: 'Description', bold: true, alignment: 'center' },
                { text: 'Eqp. Sl No.', bold: true, alignment: 'center' }, 
                { text: 'Nature of Fault', bold: true, alignment: 'center' },
                
                { text: 'Spare Used', bold: true, alignment: 'center' }, 
                { text: 'Qty', bold: true, alignment: 'center' },
                { text: 'Load (AMP)', bold: true, alignment: 'center' }, 
                { text: 'Time (Hour)', bold: true, alignment: 'center' },
                { text: 'Repaired', bold: true, alignment: 'center' }, 
                
                { text: 'BER', bold: true, alignment: 'center' },
                { text: 'Faulty', bold: true, alignment: 'center' }, 
                { text: 'Repaired BY', bold: true, alignment: 'center' },
                { text: 'Tested BY', bold: true, alignment: 'center' }
              ],
              ...this.dynamicStockPdfGrid.map(p => ([
                { text: p.RowId }, 
                { text: p.EqpName }, 
                { text: p.ItemDescription, alignment: 'center' },
                { text: p.SerialNo, alignment: 'center' }, 
                { text: p.TypeOfFaulty, alignment: 'center' },
                
                { text: p.MaterialUsed, alignment: 'center' }, 
                { text: p.StockQty, alignment: 'center' },
                { text: p.Load, alignment: 'center' }, 
                { text: p.TestingTime, alignment: 'center' },
                { text: p.RepairedQty, alignment: 'center' }, 
                
                { text: p.ScrapQty, alignment: 'center' },
                { text: p.FaultyQty, alignment: 'center' }, 
                { text: p.RepairBy, alignment: 'center' },
                { text: p.TestedBy, alignment: 'center' }
              ])),
              [
                {}, 
                { text: '', colSpan: 1, alignment: 'right', margin: this.TableHeight }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }
              ],
              [
                { text: 'Final Remarks', colSpan: 10, alignment: 'left', bold: true }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                { text: '' }, 
                
                { text: '' }, 
                { text: '' }, 
                { text: '' },
                { text: '' }
              ]
            ]
          }
        },
        {
          columns: [
            { text: 'This is a Computer Generated Document', alignment: 'center', fontSize: 9, }
          ]
        }
      ],

      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [350, -40, 0, 0]
        },
        TableHeader: {
          fontSize: 10,
          hidden: false,
        },

        AddInfo: {
          decoration: 'underline',
          fontSize: 9,
        },
        HideColumn: {
          visible: false,
        }
      },
      images: {
        snow: `${this.model.Logo}`,
        //snow: 'http://localhost:4200/assets/logo.jpg',
        //snow: 'http://scm.astnoc.com/assets/logo.jpg'
      },
    }

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      if (this.model.FunctionFlagValue == 2) {
        pdfMake.createPdf(docDefinition).open();
      } else {       
        pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
          PDFdata = dataURL;
        });
        setTimeout(() => {
          this.SaveUpdateFaultyToRepairedPdf();
        }, 1200);
      }
    }
  }

  SaveUpdateFaultyToRepairedPdf() {
    try {
      var objSaveUpdateStockQtyModel = new SaveUpdateStockQtyModel();
      objSaveUpdateStockQtyModel.FaultuRep_Id = this.FaultuRep_Id;
      objSaveUpdateStockQtyModel.DocumentFile = PDFdata;
      this._StockserviceService.SaveUpdateFaultyToRepairedPdf(objSaveUpdateStockQtyModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          alert('Document has been generated');
        } else if (data.Status == 2) {
          alert('Document does not generated');
        }
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "SaveUpdateSRNPdf", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "SaveUpdateSRNPdf", "SRN");
    }
  }

  KeyPressRepairedBy() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.RepairedBy').val();
      if (valueItem != " ") {
        $(this).find('.RepairedBy').css('border-color', '');
      }
    });
  }
  KeyPressTestedBy() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.TestedBy').val();
      if (valueItem != " ") {
        $(this).find('.TestedBy').css('border-color', '');
      }
    });
  }


  ChangeUnit(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.UnitName').val();
      if (valueItem != "0") {
        $(this).find('.UnitName').css('border-color', '');
      }
    });
    var FilterData = this.dynamicArray[index].UnitList.filter(
      m => m.Id === parseInt(Id));
    this.dynamicArray[index].Unit = FilterData[0].UnitName;
    // if (Id == 2 && this.dynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId) {
    //   this.dynamicArray[index].HideShowConValue = false;
    //   this.dynamicArray[index].ReceivedQty = "";
    //   this.dynamicArray[index].ConversionUnit = "";
    //   this.dynamicArray[index].HideConversionValue = "";
    //   this.dynamicArray[index].IsConversion = "";
    // } else if (Id == 8 && this.dynamicArray[index].ItemNameId == CommonStaticClass.MSTItemNameId) {
    //   this.dynamicArray[index].HideShowConValue = true;
    //   this.dynamicArray[index].ReceivedQty = "";
    //   this.dynamicArray[index].ConversionUnit = "";
    //   this.dynamicArray[index].HideConversionValue = "";
    //   this.dynamicArray[index].IsConversion = "";
    //   this.dynamicArray[index].ConversionValue = "";
    //   this.dynamicArray[index].ConversionUnit = this.dynamicArray[index].ChangeUnitConversionUnit;
    //   this.dynamicArray[index].IsConversion = this.dynamicArray[index].ChangeUnitIsConversion;
    //   this.dynamicArray[index].HideConversionValue = this.dynamicArray[index].ChangeUnitHideConversionValue;
    // } else {
    //   this.dynamicArray[index].HideShowConValue = false;
    //   this.dynamicArray[index].ReceivedQty = "0.00";
    //   this.dynamicArray[index].ConversionUnit = "";
    //   this.dynamicArray[index].HideConversionValue = "";
    //   this.dynamicArray[index].IsConversion = "";
    //   this.dynamicArray[index].ConversionValue = "";
    // }

  }

  KeyPressTestingTime() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.TestingTime').val();
      if (valueItem != "0") {
        $(this).find('.TestingTime').css('border-color', '');
      }
    });
  }

  KeyPressTestingLoad() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.TestingLoad').val();
      if (valueItem != "0") {
        $(this).find('.TestingLoad').css('border-color', '');
      }
    });
  }




  Validation() {
    var flag = 0;
    if ($('#txtTOWHStateId').val() == "" || $('#txtTOWHStateId').val() == '0') {
      $('#txtTOWHStateId').css('border-color', 'red');
      $('#txtTOWHStateId').focus();
      flag = 1;
    } else {
      $("#txtTOWHStateId").css('border-color', '');

    }
    if ($('#txtWHId').val() == "" || $('#txtWHId').val() == '0') {
      $('#txtWHId').css('border-color', 'red');
      $('#txtWHId').focus();
      flag = 1;
    } else {
      $("#txtWHId").css('border-color', '');
    }
    if ($('#txtRepairedType').val() == "" || $('#txtRepairedType').val() == '0') {
      $('#txtRepairedType').css('border-color', 'red');
      $('#txtRepairedType').focus();
      flag = 1;
    } else {
      $("#txtRepairedType").css('border-color', '');
    }

    //vishal 21-01-2023

    if ($('#txtRepairDate').val() == "" || $('#txtRepairDate').val() == '0' || $('#txtRepairDate').val() == null) {
      $('#txtRepairDate').css('border-color', 'red');
      $('#txtRepairDate').focus();
      flag = 1;
    } else {
      $("#txtRepairDate").css('border-color', '');
    }
    //end-vishal

    if (this.model.Repaired == 'In WareHouse-Repaired by Vendor') {
      if ($('#txtVendorType').val() == "" || $('#txtVendorType').val() == '0') {
        $('#txtVendorType').css('border-color', 'red');
        $('#txtVendorType').focus();
        flag = 1;
      } else {
        $("#txtVendorType").css('border-color', '');
      }
    }

    for (var icount = 0, len = this.dynamicArray.length; icount < len; icount++) {
      if (this.dynamicArray[icount].ItemNameId == "" || this.dynamicArray[icount].ItemNameId == "null"
        || this.dynamicArray[icount].ItemNameId == "0") {
        $('#ddlItemNameId_' + icount).css('border-color', 'red');
        $('#ddlItemNameId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemNameId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemMakeId == "" || this.dynamicArray[icount].ItemMakeId == "null"
        || this.dynamicArray[icount].ItemMakeId == "0") {
        $('#ddlItemMake_' + icount).css('border-color', 'red');
        $('#ddlItemMake_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemMake_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ItemId == "" || this.dynamicArray[icount].ItemId == "null"
        || this.dynamicArray[icount].ItemId == "0") {
        $('#ddlItemId_' + icount).css('border-color', 'red');
        $('#ddlItemId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlItemId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].EqTypeId == "" || this.dynamicArray[icount].EqTypeId == "null"
        || this.dynamicArray[icount].EqTypeId == "0") {
        $('#ddlEqTypeId_' + icount).css('border-color', 'red');
        $('#ddlEqTypeId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlEqTypeId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].NewEqTypeId == "" || this.dynamicArray[icount].NewEqTypeId == "0") {
        $('#ddlNewEqTypeId_' + icount).css('border-color', 'red');
        $('#ddlNewEqTypeId_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlNewEqTypeId_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].ClientId == "" || this.dynamicArray[icount].ClientId == "0") {
        $('#ddlClient_' + icount).css('border-color', 'red');
        $('#ddlClient_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlClient_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].UnitName == "" || this.dynamicArray[icount].UnitName == "null" || this.dynamicArray[icount].UnitName == "0") {
        $('#ddlUnitName_' + icount).css('border-color', 'red');
        $('#ddlUnitName_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlUnitName_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].TypeFaultyId == "" || this.dynamicArray[icount].TypeFaultyId == "0") {
        $('#ddlTypeFaultyId_' + icount).css('border-color', 'red');
        $('#ddlClient_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlTypeFaultyId_" + icount).css('border-color', '');
      }


      if (this.dynamicArray[icount].NatureBerId != "" && this.dynamicArray[icount].NatureBerId != "0") {
        $("#txtTestingTime_" + icount).css('border-color', '');
        $("#txtTestingLoad_" + icount).css('border-color', '');
      } else {
        if (this.dynamicArray[icount].TestingTime == "" || this.dynamicArray[icount].TestingTime == "null" || this.dynamicArray[icount].TestingTime == "0") {
          $('#txtTestingTime_' + icount).css('border-color', 'red');
          $('#txtTestingTime_' + icount).focus();
          flag = 1;
        } else {
          $("#txtTestingTime_" + icount).css('border-color', '');
        }
        if (this.dynamicArray[icount].TestingLoad == "" || this.dynamicArray[icount].TestingLoad == "null" || this.dynamicArray[icount].TestingLoad == "0") {
          $('#txtTestingLoad_' + icount).css('border-color', 'red');
          $('#txtTestingLoad_' + icount).focus();
          flag = 1;
        } else {
          $("#txtTestingLoad_" + icount).css('border-color', '');
        }
        if ((this.dynamicArray[icount].Scrap == "0" && this.dynamicArray[icount].Repaired == "0"
          && this.dynamicArray[icount].FaultyQty == "0")) {
          $('#txtScrap_' + icount).css('border-color', 'red');
          $('#txtRepaired_' + icount).css('border-color', 'red');
          $('#txtfaulty_' + icount).css('border-color', 'red');
          $('#txtTestingLoad_' + icount).focus();
          flag = 1;
        } else {
          $('#txtScrap_' + icount).css('border-color', '');
          $('#txtRepaired_' + icount).css('border-color', '');
          $('#txtfaulty_' + icount).css('border-color', '');
        }
      }
      // if (this.dynamicArray[icount].RepairedById == "" || this.dynamicArray[icount].RepairedById == "0") {
      //   $('#ddlRepairedById_' + icount).css('border-color', 'red');
      //   $('#ddlRepairedById_' + icount).focus();
      //   flag = 1;
      // } else {
      //   $("#ddlRepairedById_" + icount).css('border-color', '');
      // }

      if (this.dynamicArray[icount].TestedById == "" || this.dynamicArray[icount].TestedById == "0") {
        $('#ddlTestedById_' + icount).css('border-color', 'red');
        $('#ddlClient_' + icount).focus();
        flag = 1;
      } else {
        $("#ddlTestedById_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].Scrap != "0") {
        if (this.dynamicArray[icount].NatureBerId == "" || this.dynamicArray[icount].NatureBerId == "0") {
          $('#ddlNatureBer_' + icount).css('border-color', 'red');
          $('#ddlNatureBer_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlNatureBer_" + icount).css('border-color', '');
        }
      }

      if (this.dynamicArray[icount].ClientId != "99999") {
        if (this.dynamicArray[icount].Qty == "" || this.dynamicArray[icount].Qty == "0") {
          $('#txtQty_' + icount).css('border-color', 'red');
          $('#txtQty_' + icount).focus();
          flag = 1;
        } else {
          $("#txtQty_" + icount).css('border-color', '');
        }
      }

      if (this.dynamicArray[icount].Class == "1519" && this.dynamicArray[icount].ClientId != "99999") {
        if (this.dynamicArray[icount].SerialNo == "") {
          $('#txtSerialNo_' + icount).css('border-color', 'red');
          $('#txtSerialNo_' + icount).focus();
          flag = 1;
        } else {
          $("#txtSerialNo_" + icount).css('border-color', '');
        }
      } else {
        $("#txtSerialNo_" + icount).css('border-color', '');
      }

      if (this.dynamicArray[icount].RepairedById == "9999") {
        if (this.dynamicArray[icount].RepairedBy == "") {
          $('#ddlRepairedBy_' + icount).css('border-color', 'red');
          $('#ddlRepairedBy_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlRepairedBy_" + icount).css('border-color', '');
        }
      }

      if (this.dynamicArray[icount].TestedById == "9999") {
        if (this.dynamicArray[icount].TestedBy == "") {
          $('#ddlTestedBy_' + icount).css('border-color', 'red');
          $('#ddlTestedBy_' + icount).focus();
          flag = 1;
        } else {
          $("#ddlTestedBy_" + icount).css('border-color', '');
        }
      }

    }

    return flag;
  }

  // brahamjot kaur 28/6/2022
  validateStockQty() {
    var returnValue = 0;
    var DefaultySetValue = 48
    for (var i = 0; i < this.dynamicArray.length; i++) {
      let FQty = (this.dynamicArray[i].FQty ?? 0);
      let Qty = (this.dynamicArray[i].Qty ?? 0);

      //console.log(this.dynamicArray[i].Qty);
      var ItemNameId = this.dynamicArray[i].ItemNameId
      const resultItemList = this.SearchItemNameList.filter(element => {
        return element.id === parseInt(ItemNameId);
      });
      var itmName = resultItemList[0].itemName;

      if (itmName == 'BB' && this.dynamicArray[i].UnitName == '8') {
        const resultItemCodeList = this.dynamicArray[i].EditItemCode.filter(element => {
          return element.id === parseInt(this.dynamicArray[i].ItemId);
        });
        var cellVolt = resultItemCodeList[0].CellVolt;
        Qty = (DefaultySetValue / cellVolt) * (Qty);
      }

      if (Qty > FQty && itmName != "MISC") {
        this.IsError = true;
        this.errorMessage = "Dispatch(" + itmName + ") Qty can not be greater then stock Qty(" + this.dynamicArray[i].FQty + ")."
        returnValue = 1;
      }


    }

    return returnValue;
  }

  // Hemant Tyagi 06/02/2022
  blurfaulty(index: any) {
    $('#txtScrap_' + index).css('border-color', '');
    $('#txtRepaired_' + index).css('border-color', '');
    $('#txtfaulty_' + index).css('border-color', '');

    //brahamjot kaur 28/6/2022
    if (this.IsMandatory(index) == true) {
      if (this.dynamicArray[index].FaultyQty != '' || this.dynamicArray[index].FaultyQty != 0) {
        this.dynamicArray[index].Repaired = 0;
        this.dynamicArray[index].Scrap = 0;
      }
    }

    if ((parseInt(this.dynamicArray[index].Scrap) + parseInt(this.dynamicArray[index].Repaired)
      + parseInt(this.dynamicArray[index].FaultyQty)) > parseInt(this.dynamicArray[index].Qty)) {
      this.dynamicArray[index].Repaired = 0;
      this.dynamicArray[index].Scrap = 0;
      this.dynamicArray[index].FaultyQty = 0;
    }

  }

}


