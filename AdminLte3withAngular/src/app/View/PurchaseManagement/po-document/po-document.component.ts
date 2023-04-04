import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as JSZip from 'jszip';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { ApprovelStatusModel, DocumentUploadModel, DropdownModel, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { PoOtherDetial, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-po-document',
  templateUrl: './po-document.component.html',
  styleUrls: ['./po-document.component.sass']
})
export class PoDocumentComponent implements OnInit {
  @Input() PoId: number;
  @Input() UserId: number;
  @Input() CompanyId: number;
  @Input() ObjUserPageRight: UserPageRight;
  private DocumentFile: any;
  @ViewChild('InputDocumentFile', { static: false })
  InputDocumentFile: ElementRef;
  DocModel: DocumentUploadModel = { DocumentTypeId: 0, TypeId: 0, Remarks: "" };

  DocumentTypeList: any[] = [];
  TypeList: any[] = [];
  DocumentTypeDataList: any[] = [];


  constructor(private _PurchaseOrderService: PurchaseOrderService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private _MaterialMovementService: MaterialMovementService,
    private _Commonservices: CommonService) { 
      //this.InputDocumentFile.nativeElement.value = "";
      //this.GetAllDocumentTypeByPoId(this.PoId);  
    }

  ngOnInit() {
    this.clearDocumentType();
    this.onChangeDocumentType();
    this.onChangeType();
    this.fnGetDocumentTypeListORTypeList();
    //this.GetAllDocumentTypeByPoId(this.PoId);
  }

  // ngAfterViewInit() {
  //   this.InputDocumentFile.nativeElement.value = "";
  // }
  
  // ngAfterViewChecked(){
  //   this.GetAllDocumentTypeByPoId(this.PoId);  
  //   console.log("after view checked");
  //   //this.InputDocumentFile.nativeElement.value = "";
  // }

  ngOnChanges(changes: any) {
    //changes.PoId
    console.log(changes.PoId.currentValue)
    this.GetAllDocumentTypeByPoId(changes.PoId.currentValue);
  }

  clearDocumentType() {
    this.DocModel.DocumentTypeId = 0;
    this.DocModel.TypeId = 0;
    this.DocModel.Remarks = "";
    //this.InputDocumentFile.nativeElement.value = "";
  }

  onChangeDocumentType() {
    $("#txtDocumentType").css('border-color', '')
  }

  onChangeType() {
    $("#txtDocumentType").css('border-color', '')
  }

  fnGetDocumentTypeListORTypeList() {
    //console.log("Call fnGetDocumentTypeListORTypeList")
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'DocumentType';
    this._Commonservices.getPOStatusAndVoucherTypedropdown(objdropdownmodel).subscribe(st => {
      if (st.Status == 1 && st.Data != null) {
        this.DocumentTypeList = st.Data;
      }
      if (st.Status == 1 && st.VouCherData != null) {
        this.TypeList = st.VouCherData;
      }
    });
  }

  onChangeFileType(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.DocumentFile = event.target.files[0];
    }
  }

  validateFileUploadModel() {
    var flag = 0;
    if (this.DocModel.DocumentTypeId == 0 || this.DocModel.DocumentTypeId == null) {
      $('#txtDocumentType').css('border-color', 'red')
      $('#txtDocumentType').focus();
      flag = 1;
    } else {
      $("#txtDocumentType").css('border-color', '')
    }

    if (this.DocModel.TypeId == 0 || this.DocModel.TypeId == null) {
      $('#txttype').css('border-color', 'red')
      $('#txttype').focus();
      flag = 1;
    } else {
      $("#txttype").css('border-color', '')
    }
    return flag;
  }

  uploadDocumentFile() {
    try {
      if (this.PoId == 0 || this.PoId == null) {
       // alert('Please Save, First PO Basic Information');
       Swal.fire('','Please Save, First PO Basic Information', 'warning' )
        return false;
      }
      if (this.validateFileUploadModel() == 1) {
        return false;
      }
      var objPoDoc = new PoOtherDetial();
      objPoDoc.PoId = this.PoId;
      objPoDoc.UserId = this.UserId;
      objPoDoc.DocumentTypeId = this.DocModel.DocumentTypeId;
      objPoDoc.TypeId = this.DocModel.TypeId;
      objPoDoc.Remarks = this.DocModel.Remarks;

      var formdata = new FormData();
      if (this.DocumentFile == null) {
        //alert('Please attach document file');
        Swal.fire('','Please attach document file', 'warning')
        return false;
        //formdata.append('file', this.DocumentFile);
      } else {
        formdata.append('file', this.DocumentFile, this.DocumentFile.name);
      }

      formdata.append('jsonDetail', JSON.stringify(objPoDoc));

      this._PurchaseOrderService.PostUpdateDocumentDetail(formdata).subscribe(data => {
        if (data.Status == 1) {
          //alert('your data has been save successfully')
          Swal.fire('', 'your data has been save successfully', 'success')
          this.clearDocumentType();
          this.GetAllDocumentTypeByPoId(this.PoId);
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId.toString();
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "PostUpdateDocumentDetail";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  onClickDocView(Id: any, index: any) {
    var FilterDocumentData = this.DocumentTypeDataList.filter(m => m.Id === parseInt(Id));
    window.open(FilterDocumentData[0].DocumentFile);
  }

  onClickDocDownload(Id: any, index: any) {
    var FilterDocumentData = this.DocumentTypeDataList.filter(m => m.Id === parseInt(Id));
    //window.open(FilterDocumentData[0].DocumentFile);
    let filepath = FilterDocumentData[0].DocumentFile;
    this.DownloadAllPdfZip(filepath, "Files", "PurchaseOrderDocument");
  }

  onClickDocDelete(Id: any, index: any) {
    try {
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = Id;
      objApprovelStatusModel.Table_Id = this.PoId;
      objApprovelStatusModel.Flag = "PODocumentType";
      this._MaterialMovementService.UpadateCancelDispatch(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          //alert('Your SuccessFully Delete')
          Swal.fire('','Your SuccessFully Delete', 'success')
          this.GetAllDocumentTypeByPoId(this.PoId);
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId.toString();
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ClickDeleteDocument";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  GetAllDocumentTypeByPoId(POId: any) {
    try {
      this.DocumentTypeDataList = [];
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = POId;
      objVendormodel.flag = 'DocumentTypeGridData';
      this._Commonservices.getVendorOrWh(objVendormodel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null || data.Data != "") {
            this.DocumentTypeDataList = data.Data;
          }
        } else {
          this.DocumentTypeDataList = [];
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId.toString();
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllDocumentTypeByPoId";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  DownloadAllPdfZip(value: string, folderName: string, ZipName: string) {
    //var value = '';
    // var FilterDocumentData = this.DocumentTypeDataList.filter(m => m.Id === parseInt(Id));
    // value = FilterDocumentData[0].DocumentFile;

    var formdata = new FormData();
    formdata.append("SendDownloadFile", JSON.stringify(value));
    this._Commonservices.DownloadFileZip(formdata).subscribe(data => {
      var zip = new JSZip();
      var imgFolder = zip.folder(folderName);
      for (let i = 0; i < data.lstUrlDetail.length; i++) {
        const byteArray = new Uint8Array(atob(data.lstUrlDetail[i].base64Value).split("").map(char => char.charCodeAt(0)));
        imgFolder.file(this.GetFilename(data.lstUrlDetail[i].Url), byteArray, { base64: true });
      }
      zip.generateAsync({ type: "blob" })
        .then(function (content) {
          FileSaver.saveAs(content, ZipName);
        });
    });
  }

  GetFilename(url: string) {
    var m = url.substring(url.lastIndexOf('/') + 1);
    return m;
  }
}

