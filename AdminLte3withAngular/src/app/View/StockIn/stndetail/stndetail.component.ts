import { DatePipe } from '@angular/common';
import { Input, TemplateRef } from '@angular/core';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/Service/common.service';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { ApprovelStatusModel, CommonStaticClass, CompanyStateVendorItemModel, DropdownModel, MenuName, PageActivity, ReasonActivity, UserRole, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { DispatchTrackingItemDetialModel, SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { SaveGRNCRNModelDetail, STNModel } from 'src/app/_Model/grncrnModel';
import { CellNo, DynamicItemGrid, GRNDynamicItemGrid, GSerialNumber, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
declare var jQuery: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var PDFdata = null;
import * as XLSX from 'xlsx';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-stndetail',
  templateUrl: './stndetail.component.html',
  styleUrls: ['./stndetail.component.sass'],
  providers: [DatePipe]
})
export class StndetailComponent implements OnInit {
  @Input() GrnId: any;
  model: any = {};
  dynamicArray: Array<DynamicItemGrid> = [];
  isShownPOEdit: boolean;
  IsPageActive: boolean;
  @Output() btnclick = new EventEmitter<void>();
  @ViewChild("content") modalContent: TemplateRef<any>;
  DocumentNokeyword = 'DocumentNo';
  AutoCompleteDocumentNoList: any;
  CompanyId: any;
  DocumentData: any;
  totalSumAcceptedQty: any;
  ItemCodeGRNCRNData: any;
  UserId: any;
  ItemNameDetailData: any;
  ValidationerrorMessage: string;
  OtherSiteStateList: any;
  ShippedTOWHList: any;
  ShippedINWHList: any;
  UserName: any;
  totalAmount: any;
  IsTransferTypeSameState: boolean;
  IsTransferTypeOtherState: boolean;
  apiCSVIData: any = {};
  SearchItemNameList: any;
  EquipmentTypeList: any;
  SearchStateList: any;
  WHStateList: any;
  FromWHList: any;
  EwayBillDocumentFile: any;
  GRfileDocumentFile: any;
  totalamount: any;
  totalSumQuantity: any;
  totalSumPOQuantity: any;
  totalSumAmount: any;
  ItemAddrowhideshow: boolean;
  LRPdfUploadFile: any;
  GatePdfUploadFile: any;
  STNDetailItem = [];
  TableId: any;
  ManueId: any;
  PageMenuId: any = 4;
  closeResult: string;
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
  WareHouseId: any;
  ClientList: any;
  IsHideShowCancelBtn: boolean;
  GRNPdfData: any;
  dynamicArrayForPdf: any[];
  STNPdfItemData: any;
  IsDownloadPrintHideShow: boolean;
  GrnEditId: string;
  CancelReasonData: any;
  GrandAllSumtotalInvoiceValue: any;
  isPdfPreview: boolean;
  IsdisabledGst: boolean;
  isPdfButtonHidePreview: boolean;
  @ViewChild('inputExcelOther', { static: false })
  inputExcelOther: ElementRef;
  @ViewChild('inputExcelBB', { static: false })
  inputExcelBB: ElementRef;
  CorrectionItemCodeList: any;
  IsAutoCompleteDesabled: boolean;
  IsLRFile: boolean;
  LRFile: any;
  IsGateFile: boolean;
  GateFile: any;
  Correctioncolumnhideandshow: boolean;
  ArrayRoleId: any;
  RoleCorrectionEntry: boolean = false;
  UserRoleId: any;
  CorretionEntryReasonDetail: any;
  IsSaveButtonDisable: boolean;
  IsVehicleValidation: boolean;
  IsTransporter: boolean;
  IsByHand: boolean;
  IsCourier: boolean;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  //vishal
  TransModeDataList: any;
  VechileTypeDataList: any;
  TransferDataList: any;
  DispatcDataList: any;
  DispatchFromList: any;
  DispatchFromSearchList: any;
  constructor(private _GrncrnService: GrncrnService, private modalService: NgbModal, private datePipe: DatePipe,
    private _Commonservices: CommonService, private _MaterialMovementService: MaterialMovementService,
    private _PurchaseOrderService: PurchaseOrderService) {

  }

  ngOnInit(): void {
    this.GrnEditId = localStorage.getItem("Id");
    this.isShownPOEdit = true;
    this.isPdfPreview = false;
    this.IsdisabledGst = false;
    this.model.InCaseReason = "0";
    this.BindCorrectionentryReason();
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.UserName = objUserModel.User_Id;
    this.IsTransferTypeOtherState = true;
    this.ItemAddrowhideshow = false;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    for (var i = 0, len = this.ArrayRoleId.length; i < len; i++) {
      if (this.ArrayRoleId[i] == UserRole.Admin || this.ArrayRoleId[i] == UserRole.SCMLead) {
        this.UserRoleId = this.ArrayRoleId[i];
      } else if (this.ArrayRoleId[i] == UserRole.GRNCorrectionEntryRole) {
        this.RoleCorrectionEntry = true;
      }
    }
    this.BindCompanyStateVendorItem();
    this.ClearSTNForm();
    this.ItemReason();
    this.DowanloadStnFile();
    if (this.GrnEditId != null) {
      this.GrnEditId == this.GrnEditId;
      this.IsDownloadPrintHideShow = true;
      this.isPdfButtonHidePreview = false;
      this.SearchEditSTNDetailBySTNId(this.GrnEditId);
    } else {
      this.IsDownloadPrintHideShow = false;
      this.isPdfButtonHidePreview = true;
    }
     //brahamjot kaur 31/10/2022
     this.GetUserPageRight();
     this. GettAllVechTransModeTransfertypeDispatch()
    }
  
    //brahamjot kaur 31/10/2022
    async GetUserPageRight() {
      this._Commonservices.GetUserPageRight(this.UserId, MenuName.GRN).subscribe(data => {
        if (data.Status == 1) {
          console.log(data);
          this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
          this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
          this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
          this.ObjUserPageRight.IsBulkPdfDwnload = data.Data[0].IsBulkPdfDwnload;
          this.ObjUserPageRight.IsGenPdf = data.Data[0].IsGenPdf;
          this.ObjUserPageRight.IsPdfView = data.Data[0].IsPdfView;
          this.ObjUserPageRight.IsDelete = data.Data[0].IsDelete;
          if(this.ObjUserPageRight.IsCreate == 1){
            this.Save = 1;
          }else if(this.ObjUserPageRight.IsEdit == 1){
            this.Save = 1;
          }else{
            this.Save = 0
          }
        }
      })
    }
  
  BindCorrectionentryReason() {
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'CorrectionEntryReason';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(data => {
      if (data.Status == 1) {
        this.CorretionEntryReasonDetail = data.Data;
      }
    });
  }
  // //#region Code By Umesh
  // showModal(value, index): void {
  //   this.BBChangeValue = '48';
  //   this.indexv = index;
  //   var unitTag = this.dynamicArray[this.indexv].UnitName;
  //   var ItemNameId = this.dynamicArray[this.indexv].ItemNameId
  //   const result = this.SearchItemNameList.filter(element => {
  //     return element.id === parseInt(ItemNameId);
  //   });
  //   this.headerItemName = result[0].itemName;

  //   if (ItemNameId != "4") {
  //     this.genrateOther(index);
  //   } else {
  //     var untName = this.dynamicArray[this.indexv].UnitName
  //     if (untName.toString() != '8') {
  //       this.genrateOther(index);
  //     }
  //     else {
  //       if (this.isEdit == false) {
  //         this.genrateBb(48);
  //       }
  //       else {
  //         this.editBB(index);
  //       }
  //     }
  //   }
  // }



  // genrateOther(index: any) {
  //   var currentAcceptQty = 0;
  //   var lastAcceptQty = 0;
  //   currentAcceptQty = parseInt(this.dynamicArray[index].Qty);
  //   lastAcceptQty = this.srnlst.length
  //   if (lastAcceptQty != currentAcceptQty) {
  //     this.srnlst = [];
  //   }
  //   var lngt = this.dynamicArray[index].GSerialNumbers.length;
  //   if (lngt == 0) {
  //     this.srnlst = [];
  //     this.dynamicArray[index].InitiallValue = ''
  //     this.dynamicArray[index].lastValue = ''
  //     for (var i = 0; i < parseInt(this.dynamicArray[index].Qty); i++) {
  //       var srnData = new GSerialNumber();
  //       srnData.InitialSrno = '';
  //       this.srnlst.push(srnData)
  //     }
  //     this.strcount = this.srnlst.length;
  //   } else {

  //     this.srnlst = this.dynamicArray[index].GSerialNumbers;
  //   }
  //   var id = "#myModal";
  //   jQuery(id).modal('show');

  //   jQuery('#myModal').modal({
  //     backdrop: 'static',
  //     keyboard: false  // to prevent closing with Esc button (if you want this too)
  //   });
  // }
  // addBb() {
  //   for (var j = 0; j < this.srnlst.length; j++) {
  //     for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
  //       var obj = new GSerialNumber();
  //       obj.InitialSrno = this.srnlst[j].CellNos[i].CellValue;
  //       obj.Sequance = j.toString();
  //       this.dynamicArray[this.indexv].GSerialNumbers.push(obj)
  //     }
  //   }
  //   jQuery("#bb").modal('hide');
  // }

  // // genrateBb(value) {

  // //   var cellVoltId = this.dynamicArray[this.indexv].ItemId;
  // //   const result = this.dynamicArray[this.indexv].EditItemCode.filter(element => {
  // //     return element.id === parseInt(cellVoltId);
  // //   });
  // //   var cellVolt = result[0].CellVolt;
  // //   value = value / cellVolt;
  // //   var lngt = this.dynamicArray[this.indexv].GSerialNumbers.length;
  // //   var currentAcceptQty = 0;
  // //   var lastAcceptQty = 0;
  // //   currentAcceptQty = parseInt(this.dynamicArray[this.indexv].Qty);
  // //   lastAcceptQty = this.srnlst.length
  // //   if (this.isEdit == false) {
  // //     if (lastAcceptQty != currentAcceptQty) {
  // //       this.srnlst = [];
  // //     }
  // //   }
  // //   for (var i = 0; i < parseInt(this.dynamicArray[this.indexv].Qty); i++) {
  // //     var srnData = new GSerialNumber();
  // //     if (lngt != parseInt(this.dynamicArray[this.indexv].Qty)) {
  // //       srnData.InitialSrno = '';
  // //       srnData.BBInitial = ''
  // //       srnData.BBLast = ''
  // //       for (var j = 0; j < value; j++) {
  // //         var oc = new CellNo();
  // //         oc.Sequance = i.toString();
  // //         oc.CellValue = '';
  // //         srnData.CellNos.push(oc);
  // //       }
  // //       srnData.InitialSrno = '';
  // //       this.srnlst.push(srnData)
  // //       //this.dynamicArray[this.indexv].GSerialNumbers.push(srnData);
  // //     }
  // //   }
  // //   this.strcount = this.srnlst.length;
  // //   jQuery('#bb').modal('show');
  // // }
  // genrateBb(value) {
  //   this.srnlst = [];
  //   var cellVoltId = this.dynamicArray[this.indexv].ItemId;
  //   const result = this.dynamicArray[this.indexv].EditItemCode.filter(element => {
  //     return element.id === parseInt(cellVoltId);
  //   });
  //   var cellVolt = result[0].CellVolt;
  //   value = value / cellVolt;
  //   // var lngt = this.dynamicArray[this.indexv].GSerialNumbers.length;
  //   var currentAcceptQty = 0;
  //   //var lastAcceptQty = 0;
  //   currentAcceptQty = parseInt(this.dynamicArray[this.indexv].Qty);


  //   // lastAcceptQty = this.srnlst.length
  //   // if (this.isEdit == false) {
  //   //   if (lastAcceptQty != currentAcceptQty) {
  //   //     this.srnlst = [];
  //   //   }
  //   // }
  //   for (var i = 0; i < parseInt(this.dynamicArray[this.indexv].Qty); i++) {
  //     var srnData = new GSerialNumber();
  //     // if (lngt != parseInt(this.dynamicArray[this.indexv].Qty)) {
  //     var cellCount = 0;
  //     var cellData = [];
  //     if (this.dynamicArray[this.indexv].GSerialNumbers != null) {
  //       cellCount = this.dynamicArray[this.indexv].GSerialNumbers.length;
  //       cellData = this.dynamicArray[this.indexv].GSerialNumbers.filter(element => {
  //         return element.Sequance === i.toString();
  //       });
  //     } else {
  //       cellCount = 0;
  //     }
  //     srnData.InitialSrno = '';
  //     srnData.BBInitial = ''
  //     srnData.BBLast = ''
  //     for (var j = 0; j < value; j++) {
  //       var oc = new CellNo();
  //       oc.Sequance = i.toString();
  //       if (cellCount > 0) {
  //         if (j < cellCount) {
  //           oc.CellValue = cellData[j].InitialSrno;
  //         }
  //       } else {
  //         oc.CellValue = '';
  //       }
  //       srnData.CellNos.push(oc);
  //     }
  //     srnData.InitialSrno = '';
  //     this.srnlst.push(srnData)
  //     //this.dynamicArray[this.indexv].GSerialNumbers.push(srnData);
  //     // }
  //   }
  //   this.strcount = this.srnlst.length;
  //   jQuery('#bb').modal('show');
  // }


  // ChangeBBC() {
  //   this.dynamicArray[this.indexv].GSerialNumbers = [];
  //   this.srnlst = [];
  //   this.genrateBb(this.BBChangeValue);
  // }
  // editBB(index) {
  //   this.srnlst = this.dynamicArray[index].GSerialNumbers;
  //   jQuery('#bb').modal('show');
  // }
  // addBtn() {
  //   this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
  //   jQuery("#myModal").modal('hide');
  //   this.IsError = false;
  // }
  // bbChange(index: any) {
  //   this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
  //   var lstvale = this.getLastNumber(this.srnlst[index].BBLast);
  //   var firstVale = this.getLastNumber(this.srnlst[index].BBInitial);
  //   var inmentValue = this.srnlst[index].BBInitial;
  //   var diff = lstvale - firstVale;
  //   for (var i = 0; i < diff; i++) {
  //     if (i == 0) {
  //       this.srnlst[index].CellNos[i].CellValue = this.srnlst[index].BBInitial;
  //     } else {
  //       inmentValue = this.getAndIncrementLastNumber(inmentValue)
  //       this.srnlst[index].CellNos[i].CellValue = inmentValue;
  //     }
  //   }
  // }
  // ddlChange() {
  //   this.genrateBb(96)
  // }
  // getAndIncrementLastNumber(str) {
  //   return str.replace(/\d+$/, function (s) {
  //     return +s + 1;
  //   });
  // }
  // hidebbModal(): void {
  //   jQuery("#bb").modal('hide');
  // }

  // hideModal(): void {
  //   jQuery("#myModal").modal('hide');
  // }
  // initialsrn() {
  //   this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
  //   var lstvale = this.getLastNumber(this.lastValue);
  //   var firstVale = this.getLastNumber(this.firstValue);
  //   var diff = lstvale - firstVale;
  //   if (lstvale != '') {
  //     var incerMentValue = this.firstValue;
  //     for (var i = 0; i < diff; i++) {
  //       if (i == 0) {
  //         this.dynamicArray[this.indexv].GSerialNumbers[i].InitialSrno = this.firstValue;
  //       } else {
  //         incerMentValue = this.getAndIncrementLastNumber(incerMentValue);
  //         this.dynamicArray[this.indexv].GSerialNumbers[i].InitialSrno = incerMentValue;
  //       }
  //     }
  //   }
  // }

  // getLastNumber(source) {
  //   var lastNum = source.replace(/.*?(\d+)[^\d]*$/, '$1')
  //   return lastNum;
  // }

  // validateItemData() {
  //   var returnValue = 0;
  //   for (var i = 0; i < this.dynamicArray.length; i++) {
  //     var ItemNameId = this.dynamicArray[i].ItemNameId
  //     const result = this.SearchItemNameList.filter(element => {
  //       return element.id === parseInt(ItemNameId);
  //     });
  //     var itmName = result[0].itemName;
  //     if (this.IsMandatory(i) == true) {
  //       var srnlength = this.dynamicArray[i].GSerialNumbers;
  //       if (srnlength.length == 0) {
  //         returnValue = 1;
  //         this.IsError = true;
  //         this.errorMessage = "Serial no is required for " + itmName + " ";
  //       }
  //     }
  //   }
  //   return returnValue;
  // }

  // IsMandatory(index: any) {
  //   var ItemNameId = this.dynamicArray[index].ItemNameId
  //   const result = this.SearchItemNameList.filter(element => {
  //     return element.id === parseInt(ItemNameId);
  //   });
  //   return result[0].IsSerialReq;

  // }

  // //#endregion

  //#region Code By Umesh, Hemant
  //#region Excel Upload
  SerialNoExcelUpload(evt: any) {
    try {
      //this.srnlst = [];      
      let ExeclImportData: any[];
      type AOA = any[][];
      /* wire up file reader */
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        var headers = [];
        var sheet = ws;
        var range = XLSX.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r;
        var hdr;
        for (C = range.s.c; C <= range.e.c; ++C) {
          var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
          var ColuName = "UNKNOWN " + C; // <-- replace with your desired default
          if (cell && cell.t) {
            ColuName = XLSX.utils.format_cell(cell);
            if (ColuName == "SerialNo") {
              hdr = ColuName
            } else {
              alert("Invalid Column Name _" + ColuName);
              //this.myInputVariable.nativeElement.value = '';
              return false;
            }
          }
          // headers.push(hdr);
        }

        //this.indexv
        ExeclImportData = <AOA>(XLSX.utils.sheet_to_json(ws, { raw: true }));
        if (ExeclImportData.length > 0 && ExeclImportData != null) {
          if (this.dynamicArray[this.indexv].ItemNameId == '4' && this.dynamicArray[this.indexv].UnitName == '8') {
            let iCount_BB_Cell = 0;
            for (var j = 0; j < this.srnlst.length; j++) {
              for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
                this.srnlst[j].CellNos[i].Sequance = i.toString();
                if (ExeclImportData.length > iCount_BB_Cell) {
                  this.srnlst[j].CellNos[i].CellValue = ExeclImportData[iCount_BB_Cell].SerialNo.toString();
                } else {
                  this.srnlst[j].CellNos[i].CellValue = '';
                }
                iCount_BB_Cell++;
              }
            }
          } else {
            for (var i = 0; i < this.srnlst.length; i++) {
              if (ExeclImportData.length > i) {
                this.srnlst[i].InitialSrno = ExeclImportData[i].SerialNo.toString();
              } else {
                this.srnlst[i].InitialSrno = ''
              }
            }
          }
          this.strcount = this.srnlst.length;
        }
        this.resetExcel();
      };
      reader.readAsBinaryString(target.files[0]);
    } catch (Error) { }
  }

  ClearSerialNoList() {
    if (this.dynamicArray[this.indexv].ItemNameId == '4' && this.dynamicArray[this.indexv].UnitName == '8') {
      for (var j = 0; j < this.srnlst.length; j++) {
        this.srnlst[j].BBInitial = '';
        this.srnlst[j].BBLast = '';
        for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
          var oc = new CellNo();
          this.srnlst[j].CellNos[i].CellValue = '';
        }
      }
    } else {
      this.firstValue = '';
      this.lastValue = '';
      for (var i = 0; i < this.srnlst.length; i++) {
        this.srnlst[i].InitialSrno = '';
      }
    }
  }
  resetExcel() {
    this.inputExcelOther.nativeElement.value = "";
    this.inputExcelBB.nativeElement.value = "";
  }

  SerialNoExcelSample: any = [{
    SerialNo: 'Amr0212334'
  }];

  DownloadSerialNoExcelSample() {
    this._PurchaseOrderService.exportAsExcelFile(this.SerialNoExcelSample, 'SampleExcel');
  }
  //#endregion

  showModal(value: number, index: number): void {
    this.indexv = index;
    var qty = this.dynamicArray[index].AcceptedQty;
    var unitTag = this.dynamicArray[this.indexv].UnitName;
    var ItemNameId = this.dynamicArray[this.indexv].ItemNameId

    // validation on ItemName
    if (this._Commonservices.checkUndefined(ItemNameId) == "" || this._Commonservices.checkUndefined(ItemNameId) == '0' || this._Commonservices.checkUndefined(ItemNameId) == '0.00') {
      this.ValidationerrorMessage = "Please select item name.";
      jQuery('#Validationerror').modal('show');
      return;
    }

    // validation on Qty
    if (this._Commonservices.checkUndefined(qty) == "" || this._Commonservices.checkUndefined(qty) == '0' || this._Commonservices.checkUndefined(qty) == '0.00') {
      this.ValidationerrorMessage = "Please enter atleast 1 qty.";
      jQuery('#Validationerror').modal('show');
      return;
    }

    // validation on unit
    if (this._Commonservices.checkUndefined(unitTag) == "" || this._Commonservices.checkUndefined(unitTag) == '0' || this._Commonservices.checkUndefined(unitTag) == '0.00') {
      this.ValidationerrorMessage = "Please enter unit.";
      jQuery('#Validationerror').modal('show');
      return;
    }

    // by Default declare 48
    this.BBChangeValue = '48';

    // get Item Id and Name from item List.
    const result = this.SearchItemNameList.filter(element => {
      return element.id === parseInt(ItemNameId);
    });

    this.headerItemName = result[0].itemName;

    if (this.IsMandatory(index) == true) {
      if (ItemNameId != "4") {
        this.genrateOther(index);
      } else {
        if (unitTag == '8') {
          this.genrateBb(48);
        } else {
          this.genrateOther(index);
        }
      }
    }
  }


  // show model for AC/DG etc except the BB.
  genrateOther(index: any) {
    this.srnlst = [];
    this.dynamicArray[index].InitiallValue = ''
    this.dynamicArray[index].lastValue = ''
    for (var i = 0; i < parseInt(this.dynamicArray[index].AcceptedQty); i++) {
      var srnData = new GSerialNumber();
      if (this.dynamicArray[index].GSerialNumbers.length > i) {
        srnData.InitialSrno = this.dynamicArray[index].GSerialNumbers[i].InitialSrno;
      } else {
        srnData.InitialSrno = '';
      }
      this.srnlst.push(srnData);
    }
    this.strcount = this.srnlst.length;

    var id = "#myModal";
    jQuery(id).modal('show');

    jQuery('#myModal').modal({
      backdrop: 'static',
      keyboard: false  // to prevent closing with Esc button (if you want this too)
    });
  }

  // bind serial no on Other item on blur on initialVal or LastValue
  initialsrn() {
    //this.ReceiveddynamicArray[this.indexv].GSerialNumbers = this.srnlst;
    var lstvale = this.getLastNumber(this.lastValue);
    var firstVale = this.getLastNumber(this.firstValue);
    var diff = lstvale - firstVale;
    if (lstvale != '') {
      var incerMentValue = this.firstValue;
      for (var i = 0; i < this.srnlst.length; i++) {
        if (i == 0) {
          this.srnlst[i].InitialSrno = this.firstValue;
        } else {
          incerMentValue = this.getAndIncrementLastNumber(incerMentValue);
          this.srnlst[i].InitialSrno = incerMentValue;
        }
      }
    }
  }

  // Add serial no of AC/DG etc except the BB into main array 
  addBtn() {
    let SerialNo = "";
    let isDup = false
    let uniq_values = []
    //iterate the source data
    for (let x of this.srnlst) {
      if (uniq_values.indexOf(x.InitialSrno) != -1) {
        isDup = true
        SerialNo = x.InitialSrno;
        break
      } else {
        uniq_values.push(x.InitialSrno)
      }
    }

    if (isDup == true) {
      alert("Please enter unique serialno.(" + SerialNo + ")");
      return false;
    }

    for (var i = 0; i < this.srnlst.length; i++) {
      SerialNo = this.srnlst[i].InitialSrno;
      if (SerialNo == null || SerialNo.trim() == "") {
        alert("Please enter serialno");
        return false;
      } else if (SerialNo.length < 4) {
        alert("Please enter serialno minimum 4-digits.(" + SerialNo + ")");
        return false;
      }
    }
    this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
    this.hideModal();
    this.IsError = false;
  }

  // hide  Other model on cancel
  hideModal(): void {
    jQuery("#myModal").modal('hide');
  }

  // show model for the BB.
  genrateBb(value: number) {

    this.srnlst = [];
    var cellVoltId = this.dynamicArray[this.indexv].ItemId;
    const result = this.dynamicArray[this.indexv].EditItemCode.filter(element => {
      return element.id === parseInt(cellVoltId);
    });
    var cellVolt = result[0].CellVolt;
    value = value / cellVolt;
    for (var i = 0; i < parseInt(this.dynamicArray[this.indexv].AcceptedQty); i++) {
      var srnData = new GSerialNumber();
      for (var j = 0; j < value; j++) {
        var oc = new CellNo();
        oc.Sequance = i.toString();
        var celllength = this.dynamicArray[this.indexv].GSerialNumbers.length;
        if (celllength > i) {
          // Error Comming
          oc.CellValue = this.dynamicArray[this.indexv].GSerialNumbers[i].CellNos[j].CellValue;
        } else {
          oc.CellValue = '';
        }
        srnData.CellNos.push(oc);
      }
      srnData.InitialSrno = '';
      this.srnlst.push(srnData)
    }
    this.strcount = this.srnlst.length;
    jQuery('#bb').modal('show');
  }

  // bind serial no on BB item on blur on initialVal or LastValue
  bbChange(index: any) {
    var lstvale = this.getLastNumber(this.srnlst[index].BBLast);
    var firstVale = this.getLastNumber(this.srnlst[index].BBInitial);
    var inmentValue = this.srnlst[index].BBInitial;
    var diff = lstvale - firstVale;
    if (diff > this.srnlst[index].CellNos.length) {
      diff = this.srnlst[index].CellNos.length;
    }
    for (var i = 0; i < diff; i++) {
      if (i == 0) {
        this.srnlst[index].CellNos[i].CellValue = this.srnlst[index].BBInitial;
      } else {
        inmentValue = this.getAndIncrementLastNumber(inmentValue)
        this.srnlst[index].CellNos[i].CellValue = inmentValue;
      }
    }
  }

  // Add serial no of the BB into main array 
  addBb() {
    try {
      let BB_SerialArr = []
      for (var j = 0; j < this.srnlst.length; j++) {
        for (var i = 0; i < this.srnlst[j].CellNos.length; i++) {
          var oc = new CellNo();
          BB_SerialArr.push(this.srnlst[j].CellNos[i].CellValue); // by hemant tygai
        }
      }

      let SerialNo = "";
      let isDup = false
      let uniq_values = []
      //iterate the source data    
      for (let x of BB_SerialArr) {
        if (uniq_values.indexOf(x) != -1) {
          isDup = true
          SerialNo = x;
          break
        } else {
          uniq_values.push(x)
        }
      }

      if (isDup == true) {
        if (SerialNo == null || SerialNo.trim() == "") {
          alert("Please enter serialno");
          return false;
        } else {
          alert("Please enter unique serialno.(" + SerialNo + ")");
          return false;
        }
      }

      for (var i = 0; i < BB_SerialArr.length; i++) {
        SerialNo = BB_SerialArr[i];
        if (SerialNo == null || SerialNo.trim() == "") {
          alert("Please enter serialno");
          return false;
        } else if (SerialNo.length < 4) {
          alert("Please enter serialno minimum 4-digits.(" + SerialNo + ")");
          return false;
        }
      }
      this.dynamicArray[this.indexv].GSerialNumbers = this.srnlst;
      this.hidebbModal();
    } catch (error) {
      alert(error)
    }
  }

  // hide  BB model on cancel
  hidebbModal(): void {
    jQuery("#bb").modal('hide');
  }

  // Increment the Serial no
  getAndIncrementLastNumber(str) {
    return str.replace(/\d+$/, function (s) {
      return +s + 1;
    });
  }

  // get Last the Serial no
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
        //let srnlength = this.ReceiveddynamicArray[i].GSerialNumbers.length;        
        if (this.dynamicArray[i].GSerialNumbers.length != this.dynamicArray[i].AcceptedQty) {
          returnValue = 1;
          this.IsError = true;
          this.errorMessage = "Serial-No (" + parseInt(this.dynamicArray[i].AcceptedQty) + " -Qty) is required for " + itmName + " ";
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
    return result[0].IsSerialReq;
  }
  //#endregion


  //#region Code By Ravinder 02/08/2021
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
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GrnItemReason", "SRN");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GrnItemReason", "SRN");
    }
  }

  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      this.SearchStateList = objCSVTdata.StateArray;
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      //this.WHStateList=objCSVTdata.StateArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.ClientList = objCSVTdata.ClientArray;
      this.WHStateList = objCSVTdata.StateArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }

  SearchSTNCleared() {
    this.AutoCompleteDocumentNoList = [];
    this.model.DocumentNoData = "";
    this.ClearSTNForm();
  }

  SearchAutoDocumentNo(item) {
    this.model.Document = item.DocumentNo;
    this.SearchSTNDataByDispatchId(item.id);
  }

  onFocused(e) {
  }

  onChangeSearch(val: string) {
    this.AutoCompleteDocumentNoList = [];
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = this.UserId;
    objdropdownmodel.Parent_Id = val;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'STN';
    this._GrncrnService.GetAutoCompleteDocumentNo(objdropdownmodel).subscribe((data) => {
      this.AutoCompleteDocumentNoList = data.Data;
    })
  }

//#region this function  change Item, make, code,
  ChangeEditItemName(ItemNameId: any, index: any) {
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.ItemName').val();
        if (valueItem != '0') {
          $(this).find('.ItemName').css('border-color', '');
        }
      });
      var ItemNameHSNCode = this.SearchItemNameList.filter(
        m => m.id === parseInt(ItemNameId));
      if (ItemNameHSNCode.length > 0) {
        this.dynamicArray[index].HSN = ItemNameHSNCode[0].HSNCode;
        this.dynamicArray[index].ClassId = ItemNameHSNCode[0].Class;
        this.dynamicArray[index].ItemName = ItemNameHSNCode[0].itemName;
      } else {
        this.dynamicArray[index].HSN = "";
        this.dynamicArray[index].ClassId = "";
      }
      this.dynamicArray[index].EditItemMake = null;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = ItemNameId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.dynamicArray[index].EditItemMake = item.Data
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ChangeEditItemName";
      objWebErrorLogModel.ErrorPage = "GRN";
      // this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  async ChangeEditItemMake(ItemMakeId: any, ItemNameId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueMake = $(this).find('.ItemMake').val();
      if (valueMake != '0') {
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
    this.dynamicArray[index].EditItemCode = null;
    this.ItemCodeGRNCRNData = null;
    this.ItemCodeGRNCRNData = await
      this._Commonservices.getdropdown2(objdropdownmodel);
    this.dynamicArray[index].EditItemCode = this.ItemCodeGRNCRNData.Data

  }

  ChangeEditItemCode(ItemId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ItemCode').val();
      if (valueItem != '0') {
        $(this).find('.ItemCode').css('border-color', '');
      }
    });
    var FilterData = this.dynamicArray[index].EditItemCode.filter(
      m => m.id === parseInt(ItemId));
    this.dynamicArray[index].ItemCode = FilterData[0].itemName;
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = ItemId;
    objVendormodel.flag = 'ItemMaster';
    this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
      var UnitData = data.Data;
      if (data.Data[0].UnitList.length == 1) {
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
        this.dynamicArray[index].UnitName = this.dynamicArray[index].UnitList[0].Id;
        var FilterData = this.dynamicArray[index].UnitList.filter(
          m => m.Id === parseInt(this.dynamicArray[index].UnitList[0].Id));
        this.dynamicArray[index].Unit = FilterData[0].UnitName;
      } else {
        this.dynamicArray[index].UnitName = "0";
        this.dynamicArray[index].UnitList = data.Data[0].UnitList;
      }
      this.dynamicArray[index].ItemDescription = data.Data[0].ItemDescription;
    });
  }
//#endregion

//#region this function  used Edit STN Detail by STN Id
  SearchEditSTNDetailBySTNId(Id: any) {
    try {
      var objModel = new SearchDispatchTrackerModel();
      objModel.DispatchTracker_Id = Id;
      // objModel.Flag = "DispatchId";
      // objModel.Flag = "";
      this._GrncrnService.SearchEditSTNDetailBySTNId(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          // this.IsDisabledPreviewGenratebutton=false;
          if (data.Data != null && data.Data != '') {
            this.model.STNId = data.Data[0].Id;
            this.model.DisatchTrackeringId = data.Data[0].DispatchId;
            this.TableId = data.Data[0].Id;
            this.ManueId = this.PageMenuId;
            var DDate = data.Data[0].DocumentDate.split('/');
            this.model.DocumentDate = { year: parseInt(DDate[2]), month: parseInt(DDate[1]), day: parseInt(DDate[0]) };
            //   this.CreateName=data.Data[0].CreateName;
            //   this.CreatedDate=data.Data[0].CreatedDate;
            //   this.ModifiedName=data.Data[0].ModifiedName;
            //   this.ModifiedDate=data.Data[0].ModifiedDate;
            //   this.ApprovalList=null;
            //   this.ApprovalList=JSON.parse(data.Data[0].ApprovalStatusList);
            //   for (let i = 0; i < this.ArrayRoleId?.length; i++) {
            //     for (let j = 0; j < this.ApprovalList?.length; j++) {
            //       if(parseInt(this.ArrayRoleId[i])==this.ApprovalList[j].RoleId)
            //       {
            //         this.IsApprovalstatusbtnhideShow=true;
            //       }
            //     }
            //  }
            this.model.DateDiffHour = data.Data[0].DateDiffHour;
            if (this.model.DateDiffHour > CommonStaticClass.DifferenceDay) {
              if (this.UserRoleId == UserRole.Admin || this.UserRoleId == UserRole.SCMLead) {
                this.IsSaveButtonDisable = true;
                this.IsDownloadPrintHideShow = true;
              } else {
                this.IsDownloadPrintHideShow = true;
                this.IsSaveButtonDisable = true;
              }
            } else {
              this.IsDownloadPrintHideShow = true;
              this.IsSaveButtonDisable = false;
            }
            if (data.Data[0].CLRPdfile != null && data.Data[0].CLRPdfile != "") {
              this.IsLRFile = true;
              this.LRFile = data.Data[0].CLRPdfile;
            } else {
              this.IsLRFile = false;
            }
            if (data.Data[0].GatePdffile != null && data.Data[0].GatePdffile != "") {
              this.IsGateFile = true;
              this.GateFile = data.Data[0].GatePdffile;
            } else {
              this.IsGateFile = false;
            }
            this.model.TransferTypeId = data.Data[0].IstransferTypeId;

            if (data.Data[0].DispatchFromId != null) {
              this.model.DispatchFrom = data.Data[0].DispatchFromId;
            } else {
              this.model.DispatchFrom = 0;
            }
            this.model.TaxInvoicDocFile = data.Data[0].TaxInvoiceFile;
            this.model.DocmentFile = data.Data[0].DocumentFile;
            this.model.EwayBillNo = data.Data[0].EwayBillNo;
            this.model.GRNNo = data.Data[0].GRNNo;
            if (data.Data[0].GRNDate != null) {
              var grnDate = data.Data[0].GRNDate.split('/');
              this.model.GRNDate = { year: parseInt(grnDate[2]), month: parseInt(grnDate[1]), day: parseInt(grnDate[0]) };
              }
            this.model.GateEntryNo = data.Data[0].GateEntryNo;
            var GateDate = data.Data[0].GateEntryDate.split('/');
            this.model.GateEntryDate = { year: parseInt(GateDate[2]), month: parseInt(GateDate[1]), day: parseInt(GateDate[0]) };
            this.model.GRNo = data.Data[0].GRNo;
            if (data.Data[0].GRDate != null) {
            var GrDate = data.Data[0].GRDate.split('/');
            this.model.GRDate = { year: parseInt(GrDate[2]), month: parseInt(GrDate[1]), day: parseInt(GrDate[0]) };
            }
            this.model.LRNo = data.Data[0].LRNo;
            if (data.Data[0].LRdate != null) {
            var lrDate = data.Data[0].LRDate.split('/');
            this.model.LRdate = { year: parseInt(lrDate[2]), month: parseInt(lrDate[1]), day: parseInt(lrDate[0]) };
            }
            this.model.ddlDespatchby = data.Data[0].IsDespatch;
            this.ChangeDespatchby(this.model.ddlDespatchby);
            if (this.model.ddlDespatchby == 1) {
              this.model.Transporter = data.Data[0].TranspoterName;;
              this.model.TransporterGSTNo = data.Data[0].TransporterGSTNO;
            } else if (this.model.ddlDespatchby == 2) {
              this.model.SenderName = data.Data[0].TranspoterName;;
              this.model.SenderNo = data.Data[0].TransporterGSTNO;
              this.model.SenderAddress = data.Data[0].SenderAddress;
            } else {
              this.model.CourierCompanyName = data.Data[0].TranspoterName;;
              this.model.CourierPhoneNo = data.Data[0].TransporterGSTNO;
              this.model.DocketNo = data.Data[0].DocketNo;
            }
            this.model.VehicleNo = data.Data[0].VehicleNo;
            this.model.IndentorName = data.Data[0].IndenterName;
            this.model.Remarks = data.Data[0].Remarks;


            this.model.ToStateId = '' + data.Data[0].WHState_Id + '';
            if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
              this.ShippedTOWHList = data.WHData;
              //this.model.ShippedWHAddress = data.WHData[0].WHAddress;
              this.model.WHToAddress = data.WHData[0].WHAddress;
            }
            this.model.ShippedToOtherWHId = '' + data.Data[0].WH_Id + '';

            this.FromWHList = JSON.parse(data.Data[0].FromWHAddressList)
            if (this.FromWHList != null || this.FromWHList != '') {
              this.model.ShippedfromWHId = data.Data[0].FromWHId;
              var FilterFROMHdata = this.FromWHList.filter(m => m.Id === parseInt(data.Data[0].FromWHId));
              this.model.ShippedWHAddress = FilterFROMHdata[0].WHAddress;
            }

            if (this.model.TransferTypeId == PageActivity.Dis_WHWithinState) {
              this.IsdisabledGst = true;
              this.model.DocumentNoData = data.Data[0].DocumentNo;
              this.IsAutoCompleteDesabled = true;
            }
            if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState) {
              this.IsdisabledGst = false;
              this.model.DocumentNoData = data.Data[0].TaxInvoiceNO;
              this.IsAutoCompleteDesabled = true;
            }
            this.IsTransferTypeOtherState = true;
            this.CorrectionItemCodeList = JSON.parse(data.Data[0].CorrectionItemCodeList);
            if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
              this.BindStnEditListArray(data.ItemData);
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetDispatchDetailForSTNByDocumentId", "stndetail");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetDispatchDetailForSTNByDocumentId", "stndetail");
    }
  }

  BindStnEditListArray(GRNCRNRowData: any) {
    try {
      this.dynamicArray = [];
      for (var i = 0, len = GRNCRNRowData.length; i < len; i++) {
        var objdynamic = new DynamicItemGrid();
        objdynamic.IsCorrection = false;
        objdynamic.Id = GRNCRNRowData[i].Id;
        objdynamic.ItemNameId = GRNCRNRowData[i].ItemNameId;
        objdynamic.PoItemListId = GRNCRNRowData[i].ItemListId;
        objdynamic.ItemDescription = GRNCRNRowData[i].ItemDescription;
        objdynamic.SubDescription = GRNCRNRowData[i].SubDescription;
        // objdynamic.UnitName = GRNCRNRowData[i].UnitName;
        objdynamic.Rate = parseFloat(GRNCRNRowData[i].ItemRate).toFixed(2);
        // objdynamic.POQty = GRNCRNRowData[i].DisQty;
        objdynamic.Qty = GRNCRNRowData[i].ChallanQty;
        objdynamic.AcceptedQty = GRNCRNRowData[i].AcceptedQty;
        objdynamic.ReceivedQty = GRNCRNRowData[i].ReceivedQty;
        objdynamic.RejectedQty = GRNCRNRowData[i].RejectedQty;
        objdynamic.ExcessShort = GRNCRNRowData[i].ExcessShort;
        objdynamic.TotalAmount = GRNCRNRowData[i].TotalAmount;
        if (GRNCRNRowData[i].TaxWith == 0 || GRNCRNRowData[i].TaxWith == 1) {
          objdynamic.TaxWith = "1";
        } else {
          objdynamic.TaxWith = "2";
        }
        objdynamic.CGSTRate = GRNCRNRowData[i].CGSTRate;
        objdynamic.CGST = GRNCRNRowData[i].CGST;
        objdynamic.SGSTRate = GRNCRNRowData[i].SGSTRate;
        objdynamic.SGST = GRNCRNRowData[i].SGST;
        objdynamic.TCSRate = GRNCRNRowData[i].TCSRate;
        objdynamic.TCS = GRNCRNRowData[i].TCS;
        objdynamic.IGSTValue = GRNCRNRowData[i].IGSTRate;
        objdynamic.IGST = GRNCRNRowData[i].IGST;
        objdynamic.TotalInvoiceValue = GRNCRNRowData[i].TotalInvoiceValue;
        objdynamic.FreightCharge = GRNCRNRowData[i].FreightCharge;
        objdynamic.TotalAmountWithFreightCharge = GRNCRNRowData[i].TotalAmountWithFreightCharge;

        objdynamic.ItemId = GRNCRNRowData[i].ItemId;
        objdynamic.ItemMakeId = GRNCRNRowData[i].MakeMaster_Id;
        objdynamic.EditItemCode = JSON.parse(GRNCRNRowData[i].ItemCodeList)
        objdynamic.EditItemMake = JSON.parse(GRNCRNRowData[i].ItemMakeList);
        if (GRNCRNRowData[i].SerialNoList === null) {
          objdynamic.GSerialNumbers = [];
        } else {
          objdynamic.GSerialNumbers = JSON.parse(GRNCRNRowData[i].SerialNoList);
        }
        if (GRNCRNRowData[i].IsCorrectionEntryReason != 0) {
          objdynamic.IsCorrectionEntryReason = GRNCRNRowData[i].IsCorrectionEntryReason;
        } else {
          objdynamic.IsCorrectionEntryReason = "0";
        }
        objdynamic.CorrectionEntryRemarks = GRNCRNRowData[i].CorrectionEntryRemarks;
        objdynamic.UnitList = JSON.parse(GRNCRNRowData[i].UnitList);
        if (GRNCRNRowData[i].UnitMaster_Id != null && GRNCRNRowData[i].UnitMaster_Id != "") {
          objdynamic.UnitName = GRNCRNRowData[i].UnitMaster_Id;
        } else {
          objdynamic.UnitName = "0";
        }
        if (GRNCRNRowData[i].EqTypeId != null && GRNCRNRowData[i].EqTypeId != "") {
          objdynamic.EqTypeId = GRNCRNRowData[i].EqTypeId;
        } else {
          objdynamic.EqTypeId = "0";
        }
        if (GRNCRNRowData[i].ClientId != "" && GRNCRNRowData[i].ClientId != null) {
          objdynamic.ClientId = GRNCRNRowData[i].ClientId;
        } else {
          objdynamic.ClientId = "0";
        }
        objdynamic.ValueSiteName = GRNCRNRowData[i].SiteName;
        objdynamic.ValueCustomerSite = GRNCRNRowData[i].CustomerSiteId;
        if (GRNCRNRowData[i].IsConversion == 1) {
          objdynamic.HideShowConValue = true;
          objdynamic.ConversionValue = GRNCRNRowData[i].SetQty;
          objdynamic.HideConversionValue = GRNCRNRowData[i].ConversionValue;
          objdynamic.ConversionUnit = GRNCRNRowData[i].ConversionUnit;
        } else {
          objdynamic.HideShowConValue = false;
        }
        objdynamic.SiteId = GRNCRNRowData[i].SiteId;
        objdynamic.SiteName = GRNCRNRowData[i].SiteName;
        objdynamic.CustomerSiteId = GRNCRNRowData[i].CustomerSiteId;
        objdynamic.ReasonCode = GRNCRNRowData[i].ReasonCode;
        objdynamic.CustomerId = GRNCRNRowData[i].CustomerId;
        objdynamic.CustomerCode = GRNCRNRowData[i].CustomerCode;
        objdynamic.HSN = GRNCRNRowData[i].HSNCode;
        this.dynamicArray.push(objdynamic);
        //objdynamic.TotalAmount=parseFloat(ItemEditDataArr[i].TotalAmount).toFixed(2);
        this.fnBindItemGrossToatlTax();
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindGrnCrnItemListArray";
      objWebErrorLogModel.ErrorPage = "GRN";
      // this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
//#endregion
//#region this function  used Bind STN Detail by Dispatch Id
  SearchSTNDataByDispatchId(Id: any) {
    try {
      var objModel = new SearchDispatchTrackerModel();
      objModel.DispatchTracker_Id = Id;
      // objModel.Flag = "DispatchId";
      // objModel.Flag = "";
      this._GrncrnService.GetDispatchDetailForSTNByDocumentId(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.model.DisatchTrackeringId = data.Data[0].DisatchTrackeringId;
            this.TableId = data.Data[0].DisatchTrackeringId;
            this.ManueId = this.PageMenuId;
            var DDate = data.Data[0].DocumentDate.split('/');
            this.model.DocumentDate = { year: parseInt(DDate[2]), month: parseInt(DDate[1]), day: parseInt(DDate[0]) };
            //   this.CreateName=data.Data[0].CreateName;
            //   this.CreatedDate=data.Data[0].CreatedDate;
            //   this.ModifiedName=data.Data[0].ModifiedName;
            //   this.ModifiedDate=data.Data[0].ModifiedDate;
            //   this.ApprovalList=null;
            //   this.ApprovalList=JSON.parse(data.Data[0].ApprovalStatusList);
            //   for (let i = 0; i < this.ArrayRoleId?.length; i++) {
            //     for (let j = 0; j < this.ApprovalList?.length; j++) {
            //       if(parseInt(this.ArrayRoleId[i])==this.ApprovalList[j].RoleId)
            //       {
            //         this.IsApprovalstatusbtnhideShow=true;
            //       }
            //     }
            //  }

            // if(this.ApprovalList!=null)
            // {
            //   this.ApproveStatusDataList= this.ApprovalList;
            // }else{
            //   this.ApproveStatusDataList=null;
            // }
            this.model.TransferTypeId = data.Data[0].IstransferTypeId;
            if (data.Data[0].TrasporationMode != null) {
              this.model.TrasporationMode = data.Data[0].TrasporationMode;
            } else {
              this.model.TrasporationMode = 0;
            }
            //vishal, 05/12/2022
            if (data.Data[0].TrasporationName != null) {
              this.model.TrasporationName = data.Data[0].TrasporationName;
            } else {
              this.model.TrasporationName = 0;
            }
            if (data.Data[0].TrasporationGSTNO != null) {
              this.model.TrasporationGSTNO = data.Data[0].TrasporationGSTNO;
            } else {
              this.model.TrasporationGSTNO = 0;
            }
            if (data.Data[0].VehicleNumber != null) {
              this.model.VehicleNumber = data.Data[0].VehicleNumber;
            } else {
              this.model.VehicleNumber = 0;
            }
            //end-vishal
            if (data.Data[0].DispatchFromId != null) {
              this.model.DispatchFrom = data.Data[0].DispatchFromId;
            } else {
              this.model.DispatchFrom = 0;
            }
            this.model.TaxInvoicDocFile = data.Data[0].TaxInvoiceFile;
            this.model.DocmentFile = data.Data[0].DocumentFile;
            this.model.EwayBillNo = data.Data[0].EwayBillNo;
            this.model.GRNo = data.Data[0].GRNo;
            
            if (data.Data[0].GRDate != null) {
            var GrDate = data.Data[0].GRDate.split('/');
            this.model.GRDate = { year: parseInt(GrDate[2]), month: parseInt(GrDate[1]), day: parseInt(GrDate[0]) };
            }
            this.model.TaxInvoiceNo = data.Data[0].TaxInvoiceNO;
            this.model.DocumentNo = data.Data[0].DocumentNo;
            this.model.InvoiceAmount = data.Data[0].TotalSumAmount;
            //
            // this.model.GSTType=1;
            if (data.Data[0].DeliveredDate != null) {
              var DelDate = data.Data[0].DeliveredDate.split('/');
              this.model.DeliveredDate = { year: parseInt(DelDate[2]), month: parseInt(DelDate[1]), day: parseInt(DelDate[0]) };
            }
            if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
              this.FromWHList = data.WHData;
              this.model.ShippedWHAddress = data.WHData[0].WHAddress;
            }
            this.model.ShippedfromWHId = data.Data[0].ShippedfromWHId;
            var FilterFROMHdata = this.FromWHList.filter(m => m.Id === parseInt(data.Data[0].ShippedfromWHId));
            this.model.FromWHName = FilterFROMHdata[0].WHName;

            this.ShippedTOWHList = JSON.parse(data.Data[0].ToOtherWHAddressList)
            this.model.ShippedToOtherWHId = '' + data.Data[0].ShippedToWHId + '';
            var FilterTOWHdata = this.ShippedTOWHList.filter(m => m.id === parseInt(data.Data[0].ShippedToWHId));
            this.model.ToWHName = FilterTOWHdata[0].itemName;
            this.model.WHToAddress = data.Data[0].ToWhAddress;
            this.model.ToStateId = '' + data.Data[0].ToState_Id + '';
            var FilterTOStatedata = this.WHStateList.filter(m => m.id === parseInt(data.Data[0].ToState_Id));
            this.model.ToStateName = FilterTOStatedata[0].itemName;

            if (this.model.TransferTypeId == PageActivity.Dis_WHWithinState) {
              this.IsdisabledGst = true;
            }
            if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState) {
              this.IsdisabledGst = false;
            }
            this.IsTransferTypeOtherState = true;
            if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
              this.BindItemArray(data.ItemData);
            }
          }
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GetDispatchDetailForSTNByDocumentId", "stndetail");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GetDispatchDetailForSTNByDocumentId", "stndetail");
    }
  }

  async BindItemArray(ItemEditDataArr: any) {
    this.dynamicArray = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objdynamic = new DynamicItemGrid();
        objdynamic.Id = ItemEditDataArr[i].Id;
        objdynamic.PoItemListId = ItemEditDataArr[i].Id;
        objdynamic.ItemNameId = ItemEditDataArr[i].ItemNameId;
        objdynamic.ItemName = ItemEditDataArr[i].ItemName;
        objdynamic.EditItemMake = JSON.parse(ItemEditDataArr[i].ItemMakeList);
        objdynamic.ItemMakeId = ItemEditDataArr[i].MakeMaster_Id;
        objdynamic.EditItemCode = JSON.parse(ItemEditDataArr[i].ItemCodeList);
        // objdynamic.GSerialNumbers = JSON.parse(ItemEditDataArr[i].SerialNoList);
        if (ItemEditDataArr[i].SerialNoList != null) {
          objdynamic.GSerialNumbers = JSON.parse(ItemEditDataArr[i].SerialNoList);
        } else {
          objdynamic.GSerialNumbers = [];
        }
        objdynamic.UnitList = JSON.parse(ItemEditDataArr[i].UnitList);
        objdynamic.ItemId = ItemEditDataArr[i].ItemId;
        objdynamic.EqTypeId = ItemEditDataArr[i].EqpType_Id;
        objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
        objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
        objdynamic.EqpType = ItemEditDataArr[i].EqpType;
        if (ItemEditDataArr[i].ClientId != "" && ItemEditDataArr[i].ClientId != null) {
          objdynamic.ClientId = ItemEditDataArr[i].ClientId;
        } else {
          objdynamic.ClientId = "0";
        }
        if (ItemEditDataArr[i].ClientId == 60) {
          objdynamic.CustomerCode = "Ascend";
        } else {
          objdynamic.CustomerCode = "General";
        }
        objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
        objdynamic.ReceivedQty = ItemEditDataArr[i].Qty.toFixed(2);
        objdynamic.AcceptedQty = ItemEditDataArr[i].Qty.toFixed(2);
        if (ItemEditDataArr[i].UnitMaster_Id != null) {
          objdynamic.UnitName = ItemEditDataArr[i].UnitMaster_Id;
        } else {
          objdynamic.UnitName = "0";
        }
        objdynamic.RejectedQty = "0";
        objdynamic.ExcessShort = "0";
        objdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
        objdynamic.MakeName = ItemEditDataArr[i].MakeName;
        objdynamic.ItemCode = ItemEditDataArr[i].ItemCode;
        objdynamic.Unit = ItemEditDataArr[i].UnitName;
        objdynamic.HSN = ItemEditDataArr[i].HSN_SAC;
        objdynamic.TotalAmount = ItemEditDataArr[i].TotalAmount;
        objdynamic.TotalAmountWithFreightCharge = ItemEditDataArr[i].TotalAmount;
        objdynamic.Discount = ItemEditDataArr[i].Discount;
        // objdynamic.GetTotalAmount = ItemEditDataArr[i].GrandTotalAmt;
        objdynamic.TotalInvoiceValue = ItemEditDataArr[i].GrandTotalAmt
        var MfDate = ItemEditDataArr[i].ManufacturerDate;
        if (MfDate != null && MfDate != '') {
          var MfDate = ItemEditDataArr[i].ManufacturerDate.split('/');
          objdynamic.ManufDate = { year: parseInt(MfDate[2]), month: parseInt(MfDate[1]), day: parseInt(MfDate[0]) };
        }
        objdynamic.SerialNo = ItemEditDataArr[i].ManufacturerSerialNo;
        var INVCDate = ItemEditDataArr[i].InvoiceTaxDate;
        if (INVCDate != null && INVCDate != '') {
          var INVCDate = ItemEditDataArr[i].InvoiceTaxDate.split('/');
          objdynamic.InvoiceTaxDate = { year: parseInt(INVCDate[2]), month: parseInt(INVCDate[1]), day: parseInt(INVCDate[0]) };
        }
        objdynamic.InvoiceTaxNo = ItemEditDataArr[i].InvoiceTaxNo;
        if (ItemEditDataArr[i].IGSTValue != null) {
          objdynamic.IGSTValue = ItemEditDataArr[i].IGSTValue;
        } else {
          objdynamic.IGSTValue = 0;
        }

        objdynamic.IGST = ItemEditDataArr[i].IGST;
        this.dynamicArray.push(objdynamic);
        //this.fnBindItemGrossToatl();
        // this.fnBindIGSTValueItemGrossToatal();
        this.fnBindItemGrossToatlTax();
      }
    }
  }
  //#endregion
  OnblurReceivedQty(index: any) {
    var trqty = 0.0;
    var recqty = 0.0;
    var accepqty = 0.0;
    var execssqty = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      trqty = parseFloat(this.dynamicArray[index].Qty == undefined ? 0.0 : this.dynamicArray[index].Qty);
      recqty = parseFloat(this.dynamicArray[index].ReceivedQty == undefined ? 0.0 : this.dynamicArray[index].ReceivedQty);
      this.dynamicArray[index].ExcessShort = (recqty - trqty)
    }
  }

  AcceptedQtyOnblur(index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueAcceptedQty = $(this).find('.AcceptedQty').val();
      if (valueAcceptedQty != '0') {
        $(this).find('.AcceptedQty').css('border-color', '');
      }
    });
    var trqty = 0.0;
    var acqty = 0.0;
    var faqty = 0.0;
    var recqty = 0.0;
    var execssqty = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      trqty = parseFloat(this.dynamicArray[index].Qty == undefined ? 0.0 : this.dynamicArray[index].Qty);
      acqty = parseFloat(this.dynamicArray[index].AcceptedQty == undefined ? 0.0 : this.dynamicArray[index].AcceptedQty);
      faqty = parseFloat(this.dynamicArray[index].RejectedQty == undefined ? 0.0 : this.dynamicArray[index].RejectedQty);
      recqty = parseFloat(this.dynamicArray[index].ReceivedQty == undefined ? 0.0 : this.dynamicArray[index].ReceivedQty);
      if (acqty > recqty) {
        alert("accepted qty should not be greater than  received qty   ");
        this.dynamicArray[index].AcceptedQty = "0.00";
        this.dynamicArray[index].RejectedQty = "0";
        // this.fnBindItemGrossToatl();
      } else {
        //this.dynamicArray[i].RejectedQty = (trqty - acqty); 
        this.dynamicArray[index].RejectedQty = (recqty - acqty);
        // this.fnBindItemGrossToatl();
        this.fnBindItemGrossToatlTax();
      }
    }
  }

  ItemRateOnblur() {
    //this.fnBindItemGrossToatl();
    this.fnBindItemGrossToatlTax();
  }

  fnBindItemGrossToatlTax() {
    this.totalAmount = 0.0;
    var _rowAmount = 0.0;
    var accqty = 0.0;
    var AcceptedQty = 0.0;
    var rate = 0.0;
    this.totalSumAcceptedQty = 0.0;
    var cgstRate = 0.00;
    var sgstRate = 0.00;
    var tcsRate = 0.00;
    var igstrate = 0.00;
    var GrandAllSumtotal = 0;
    this.GrandAllSumtotalInvoiceValue = 0.00;
    var taxWith;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      _rowAmount = 0.0;

      if (this.dynamicArray[i].SGSTRate != 0) {
        this.dynamicArray[i].CGSTRate = this.dynamicArray[i].SGSTRate;
      }
      if (this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].SGSTRate = this.dynamicArray[i].CGSTRate;
      }
      if (this.dynamicArray[i].IGSTValue != 0) {
        this.dynamicArray[i].SGSTRate = 0;
        this.dynamicArray[i].CGSTRate = 0;
      }
      // accqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      accqty = parseFloat(this.dynamicArray[i].AcceptedQty == "" ? 0.0 : this.dynamicArray[i].AcceptedQty);
      rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      cgstRate = parseFloat(this.dynamicArray[i].CGSTRate == "" ? 0.0 : this.dynamicArray[i].CGSTRate);
      sgstRate = parseFloat(this.dynamicArray[i].SGSTRate == "" ? 0.0 : this.dynamicArray[i].SGSTRate);
      tcsRate = parseFloat(this.dynamicArray[i].TCSRate == "" ? 0.0 : this.dynamicArray[i].TCSRate);
      igstrate = parseFloat(this.dynamicArray[i].IGSTValue == "" ? 0.0 : this.dynamicArray[i].IGSTValue);

      AcceptedQty += accqty;
      // this.totalAmount += (accqty * rate);
      _rowAmount = accqty * rate;
      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(accqty * rate);
      taxWith = this.dynamicArray[i].TaxWith;
      if (taxWith == "1") {
        this.dynamicArray[i].TotalAmountWithFreightCharge = _rowAmount + parseFloat(this.dynamicArray[i].FreightCharge);
        this.dynamicArray[i].CGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * cgstRate) / 100;
        this.dynamicArray[i].SGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * sgstRate) / 100;
        this.dynamicArray[i].IGST = (this.dynamicArray[i].TotalAmountWithFreightCharge * igstrate) / 100;
        this.dynamicArray[i].TCS = (this.dynamicArray[i].TotalAmountWithFreightCharge * tcsRate) / 100
        this.totalAmount += this.dynamicArray[i].TotalAmountWithFreightCharge;
      }
      else {
        this.dynamicArray[i].TotalAmountWithFreightCharge = _rowAmount + parseFloat(this.dynamicArray[i].FreightCharge);
        this.dynamicArray[i].CGST = (_rowAmount * cgstRate) / 100;
        this.dynamicArray[i].SGST = (_rowAmount * sgstRate) / 100;
        this.dynamicArray[i].IGST = (_rowAmount * igstrate) / 100;
        this.dynamicArray[i].TCS = (_rowAmount * tcsRate) / 100;
        this.totalAmount += this.dynamicArray[i].TotalAmountWithFreightCharge;
      }
      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].IGSTValue != 0) {
        this.ValidationerrorMessage = 'Invalid Tax Detail';
        jQuery('#Validationerror').modal('show');
        this.dynamicArray[i].SGSTRate = 0.00;
        this.dynamicArray[i].CGSTRate = 0.00;
        this.dynamicArray[i].IGSTValue = 0.00;
      }
      if (this.dynamicArray[i].SGSTRate != 0 && this.dynamicArray[i].CGSTRate != 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].CGST + this.dynamicArray[i].SGST + this.dynamicArray[i].TCS);
      }
      if (this.dynamicArray[i].SGSTRate == 0 && this.dynamicArray[i].CGSTRate == 0) {
        this.dynamicArray[i].TotalInvoiceValue = (this.dynamicArray[i].TotalAmountWithFreightCharge + this.dynamicArray[i].IGST);
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
      if (this.dynamicArray[i].IGSTValue == '') {
        this.dynamicArray[i].IGSTValue = 0;
      }
      if (this.dynamicArray[i].CGSTRate == '') {
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (this.dynamicArray[i].SGSTRate == '') {
        this.dynamicArray[i].SGSTRate = 0;
      }
      this.dynamicArray[i].TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue.toFixed(2);
      GrandAllSumtotal += parseFloat(this.dynamicArray[i].TotalInvoiceValue);
      var chekValidation = (parseFloat(this.dynamicArray[i].SGSTRate) + parseFloat(this.dynamicArray[i].CGSTRate))
      var chekValidationIgst = (parseFloat(this.dynamicArray[i].IGSTValue))
      if (chekValidation > 28) {
        alert('Please enter tax detail less then 14');
        this.dynamicArray[i].SGSTRate = 0;
        this.dynamicArray[i].CGSTRate = 0;
      }
      if (chekValidationIgst > 28) {
        alert('Please enter tax detail less then 28');
        this.dynamicArray[i].IGSTRate = 0;
      }
    }
    this.totalSumAcceptedQty = AcceptedQty.toFixed(2);
    this.totalSumAmount = this._Commonservices.thousands_separators(this.totalAmount);
    this.GrandAllSumtotalInvoiceValue = GrandAllSumtotal.toFixed(2);
    //this.totalSumQuantity=parseFloat(this.totalQuantity).toFixed(2);
    // parseFloat(this.totalSumAmount).toFixed(2)
  }

  fnBindIGSTValueItemGrossToatal() {
    this.totalamount = 0.0;
    var totalqty = 0.0;
    var totalpoqty = 0.0;
    var poqty = 0.0;
    var IGSTval = 0.0;
    var IGSTAmount = 0.0;
    var Rate = 0.0;
    this.totalSumQuantity = 0.0;
    var HideConValue = 0.0;
    for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
      //////
      poqty = parseFloat(this.dynamicArray[i].Qty == "" ? 0.0 : this.dynamicArray[i].Qty);
      Rate = parseFloat(this.dynamicArray[i].Rate == "" ? 0.0 : this.dynamicArray[i].Rate);
      IGSTval = parseFloat(this.dynamicArray[i].IGSTValue == "" ? 0.0 : this.dynamicArray[i].IGSTValue);
      if (this._Commonservices.checkUndefined(this.dynamicArray[i].HideConversionValue) != "") {
        HideConValue = parseFloat(this.dynamicArray[i].HideConversionValue == "" ? 0.0 : this.dynamicArray[i].HideConversionValue);
        this.dynamicArray[i].ConversionValue = (poqty * HideConValue)
      }
      totalpoqty += poqty;
      //totalamount+=((poqty*Rate)-DiscountAmt);
      this.dynamicArray[i].TotalAmount = this._Commonservices.thousands_separators(poqty * Rate);
      this.dynamicArray[i].IGST = (((poqty * Rate) * IGSTval) / 100);
      // this.dynamicArray[i].GetTotalAmount = this._Commonservices.thousands_separators((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      this.dynamicArray[i].TotalInvoiceValue = this._Commonservices.thousands_separators((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      IGSTAmount = ((poqty * Rate) + (((poqty * Rate) * IGSTval) / 100));
      this.totalamount += IGSTAmount;
    }
    this.totalSumPOQuantity = totalpoqty.toFixed(2);
    this.totalSumQuantity = totalqty.toFixed(2);
    //this.totalSumAmount=totalamount.toFixed(2);
    this.model.AmountChargeable = this._Commonservices.valueInWords(this.totalamount);
    this.totalSumAmount = this._Commonservices.thousands_separators(this.totalamount.toFixed(2));
  }

  ClearSTNForm() {
    localStorage.removeItem("Id");
    this.IsLRFile = false;
    this.IsGateFile = false;
    this.model.STNId = 0;
    this.model.ToStateId = '0';
    this.model.ShippedfromWHId = "0";
    this.model.ShippedToOtherWHId = "0";
    this.FromWHList = null;
    this.WHStateList = null;
    this.ShippedTOWHList = null;
    this.dynamicArray = [];
    this.totalSumQuantity = "";
    this.totalSumAmount = "";
    this.totalSumPOQuantity = "";
    this.model.WHAddress = "";
    this.model.ShippedWHAddress = "";
    this.model.DocumentDate = "";
    this.model.GRNo = "";
    this.model.GRDate = "";
    this.model.VehicleNo = "";
    this.model.TaxInvoiceNo = "";
    this.model.Transporter = "";
    this.model.IndentorName = "";

    this.model.CourierCompanyName = "";
    this.model.CourierPhoneNo = "";
    this.model.SenderAddress = "";
    this.model.SenderNo = "";
    this.model.SenderName = "";
    this.ChangeDespatchby(1);
    this.model.ddlDespatchby = "1";
    this.model.LRNo = "";
    this.model.LRdate = "";
    this.model.Remarks = "";
    this.model.GateEntryDate = "";
    this.model.GateEntryNo = "";
    this.model.InvoiceAmount = "";
    this.model.ChallanDate = "";
    this.model.EwayBillNo = "";
    this.model.DocumentNo = "";
    this.model.DisatchTrackeringId = 0;
    this.model.WHToAddress = "";
    this.model.DocumentNoData = "";
    this.AutoCompleteDocumentNoList = [];
    var toDate = "";
    toDate = this.datePipe.transform(Date(), "yyyy/MM/dd");
    this.model.GRNDate = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };

    //this.ClearAllUploadFile();
  }
  GateViewfileClick() {
    window.open(this.GateFile);
  }

  LRViewfileClick() {
    window.open(this.LRFile);
  }
  CreateNewSTN() {
    this.ClearSTNForm();
    this.IsSuccess = false;
    this.isPdfButtonHidePreview = true;
    this.IsDownloadPrintHideShow = false;
    this.IsAutoCompleteDesabled = false;
    this.IsSaveButtonDisable = false;
  }
//#region this function used to Save Proccess
  conformPopup() {
    if (this.ValidationSTN() == 1) {
      return false;
    } else if (this.validateItemData() == 1) {
      setTimeout(function () { this.IsError = false; }, 3000);
      return false;
    } else if (this.dynamicArray.length < 1) {
      alert('please fill atleast one item');
      return false;
    } else {
      jQuery('#confirm').modal('show');
    }
  }

  SaveSTNDetail() {
    try {
      var objSTNModel = new STNModel();
      objSTNModel.GrnCrnId = this.model.STNId;
      objSTNModel.DispatchId = this.model.DisatchTrackeringId;
      objSTNModel.UserId = this.UserId;
      objSTNModel.CompanyId = this.CompanyId;
      objSTNModel.FromWHId = this.model.ShippedfromWHId;
      objSTNModel.TostateId = this.model.ToStateId;
      if (this.model.TaxInvoiceNo != null && this.model.TaxInvoiceNo != '') {
        objSTNModel.InvChallanNo = this.model.TaxInvoiceNo;
      } else {
        objSTNModel.InvChallanNo = this.model.DocumentNo;
      }
      objSTNModel.ToWHId = this.model.ShippedToOtherWHId;
      objSTNModel.GateEntryNo = this.model.GateEntryNo;
      objSTNModel.Flag = '4';
      var GrnSrnEntryDate = this._Commonservices.checkUndefined(this.model.GateEntryDate);
      if (GrnSrnEntryDate != '') {
        objSTNModel.GateEntryDate = GrnSrnEntryDate.day + '/' + GrnSrnEntryDate.month + '/' + GrnSrnEntryDate.year;
      } else {
        objSTNModel.GateEntryDate = '';
      }
      objSTNModel.IsDespatch = this.model.ddlDespatchby;
      if (this.model.ddlDespatchby == 1) {
        objSTNModel.TransporterGSTNO = this.model.TransporterGSTNo;
        objSTNModel.TranspoterName = this.model.Transporter;
      } else if (this.model.ddlDespatchby == 2) {
        objSTNModel.TransporterGSTNO = this.model.SenderNo;
        objSTNModel.TranspoterName = this.model.SenderName;
        objSTNModel.SenderAddress = this.model.SenderAddress;
      } else {
        objSTNModel.TransporterGSTNO = this.model.CourierPhoneNo;
        objSTNModel.TranspoterName = this.model.CourierCompanyName;
        objSTNModel.DocketNo = this.model.DocketNo;
      }

      objSTNModel.VehicleNo = this.model.VehicleNo;
      objSTNModel.IndentorName = this.model.IndentorName;
      objSTNModel.LRNo = this.model.LRNo;
      var GrnSrnLrDate = this._Commonservices.checkUndefined(this.model.LRdate);
      if (GrnSrnLrDate != "") {
        objSTNModel.LRDate = GrnSrnLrDate.day + '/' + GrnSrnLrDate.month + '/' + GrnSrnLrDate.year;
      } else {
        objSTNModel.LRDate = '';
      }
      objSTNModel.EwayBillNo = this.model.EwayBillNo;
      objSTNModel.Remarks = this.model.Remarks;
      this.STNDetailItem = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
        objDispatchTrackingItemDetialModel.Id = this.dynamicArray[i].Id;
        objDispatchTrackingItemDetialModel.PoItemListId = this.dynamicArray[i].PoItemListId;
        objDispatchTrackingItemDetialModel.ItemCode_Id = this.dynamicArray[i].ItemId;
        objDispatchTrackingItemDetialModel.Rate = this.dynamicArray[i].Rate;
        objDispatchTrackingItemDetialModel.Discount = this.dynamicArray[i].Discount;
        objDispatchTrackingItemDetialModel.HSN_SAC = this.dynamicArray[i].HSN;
        objDispatchTrackingItemDetialModel.EqpType_Id = this.dynamicArray[i].EqTypeId;
        objDispatchTrackingItemDetialModel.ClientId = this.dynamicArray[i].ClientId;
        objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
        objDispatchTrackingItemDetialModel.SubDescription = this.dynamicArray[i].SubDescription;
        var MfDate = this._Commonservices.checkUndefined(this.dynamicArray[i].ManufDate);
        if (MfDate != '') {
          objDispatchTrackingItemDetialModel.ManufacturerDate = MfDate.day + '/' + MfDate.month + '/' + MfDate.year;
        } else {
          objDispatchTrackingItemDetialModel.ManufacturerDate = "";
        }
        // objDispatchTrackingItemDetialModel.ManufacturerSerialNo = this.dynamicArray[i].SerialNo;
        var INVDate = this._Commonservices.checkUndefined(this.dynamicArray[i].InvoiceTaxDate);
        if (INVDate != '') {
          objDispatchTrackingItemDetialModel.InvoiceTaxDate = INVDate.day + '/' + INVDate.month + '/' + INVDate.year;
        } else {
          objDispatchTrackingItemDetialModel.InvoiceTaxDate = "";
        }
        objDispatchTrackingItemDetialModel.InvoiceTaxNo = this.dynamicArray[i].InvoiceTaxNo;
        objDispatchTrackingItemDetialModel.IGST = this.dynamicArray[i].IGST;
        objDispatchTrackingItemDetialModel.IGSTRate = this.dynamicArray[i].IGSTValue;
        objDispatchTrackingItemDetialModel.CGSTRate = this.dynamicArray[i].CGSTRate;
        objDispatchTrackingItemDetialModel.CGST = this.dynamicArray[i].CGST;
        objDispatchTrackingItemDetialModel.SGSTRate = this.dynamicArray[i].SGSTRate;
        objDispatchTrackingItemDetialModel.SGST = this.dynamicArray[i].SGST;
        objDispatchTrackingItemDetialModel.TCSRate = this.dynamicArray[i].TCSRate;
        objDispatchTrackingItemDetialModel.TCS = this.dynamicArray[i].TCS;
        objDispatchTrackingItemDetialModel.TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue;
        objDispatchTrackingItemDetialModel.FreightCharge = this.dynamicArray[i].FreightCharge;
        objDispatchTrackingItemDetialModel.TotalAmountWithFreightCharge = this.dynamicArray[i].TotalAmountWithFreightCharge;
        objDispatchTrackingItemDetialModel.TaxWith = this.dynamicArray[i].TaxWith;
        objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
        objDispatchTrackingItemDetialModel.ReceivedQty = this.dynamicArray[i].ReceivedQty;
        objDispatchTrackingItemDetialModel.AcceptedQty = this.dynamicArray[i].AcceptedQty;
        objDispatchTrackingItemDetialModel.RejectedQty = this.dynamicArray[i].RejectedQty;
        objDispatchTrackingItemDetialModel.ExcessShort = this.dynamicArray[i].ExcessShort;
        // var conver = this._Commonservices.checkUndefined(this.dynamicArray[i].ConversionUnit);
        // if (conver == "") {
        //   objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
        //   objDispatchTrackingItemDetialModel.ConversionUnit = "";
        //   objDispatchTrackingItemDetialModel.ConversionValue = 0;
        // } else {
        //   objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].ConversionValue;
        //   objDispatchTrackingItemDetialModel.ConversionUnit = this.dynamicArray[i].UnitName;
        //   objDispatchTrackingItemDetialModel.ConversionValue = this.dynamicArray[i].Qty;
        // }
        this.srnlst = [];
        if (this.dynamicArray[i].GSerialNumbers.length > 0) {
          if (this.dynamicArray[i].ItemNameId == "4" && this.dynamicArray[i].UnitName == "8") {
            // Check by Hemant Tyagi
            for (var j = 0; j < this.dynamicArray[i].GSerialNumbers.length; j++) {
              for (var k = 0; k < this.dynamicArray[i].GSerialNumbers[j].CellNos.length; k++) {
                var srnData = new GSerialNumber();
                srnData.InitialSrno = this.dynamicArray[i].GSerialNumbers[j].CellNos[k].CellValue;
                srnData.Sequance = j.toString();
                this.srnlst.push(srnData)
              }
            }
            objDispatchTrackingItemDetialModel.GSerialNumbers = this.srnlst;
          } else {
            objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
          }
        }
        //objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
        this.STNDetailItem.push(objDispatchTrackingItemDetialModel)
      }
      objSTNModel.DispatchTrackerItemList = this.STNDetailItem;
      var formdata = new FormData();
      if (this.GatePdfUploadFile == null) {
        formdata.append('GatePdffile', this.GatePdfUploadFile);
      } else {
        formdata.append('GatePdffile', this.GatePdfUploadFile, this.GatePdfUploadFile.name);
      }
      if (this.LRPdfUploadFile == null) {
        formdata.append('LRPdffile', this.LRPdfUploadFile);
      } else {
        formdata.append('LRPdffile', this.LRPdfUploadFile, this.LRPdfUploadFile.name);
      }
      formdata.append('jsonDetail', JSON.stringify(objSTNModel));
      this._GrncrnService.SaveUpadteSTNDetail(formdata).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#confirm').modal('hide');
          this.loading = false;
          this.succesMessage = "Your data has been save successfully with STN No-" + data.Remarks + "";
          this.IsSuccess = true;
          setTimeout(() => {
            this.IsSuccess = false;
          }, 1000);
          this.ClearSTNForm();
        } else if (data.Status == 2) {
          this.loading = false;
          jQuery('#confirm').modal('hide');
          this.succesMessage = "your data update successfully";
          this.IsSuccess = true;
          setTimeout(() => {
            this.IsSuccess = false;
          }, 1000);
        }
        else if (data.Status == 3) {
          this.loading = false;
          jQuery('#confirm').modal('hide');
          this.errorMessage = "" + data.Remarks + "";
          this.IsError = true;
        } else if (data.Status == 0) {
          this.loading = false;
          jQuery('#confirm').modal('hide');
          this.errorMessage = "" + data.Remarks + "";
          this.IsError = true;
        }
      }, error => {
        this.loading = false;
        jQuery('#confirm').modal('hide');
        this._Commonservices.ErrorFunction(this.UserName, error.message, "SaveUpadteSTNDetail", "STNDetail");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "SaveUpadteSTNDetail", "STNDetail");
    }
  }
//#endregion

  ChangeDespatchby(Id: any) {
    this.IsVehicleValidation = false;
    this.IsTransporter = false;
    this.IsByHand = false;
    this.IsCourier = false;
    if (Id == 1 || Id == "0") {
      this.IsTransporter = true;
      this.IsVehicleValidation = true;
    } else if (Id == 2) {
      this.IsByHand = true;
    } else {
      this.IsCourier = true;
    }
  }

  //#region Correction Entry Work
  ChangeCorrectionEntryReason(index: any) {
    if (this.dynamicArray[index].IsCorrectionEntryReason != "" || this.dynamicArray[index].IsCorrectionEntryReason != "0") {
      $("#ddlCentryReason_" + index).css('border-color', '');
    }
  }

  ClickCorrectionEntryRemarks(index: any) {
    if (this.dynamicArray[index].CorrectionEntryRemarks != "" || this.dynamicArray[index].CorrectionEntryRemarks != "0") {
      $("#txtCorrectionEntryRemarks_" + index).css('border-color', '');
    }
  }

  ChangeCorrectionCode(index: any, id: any) {
    var CorrectionAcceptqty = this.CorrectionItemCodeList.filter(m => m.GrnListId === parseInt(id));
    this.dynamicArray[index].PoItemListId = CorrectionAcceptqty[0].GrnListId;
    if (this.dynamicArray[index].IsCorrectionCodeId != "" || this.dynamicArray[index].IsCorrectionCodeId != "0") {
      $("#ddlCorrectionCodeId_" + index).css('border-color', '');
    }
  }

  ConfirmSTNCorrectionPopup(index: any) {
    this.model.arrayId = index;
    if (this.CorrectionValidationGRN(index) == 1) {
      return false;
    }
    jQuery('#STNCorrectionconfirm').modal('show');
  }

  UpadateSTNCorrectionEntry() {
    jQuery('#STNCorrectionconfirm').modal('hide');
    try {
      var objCorrectionSTNModel = new STNModel();
      objCorrectionSTNModel.UserId = this.UserId;
      objCorrectionSTNModel.GrnCrnId = parseInt(this.GrnEditId);
      objCorrectionSTNModel.CompanyId = this.CompanyId;
      this.STNDetailItem = [];
      for (var i = 0, len = this.dynamicArray.length; i < len; i++) {
        if (this.dynamicArray[i] == this.dynamicArray[this.model.arrayId]) {
          var objDispatchTrackingItemDetialModel = new DispatchTrackingItemDetialModel();
          //objDispatchTrackingItemDetialModel.RowId = i;
          objDispatchTrackingItemDetialModel.Id = this.dynamicArray[i].IsCorrectionCodeId;
          objDispatchTrackingItemDetialModel.PoItemListId = this.dynamicArray[i].PoItemListId;
          objDispatchTrackingItemDetialModel.ItemCode_Id = this.dynamicArray[i].ItemId;
          objDispatchTrackingItemDetialModel.Rate = this.dynamicArray[i].Rate;
          objDispatchTrackingItemDetialModel.Discount = this.dynamicArray[i].Discount;
          objDispatchTrackingItemDetialModel.HSN_SAC = this.dynamicArray[i].HSN;
          objDispatchTrackingItemDetialModel.EqpType_Id = this.dynamicArray[i].EqTypeId;
          objDispatchTrackingItemDetialModel.ClientId = this.dynamicArray[i].ClientId;
          objDispatchTrackingItemDetialModel.UnitId = this.dynamicArray[i].UnitName;
          objDispatchTrackingItemDetialModel.SubDescription = this.dynamicArray[i].SubDescription;
          var MfDate = this._Commonservices.checkUndefined(this.dynamicArray[i].ManufDate);
          if (MfDate != '') {
            objDispatchTrackingItemDetialModel.ManufacturerDate = MfDate.day + '/' + MfDate.month + '/' + MfDate.year;
          } else {
            objDispatchTrackingItemDetialModel.ManufacturerDate = "";
          }
          var INVDate = this._Commonservices.checkUndefined(this.dynamicArray[i].InvoiceTaxDate);
          if (INVDate != '') {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = INVDate.day + '/' + INVDate.month + '/' + INVDate.year;
          } else {
            objDispatchTrackingItemDetialModel.InvoiceTaxDate = "";
          }
          objDispatchTrackingItemDetialModel.InvoiceTaxNo = this.dynamicArray[i].InvoiceTaxNo;
          objDispatchTrackingItemDetialModel.IGST = this.dynamicArray[i].IGST;
          objDispatchTrackingItemDetialModel.IGSTRate = this.dynamicArray[i].IGSTValue;
          objDispatchTrackingItemDetialModel.CGSTRate = this.dynamicArray[i].CGSTRate;
          objDispatchTrackingItemDetialModel.CGST = this.dynamicArray[i].CGST;
          objDispatchTrackingItemDetialModel.SGSTRate = this.dynamicArray[i].SGSTRate;
          objDispatchTrackingItemDetialModel.SGST = this.dynamicArray[i].SGST;
          objDispatchTrackingItemDetialModel.TCSRate = this.dynamicArray[i].TCSRate;
          objDispatchTrackingItemDetialModel.TCS = this.dynamicArray[i].TCS;
          objDispatchTrackingItemDetialModel.TotalInvoiceValue = this.dynamicArray[i].TotalInvoiceValue;
          objDispatchTrackingItemDetialModel.FreightCharge = this.dynamicArray[i].FreightCharge;
          objDispatchTrackingItemDetialModel.TotalAmountWithFreightCharge = this.dynamicArray[i].TotalAmountWithFreightCharge;
          objDispatchTrackingItemDetialModel.TaxWith = this.dynamicArray[i].TaxWith;
          objDispatchTrackingItemDetialModel.Qty = this.dynamicArray[i].Qty;
          objDispatchTrackingItemDetialModel.ReceivedQty = this.dynamicArray[i].ReceivedQty;
          objDispatchTrackingItemDetialModel.AcceptedQty = this.dynamicArray[i].AcceptedQty;
          objDispatchTrackingItemDetialModel.RejectedQty = this.dynamicArray[i].RejectedQty;
          objDispatchTrackingItemDetialModel.ExcessShort = this.dynamicArray[i].ExcessShort;

          objDispatchTrackingItemDetialModel.CorrectionEntryRemarks = this.dynamicArray[i].CorrectionEntryRemarks;
          if (this.dynamicArray[i].IsCorrectionEntryReason != "0") {
            objDispatchTrackingItemDetialModel.IsCorrectionEntryReason = this.dynamicArray[i].IsCorrectionEntryReason;
          } else {
            objDispatchTrackingItemDetialModel.IsCorrectionEntryReason = null;
          }
          objDispatchTrackingItemDetialModel.IsCorrectionCodeId = this.dynamicArray[i].IsCorrectionCodeId;
          this.srnlst = [];
          if (this.dynamicArray[i].GSerialNumbers.length > 0) {
            if (this.dynamicArray[i].ItemNameId == "4" && this.dynamicArray[i].UnitName == "8") {
              // Check by Hemant Tyagi
              for (var j = 0; j < this.dynamicArray[i].GSerialNumbers.length; j++) {
                for (var k = 0; k < this.dynamicArray[i].GSerialNumbers[j].CellNos.length; k++) {
                  var srnData = new GSerialNumber();
                  srnData.InitialSrno = this.dynamicArray[i].GSerialNumbers[j].CellNos[k].CellValue;
                  srnData.Sequance = j.toString();
                  this.srnlst.push(srnData)
                }
              }
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.srnlst;
            } else {
              objDispatchTrackingItemDetialModel.GSerialNumbers = this.dynamicArray[i].GSerialNumbers;
            }
          }
          this.STNDetailItem.push(objDispatchTrackingItemDetialModel)
        }
      }
      objCorrectionSTNModel.DispatchTrackerItemList = this.STNDetailItem;
      var formdata = new FormData();
      formdata.append('jsonDetail', JSON.stringify(objCorrectionSTNModel));
      this._GrncrnService.UpdateCorrectionEntrySTNDetail(formdata).subscribe(data => {
        //this.Loader.hide();
        if (data.Status == 1) {
          jQuery("#confirm").modal('hide');
          alert(data.Remarks);
        } else if (data.Status == 2) {
          jQuery("#confirm").modal('hide');
          alert('your accpeted qty > remaining qty and your remaining qty :- ' + data.Remarks);
        }
      });
    } catch (Error) {
      console.log(Error.message)
    }

  }

  CorrectionValidationGRN(index) {
    var flag = 0;
    if (this.dynamicArray[index].ItemNameId == "" || this.dynamicArray[index].ItemNameId == "null" || this.dynamicArray[index].ItemNameId == "0") {
      $('#txtItemNameId_' + index).css('border-color', 'red');
      $('#txtItemNameId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemNameId_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].ItemMakeId == "" || this.dynamicArray[index].ItemMakeId == "null" || this.dynamicArray[index].ItemMakeId == "0") {
      $('#ddlItemMake_' + index).css('border-color', 'red');
      $('#ddlItemMake_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemMake_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].ItemId == "" || this.dynamicArray[index].ItemId == "null" || this.dynamicArray[index].ItemId == "0") {
      $('#ddlItemId_' + index).css('border-color', 'red');
      $('#ddlItemId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlItemId_" + index).css('border-color', '');
    }
    // if (this.dynamicArray[icount].EqTypeId == "" || this.dynamicArray[icount].EqTypeId == "null" || this.dynamicArray[icount].EqTypeId == "0") {
    //   $('#ddlEqTypeId_' + icount).css('border-color', 'red');
    //   $('#ddlEqTypeId_' + icount).focus();
    //   flag = 1;
    // } else {
    //   $("#ddlEqTypeId_" + icount).css('border-color', '');
    // }


    // if (this.dynamicArray[index].UnitName == "" || this.dynamicArray[index].UnitName == "0") {
    //   $('#ddlUnitName_' + index).css('border-color', 'red');
    //   $('#ddlUnitName_' + index).focus();
    //   flag = 1;
    // } else {
    //   $("#ddlUnitName_" + index).css('border-color', '');
    // }
    if (this.dynamicArray[index].Rate == "" || this.dynamicArray[index].Rate == "0") {
      $('#txtRate_' + index).css('border-color', 'red');
      $('#txtRate_' + index).focus();
      flag = 1;
    } else {
      $("#txtRate_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].AcceptedQty == "" || this.dynamicArray[index].AcceptedQty == "0") {
      $('#ddlAcceptedQty_' + index).css('border-color', 'red');
      $('#ddlAcceptedQty_' + index).focus();
      flag = 1;
    } else {
      $("#ddlAcceptedQty_" + index).css('border-color', '');
    }
    if (this.dynamicArray[index].IsCorrectionCodeId == "" || this.dynamicArray[index].IsCorrectionCodeId == "0") {
      $('#ddlCorrectionCodeId_' + index).css('border-color', 'red');
      $('#ddlCorrectionCodeId_' + index).focus();
      flag = 1;
    } else {
      $("#ddlCorrectionCodeId_" + index).css('border-color', '');
    }
    if (this.dynamicArray[index].IsCorrectionEntryReason == "" || this.dynamicArray[index].IsCorrectionEntryReason == "0") {
      $('#ddlCentryReason_' + index).css('border-color', 'red');
      $('#ddlCentryReason_' + index).focus();
      flag = 1;
    } else {
      $("#ddlCentryReason_" + index).css('border-color', '');
    }

    if (this.dynamicArray[index].IsCorrectionEntryReason == ReasonActivity.CorrectionReason) {
      if (this._Commonservices.checkUndefined(this.dynamicArray[index].CorrectionEntryRemarks) == "") {
        $('#txtCorrectionEntryRemarks_' + index).css('border-color', 'red');
        $('#txtCorrectionEntryRemarks_' + index).focus();
        flag = 1;
      } else {
        $("#txtCorrectionEntryRemarks_" + index).css('border-color', '');
      }

    }
    return flag;
  }

  //#endregion


  onGatePdfFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.GatePdfUploadFile = event.target.files[0];
    }
  }

  onLRPdfFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.LRPdfUploadFile = event.target.files[0];
    }
  }

  conformCancelPopup() {
    this.IsError = false;
    if (this.CancelValidation() == 1) {
      return false;
    }
    jQuery('#Cancleconfirm').modal('show');
  }

  UpadateCancelSTN() {
    try {
      if (this.CancelValidation() == 1) {
        return false;
      }
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = parseInt(this.GrnEditId);
      objApprovelStatusModel.Table_Id = this.model.InCaseReason;
      objApprovelStatusModel.Flag = "GRN";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          this.IsDownloadPrintHideShow = false;
          jQuery('#Cancleconfirm').modal('hide');
          setTimeout(() => {
            alert('Your STN SuccessFully Cancel')
          }, 300);
        }

      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "UpadateCancelDispatch", "GRN");
    }
  }

  BackPreviewPage() {
    this.isPdfPreview = false;
    this.isShownPOEdit = true;
    this.model.DocumentNoData = this.model.Document;
  }

  SearchPdfPreview() {
    this.isPdfPreview = true;
    this.isShownPOEdit = false;
    this.model.PreviewGRDate = this._Commonservices.ConvertDateFormat(this.model.GRDate);
    this.model.PreviewGRNDate = this._Commonservices.ConvertDateFormat(this.model.GRNDate);
    this.model.PreviewGateDate = this._Commonservices.ConvertDateFormat(this.model.GateEntryDate);
    this.model.PreviewDocumentDate = this._Commonservices.ConvertDateFormat(this.model.DocumentDate);
    this.model.PreviewLRDate = this._Commonservices.ConvertDateFormat(this.model.LRdate);
    if (this.model.ddlDespatchby == 1) {
      this.model.PreviewDespatchby = "By Transport";
    } else {
      this.model.PreviewDespatchby = "By Hand";
    }
  }

  //#region  Create GRN PDf
  DowanloadStnFile() {
    try {
      if (this.GrnEditId == null || this.GrnEditId == '') {
        return false;
      }
      this.GRNPdfData = null;
      this.STNPdfItemData = null;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.GrnEditId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = "STN";
      this._GrncrnService.GetCreatePdfGRNDetailItemByGRNId(objdropdownmodel).subscribe((data) => {
        if (data.Status == 1) {
          this.GRNPdfData = data.Data[0];
          this.model.GRNDocumentFile = data.Data[0].GRNDocumentFile;
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "DowanloadStnFile";
      objWebErrorLogModel.ErrorPage = "STN";
      // this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  CreateGRNPdfData(FlagValue: any) {
    try {
      this.GRNPdfData = null;
      this.STNPdfItemData = null;
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.GrnEditId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = "STN";
      this._GrncrnService.GetCreatePdfGRNDetailItemByGRNId(objdropdownmodel).subscribe((data) => {
        localStorage.removeItem("Id");
        this.IsDownloadPrintHideShow = true;
        if (data.Status == 1) {
          this.GRNPdfData = data.Data[0];
          this.model.TotalSumAmount = data.Data[0].TotalSumAmount;
          this.model.GRNDocumentFile = data.Data[0].GRNDocumentFile;
          if (data.Data[0].IsDespatch == 1) {
            this.model.labelTransSender = "Transpoter";
          } else if (data.Data[0].IsDespatch == 2) {
            this.model.labelTransSender = "Sender Name";
          } else {
            this.model.labelTransSender = "Courier Company Name";
          }
          if (data.Data[0].LRDate != '') {
            this.model.labelBiltyNo = "Bilty No";
            this.model.labelBiltyDate = "Bilty Date";
          } else {
            this.model.labelBiltyNo = " ";
            this.model.labelBiltyDate = " ";
          }
          this.STNPdfItemData = data.GridItemData;
          this.dynamicArrayForPdf = [];
          for (var i = 0, len = this.STNPdfItemData.length; i < len; i++) {
            var objdynamicPdf = new GRNDynamicItemGrid();
            objdynamicPdf.RowId = this.STNPdfItemData[i].RowId;
            objdynamicPdf.ItemDescription = this.STNPdfItemData[i].ItemDescription;
            objdynamicPdf.ItemCode = this.STNPdfItemData[i].ItemCode;
            objdynamicPdf.SubDescription = this.STNPdfItemData[i].SubDescription;
            objdynamicPdf.UnitName = this.STNPdfItemData[i].UnitName;
            objdynamicPdf.EqpType = this.STNPdfItemData[i].EqpType;
            objdynamicPdf.Rate = parseFloat(this.STNPdfItemData[i].ItemRate).toFixed(2);
            objdynamicPdf.ChallanQty = this.STNPdfItemData[i].ChallanQty;
            objdynamicPdf.AcceptedQty = this.STNPdfItemData[i].AcceptedQty;
            objdynamicPdf.ReceivedQty = this.STNPdfItemData[i].ReceivedQty;
            objdynamicPdf.RejectedQty = this.STNPdfItemData[i].RejectedQty;
            objdynamicPdf.ExcessShort = this.STNPdfItemData[i].ExcessShort;
            objdynamicPdf.TotalAmount = parseFloat(this.STNPdfItemData[i].TotalAmount).toFixed(2);
            objdynamicPdf.IGST = this.STNPdfItemData[i].IGST;
            objdynamicPdf.IGSTRate = this.STNPdfItemData[i].IGSTRate;
            objdynamicPdf.CGST = this.STNPdfItemData[i].CGST;
            objdynamicPdf.CGSTRate = this.STNPdfItemData[i].CGSTRate;
            objdynamicPdf.TCS = this.STNPdfItemData[i].TCS;
            objdynamicPdf.TCSRate = this.STNPdfItemData[i].TCSRate;
            objdynamicPdf.FreightCharge = this.STNPdfItemData[i].FreightCharge;
            objdynamicPdf.TotalInvoiceValue = parseFloat(this.STNPdfItemData[i].TotalInvoiceValue).toFixed(2);
            objdynamicPdf.TotalAmountWithFreightCharge = parseFloat(this.STNPdfItemData[i].TotalAmountWithFreightCharge).toFixed(2);
            this.dynamicArrayForPdf.push(objdynamicPdf);
            //objdynamic.TotalAmount=parseFloat(ItemEditDataArr[i].TotalAmount).toFixed(2);
          }
          if (FlagValue == 1) {
            this.generatePDF('download');
          } else {
            this.generatePDF('open');
          }
        }
      });

    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "CreateSTNNPdfData";
      objWebErrorLogModel.ErrorPage = "STN";
      // this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  generatePDF(action: any) {
    let docDefinition = {
      pageOrientation: 'landscape',
      //pageMargins: [ 40, 60, 40, 60 ],
      content: [
        {
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
          table: {
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
                              width: 144,
                              text: [
                              ]
                            },
                            {
                              margin: [160, 0, 0, 0],
                              width: 500,
                              text: [
                                { text: `${this.GRNPdfData.CompanyName}`, fontSize: 13, bold: true, },
                              ]
                            },
                            {
                              width: 144,
                              text: [
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              image: `snow`, width: 80,
                            },

                            {
                              margin: [220, 0, 0, 0],
                              width: 400,
                              text: [
                                { text: 'Address: ', fontSize: 10, },
                                { text: `${this.GRNPdfData.CompanyAddress}`, fontSize: 10 },
                                '\n',
                                { text: `GOODS RECEIPT NOTE`, fontSize: 12, bold: true, alignment: 'center', },

                              ]
                            },

                            {
                              // alignment: 'right',
                              margin: [84, 0, 0, 0],
                              text: [
                                { text: `GRN No     ${this.GRNPdfData.GRNNo}`, fontSize: 10, width: 180 },
                                '\n',
                                { text: `Date               ${this.GRNPdfData.GRNDate}`, fontSize: 10, width: 180, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 290,
                              text: [
                                { text: `From WH Name              ${this.GRNPdfData.FromWHName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Inv./Challan No.       ${this.GRNPdfData.InvChallanNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: ` Inv/Challan Date             ${this.GRNPdfData.InvChallanDate}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 290,
                              text: [
                                { text: `Address`, fontSize: 10 },
                                { text: `         ${this.GRNPdfData.SupplierAddress}`, fontSize: 10, bold: true },
                                // {text:`Supplier Name         ${this.GRNPdfData.SupplierName}`, fontSize:10},
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Gate Entry No           ${this.GRNPdfData.GateEntryNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                                { text: `Gate Entry Date               ${this.GRNPdfData.GateEntryDate}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 290,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.GRNPdfData.SupplierAddress}`, fontSize:10},
                                { text: ``, fontSize: 10, bold: true, },
                                { text: `                     `, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                                { text: `Dispatch From          ${this.GRNPdfData.Project}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 190,
                              text: [
                                { text: `Document No    ${this.GRNPdfData.DocumentNo}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },
              ],
            ]
          }
        },
        {
          style: 'ItemTableHeader',
          table: {
            headerRows: 1,
            widths: ['2%', '4%', '15.6%', '3%', '4%', '5%', '5%', '5%', '4%', '4%', '5%', '5%', '5%', '3%', '5%', '3%', '5%', '3%', '5%', '3%', '5%', '5%',],
            body: [
              ['SL No', 'Item Code', 'Material Description ', 'UOM', ' Challan Qty', 'Received Qty',
                'Accepted Qty', 'Rejected Qty', 'Excess/Short', 'Rate', 'Basic Value', 'Frieght Charge', 'Total Amount',
                'SGST (%)', 'SGST Value', 'CGST (%)', 'CGST Value', 'IGST (%)', 'IGST Value', 'TCS (%)', 'TCS Value', 'Gross value'],
              // ...this.dynamicArray.map(p => ([p.RowId, p.ItemDescription+'\n\n' +p.SubDescription,p.ItemCode,p.POQty, p.Rate, p.UnitName,p.TotalAmount])),
              ...this.dynamicArrayForPdf.map(p => ([{ text: p.RowId }, p.ItemCode, { text: p.ItemDescription }, p.UnitName, { text: p.ChallanQty }, { text: p.ReceivedQty }, { text: p.AcceptedQty }, { text: p.RejectedQty },
              { text: p.ExcessShort }, { text: p.Rate }, { text: p.TotalAmount }, { text: p.FreightCharge }, { text: p.TotalAmountWithFreightCharge },
              { text: p.SGSTRate }, { text: p.SGST }, { text: p.CGSTRate }, { text: p.CGST }, { text: p.IGSTRate }, { text: p.IGST },
              { text: p.TCSRate }, { text: p.TCS }, { text: p.TotalInvoiceValue },])),

              [{}, { text: 'Total Amount', colSpan: 2, alignment: 'right', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' },
              { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: this._Commonservices.thousands_separators(`${this.model.TotalSumAmount}`) + '₹', bold: true, alignment: 'center' }]
            ]
          }
        },


        {
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
          table: {
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
                              margin: [0, 0, 0, 0],
                              width: 338,
                              text: [
                                { text: `Quality Inspection Report:`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 270,
                              text: [
                              ]
                            },
                            {
                              margin: [10, 0, 0, 0],
                              width: 180,
                              text: [
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              margin: [0, 0, 0, 0],
                              width: 300,
                              text: [
                                { text: `${this.model.labelBiltyNo}                    ${this.GRNPdfData.LRNo}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `${this.model.labelBiltyDate}           ${this.GRNPdfData.LRDate}`, fontSize: 10 },
                              ]
                            },
                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                { text: `Remarks:           ${this.GRNPdfData.Remarks}`, fontSize: 10 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 300,
                              margin: [0, 0, 0, 0],
                              text: [
                                //  { text:`Address                     ${this.GRNPdfData.SupplierAddress}`, fontSize:10},

                                { text: `${this.model.labelTransSender}            ${this.GRNPdfData.TranspoterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `P.R Dept          ${this.GRNPdfData.PRDept}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.GRNPdfData.PoDate}`, fontSize:10},
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 300,
                              margin: [0, 0, 0, 0],
                              text: [
                                { text: `Vehicle No           ${this.GRNPdfData.VehicleNo}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                                { text: `Material received by     ${this.GRNPdfData.IndenterName}`, fontSize: 10 },
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                // {text:`PO Date                             ${this.GRNPdfData.PoDate}`, fontSize:10},
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 1, 0, 0],
                          columns: [
                            {
                              width: 260,
                              margin: [0, 0, 0, 0],
                              text: [
                              ]
                            },

                            {
                              margin: [40, 0, 0, 0],
                              width: 250,
                              text: [
                              ]
                            },

                            {
                              margin: [10, 0, 0, 0],
                              width: 200,
                              text: [
                                { text: `Authorised by `, fontSize: 10, bold: true, alignment: 'right', },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },
              ],
            ]
          }
        },
      ],

      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [190, -40, 0, 0]
        },

        ItemTableHeader: {
          fontSize: 7,
          alignment: 'center',
          margin: [-25, 0, 0, 0],
          border: [0, 0, 0, 0],
        },
      },
      images: {
        snow: `${this.GRNPdfData.Logo}`,
        //snow: 'http://localhost:4200/assets/logo.jpg',
        //snow: 'http://scm.astnoc.com/assets/logo.jpg'
      },


    }
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      //pdfMake.createPdf(docDefinition).open();
      pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
        PDFdata = dataURL;
      });
      setTimeout(() => {
        this.SaveUpdateGRNPDF();
      }, 1200);
    }
  }

  SaveUpdateGRNPDF() {
    try {
      var objSaveGRNCRNModelDetail = new SaveGRNCRNModelDetail();
      objSaveGRNCRNModelDetail.GrnCrnId = parseInt(this.GrnEditId);
      objSaveGRNCRNModelDetail.GRNDocumentFile = PDFdata;
      // objSaveGRNCRNModelDetail.Flag = "GRN";
      this._GrncrnService.SaveGRNDocumentPDF(objSaveGRNCRNModelDetail).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          alert('Document has been generated');
        } else if (data.Status == 2) {
          alert('Document does not generated');
        }
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "SaveGRNPdf", "GrnDetail");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "SaveGRNPdf", "GrnDetail");
    }
  }

  DownloadSTNPdf() {
    if (this.model.GRNDocumentFile != null && this.model.GRNDocumentFile != "") {
      window.open(this.model.GRNDocumentFile);
    } else {
      alert('please first Genrate GRN Document');
    }
  }
  //#endregion

  IGSTKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.IGSTValue').val();
      if (valueItem != '0') {
        $(this).find('.IGSTValue').css('border-color', '');
      }
      var valueIGST = $(this).find('.IGST').val();
      if (valueIGST != '0') {
        $(this).find('.IGST').css('border-color', '');
      }
    });
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
  ChangeClient(ItemId: any, index: any) {
    if (ItemId == 60) {
      this.dynamicArray[index].CustomerCode = "Ascend";
    } else {
      this.dynamicArray[index].CustomerCode = "General";
    }
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Client').val();
      if (valueItem != '0') {
        $(this).find('.Client').css('border-color', '');
      }
    });
  }
  SerialNoKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.SerialNo').val();
      if (valueItem != '0') {
        $(this).find('.SerialNo').css('border-color', '');
      }
    });
  }
  QtyKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Qty').val();
      if (valueItem != '0') {
        $(this).find('.Qty').css('border-color', '');
      }
    });
  }
  RateKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Rate').val();
      if (valueItem != '0') {
        $(this).find('.Rate').css('border-color', '');
      }
    });
  }
  HSNKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.HSN').val();
      if (valueItem != '0') {
        $(this).find('.HSN').css('border-color', '');
      }
    });
  }
  OnblurConversionValue() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueReceivedQty = $(this).find('.ConversionValue').val();
      if (valueReceivedQty != '') {
        $(this).find('.ConversionValue').css('border-color', '');
      }
    });
  }

  ChangeEqupmnet(ItemId: any, index: any) {
    var FilterData = this.EquipmentTypeList.filter(
      m => m.id === parseInt(ItemId));
    this.dynamicArray[index].EqpType = FilterData[0].itemName;
    try {
      $('#tblOne > tbody  > tr').each(function () {
        var valueItem = $(this).find('.EqType').val();
        if (valueItem != '0') {
          $(this).find('.EqType').css('border-color', '');
        }
      });

    } catch (Error) {
      console.log(Error.message)
    }
  }
  DiscountKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Discount').val();
      if (valueItem != '') {
        $(this).find('.Discount').css('border-color', '');
      }
    });
  }


  addRow() {
    var objNewItemGrid = new DynamicItemGrid();
    objNewItemGrid.Id = 0;
    objNewItemGrid.ItemNameId = "0";
    objNewItemGrid.ItemMakeId = "0";
    objNewItemGrid.ItemId = "0";
    objNewItemGrid.SiteName = "";
    objNewItemGrid.CustomerSiteId = "";
    objNewItemGrid.ReasonCode = "";
    objNewItemGrid.CustomerCode = "";
    objNewItemGrid.CustomerId = 0;
    objNewItemGrid.HSN = "";
    objNewItemGrid.Qty = "";
    objNewItemGrid.Rate = "";
    objNewItemGrid.Discount = 0;
    objNewItemGrid.PoItemListId = 0;
    objNewItemGrid.ValueQty = "";
    objNewItemGrid.TotalAmount = "";
    objNewItemGrid.SerialNo = "";
    objNewItemGrid.ManufDate = "";
    objNewItemGrid.GetTotalAmount = "";
    objNewItemGrid.TotalInvoiceValue = 0.00;
    objNewItemGrid.EqTypeId = "0";
    objNewItemGrid.InvoiceTaxNo = "";
    objNewItemGrid.InvoiceTaxDate = "";
    objNewItemGrid.IGST = "0";
    objNewItemGrid.IGSTValue = "0";
    objNewItemGrid.ConversionUnit = "";
    objNewItemGrid.ConversionValue = "";
    objNewItemGrid.ClientId = "99999";
    objNewItemGrid.CustomerCode = "General";
    if (objNewItemGrid.ClientId = "99999") {
      objNewItemGrid.CustomerCode = "General";
    }
    objNewItemGrid.IsCorrectionEntryReason = "0";
    objNewItemGrid.IsCorrectionCodeId = "0";
    if (this.GrnEditId != null && this.RoleCorrectionEntry == true) {
      objNewItemGrid.IsCorrection = true;
      this.Correctioncolumnhideandshow = true;
      objNewItemGrid.IsCorrectionDisabled;
    } else {
      objNewItemGrid.IsCorrection = false;
      this.ItemAddrowhideshow = false;
      this.Correctioncolumnhideandshow = false;
    }
    objNewItemGrid.UnitName = "0";
    objNewItemGrid.ExcessShort = "0";
    objNewItemGrid.RejectedQty = "0";
    this.dynamicArray.push(objNewItemGrid);
    return true;
  }

  Customer(id: any) {


  }
  deleteRow(index) {
    if (this.dynamicArray.length == 1) {
      return false;
    } else {
      this.dynamicArray.splice(index, 1);
      return true;
    }
  }
  keyPressGateEntry() {
    $("#txtGateEntryNo").css('border-color', '');
  }
  onKeypressGateEntryDate(event: any) {
    $("#txtGateEntryDate").css('border-color', '');
  }
  keyPressTransporter() {
    $("#txtTransporter").css('border-color', '');
  }
  keyPressVehicleNo() {
    $("#txtVehicleNo").css('border-color', '');
  }
  keyPressIndentorName() {
    $("#txtIndentorName").css('border-color', '');
  }

  onKeypressLRdate(event: any) {
    $("#txtLRdate").css('border-color', '');
  }
  ChangefromWH() {
    $("#txtShippedfromWHId").css('border-color', '');
  }
  TransporteGSTNoKeyPress() {
    $("#txtTransporterGSTNo").css('border-color', '');
  }
  ChangeToState() {
    try {
      $('#txtTOWHStateId').attr('style', 'border-color: ');
      var StateId = this._Commonservices.checkUndefined(this.model.ToStateId);
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.CompanyId;
      if (StateId != '') {
        objdropdownmodel.Other_Id = StateId;
      } else {
        objdropdownmodel.Other_Id = "0";
      }
      objdropdownmodel.Flag = 'OtherWHMaster';
      this.model.ShippedToWHId = '0'
      this.model.ShippedToOtherWHId = '0'
      this.model.WHAddress = '';
      this.model.WHStateCode = '';
      this.model.WHGSTIN = '';
      this.ShippedTOWHList = [];
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(wh => {
        if (wh.Data != null && wh.Data != "") {
          this.ShippedTOWHList = wh.Data;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "BindEditWHList", "STNDetail");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "BindEditWHList", "WHTOSite");
    }
  }
  keypressLR() {
    $('#txtLRNo').attr('style', 'border-color: ');
  }
  ChangeToOtherWH() {
    $('#txtShippedToOtherWHId').attr('style', 'border-color: ');
  }

  ValidationSTN() {
    var flag = 0;
    if (this.model.ShippedfromWHId == "0" || this.model.ShippedfromWHId == null) {
      $('#txtShippedfromWHId').css('border-color', 'red');
      $('#txtShippedfromWHId').focus();
      flag = 1;
    } else {
      $("#txtShippedfromWHId").css('border-color', '');
    }
    if (this.model.ToStateId == "0" || this.model.ToStateId == undefined) {
      $('#txtTOWHStateId').attr('style', 'border-color: red');
      $('#txtTOWHStateId').focus();
      flag = 1;
    } else {
      $('#txtTOWHStateId').attr('style', 'border-color: ');
    }
    if (this.model.ShippedToOtherWHId == "0" || this.model.ShippedToOtherWHId == undefined) {
      $('#txtShippedToOtherWHId').attr('style', 'border-color: red');
      $('#txtShippedToOtherWHId').focus();
      flag = 1;
    } else {
      $('#txtShippedToOtherWHId').attr('style', 'border-color: ');
    }


    if ($('#txtGateEntryNo').val() == "" || $('#txtGateEntryNo').val() == undefined) {
      $('#txtGateEntryNo').css('border-color', 'red');
      $('#txtGateEntryNo').focus();
      flag = 1;
    } else {
      $("#txtGateEntryNo").css('border-color', '');
    }
    if (this.model.GateEntryDate == "" || this.model.GateEntryDate == null) {
      $('#txtGateEntryDate').css('border-color', 'red');
      $('#txtGateEntryDate').focus();
      flag = 1;
    } else {
      $("#txtGateEntryDate").css('border-color', '');
    }
    if (this.model.ddlDespatchby == "1") {
      if ($('#txtTransporter').val() == "" || $('#txtTransporter').val() == undefined) {
        $('#txtTransporter').css('border-color', 'red');
        $('#txtTransporter').focus();
        flag = 1;
      } else {
        $("#txtTransporter").css('border-color', '');
      }
      if (this.model.TransporterGSTNo == "" || this.model.TransporterGSTNo == null) {
        $('#txtTransporterGSTNo').css('border-color', 'red');
        $('#txtTransporterGSTNo').focus();
        flag = 1;
      } else {
        $("#txtTransporterGSTNo").css('border-color', '');
      }
      if ($('#txtVehicleNo').val() == "" || $('#txtTransporter').val() == undefined) {
        $('#txtVehicleNo').css('border-color', 'red');
        $('#txtVehicleNo').focus();
        flag = 1;
      } else {
        $("#txtVehicleNo").css('border-color', '');
      }

      if ($('#txtLRNo').val() == "" || $('#txtLRNo').val() == undefined) {
        $('#txtLRNo').css('border-color', 'red');
        $('#txtLRNo').focus();
        flag = 1;
      } else {
        $("#txtLRNo").css('border-color', '');
      }
      if (this.model.LRdate == "" || this.model.LRdate == null) {
        $('#txtLRdate').css('border-color', 'red');
        $('#txtLRdate').focus();
        flag = 1;
      } else {
        $("#txtLRdate").css('border-color', '');
      }
      if (this.IsLRFile == false) {
        var LRFile = this._Commonservices.checkUndefined(this.LRPdfUploadFile);
        if (LRFile == "" || LRFile == null) {
          flag = 1;
          alert('Please Select Bilty File');
        }
      }
    }
    if ($('#txtIndentorName').val() == "" || $('#txtIndentorName').val() == undefined) {
      $('#txtIndentorName').css('border-color', 'red');
      $('#txtIndentorName').focus();
      flag = 1;
    } else {
      $("#txtIndentorName").css('border-color', '');
    }

    if (this.model.STNId == 0) {
      var GateFile = this._Commonservices.checkUndefined(this.GatePdfUploadFile);
      if (GateFile == "" || GateFile == null) {
        flag = 1;
        alert('Please Select Gate Entery File');
      }

    }
    //item Validation


    return flag;
  }

  //vishal, 05/12/2022
  GettAllVechTransModeTransfertypeDispatch() {
    try {
      this._MaterialMovementService.GetVechileTypeAndTransPortMode().pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != "") {
            this.VechileTypeDataList = data.Data;
          }
          if (data.TModeData != null && data.TModeData != "") {
            this.TransModeDataList = data.TModeData;
          }
          if (data.TransferData != null && data.TransferData != "") {

            this.TransferDataList = data.TransferData;
            this.DispatcDataList = data.TransferData;
          }
          if (data.DispatchFrom != null && data.DispatchFrom != "") {
            this.DispatchFromList = data.DispatchFrom;
            this.DispatchFromSearchList = data.DispatchFrom;
          }

        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "GettAllVechTransModeTransfertypeDispatch", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "GettAllVechTransModeTransfertypeDispatch", "WHTOSite");
    }
  }
}
