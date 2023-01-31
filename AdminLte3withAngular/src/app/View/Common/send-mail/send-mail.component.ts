import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, } from '@angular/core';
import { SendmailService } from 'src/app/Service/sendmail.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmailModel, EmailSendTotalDataModel, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { NgxSpinnerService } from 'ngx-spinner';




declare var jQuery: any;

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.sass']
})
export class SendMailComponent implements OnInit {
  // SendMailData: any;
  loaded = true;
  closeResult: string;
  model: any = {};//get Data
  MailFile: any = [];
  loading = false;
  UserId: any;
  urls: any = [];

  uplodfile: File = null;
  AttchMent: File = null;
  public pdfPath: string;
  EmailData: any [];
  EditPoId: any;
 

   @ViewChild('modal') modal: ElementRef;
   DispatchTrackingId: any;
  
  
  
  constructor(private _objSendMailService: SendmailService, private modalService: NgbModal,
    private _Commonservices: CommonService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService, private Loader: NgxSpinnerService,
  ) {

    this._objSendMailService._getSendMailSubject.subscribe(data => {
      this.pdfPath = data;  
      
    });
    
    // this._objSendMailService._getSendMailSubject.subscribe(data => {
    //   this.EmailData = data;  
      
    // });

    // this._objSendMailService._getDispatchId.subscribe(Id => {
    //   this.DispatchTrackingId = Id;
      
    // });
  }



  ngOnInit(): void {

    this.model.MailTo = "";
    this.model.MailCc = "";
    this.model.MailBcc = "";
    this.model.MailSubject = "";
    this.model.MailMessage = " Hi, As per attachment pls provide tax invoice against the challan no." ;
    this.model.pdfPath = "";

  }



  SendMail() {
    
    try {
      if (this.ValidationEmailSend() == 0) {
        this.loading = true;
        var objEmailSendTotalDataModel = new EmailSendTotalDataModel();
        var objEmailModel = new EmailModel();
        objEmailModel.MailTo = this.model.MailTo;
        objEmailModel.MailCc = this.model.MailCc;
        objEmailModel.MailBcc = this.model.MailBcc;
        objEmailModel.MailSubject = this.model.MailSubject;
        objEmailModel.MailBodyMessage = this.model.MailMessage;
        var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
        objEmailModel.UserId = objUserModel.User_Id;
        objEmailModel.DocumentFile = this.model.pdfPath;
        

        var formdata = new FormData();
        for (var i = 0; i < this.MailFile.length; i++) {
          formdata.append("fileUpload", this.MailFile[i]);
        }
        formdata.append('jsonEmailDetail', JSON.stringify(objEmailModel));
        this._Commonservices.EmailSendDeatil(formdata).subscribe(data => {
          if (data.Status == 1) {
            this.loading = false;
            // $('#custom-tabs-three-outbox-tab').css('background-color', '#2196f3')
            alert('your email has been successfully send')
            
          } else if (data.Status == 0) {
            this.loading = false;
            alert('your email Id not correct format')
          }
        });
      }
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetItemSaveExcelData";
      objWebErrorLogModel.ErrorPage = "SendMail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  AttchmentFileChange(event) {
    let reader = new FileReader();
    this.MailFile = [];
    for (var i = 0, len = event.target.files.length; i < len; i++) {
      var Size = parseInt(event.target.files[i].size);
      if (Size > 200000) {
        alert("your file size > 2mb ");
        return false;
      } else {
        this.urls.push(event.target.files[i]);
        this.MailFile.push(event.target.files[i]);
      }
    }
  }
  removeSelectedFile(index) {
    this.MailFile.splice(index, 1);
    this.urls.splice(index, 1);
  }

  KeypressMailTo(event) {
    $("#txtToMail").css('border-color', '')
  }
  KeypressSubject(event) {
    $("#txtSubject").css('border-color', '')
  }
  KeypressMessage(event) {
    $("#txtMessage").css('border-color', '')
  }
  ValidationEmailSend() {
    var flag = 0;
    if (this.model.MailTo == "" || this.model.MailTo == undefined) {
      $('#txtToMail').css('border-color', 'red')
      $('#txtToMail').focus();
      flag = 1;
    } else {
      $("#txtToMail").css('border-color', '')
    }
    if (this.model.MailSubject == "" || this.model.MailSubject == undefined) {
      $('#txtSubject').css('border-color', 'red')
      $('#txtSubject').focus();
      flag = 1;
    } else {
      $("#txtSubject").css('border-color', '')
    }
    if (this.model.MailMessage == "" || this.model.MailMessage == undefined) {
      $('#txtMessage').css('border-color', 'red')
      $('#txtMessage').focus();
      flag = 1;
    } else {
      $("#txtMessage").css('border-color', '')
    }
    return flag;
  }

  onPdfClick() {
    window.open(this.pdfPath);
  }
  //end-region

  

  GetSendMailDetail() {
    try {
      // this.Loader.show();  
      this.EmailData = [];
      var objVendormodel = new VendorOrWhModel();
      objVendormodel.Id = this.EditPoId;
      objVendormodel.flag = 'EmailMaster';
      this._Commonservices.getVendorOrWh(objVendormodel).subscribe(Email => {
        if (Email.Status == 1) {
          if (Email.Data != null || Email.Data != "") {
            this.Loader.hide();
            this.EmailData = Email.Data;
            $('#custom-tabs-three-outbox-tab').css('background-color', '#2196f3');
          }
        } else {
          this.Loader.hide();
          $('#custom-tabs-three-outbox-tab').css('background-color', '#F9F9F9');
        }

      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetSendMailDetail";
      objWebErrorLogModel.ErrorPage = "Podetail";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

}
