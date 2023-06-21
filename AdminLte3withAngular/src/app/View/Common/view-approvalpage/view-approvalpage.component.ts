import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { ApprovelStatusModel, CommonStaticClass, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';

@Component({
  selector: 'app-view-approvalpage',
  templateUrl: './view-approvalpage.component.html',
  styleUrls: ['./view-approvalpage.component.sass']
})
export class ViewApprovalpageComponent implements OnInit {
  @Input() ChildApprovalList: any;
  @Input() ManueId: any;
  @Input() TableId: any;
  @Input() CreateName: any;
  @Input() CreatedDate: any;
  @Input() ModifiedName: any;
  @Input() ModifiedDate: any;
  @Input() ApprovalstatusbtnhideShow: any;
  @Input() ApprovelLevelId: any;
  @Input() CompanyId: any;
  @Input() Flag: any;

  closeResult: any;
  Remarks: any;
  ApprovalReason: any;
  model: any;
  ReasonDataList: any;
  ApprovalStatusDetail: any;

  UserId: any;
  ApprovalId: any;
  RejectedId: number;
  constructor(
    private modalService: NgbModal,
    private _Commonservices: CommonService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService) {

  }

  ngOnInit(): void {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.fnGetApprovalReasonAndStatus();
    this.ApprovalId = CommonStaticClass.Approved;
    this.RejectedId = CommonStaticClass.Reject;
  }

  fnGetApprovalReasonAndStatus() {
    var objVendormodel = new VendorOrWhModel();
    objVendormodel.Id = '0';
    objVendormodel.flag = '1460';
    this.ApprovalReason = "0";
    this._Commonservices.GettApprovalStatusAndReasondropdown(objVendormodel).subscribe(st1 => {
      if (st1.Status == 1 && st1.ReasonData != null) {
        this.ReasonDataList = st1.ReasonData;
      }
      if (st1.Status == 1 && st1.ApprovalStatusData != null) {
        this.ApprovalStatusDetail = st1.ApprovalStatusData;
      }
    });
  }

  open(content:any) {
    debugger
    this.modalService.open(content, { size: <any>'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  ClearApprovalStatus() {
    this.ApprovalReason = "0";
    this.Remarks = "";
  }

  ValidationApprovalStatus() {
    var flag = 0;
    if (this.ApprovalReason == "0") {
      $('#txtReason').css('border-color', 'red')
      $('#txtReason').focus();
      flag = 1;
    } else {
      $("#txtReason").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.Remarks) == "") {
      $('#txtRemarks').css('border-color', 'red')
      $('#txtRemarks').focus();
      flag = 1;
    } else {
      $("#txtRemarks").css('border-color', '')
    }
    return flag;
  }

  SaveApprovalStatus(ApprovalStatusId: any) {
    try {
      if (this.TableId == 0) {
        alert('Please Save Form');
        return false;
      }
      if (ApprovalStatusId == this.RejectedId) {
        if (this.ValidationApprovalStatus() == 1) {
          return false;
        }
      }
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.Menu_Id = this.ManueId;
      objApprovelStatusModel.Table_Id = this.TableId;
      objApprovelStatusModel.User_Id = this.UserId;
      objApprovelStatusModel.ApprovalStatus_Id = ApprovalStatusId;
      objApprovelStatusModel.Reason_Id = this.ApprovalReason;
      objApprovelStatusModel.CompanyId = this.CompanyId;
      var Val = this._Commonservices.checkUndefined(this.Remarks);
      if (Val != "") {
        objApprovelStatusModel.Remarks = this.Remarks;
      } else {
        objApprovelStatusModel.Remarks = "";
      }

      this._Commonservices.SaveApprovalStatusHistory(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          setTimeout(() => {
            alert('Approval Status SuccessFully Save')
          }, 300);
          this.ClearApprovalStatus();
          this.modalService.dismissAll();
        } else if (data.Status == 2) {
          setTimeout(() => {
            alert('Approval Status SuccessFully Update')
          }, 300);
        }
      });

    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SaveApprovalStatus";
      objWebErrorLogModel.ErrorPage = "WHtosite";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }  

  onChangeApprovalReason() {
    $("#txtReason").css('border-color', '')
  }

  KeypressRemarks() {
    $("#txtRemarks").css('border-color', '')
  }
}
