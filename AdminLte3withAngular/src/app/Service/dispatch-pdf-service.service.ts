import { Injectable, TemplateRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { EmailModel, mailFor, MailSenderModel, PageActivity, TransPortModeType } from '../_Model/commonModel';
import { DispatchTrackingModel, SearchDispatchTrackerModel } from '../_Model/DispatchModel';
import { DynamicItemGrid, DynamicWHAddress } from '../_Model/purchaseOrderModel';
import { CommonService } from './common.service';
import { MaterialMovementService } from './material-movement.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { style } from '@angular/animations';
import { SendmailService } from './sendmail.service';
import { Modal } from 'bootstrap'
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
var PDFdata = null;
declare var jQuery: any;
@Injectable({
  providedIn: 'root'
})

export class DispatchPdfServiceService {
  dynamicArrayDispatchPdf: Array<DynamicItemGrid> = [];
  TableHeight: any;
  model: any = {};
  PdfStateCodeWhAd: any;
  objDynamicWHAddress: Array<DynamicWHAddress> = [];
  EditWHList: any;
  totalSumQuantity: number;
  @ViewChild("content") modalContent: TemplateRef<any>;
  // EmailData: any = [];
  PdfPath: string = "";

  constructor(private _MaterialMovementService: MaterialMovementService, private _Commonservices: CommonService,
    private _objSendMailService: SendmailService, private modalService: NgbModal,) { }

  DispatchPdfbyDispatchId(Value: any, DispatchId: any): string {
    try {
      this.model.DispatchId = DispatchId;
      this.model.FunctionFlagValue = null;
      this.model.FunctionFlagValue = Value;
      var objModel = new SearchDispatchTrackerModel();
      objModel.DispatchTracker_Id = DispatchId;
      this._MaterialMovementService.GenerateDispatchTrackerPdfListById(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.RegData != null && data.RegData != '') {
            this.model.PdfStateCode = data.RegData[0].StateCode;
            this.model.PdfCompanyName = data.RegData[0].CompanyName;
            this.model.PdfRegdOffice = data.RegData[0].OfficeAddress;
            this.model.PdfGSTINNo = data.RegData[0].GSTIN_UIN;
            this.model.PdfCIN = data.RegData[0].CIN;
            this.model.PdfWHState = data.RegData[0].StateName;
            this.PdfStateCodeWhAd = JSON.parse(data.RegData[0].RegWHAddressList);
            if (this.PdfStateCodeWhAd.length > 0) {
              this.objDynamicWHAddress = [];
              var Count = 0;
              for (var i = 0, len = this.PdfStateCodeWhAd.length; i < len; i++) {
                var objWHAddress = new DynamicWHAddress();
                objWHAddress.WHAddress = this.PdfStateCodeWhAd[i].WHAddress;
                objWHAddress.Address = 'W/h Address :';
                this.objDynamicWHAddress.push(objWHAddress);
              }
            }
          }
          if (data.Data != null && data.Data != '') {
            this.model.DisatchTrackeringId = data.Data[0].DisatchTrackeringId;
            this.model.IsApproved = data.Data[0].IsApproved;
            // this.model.ddlStateId=data.Data[0].State_Id;
            this.model.ddlCompanyId = data.Data[0].Company_Id;
            this.model.TransferTypeId = data.Data[0].IstransferTypeId;
            var Bill = data.Data[0].EwayBillNo
            if (Bill != null && Bill != "") {
              this.model.PdfEwayBillNo = data.Data[0].EwayBillNo;
              this.model.EwayBillNoName = "Eway Bill No ";
              this.model.EwayBilltextBorder = [0, 1, 0, 0];
              this.model.EwayBillValueBorder = [1, 1, 0, 0];
            } else {
              this.model.PdfEwayBillNo = "";
              this.model.EwayBillNoName = "";
              this.model.EwayBilltextBorder = [0, 0, 0, 0];
              this.model.EwayBillValueBorder = [0, 0, 0, 0];
            }
            this.model.LableTransPotionName = data.Data[0].LableTransPotionName;
            this.model.LableTransPhone = data.Data[0].LableTransPhone;
            this.model.PdfDocumentDate = data.Data[0].DocumentDate;
            this.model.GrossTotalAmount = data.Data[0].GrossTotalAmount;
            this.model.PdfAmountChargeable = data.Data[0].AmountChargeable;
            this.model.PdfTrasporationMode = data.Data[0].TrasporationMode;
            this.model.PdfTransporterName = data.Data[0].TrasporationName;
            this.model.PdfTransporterGSTNo = data.Data[0].TrasporationGSTNO;
            this.model.PdfDestination = data.Data[0].Destination;
            this.model.PdfPlaceOfDispatch = data.Data[0].PlaceOfDispatch;
            this.model.PdfVehicleType = data.Data[0].VehicleTypeName;

            if (data.Data[0].TrasporationModeTypeId == TransPortModeType.ByRoad) {
              this.model.LablebiltyNo = "Bilty No & Date:"
              this.model.PdfGRNo = data.Data[0].GRNo;
              this.model.PdfGRDate = data.Data[0].GRDate;
              this.model.VerticalData = '   | ';
              this.model.LableBorderbiltyNo = [0, 0, 0, 1];
              this.model.LableBorderbiltyDate = [1, 0, 0, 1];
            } else {
              this.model.PdfGRNo = "";
              this.model.PdfGRDate = "";
              this.model.LablebiltyNo = "";
              this.model.VerticalData = "";
              this.model.LableBorderbiltyNo = [0, 0, 0, 0];
              this.model.LableBorderbiltyDate = [0, 0, 0, 0];
            }

            this.model.PdfVehicleNumber = data.Data[0].VehicleNumber;
            this.model.PdfTaxInvoiceNo = data.Data[0].TaxInvoiceNO;
            this.model.PdfNote = data.Data[0].Note;
            this.model.PdfReceivedBy = data.Data[0].ReceivedBy;
            this.model.PdfReceivedNo = data.Data[0].ReceivedNo;
            //this.model.MultiSiteListPdfName=JSON.parse(data.Data[0].MultiSiteList);
            this.model.PdfTotalSumQty = parseFloat(data.Data[0].Quantity).toFixed(2);
            if (data.WHData != null && data.WHData != "" && data.WHData.length > 0) {
              this.EditWHList = data.WHData;
              var FromWHAddress = this.EditWHList.filter(m => m.Id === parseInt(data.Data[0].ShippedfromWHId));
              this.model.PdfShippedWHAddress = FromWHAddress[0].WHAddress;
            }
            if (data.Data[0].IstransferTypeId != null || data.Data[0].IstransferTypeId != "") {
              if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState && this.model.ddlCompanyId == 4) {
                if (data.Data[0].CompanyName == "" || data.Data[0].CompanyName == null) {
                  this.model.PdfToCompanyName = data.RegData[0].CompanyName;
                } else {
                  this.model.PdfToCompanyName = data.Data[0].CompanyName;
                }
                this.model.PdfDocumentNo = data.Data[0].DocumentNo;
                this.model.ChallanName = "Challan No ";
                if (this.model.IsApproved == 1) {
                  this.model.PdfHeaderName = "DELIVERY CHALLAN";
                } else {
                  this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                }

                this.model.WithInState = "WithInState";
                this.model.PdfToSiteAndWhStateCode = data.RegData[0].StateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.RegData[0].GSTIN_UIN;
                this.model.PdfToSiteAndWhAddress = data.Data[0].SiteAddress;
                this.model.PdfToSiteWHState = data.RegData[0].StateName;
                this.model.PdfToSiteId = data.Data[0].CustomerSiteId;
                this.model.PdfToSiteName = data.Data[0].SiteName;
                this.model.PdfToSiteDistrict = data.Data[0].SiteDistrict;
                this.model.ToSiteTech = "Tech";
                this.model.ToSiteCI = "CI";
                this.model.ToSiteZOM = "ZOM";
                this.model.ToSiteTechName = data.Data[0].SiteTechName;
                this.model.ToSiteCIName = data.Data[0].SiteCIName;
                this.model.ToSiteZOMName = data.Data[0].SiteZOMName;
                this.model.ToSiteTechPhone = data.Data[0].SiteTechPhone;
                this.model.ToSiteCIPhone = data.Data[0].SiteCIPhone;
                this.model.ToSiteZOMPhone = data.Data[0].SiteZOMPhone;
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = 'Site Detail ';
                this.model.PdfSiteDetailBorder = [0, 0, 0, 1];
                this.model.PdfSiteDetailValueBorder = [1, 0, 0, 1];
                this.model.PdfSiteVerticalBorder = '|';
                this.model.PdfSiteTechBorder1 = [0, 0, 1, 0];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder1 = [0, 1, 1, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 1, 0, 0];
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState && this.model.ddlCompanyId == 4) {
                if (data.Data[0].CompanyName == "") {
                  this.model.PdfToCompanyName = data.RegData[0].CompanyName;
                } else {
                  this.model.PdfToCompanyName = data.Data[0].CompanyName;
                }
                if (data.Data[0].GSTTypeId == 1) {
                  this.model.PdfDocumentNo = data.Data[0].TaxInvoiceNO;
                  this.model.ChallanName = "TaxInvoice No";
                  // this.model.PdfHeaderName = "TAX INVOICE ";
                  if (this.model.IsApproved == 1) {
                    this.model.PdfHeaderName = "TAX INVOICE";
                  } else {
                    this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                  }
                } else if (data.Data[0].GSTTypeId == 2) {
                  this.model.PdfDocumentNo = data.Data[0].DocumentNo;
                  this.model.ChallanName = "Challan No ";
                  //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  if (this.model.IsApproved == 1) {
                    this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  } else {
                    this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                  }
                } else {
                  //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  if (this.model.IsApproved == 1) {
                    this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  } else {
                    this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                  }
                }
                this.model.WithInState = "OtherState";
                this.model.PdfToSiteAndWhStateCode = data.Data[0].ShippedToStateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.Data[0].ShippedToGSTNO;
                this.model.PdfToSiteAndWhAddress = data.Data[0].SiteAddress;
                this.model.PdfToSiteWHState = data.Data[0].ToStateName;
                this.model.PdfToSiteId = data.Data[0].CustomerSiteId;
                this.model.PdfToSiteName = data.Data[0].SiteName;
                this.model.PdfToSiteDistrict = data.Data[0].SiteDistrict;
                this.model.ToSiteTech = "Tech";
                this.model.ToSiteCI = "CI";
                this.model.ToSiteZOM = "ZOM";
                this.model.ToSiteTechName = data.Data[0].SiteTechName;
                this.model.ToSiteCIName = data.Data[0].SiteCIName;
                this.model.ToSiteZOMName = data.Data[0].SiteZOMName;
                this.model.ToSiteTechPhone = data.Data[0].SiteTechPhone;
                this.model.ToSiteCIPhone = data.Data[0].SiteCIPhone;
                this.model.ToSiteZOMPhone = data.Data[0].SiteZOMPhone;
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = 'Site Detail ';
                this.model.PdfSiteDetailBorder = [0, 0, 0, 1];
                this.model.PdfSiteDetailValueBorder = [1, 0, 0, 1];
                this.model.PdfSiteVerticalBorder = '|';
                this.model.PdfSiteTechBorder1 = [0, 0, 1, 0];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder1 = [0, 1, 1, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 1, 0, 0];
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState && this.model.ddlCompanyId == 1) {
                if (data.Data[0].CompanyName == "") {
                  this.model.PdfToCompanyName = data.RegData[0].CompanyName;
                } else {
                  this.model.PdfToCompanyName = data.Data[0].CompanyName;
                }
                this.model.PdfDocumentNo = data.Data[0].DocumentNo;

                this.model.ChallanName = "Challan No ";
                //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                if (this.model.IsApproved == 1) {
                  this.model.PdfHeaderName = "DELIVERY CHALLAN";
                } else {
                  this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                }
                this.model.WithInState = "WithInState";
                this.model.PdfToSiteAndWhStateCode = data.RegData[0].StateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.RegData[0].GSTIN_UIN;
                this.model.PdfToSiteAndWhAddress = data.Data[0].SiteAddress;
                this.model.PdfToSiteWHState = data.RegData[0].StateName;
                this.model.PdfToSiteId = data.Data[0].CustomerSiteId;
                this.model.PdfToSiteName = data.Data[0].SiteName;
                this.model.PdfToSiteDistrict = data.Data[0].SiteDistrict;
                this.model.ToSiteTech = "COH";
                this.model.ToSiteCI = "FE";
                this.model.ToSiteZOM = "";
                this.model.ToSiteTechName = data.Data[0].SiteCOHName;
                this.model.ToSiteTechPhone = data.Data[0].SiteCOHPhone;
                this.model.ToSiteCIName = data.Data[0].SiteTechName;
                this.model.ToSiteCIPhone = data.Data[0].SiteTechPhone;
                this.model.ToSiteZOMName = "";
                this.model.ToSiteZOMPhone = "";
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = 'Site Detail ';
                this.model.PdfSiteDetailBorder = [0, 0, 0, 1];
                this.model.PdfSiteDetailValueBorder = [1, 0, 0, 1];
                this.model.PdfSiteTechBorder1 = [0, 0, 1, 1];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 1];
                this.model.PdfSiteCIAndZomBorder1 = [0, 0, 1, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteVerticalBorder = '|';
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState && this.model.ddlCompanyId == 1) {
                if (data.Data[0].CompanyName == "") {
                  this.model.PdfToCompanyName = data.RegData[0].CompanyName;
                } else {
                  this.model.PdfToCompanyName = data.Data[0].CompanyName;
                }
                if (data.Data[0].GSTTypeId == 1) {
                  this.model.PdfDocumentNo = data.Data[0].TaxInvoiceNO;
                  this.model.ChallanName = "TaxInvoice No ";
                  //this.model.PdfHeaderName = "TAX INVOICE";
                  if (this.model.IsApproved == 1) {
                    this.model.PdfHeaderName = "TAX INVOICE";
                  } else {
                    this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                  }
                } else if (data.Data[0].GSTTypeId == 2) {
                  this.model.PdfDocumentNo = data.Data[0].DocumentNo;
                  this.model.ChallanName = "Challan No ";
                  //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  if (this.model.IsApproved == 1) {
                    this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  } else {
                    this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                  }
                } else {
                  //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  if (this.model.IsApproved == 1) {
                    this.model.PdfHeaderName = "DELIVERY CHALLAN";
                  } else {
                    this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                  }
                }
                this.model.WithInState = "OtherState";
                this.model.PdfToSiteWHState = data.Data[0].ToStateName;
                this.model.PdfToSiteAndWhStateCode = data.Data[0].ShippedToStateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.Data[0].ShippedToGSTNO;
                this.model.PdfToSiteAndWhAddress = data.Data[0].SiteAddress;
                this.model.PdfToSiteId = data.Data[0].CustomerSiteId;
                this.model.PdfToSiteName = data.Data[0].SiteName;
                this.model.PdfToSiteDistrict = data.Data[0].SiteDistrict;
                this.model.ToSiteTech = "COH";
                this.model.ToSiteCI = "FE";
                this.model.ToSiteZOM = "";
                this.model.ToSiteTechName = data.Data[0].SiteCOHName;
                this.model.ToSiteTechPhone = data.Data[0].SiteCOHPhone;
                this.model.ToSiteCIName = data.Data[0].SiteTechName;
                this.model.ToSiteCIPhone = data.Data[0].SiteTechPhone;
                this.model.ToSiteZOMName = "";
                this.model.ToSiteZOMPhone = "";
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = 'Site Detail ';
                this.model.PdfSiteDetailBorder = [0, 0, 0, 1];
                this.model.PdfSiteDetailValueBorder = [1, 0, 0, 1];
                this.model.PdfSiteTechBorder1 = [0, 0, 1, 1];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 1];
                this.model.PdfSiteCIAndZomBorder1 = [0, 0, 1, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 0, 0, 0];
                //  this.model.PdfSiteDetailBorder=[0,0,0,1];
                //  this.model.PdfSiteDetailValueBorder=[1,0,0,1];
                //  this.model.PdfSiteTechBorder1=[0,0,1,0] ;
                //  this.model.PdfSiteTechBorder2=[0,0,0,0];
                //  this.model.PdfSiteCIAndZomBorder1=[0,1,1,0];
                //  this.model.PdfSiteCIAndZomBorder2=[0,1,0,0];
                this.model.PdfSiteVerticalBorder = '|';
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_WHWithinState) {
                this.model.PdfToCompanyName = data.RegData[0].CompanyName;
                this.model.PdfToSiteAndWhStateCode = data.RegData[0].StateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.RegData[0].GSTIN_UIN;
                this.model.PdfToSiteAndWhAddress = data.Data[0].ToWhAddress;
                this.model.PdfToSiteWHState = data.RegData[0].StateName;
                this.model.PdfDocumentNo = data.Data[0].DocumentNo;
                this.model.ChallanName = "Challan No ";
                //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                if (this.model.IsApproved == 1) {
                  this.model.PdfHeaderName = "DELIVERY CHALLAN";
                } else {
                  this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                }
                this.model.ToSiteTech = "";
                this.model.ToSiteCI = "";
                this.model.ToSiteZOM = "";
                this.model.ToSiteTechName = "";
                this.model.ToSiteTechPhone = "";
                this.model.ToSiteCIName = "";
                this.model.ToSiteZOMName = "";
                this.model.ToSiteCIPhone = "";
                this.model.ToSiteZOMPhone = "";
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = '';
                this.model.PdfToSiteId = "";
                this.model.PdfToSiteName = "";
                this.model.PdfToSiteDistrict = "";
                this.model.PdfBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailValueBorder = [0, 0, 0, 0];
                this.model.PdfSiteVerticalBorder = '';
                this.model.PdfSiteTechBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 0, 0, 0];
                this.model.WithInState = "WithInState";
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_WHOtherState) {
                this.model.PdfToCompanyName = data.RegData[0].CompanyName;
                this.model.PdfToSiteAndWhStateCode = data.Data[0].ShippedToStateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.Data[0].ShippedToGSTNO;
                this.model.PdfToSiteAndWhAddress = data.Data[0].ToWhAddress;
                this.model.PdfToSiteWHState = data.Data[0].ToStateName;
                this.model.PdfDocumentNo = data.Data[0].TaxInvoiceNO;
                this.model.ChallanName = "TaxInvoice No ";
                // this.model.PdfHeaderName = "TAX INVOICE ";
                if (this.model.IsApproved == 1) {
                  this.model.PdfHeaderName = "TAX INVOICE";
                } else {
                  this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                }
                this.model.ToSiteTech = "";
                this.model.ToSiteCI = "";
                this.model.ToSiteZOM = "";
                this.model.ToSiteTechName = data.Data[0].WHInChargeName;
                this.model.ToSiteTechPhone = data.Data[0].WHNumber;
                this.model.ToSiteCIName = "";
                this.model.ToSiteZOMName = "";
                this.model.ToSiteCIPhone = "";
                this.model.ToSiteZOMPhone = "";
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = '';
                this.model.PdfToSiteId = "";
                this.model.PdfToSiteName = "";
                this.model.PdfToSiteDistrict = "";
                this.model.PdfBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailValueBorder = [0, 0, 0, 0];
                this.model.PdfSiteVerticalBorder = '';
                this.model.PdfSiteTechBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 0, 0, 0];
                this.model.WithInState = "OtherState";
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_CustomerReturn) {
                this.model.PdfToCompanyName = data.Data[0].ClientName;
                this.model.PdfToSiteAndWhStateCode = data.Data[0].ShippedToStateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.Data[0].ShippedToGSTNO;
                this.model.PdfToSiteAndWhAddress = data.Data[0].CustomerAddress;
                this.model.PdfToSiteWHState = data.Data[0].ToStateName;
                this.model.PdfDocumentNo = data.Data[0].DocumentNo;
                this.model.ChallanName = "Challan No ";
                //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                if (this.model.IsApproved == 1) {
                  this.model.PdfHeaderName = "DELIVERY CHALLAN";
                } else {
                  this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                }
                this.model.ToSiteTech = "";
                this.model.ToSiteCI = "";
                this.model.ToSiteZOM = "";
                this.model.ToSiteTechName = "";
                this.model.ToSiteTechPhone = "";
                this.model.ToSiteCIName = "";
                this.model.ToSiteZOMName = "";
                this.model.ToSiteCIPhone = "";
                this.model.ToSiteZOMPhone = "";
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = '';
                this.model.PdfToSiteId = "";
                this.model.PdfToSiteName = "";
                this.model.PdfToSiteDistrict = "";
                this.model.PdfBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailValueBorder = [0, 0, 0, 0];
                this.model.PdfSiteVerticalBorder = '';
                this.model.PdfSiteTechBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 0, 0, 0];
                this.model.WithInState = "WithInState";
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_RepairingCenter) {
                this.model.PdfToCompanyName = data.RegData[0].CompanyName;
                this.model.PdfToSiteAndWhStateCode = data.Data[0].ShippedToStateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.Data[0].ShippedToGSTNO;
                this.model.PdfToSiteAndWhAddress = data.Data[0].ToWhAddress;
                this.model.PdfToSiteWHState = data.Data[0].ToStateName;
                this.model.PdfDocumentNo = data.Data[0].DocumentNo;
                this.model.ChallanName = "Challan No ";
                //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                if (this.model.IsApproved == 1) {
                  this.model.PdfHeaderName = "DELIVERY CHALLAN";
                } else {
                  this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                }
                this.model.ToSiteTech = "";
                this.model.ToSiteCI = "";
                this.model.ToSiteZOM = "";
                this.model.ToSiteTechName = data.Data[0].WHInChargeName;
                this.model.ToSiteTechPhone = data.Data[0].WHNumber;
                this.model.ToSiteCIName = "";
                this.model.ToSiteZOMName = "";
                this.model.ToSiteCIPhone = "";
                this.model.ToSiteZOMPhone = "";
                this.model.PdfToContectDetails = 'Contact Details';
                this.model.PdfToSiteDetail = '';
                this.model.PdfToSiteId = "";
                this.model.PdfToSiteName = "";
                this.model.PdfToSiteDistrict = "";
                this.model.PdfBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailValueBorder = [0, 0, 0, 0];
                this.model.PdfSiteVerticalBorder = '';
                this.model.PdfSiteTechBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 0, 0, 0];
                this.model.WithInState = "WithInState";
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
              else if (this.model.TransferTypeId == PageActivity.Dis_Vendor || this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale || this.model.TransferTypeId == PageActivity.Dis_VendorSale) {
                this.model.PdfToCompanyName = data.Data[0].VendorName;
                this.model.PdfToSiteAndWhStateCode = data.Data[0].ShippedToStateCode;
                this.model.PdfToSiteAndWhGSTINNo = data.Data[0].ShippedToGSTNO;
                this.model.PdfToSiteAndWhAddress = data.Data[0].VenderAddress;
                this.model.PdfToSiteWHState = data.Data[0].ToStateName;
                this.model.PdfDocumentNo = data.Data[0].DocumentNo;
                this.model.ChallanName = "Challan No ";
                //vishal, 02/04/2023
                this.model.PdfBillToCompanyName = data.Data[0].BillToVendorName;
                this.model.PdfBillToStateCode = data.Data[0].BillToStateCode;
                this.model.PdfBillToGSTINNo = data.Data[0].BillToGSTNO;
                this.model.PdfBillToState = data.Data[0].BillToStateName;
                this.model.PdfBillToVenAddress = data.Data[0].BillToVenAddress;
                //end-vishal

                //this.model.PdfHeaderName = "DELIVERY CHALLAN";
                if (this.model.IsApproved == 1) {
                  this.model.PdfHeaderName = "DELIVERY CHALLAN";
                } else {
                  this.model.PdfHeaderName = "ONLY PREVIEW CHALLAN";
                }
                this.model.WithInState = "VendorSale";
                this.model.ToSiteTech = "";
                this.model.ToSiteCI = "";
                this.model.ToSiteZOM = "";
                this.model.ToSiteTechName = "";
                this.model.ToSiteTechPhone = "";
                this.model.ToSiteCIName = "";
                this.model.ToSiteZOMName = "";
                this.model.ToSiteCIPhone = "";
                this.model.ToSiteZOMPhone = "";
                this.model.PdfToContectDetails = "";
                this.model.PdfToSiteDetail = '';
                this.model.PdfToSiteId = "";
                this.model.PdfToSiteName = "";
                this.model.PdfToSiteDistrict = "";
                this.model.PdfBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailBorder = [0, 0, 0, 0];
                this.model.PdfSiteDetailValueBorder = [0, 0, 0, 0];
                this.model.PdfSiteVerticalBorder = '';
                this.model.PdfSiteTechBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteTechBorder2 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder1 = [0, 0, 0, 0];
                this.model.PdfSiteCIAndZomBorder2 = [0, 0, 0, 0];
                if (data.Data[0].MultiSiteName != '') {
                  this.model.MultiSiteLabelName = "Other Site List :-";
                  this.model.MultiSiteName = data.Data[0].MultiSiteName;
                } else {
                  this.model.MultiSiteLabelName = "";
                  this.model.MultiSiteName = "";
                }
              }
            }
          }
          //vishal
          if (this.model.WithInState == "VendorSale") {
            if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
              this.BindItemPdfArrayOtherState(data.ItemData);
            }
            this.generatePDFWithVendorSale('open');
          } else if (this.model.WithInState == "WithInState") {
            if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
              this.BindItemPdfArray(data.ItemData);
            }
            this.generatePDFWithInState('open');
          } else {
            if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
              this.BindItemPdfArrayOtherState(data.ItemData);
            }
            this.generatePDFWithOtherState('open');
          }

          //end-vishal
          //commented by vishal before adding Bill To Section in Vendor Sale case/////
          // if (this.model.WithInState == "WithInState") {
          //   if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
          //     this.BindItemPdfArray(data.ItemData);
          //   }
          //   this.generatePDFWithInState('open');
          // } else {
          //   if (data.ItemData != null && data.ItemData != "" && data.ItemData.length > 0) {
          //     this.BindItemPdfArrayOtherState(data.ItemData);
          //   }
          //   this.generatePDFWithOtherState('open');
          // }

        }

      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "GenerateDispatchPdfbyDispatchId", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "GenerateDispatchPdfbyDispatchId", "WHTOSite");
    }
    return this.PdfPath;
  }

  async BindItemPdfArray(ItemEditDataArr: any) {
    this.dynamicArrayDispatchPdf = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      if (ItemEditDataArr.length == 1) {
        this.TableHeight = [0, 180, 0, 0]
      } else if (ItemEditDataArr.length == 2) {
        this.TableHeight = [0, 140, 0, 0]
      } else if (ItemEditDataArr.length == 3) {
        this.TableHeight = [0, 100, 0, 0]
      } else if (ItemEditDataArr.length == 4) {
        this.TableHeight = [0, 70, 0, 0]
      } else if (ItemEditDataArr.length == 5) {
        this.TableHeight = [0, 30, 0, 0]
      }
      else if (ItemEditDataArr.length == 6) {
        this.TableHeight = [0, 5, 0, 0]
      } else {
        this.TableHeight = [0, 290, 0, 0]
      }
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objdynamic = new DynamicItemGrid();
        objdynamic.RowId = ItemEditDataArr[i].RowId;
        objdynamic.ItemId = ItemEditDataArr[i].ItemId;
        objdynamic.EqTypeId = ItemEditDataArr[i].EqpType_Id;
        objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
        objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
        objdynamic.EqpType = ItemEditDataArr[i].EqpType;
        objdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
        if (ItemEditDataArr[i].ConversionUnit == "" || ItemEditDataArr[i].ConversionUnit == null) {
          objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          objdynamic.UnitName = ItemEditDataArr[i].UnitName;
        } else {
          // objdynamic.Qty = parseFloat(ItemEditDataArr[i].ConversionValue).toFixed(2);
          // objdynamic.UnitName = ItemEditDataArr[i].ConversionUnit;
          objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          objdynamic.UnitName = ItemEditDataArr[i].UnitName;
        }
        objdynamic.HSN = parseInt(ItemEditDataArr[i].HSN_SAC);
        objdynamic.TotalAmount = ItemEditDataArr[i].TotalAmount.toFixed(2);
        objdynamic.Discount = ItemEditDataArr[i].Discount.toFixed(2);
        objdynamic.GetTotalAmount = ItemEditDataArr[i].GrandTotalAmt.toFixed(2);
        objdynamic.SerialNo = ItemEditDataArr[i].ManufacturerSerialNo;
        this.dynamicArrayDispatchPdf.push(objdynamic);
        this.fnBindItemGrossTotal();
      }
    }
  }

  async BindItemPdfArrayOtherState(ItemEditDataArr: any) {
    this.dynamicArrayDispatchPdf = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objdynamic = new DynamicItemGrid();
        objdynamic.RowId = ItemEditDataArr[i].RowId;
        objdynamic.ItemId = ItemEditDataArr[i].ItemId;
        objdynamic.EqTypeId = ItemEditDataArr[i].EqpType_Id;
        objdynamic.ItemDescription = ItemEditDataArr[i].ItemDescription;
        objdynamic.SubDescription = ItemEditDataArr[i].SubDescription;
        objdynamic.EqpType = ItemEditDataArr[i].EqpType;
        objdynamic.Rate = parseFloat(ItemEditDataArr[i].Rate).toFixed(2);
        if (ItemEditDataArr[i].ConversionUnit == "" || ItemEditDataArr[i].ConversionUnit == null) {
          objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          objdynamic.UnitName = ItemEditDataArr[i].UnitName;
        } else {
          objdynamic.Qty = parseFloat(ItemEditDataArr[i].Qty).toFixed(2);
          objdynamic.UnitName = ItemEditDataArr[i].UnitName;
        }
        objdynamic.HSN = parseInt(ItemEditDataArr[i].HSN_SAC);
        objdynamic.TotalAmount = ItemEditDataArr[i].TotalAmount.toFixed(2);
        objdynamic.Discount = ItemEditDataArr[i].Discount.toFixed(2);
        objdynamic.GetTotalAmount = ItemEditDataArr[i].GrandTotalAmt.toFixed(2);
        objdynamic.SerialNo = ItemEditDataArr[i].ManufacturerSerialNo;
        objdynamic.IGST = ItemEditDataArr[i].IGST;
        objdynamic.IGSTValue = ItemEditDataArr[i].IGSTValue;
        objdynamic.SGST = ItemEditDataArr[i].SGST;
        objdynamic.RateSGST = ItemEditDataArr[i].RateSGST;
        objdynamic.CGST = ItemEditDataArr[i].CGST;
        objdynamic.CGSTRate = ItemEditDataArr[i].CGSTRate;
//vishal
        objdynamic.TCSRate = ItemEditDataArr[i].TCSRate;
        objdynamic.TCS = ItemEditDataArr[i].TCS;

        this.dynamicArrayDispatchPdf.push(objdynamic);
        this.fnBindItemGrossTotal();
      }
    }
  }

  fnBindItemGrossTotal() {
    var totalpoqty = 0.0;
    var poqty = 0.0;
    this.totalSumQuantity = 0.0;
    for (var i = 0, len = this.dynamicArrayDispatchPdf.length; i < len; i++) {
      poqty = parseFloat(this.dynamicArrayDispatchPdf[i].Qty == "" ? 0.0 : this.dynamicArrayDispatchPdf[i].Qty);
      totalpoqty += poqty;
    }
    this.model.totalSumPOQuantity = totalpoqty.toFixed(2);
  }

  generatePDFWithInState(action = 'open') {
    let docDefinition = {
      pageSize: 'A4',
      content: [
        {
          text: `${this.model.PdfHeaderName}`,
          style: 'header'
        },
        {
          margin: [0, 0, 0, 0],
          table: {
            body: [
              [
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              bold: true,
                              fontSize: 14,
                              alignment: 'center',
                              text: [
                                { text: `${this.model.PdfCompanyName}`, width: 240 },
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

                              fontSize: 10,
                              text: [
                                { text: 'Regd.Office :', bold: true, }, { text: `${this.model.PdfRegdOffice}`, alignment: 'justify', width: 230 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 1, 0, 0],
                          width: 230,
                          columns: [
                            {
                              table: {
                                widths: ['auto', 'auto'],
                                body: [
                                  ...this.objDynamicWHAddress.map(p => ([
                                    { text: p.Address, fontSize: 9, border: [0, 0, 0, 1] },
                                    { text: p.WHAddress, fontSize: 9, border: [0, 0, 0, 1] }])),
                                ]
                              },
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN No :', bold: true }, { text: `${this.model.PdfGSTINNo}`, width: 230 },
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
                              fontSize: 10,
                              text: [
                                { text: 'CIN No      : ', bold: true }, { text: `${this.model.PdfCIN}`, width: 230 },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },
                ///start Document
                {
                  border: [1, 1, 1, 0],
                  width: 240,
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.ChallanName}`, bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 140,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfDocumentNo}` },
                              ]
                            },
                          ]
                        },
                      ],


                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Date : ', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfDocumentDate}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Trasporation Mode: ', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfTrasporationMode}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.LableTransPotionName}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfTransporterName}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.LableTransPhone}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfTransporterGSTNo}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Place of Dispatch:', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfPlaceOfDispatch}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Destination :', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfDestination}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: this.model.LableBorderbiltyNo,
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.LablebiltyNo}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: this.model.LableBorderbiltyDate,
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfGRNo}` }, { text: `${this.model.VerticalData}` }, { text: `${this.model.PdfGRDate}` },
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
                              fontSize: 10,
                              text: [
                                { text: 'Vehicle Number:', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 0],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfVehicleNumber}` }, '   |', { text: 'V. Type', bold: true }, '   |', { text: `${this.model.PdfVehicleType}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: this.model.EwayBilltextBorder,
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.EwayBillNoName}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: this.model.EwayBillValueBorder,
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfEwayBillNo}` },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },

              ],


              [
                {

                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              alignment: 'center',
                              text: [
                                { text: 'SHIPPED FROM', bold: true, },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },



                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'SHIPPED TO', bold: true, width: 240, alignment: 'center', },
                              ]
                            },
                          ]
                        },


                      ],
                    ]
                  }
                },
              ],

              [
                ////shipped From
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Name ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfCompanyName}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Address ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfShippedWHAddress}`, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfWHState}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State Code ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfStateCode}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN/Unique ID ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfGSTINNo}` },
                              ]
                            },
                          ]
                        },
                      ],


                    ]
                  }
                },

                ////shipped TO
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Name ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 180,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToCompanyName}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: this.model.PdfSiteDetailBorder,
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteDetail}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: this.model.PdfSiteDetailValueBorder,
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteId}` }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteName}`, bold: true }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteDistrict}`, bold: true },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Address ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteAndWhAddress}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToContectDetails}`, bold: true, alignment: 'center' },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 180,
                              table: {
                                headerRows: 1,
                                widths: [25, 60, 75],
                                body: [
                                  [{ text: `${this.model.ToSiteTech}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechName}`, width: 20, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder2 }],
                                  [{ text: `${this.model.ToSiteCI}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIName}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder2 }],
                                  // [{text: `${this.model.ToSiteZOM}`, bold:true,alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMName}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMPhone}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder2},]
                                ]
                              }
                            }
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteWHState}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State Code ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteAndWhStateCode}` },
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
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN/Unique ID ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 0],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteAndWhGSTINNo}` },
                              ]
                            },
                          ]
                        },
                      ],

                    ]
                  }
                },

              ]
            ]
          }
        },


        {
          style: 'TableHeader',
          table: {
            headerRows: 1,
            widths: ['5%', '35%', '6%', '7%', '5.8%', '10%', '10%', '10%', '14%'],
            body: [
              [{ text: 'S.No', bold: true, },
              { text: 'Description of Goods', bold: true, alignment: 'center' },
              { text: 'HSN', bold: true, alignment: 'center' },
              { text: 'Qty', bold: true, alignment: 'center' },
              { text: 'Unit', bold: true, alignment: 'center' },
              // { text: 'EquType', bold: true, alignment: 'center' }, 
              { text: 'Rate', bold: true, alignment: 'center' },
              { text: 'Amount', bold: true, alignment: 'center' },
              { text: 'Discount', bold: true, alignment: 'center' },
              { text: 'Grand Total', bold: true, alignment: 'center' }],
              ...this.dynamicArrayDispatchPdf.map(p => (
                [{ text: p.RowId },
                { text: [{ text: p.ItemDescription }, '\n', { text: p.SubDescription, italics: true }] },
                { text: p.HSN, alignment: 'center' },
                { text: p.Qty, alignment: 'center' },
                { text: p.UnitName, alignment: 'center' },
                // { text: p.EqpType, alignment: 'center' }, 
                { text: p.Rate, alignment: 'center' },
                { text: p.TotalAmount, alignment: 'center' },
                { text: p.Discount, alignment: 'center' },
                { text: this._Commonservices.thousands_separators(p.GetTotalAmount), alignment: 'center' }])),
              // [{}, { text: '', colSpan: 1, alignment: 'right', margin: this.TableHeight }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' },{ text: '' }],
              [{}, { text: 'Total Amount', colSpan: 1, alignment: 'right', bold: true },
              { text: '' },
              { text: `${this.model.totalSumPOQuantity}`, alignment: 'center', bold: true },
              { text: '' },
              //  { text: '' }, 
              { text: '' }, { text: '' },
              { text: '' },
              { text: this._Commonservices.thousands_separators(`${this.model.GrossTotalAmount}`) + '₹', bold: true, alignment: 'center' }]

            ]
          }
        },
        {
          table: {
            body: [
              [
                {
                  border: [1, 0, 1, 1],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 9,
                              width: 258,
                              text: [
                                'Amount Chargeable (in words)',
                                '\n',
                                { text: `${this.model.PdfAmountChargeable}`, fontSize: 10, bold: true, },
                              ]
                            },

                          ]
                        },

                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 9,
                              width: 0,
                              alignment: 'right', italics: true,
                              text: [
                                //{text: `${this.model.AmountChargeable}`, fontSize:10, bold:true,},
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
                              width: 246,
                              text: [
                                { text: 'Note', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
                                '\n',
                                { text: `${this.model.PdfNote}`, fontSize: 10, },
                              ]
                            },

                          ]
                        },

                        {
                          border: [1, 1, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              width: 240,
                              alignment: 'right',
                              text: [
                                { text: `for ${this.model.PdfCompanyName}` },
                                '\n\n',
                                { text: `Authorised Signatory`, fontSize: 8, },
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


        [
          {
            border: [0, 0, 0, 0],
            columns: [
              {
                width: '100%',
                fontSize: 10,
                text: [
                  { text: `${this.model.MultiSiteLabelName}     ${this.model.MultiSiteName}` },

                ]
              },
            ]
          },
        ],

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
          margin: [210, -40, 0, 0]
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
    }
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      if (this.model.FunctionFlagValue == 2) {
        pdfMake.createPdf(docDefinition).open();
      } else {
        //pdfMake.createPdf(docDefinition).open();
        // pdfMake.createPdf(docDefinition).download();
        pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
          PDFdata = dataURL;
        });
        setTimeout(() => {
          this.SaveUpdateDispatchPDF();
        }, 1200);
      }
    }
  }

  generatePDFWithOtherState(action = 'open') {
    let docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          text: `${this.model.PdfHeaderName}`,
          style: 'header'
        },
        {
          margin: [0, 0, 0, 0],
          table: {
            body: [
              [
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              bold: true,
                              fontSize: 14,
                              alignment: 'center',
                              text: [
                                { text: `${this.model.PdfCompanyName}`, width: 180 },
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
                              fontSize: 10,
                              text: [
                                { text: 'Regd.Office :', bold: true, }, { text: `${this.model.PdfRegdOffice}`, alignment: 'justify', width: 180 },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 1, 0, 0],
                          width: 180,
                          columns: [
                            {
                              table: {
                                widths: ['auto', 'auto'],
                                body: [
                                  ...this.objDynamicWHAddress.map(p => ([{ text: p.Address, fontSize: 9, border: [0, 0, 0, 1] }, { text: p.WHAddress, fontSize: 9, border: [0, 0, 0, 1] }])),
                                ]
                              },
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN No :', bold: true }, { text: `${this.model.PdfGSTINNo}`, width: 180 },
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
                              fontSize: 10,
                              text: [
                                { text: 'CIN No      : ', bold: true }, { text: `${this.model.PdfCIN}`, width: 180 },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },
                ///start Ducoment
                {
                  border: [1, 1, 1, 0],
                  width: 350,
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.ChallanName}`, bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 240,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfDocumentNo}` },
                              ]
                            },
                          ]
                        },
                      ],


                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Date : ', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfDocumentDate}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Trasporation Mode: ', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfTrasporationMode}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.LableTransPotionName}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 240,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfTransporterName}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.LableTransPhone}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 180,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfTransporterGSTNo}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Place of Dispatch:', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 200,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfPlaceOfDispatch}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Destination :', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 200,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfDestination}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: this.model.LableBorderbiltyNo,
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.LablebiltyNo}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: this.model.LableBorderbiltyDate,
                          columns: [
                            {
                              width: 200,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfGRNo}` }, { text: `${this.model.VerticalData}` }, { text: `${this.model.PdfGRDate}` },
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
                              fontSize: 10,
                              text: [
                                { text: 'Vehicle Number:', bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 0],
                          columns: [
                            {
                              width: 250,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfVehicleNumber}` }, '   |  ', { text: 'V. Type', bold: true }, '   |  ', { text: `${this.model.PdfVehicleType}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: this.model.EwayBilltextBorder,
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: `${this.model.EwayBillNoName}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: this.model.EwayBillValueBorder,
                          columns: [
                            {
                              width: 200,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfEwayBillNo}` },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },

              ],

              //vishal, 01/05/2023 BILL TO

              // [
              //   {

              //     border: [1, 1, 1, 0],
              //     table: {
              //       body: [
              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   fontSize: 10,
              //               //   alignment: 'center',
              //               //   text: [
              //               //     { text: 'SHIPPED FROM', bold: true, },
              //               //   ]
              //               // },
              //             ]
              //           },
              //         ],
              //       ]
              //     }
              //   },



              //   {
              //     border: [1, 1, 1, 0],
              //     table: {
              //       body: [
              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               {
              //                 fontSize: 10,
              //                 text: [
              //                   { text: 'BILL TO', bold: true, width: 240, alignment: 'center', },
              //                 ]
              //               },
              //             ]
              //           },


              //         ],
              //       ]
              //     }
              //   },
              // ],

              // [
              //   ///shipped from
              //   {
              //     border: [1, 1, 1, 0],
              //     table: {
              //       body: [
              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 100,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: 'Name ', bold: true },

              //               //   ]
              //               // },
              //             ]
              //           },

              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 250,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: `${this.model.PdfCompanyName}` },
              //               //   ]
              //               // },
              //             ]
              //           },
              //         ],

              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 100,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: 'Address ', bold: true },

              //               //   ]
              //               // },
              //             ]
              //           },

              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 250,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: `${this.model.PdfShippedWHAddress}`, },
              //               //   ]
              //               // },
              //             ]
              //           },
              //         ],
              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 100,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: 'State ', bold: true },

              //               //   ]
              //               // },
              //             ]
              //           },

              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 250,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: `${this.model.PdfWHState}` },
              //               //   ]
              //               // },
              //             ]
              //           },
              //         ],
              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 100,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: 'State Code ', bold: true },

              //               //   ]
              //               // },
              //             ]
              //           },

              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 250,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: `${this.model.PdfStateCode}` },
              //               //   ]
              //               // },
              //             ]
              //           },
              //         ],
              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 100,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: 'GSTIN/Unique ID ', bold: true },

              //               //   ]
              //               // },
              //             ]
              //           },

              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               // {
              //               //   width: 250,
              //               //   fontSize: 10,
              //               //   text: [
              //               //     { text: `${this.model.PdfGSTINNo}` },
              //               //   ]
              //               // },
              //             ]
              //           },
              //         ],


              //       ]
              //     }
              //   },
              //   ///Bill TO
              //   {
              //     border: [1, 1, 1, 0],
              //     table: {
              //       body: [
              //         [
              //           {
              //             border: [0, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 90,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: 'Name ', bold: true },

              //                 ]
              //               },
              //             ]
              //           },

              //           {
              //             border: [1, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 260,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfBillToCompanyName}` },
              //                 ]
              //               },
              //             ]
              //           },
              //         ],

              //         [
              //           {
              //             border: this.model.PdfSiteDetailBorder,
              //             columns: [
              //               {
              //                 width: 90,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfToSiteDetail}`, bold: true },
              //                 ]
              //               },
              //             ]
              //           },

              //           {
              //             border: this.model.PdfSiteDetailValueBorder,
              //             columns: [
              //               {
              //                 width: 260,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfToSiteId}` }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteName}`, bold: true }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteDistrict}`, bold: true },
              //                 ]
              //               },
              //             ]
              //           },
              //         ],
              //         [
              //           {
              //             border: [0, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 90,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: 'Address ', bold: true },

              //                 ]
              //               },
              //             ]
              //           },

              //           {
              //             border: [1, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 260,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfBillToVenAddress}` },
              //                 ]
              //               },
              //             ]
              //           },
              //         ],

              //         [
              //           {
              //             border: [0, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 90,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfToContectDetails}`, bold: true, alignment: 'center' },
              //                 ]
              //               },
              //             ]
              //           },

              //           {
              //             border: [1, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 260,
              //                 table: {
              //                   headerRows: 1,
              //                   widths: [25, 130, 80],
              //                   body: [
              //                     [{ text: `${this.model.ToSiteTech}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechName}`, width: 20, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder2 }],
              //                     [{ text: `${this.model.ToSiteCI}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIName}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder2 }],
              //                     // [{text: `${this.model.ToSiteZOM}`, bold:true,alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMName}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMPhone}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder2},]
              //                   ]
              //                 }
              //               }
              //             ]
              //           },
              //         ],

              //         [
              //           {
              //             border: [0, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 90,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: 'State ', bold: true },

              //                 ]
              //               },
              //             ]
              //           },

              //           {
              //             border: [1, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 260,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfBillToState}` },
              //                 ]
              //               },
              //             ]
              //           },
              //         ],
              //         [
              //           {
              //             border: [0, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 90,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: 'State Code ', bold: true },

              //                 ]
              //               },
              //             ]
              //           },

              //           {
              //             border: [1, 0, 0, 1],
              //             columns: [
              //               {
              //                 width: 260,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfBillToStateCode}` },
              //                 ]
              //               },
              //             ]
              //           },
              //         ],
              //         [
              //           {
              //             border: [0, 0, 0, 0],
              //             columns: [
              //               {
              //                 width: 90,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: 'GSTIN/Unique ID ', bold: true },

              //                 ]
              //               },
              //             ]
              //           },

              //           {
              //             border: [1, 0, 0, 0],
              //             columns: [
              //               {
              //                 width: 260,
              //                 fontSize: 10,
              //                 text: [
              //                   { text: `${this.model.PdfBillToGSTINNo}` },
              //                 ]
              //               },
              //             ]
              //           },
              //         ],

              //       ]
              //     }
              //   },

              // ],

              //end-vishal

              [
                {

                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              alignment: 'center',
                              text: [
                                { text: 'SHIPPED FROM', bold: true, },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },



                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'SHIPPED TO', bold: true, width: 240, alignment: 'center', },
                              ]
                            },
                          ]
                        },


                      ],
                    ]
                  }
                },
              ],

              [
                ///shipped from
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: 'Name ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 250,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfCompanyName}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: 'Address ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 250,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfShippedWHAddress}`, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: 'State ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 250,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfWHState}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: 'State Code ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 250,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfStateCode}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN/Unique ID ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 250,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfGSTINNo}` },
                              ]
                            },
                          ]
                        },
                      ],


                    ]
                  }
                },
                ///shipped TO
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 90,
                              fontSize: 10,
                              text: [
                                { text: 'Name ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 260,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToCompanyName}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: this.model.PdfSiteDetailBorder,
                          columns: [
                            {
                              width: 90,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteDetail}`, bold: true },
                              ]
                            },
                          ]
                        },

                        {
                          border: this.model.PdfSiteDetailValueBorder,
                          columns: [
                            {
                              width: 260,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteId}` }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteName}`, bold: true }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteDistrict}`, bold: true },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 90,
                              fontSize: 10,
                              text: [
                                { text: 'Address ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 260,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteAndWhAddress}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 90,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToContectDetails}`, bold: true, alignment: 'center' },
                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 260,
                              table: {
                                headerRows: 1,
                                widths: [25, 130, 80],
                                body: [
                                  [{ text: `${this.model.ToSiteTech}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechName}`, width: 20, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder2 }],
                                  [{ text: `${this.model.ToSiteCI}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIName}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder2 }],
                                  // [{text: `${this.model.ToSiteZOM}`, bold:true,alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMName}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMPhone}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder2},]
                                ]
                              }
                            }
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 90,
                              fontSize: 10,
                              text: [
                                { text: 'State ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 260,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteWHState}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 90,
                              fontSize: 10,
                              text: [
                                { text: 'State Code ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 260,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteAndWhStateCode}` },
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
                              width: 90,
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN/Unique ID ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 0],
                          columns: [
                            {
                              width: 260,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.PdfToSiteAndWhGSTINNo}` },
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
          style: 'TableHeader',
          table: {
            headerRows: 1,
            widths: ['4%', '30.1%', '4%', '6%', '5.9%', '6%', '8%', '4%', '5%', '4%', '5%', '4%', '5%', '9%'],
            body: [
              [
                { text: 'S.No', bold: true, },
                { text: 'Description of Goods', bold: true, alignment: 'center' },
                { text: 'HSN', bold: true, alignment: 'center' },
                { text: 'Qty', bold: true, alignment: 'center' },
                { text: 'Unit', bold: true, alignment: 'center' },
                { text: 'Rate', bold: true, alignment: 'center' },
                { text: 'Amount', bold: true, alignment: 'center' },
                { text: 'Rate (%)', bold: true, alignment: 'center' },
                { text: 'CGST', bold: true, alignment: 'center' },
                { text: 'Rate (%)', bold: true, alignment: 'center' },
                { text: 'SGST', bold: true, alignment: 'center' },
                { text: 'IGST(%)', bold: true, alignment: 'center' },
                { text: 'IGST', bold: true, alignment: 'center' },
                { text: 'Grand Total', bold: true, alignment: 'center' }],
              ...this.dynamicArrayDispatchPdf.map(p => ([
                { text: p.RowId },
                { text: [{ text: p.ItemDescription }, '\n', { text: p.SubDescription, italics: true }] },
                { text: p.HSN, alignment: 'center' },
                { text: p.Qty, alignment: 'center' },
                { text: p.UnitName, alignment: 'center' },
                { text: p.Rate, alignment: 'center' },
                { text: p.TotalAmount, alignment: 'center' },
                { text: p.CGSTRate, alignment: 'center' },
                { text: p.CGST, alignment: 'center' },
                { text: p.RateSGST, alignment: 'center' },
                { text: p.SGST, alignment: 'center' },
                { text: p.IGSTValue, alignment: 'center' },
                { text: p.IGST, alignment: 'center' },
                { text: this._Commonservices.thousands_separators(p.GetTotalAmount), alignment: 'center' }])),
              // [{}, { text: '', colSpan: 1, alignment: 'right', margin: this.TableHeight }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }],
              [{},
              { text: 'Total Amount', colSpan: 1, alignment: 'right', bold: true },
              { text: '' },
              { text: `${this.model.totalSumPOQuantity}`, alignment: 'center', bold: true },
              { text: '' },
              { text: '' },
              { text: '' }, { text: '' }, { text: '' }, { text: '' },
              { text: '' }, { text: '' }, { text: '' },
              { text: this._Commonservices.thousands_separators(`${this.model.GrossTotalAmount}`) + '₹', bold: true, alignment: 'center' }]
            ]
          }
        },
        {
          table: {
            body: [
              [
                {
                  border: [1, 0, 1, 1],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 9,
                              width: 533,
                              text: [
                                'Amount Chargeable (in words)',
                                '\n',
                                { text: `${this.model.PdfAmountChargeable}`, fontSize: 10, bold: true, },
                              ]
                            },

                          ]
                        },

                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 9,
                              width: 0,
                              alignment: 'right', italics: true,
                              text: [
                                { text: '', fontSize: 10, bold: true, },
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
                              width: 350,
                              text: [
                                { text: 'Note', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
                                '\n',
                                { text: `${this.model.PdfNote}`, fontSize: 10, },
                              ]
                            },

                          ]
                        },

                        {
                          border: [1, 1, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              width: 200,
                              alignment: 'right',
                              text: [
                                { text: `for ${this.model.PdfCompanyName}` },
                                '\n\n',
                                { text: `Authorised Signatory`, fontSize: 8, },
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
        [
          {
            border: [0, 0, 0, 0],
            columns: [
              {
                width: '100%',
                fontSize: 10,
                text: [
                  { text: `${this.model.MultiSiteLabelName}     ${this.model.MultiSiteName}` },

                ]
              },
            ]
          },
        ],
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
          margin: [310, -40, 0, 0]
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
    }
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      if (this.model.FunctionFlagValue == 2) {
        pdfMake.createPdf(docDefinition).open();
      } else {
        //pdfMake.createPdf(docDefinition).open();
        // pdfMake.createPdf(docDefinition).download();
        pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
          PDFdata = dataURL;
        });
        setTimeout(() => {
          this.SaveUpdateDispatchPDF();
        }, 1200);
      }
    }
  }

  

  SaveUpdateDispatchPDF() {
    try {
      let objDispatchTrackingModel = new DispatchTrackingModel();
      objDispatchTrackingModel.DispatchTracker_Id = this.model.DispatchId;
      objDispatchTrackingModel.DocumentFile = PDFdata;
      this._MaterialMovementService.SaveDispatchPDF(objDispatchTrackingModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          alert('Document has been generated');
          let objdata = new MailSenderModel();
          objdata.Id = this.model.DispatchId;
          objdata.flag = mailFor.Dispatch;
          this._Commonservices.GetEmailSenderDeatil(objdata).subscribe(data => {
            this.PdfPath = data.Data[0].PdfUrl; //vishal           
            if (data.Status == 1) {
              let objEmailModel = new EmailModel();
              objEmailModel = data.Data[0];
              let formdata = new FormData();
              formdata.append('jsonEmailDetail', JSON.stringify(objEmailModel));
              this._Commonservices.EmailSendDeatil(formdata).subscribe(data => {
              });
            }
          });
        } else if (data.Status == 2) {
          alert('Document does not generated');
        }
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "SaveDispatchPdf", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "SaveDispatchPdf", "WHTOSite");
    }
    //  //vishal
    setTimeout(() => {
      if (this.model.TransferTypeId == PageActivity.Dis_SiteOtherState || this.model.TransferTypeId == PageActivity.Dis_WHOtherState
        || this.model.TransferTypeId == PageActivity.Dis_Vendor || this.model.TransferTypeId == PageActivity.Dis_VendorSale ||
        this.model.TransferTypeId == PageActivity.Dis_VendorScrapSale) {
        jQuery('#sendMailModel').modal('show');
      } else if (this.model.TransferTypeId == PageActivity.Dis_SiteWithinState || this.model.TransferTypeId == PageActivity.Dis_WHWithinState
        || this.model.TransferTypeId == PageActivity.Dis_CustomerReturn || this.model.TransferTypeId == PageActivity.Dis_RepairingCenter) {
        jQuery('#sendMailModel').modal('hide');
      } else {
        jQuery('#sendMailModel').modal('show');
      } //end-vishal
    }, 3000);
  }

//By:vishal, 03/05/2023, desc: function for pdf genearate in case of vendor sale

generatePDFWithVendorSale(action = 'open') {
  let docDefinition = {
    pageOrientation: 'landscape',
    content: [
      {
        text: `${this.model.PdfHeaderName}`,
        style: 'header'
      },
      {
        margin: [0, 0, 0, 0],
        table: {
          body: [
            [
              {
                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          {
                            bold: true,
                            fontSize: 14,
                            alignment: 'center',
                            text: [
                              { text: `${this.model.PdfCompanyName}`, width: 180 },
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
                            fontSize: 10,
                            text: [
                              { text: 'Regd.Office :', bold: true, }, { text: `${this.model.PdfRegdOffice}`, alignment: 'justify', width: 180 },
                            ]
                          },
                        ]
                      },
                    ],

                    [
                      {
                        border: [0, 1, 0, 0],
                        width: 180,
                        columns: [
                          {
                            table: {
                              widths: ['auto', 'auto'],
                              body: [
                                ...this.objDynamicWHAddress.map(p => ([{ text: p.Address, fontSize: 9, border: [0, 0, 0, 1] }, { text: p.WHAddress, fontSize: 9, border: [0, 0, 0, 1] }])),
                              ]
                            },
                          },
                        ]
                      },
                    ],

                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: 'GSTIN No :', bold: true }, { text: `${this.model.PdfGSTINNo}`, width: 180 },
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
                            fontSize: 10,
                            text: [
                              { text: 'CIN No      : ', bold: true }, { text: `${this.model.PdfCIN}`, width: 180 },
                            ]
                          },
                        ]
                      },
                    ],
                  ]
                }
              },
              ///start Ducoment
              {
                border: [1, 1, 1, 0],
                width: 350,
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 100,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.ChallanName}`, bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 240,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfDocumentNo}` },
                            ]
                          },
                        ]
                      },
                    ],


                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: 'Date : ', bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 110,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfDocumentDate}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: 'Trasporation Mode: ', bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 110,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfTrasporationMode}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: `${this.model.LableTransPotionName}`, bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 240,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfTransporterName}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: `${this.model.LableTransPhone}`, bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 180,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfTransporterGSTNo}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: 'Place of Dispatch:', bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 200,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfPlaceOfDispatch}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: 'Destination :', bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 200,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfDestination}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: this.model.LableBorderbiltyNo,
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: `${this.model.LablebiltyNo}`, bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: this.model.LableBorderbiltyDate,
                        columns: [
                          {
                            width: 200,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfGRNo}` }, { text: `${this.model.VerticalData}` }, { text: `${this.model.PdfGRDate}` },
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
                            fontSize: 10,
                            text: [
                              { text: 'Vehicle Number:', bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 0],
                        columns: [
                          {
                            width: 250,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfVehicleNumber}` }, '   |  ', { text: 'V. Type', bold: true }, '   |  ', { text: `${this.model.PdfVehicleType}` },
                            ]
                          },
                        ]
                      },
                    ],

                    [
                      {
                        border: this.model.EwayBilltextBorder,
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: `${this.model.EwayBillNoName}`, bold: true },
                            ]
                          },
                        ]
                      },

                      {
                        border: this.model.EwayBillValueBorder,
                        columns: [
                          {
                            width: 200,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfEwayBillNo}` },
                            ]
                          },
                        ]
                      },
                    ],
                  ]
                }
              },

            ],

            //vishal, 01/05/2023 BILL TO

            [
              {

                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   fontSize: 10,
                          //   alignment: 'center',
                          //   text: [
                          //     { text: 'SHIPPED FROM', bold: true, },
                          //   ]
                          // },
                        ]
                      },
                    ],
                  ]
                }
              },



              {
                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: 'BILL TO', bold: true, width: 240, alignment: 'center', },
                            ]
                          },
                        ]
                      },


                    ],
                  ]
                }
              },
            ],

            [
              ///shipped from
              {
                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 100,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: 'Name ', bold: true },

                          //   ]
                          // },
                        ]
                      },

                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 250,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: `${this.model.PdfCompanyName}` },
                          //   ]
                          // },
                        ]
                      },
                    ],

                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 100,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: 'Address ', bold: true },

                          //   ]
                          // },
                        ]
                      },

                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 250,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: `${this.model.PdfShippedWHAddress}`, },
                          //   ]
                          // },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 100,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: 'State ', bold: true },

                          //   ]
                          // },
                        ]
                      },

                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 250,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: `${this.model.PdfWHState}` },
                          //   ]
                          // },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 100,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: 'State Code ', bold: true },

                          //   ]
                          // },
                        ]
                      },

                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 250,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: `${this.model.PdfStateCode}` },
                          //   ]
                          // },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 100,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: 'GSTIN/Unique ID ', bold: true },

                          //   ]
                          // },
                        ]
                      },

                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          // {
                          //   width: 250,
                          //   fontSize: 10,
                          //   text: [
                          //     { text: `${this.model.PdfGSTINNo}` },
                          //   ]
                          // },
                        ]
                      },
                    ],


                  ]
                }
              },
              ///Bill TO
             {
                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'Name ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfToCompanyName}` },
                            ]
                          },
                        ]
                      },
                    ],

                    // [
                    //   {
                    //     border: this.model.PdfSiteDetailBorder,
                    //     columns: [
                    //       {
                    //         width: 90,
                    //         fontSize: 10,
                    //         text: [
                    //           { text: `${this.model.PdfToSiteDetail}`, bold: true },
                    //         ]
                    //       },
                    //     ]
                    //   },

                    //   {
                    //     border: this.model.PdfSiteDetailValueBorder,
                    //     columns: [
                    //       {
                    //         width: 260,
                    //         fontSize: 10,
                    //         text: [
                    //           { text: `${this.model.PdfToSiteId}` }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteName}`, bold: true }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteDistrict}`, bold: true },
                    //         ]
                    //       },
                    //     ]
                    //   },
                    // ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'Address ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfToSiteAndWhAddress}` },
                            ]
                          },
                        ]
                      },
                    ],

                    // [
                    //   {
                    //     border: [0, 0, 0, 1],
                    //     columns: [
                    //       {
                    //         width: 90,
                    //         fontSize: 10,
                    //         text: [
                    //           { text: `${this.model.PdfToContectDetails}`, bold: true, alignment: 'center' },
                    //         ]
                    //       },
                    //     ]
                    //   },

                    //   {
                    //     border: [1, 0, 0, 1],
                    //     columns: [
                    //       {
                    //         width: 260,
                    //         table: {
                    //           headerRows: 1,
                    //           widths: [25, 130, 80],
                    //           body: [
                    //             [{ text: `${this.model.ToSiteTech}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechName}`, width: 20, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder2 }],
                    //             [{ text: `${this.model.ToSiteCI}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIName}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder2 }],
                    //             // [{text: `${this.model.ToSiteZOM}`, bold:true,alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMName}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMPhone}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder2},]
                    //           ]
                    //         }
                    //       }
                    //     ]
                    //   },
                    // ],

                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'State ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfToSiteWHState}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'State Code ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfToSiteAndWhStateCode}` },
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
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'GSTIN/Unique ID ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 0],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfToSiteAndWhGSTINNo}` },
                            ]
                          },
                        ]
                      },
                    ],

                  ]
                }
              },

            ],

            //end-vishal

            [
              {

                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          {
                            fontSize: 10,
                            alignment: 'center',
                            text: [
                              { text: 'SHIPPED FROM', bold: true, },
                            ]
                          },
                        ]
                      },
                    ],
                  ]
                }
              },



              {
                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          {
                            fontSize: 10,
                            text: [
                              { text: 'SHIPPED TO', bold: true, width: 240, alignment: 'center', },
                            ]
                          },
                        ]
                      },


                    ],
                  ]
                }
              },
            ],

            [
              ///shipped from
              {
                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 100,
                            fontSize: 10,
                            text: [
                              { text: 'Name ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 250,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfCompanyName}` },
                            ]
                          },
                        ]
                      },
                    ],

                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 100,
                            fontSize: 10,
                            text: [
                              { text: 'Address ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 250,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfShippedWHAddress}`, },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 100,
                            fontSize: 10,
                            text: [
                              { text: 'State ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 250,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfWHState}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 100,
                            fontSize: 10,
                            text: [
                              { text: 'State Code ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 250,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfStateCode}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 100,
                            fontSize: 10,
                            text: [
                              { text: 'GSTIN/Unique ID ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 250,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfGSTINNo}` },
                            ]
                          },
                        ]
                      },
                    ],


                  ]
                }
              },
              ///shipped TO
              {
                border: [1, 1, 1, 0],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'Name ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfBillToCompanyName}` },
                            ]
                          },
                        ]
                      },
                    ],

                    // [
                    //   {
                    //     border: this.model.PdfSiteDetailBorder,
                    //     columns: [
                    //       {
                    //         width: 90,
                    //         fontSize: 10,
                    //         text: [
                    //           { text: `${this.model.PdfToSiteDetail}`, bold: true },
                    //         ]
                    //       },
                    //     ]
                    //   },

                    //   {
                    //     border: this.model.PdfSiteDetailValueBorder,
                    //     columns: [
                    //       {
                    //         width: 260,
                    //         fontSize: 10,
                    //         text: [
                    //           { text: `${this.model.PdfToSiteId}` }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteName}`, bold: true }, { text: `${this.model.PdfSiteVerticalBorder}`, bold: true }, { text: `${this.model.PdfToSiteDistrict}`, bold: true },
                    //         ]
                    //       },
                    //     ]
                    //   },
                    // ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'Address ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfBillToVenAddress}` },
                            ]
                          },
                        ]
                      },
                    ],

                    // [
                    //   {
                    //     border: [0, 0, 0, 1],
                    //     columns: [
                    //       {
                    //         width: 90,
                    //         fontSize: 10,
                    //         text: [
                    //           { text: `${this.model.PdfToContectDetails}`, bold: true, alignment: 'center' },
                    //         ]
                    //       },
                    //     ]
                    //   },

                    //   {
                    //     border: [1, 0, 0, 1],
                    //     columns: [
                    //       {
                    //         width: 260,
                    //         table: {
                    //           headerRows: 1,
                    //           widths: [25, 130, 80],
                    //           body: [
                    //             [{ text: `${this.model.ToSiteTech}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechName}`, width: 20, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder1 }, { text: `${this.model.ToSiteTechPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteTechBorder2 }],
                    //             [{ text: `${this.model.ToSiteCI}`, bold: true, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIName}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder1 }, { text: `${this.model.ToSiteCIPhone}`, alignment: 'center', fontSize: 10, border: this.model.PdfSiteCIAndZomBorder2 }],
                    //             // [{text: `${this.model.ToSiteZOM}`, bold:true,alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMName}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder1},{text: `${this.model.ToSiteZOMPhone}`, alignment: 'center',fontSize:10, border:this.model.PdfSiteCIAndZomBorder2},]
                    //           ]
                    //         }
                    //       }
                    //     ]
                    //   },
                    // ],

                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'State ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfBillToState}` },
                            ]
                          },
                        ]
                      },
                    ],
                    [
                      {
                        border: [0, 0, 0, 1],
                        columns: [
                          {
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'State Code ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 1],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfBillToStateCode}` },
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
                            width: 90,
                            fontSize: 10,
                            text: [
                              { text: 'GSTIN/Unique ID ', bold: true },

                            ]
                          },
                        ]
                      },

                      {
                        border: [1, 0, 0, 0],
                        columns: [
                          {
                            width: 260,
                            fontSize: 10,
                            text: [
                              { text: `${this.model.PdfBillToGSTINNo}` },
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
        style: 'TableHeader',
        table: {
          headerRows: 1,
          widths: ['4%', '20.5%', '4%', '6%', '5.9%', '6%', '8%', '4%', '5%', '4%', '5%', '4%', '5%', '4%', '5%',  '9%',],
          body: [
            [
              { text: 'S.No', bold: true, },
              { text: 'Description of Goods', bold: true, alignment: 'center' },
              { text: 'HSN', bold: true, alignment: 'center' },
              { text: 'Qty', bold: true, alignment: 'center' },
              { text: 'Unit', bold: true, alignment: 'center' },
              { text: 'Rate', bold: true, alignment: 'center' },
              { text: 'Amount', bold: true, alignment: 'center' },
              { text: 'Rate (%)', bold: true, alignment: 'center' },
              { text: 'CGST', bold: true, alignment: 'center' },
              { text: 'Rate (%)', bold: true, alignment: 'center' },
              { text: 'SGST', bold: true, alignment: 'center' },
              { text: 'IGST(%)', bold: true, alignment: 'center' },
              { text: 'IGST', bold: true, alignment: 'center' },
              { text: 'TCS  (%)', bold: true, alignment: 'center' },
              { text: 'TCS', bold: true, alignment: 'center' },
              { text: 'Grand Total', bold: true, alignment: 'center' }],
            ...this.dynamicArrayDispatchPdf.map(p => ([
              { text: p.RowId },
              { text: [{ text: p.ItemDescription }, '\n', { text: p.SubDescription, italics: true }] },
              { text: p.HSN, alignment: 'center' },
              { text: p.Qty, alignment: 'center' },
              { text: p.UnitName, alignment: 'center' },
              { text: p.Rate, alignment: 'center' },
              { text: p.TotalAmount, alignment: 'center' },
              { text: p.CGSTRate, alignment: 'center' },
              { text: p.CGST, alignment: 'center' },
              { text: p.RateSGST, alignment: 'center' },
              { text: p.SGST, alignment: 'center' },
              { text: p.IGSTValue, alignment: 'center' },
              { text: p.IGST, alignment: 'center' },
              { text: p.TCSRate, alignment: 'center' },
              { text: p.TCS, alignment: 'center' },
              { text: this._Commonservices.thousands_separators(p.GetTotalAmount), alignment: 'center' }])),
            // [{}, { text: '', colSpan: 1, alignment: 'right', margin: this.TableHeight }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }],
            [{},
            { text: 'Total Amount', colSpan: 1, alignment: 'right', bold: true },
            { text: '' },
            { text: `${this.model.totalSumPOQuantity}`, alignment: 'center', bold: true },
            { text: '' },
            { text: '' },
            { text: '' }, { text: '' }, { text: '' }, { text: '' },
            { text: '' }, { text: '' }, { text: '' },{ text: '' }, { text: '' },
            { text: this._Commonservices.thousands_separators(`${this.model.GrossTotalAmount}`) + '₹', bold: true, alignment: 'center' }]
          ]
        }
      },
      {
        table: {
          body: [
            [
              {
                border: [1, 0, 1, 1],
                table: {
                  body: [
                    [
                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          {
                            fontSize: 9,
                            width: 533,
                            text: [
                              'Amount Chargeable (in words)',
                              '\n',
                              { text: `${this.model.PdfAmountChargeable}`, fontSize: 10, bold: true, },
                            ]
                          },

                        ]
                      },

                      {
                        border: [0, 0, 0, 0],
                        columns: [
                          {
                            fontSize: 9,
                            width: 0,
                            alignment: 'right', italics: true,
                            text: [
                              { text: '', fontSize: 10, bold: true, },
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
                            width: 350,
                            text: [
                              { text: 'Note', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
                              '\n',
                              { text: `${this.model.PdfNote}`, fontSize: 10, },
                            ]
                          },

                        ]
                      },

                      {
                        border: [1, 1, 0, 0],
                        columns: [
                          {
                            fontSize: 10,
                            width: 200,
                            alignment: 'right',
                            text: [
                              { text: `for ${this.model.PdfCompanyName}` },
                              '\n\n',
                              { text: `Authorised Signatory`, fontSize: 8, },
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
      [
        {
          border: [0, 0, 0, 0],
          columns: [
            {
              width: '100%',
              fontSize: 10,
              text: [
                { text: `${this.model.MultiSiteLabelName}     ${this.model.MultiSiteName}` },

              ]
            },
          ]
        },
      ],
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
        margin: [310, -40, 0, 0]
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
  }
  if (action === 'download') {
    pdfMake.createPdf(docDefinition).download();
  } else if (action === 'print') {
    pdfMake.createPdf(docDefinition).print();
  } else {
    if (this.model.FunctionFlagValue == 2) {
      pdfMake.createPdf(docDefinition).open();
    } else {
      //pdfMake.createPdf(docDefinition).open();
      // pdfMake.createPdf(docDefinition).download();
      pdfMake.createPdf(docDefinition).getDataUrl(function (dataURL) {
        PDFdata = dataURL;
      });
      setTimeout(() => {
        this.SaveUpdateDispatchPDF();
      }, 1200);
    }
  }

}

//end-vishal
}
