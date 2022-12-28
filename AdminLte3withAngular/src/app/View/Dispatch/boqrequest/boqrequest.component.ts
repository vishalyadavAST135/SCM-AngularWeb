import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApprovalButtonRendererComponent } from 'src/app/renderer/approvalbutton.component';
import { ApprovalrendererComponent } from 'src/app/renderer/approvalrenderer/approvalrenderer.component';
import { approvalTooltipComponent } from 'src/app/renderer/Approvaltooltip.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { CommonpdfService } from 'src/app/Service/commonpdf.service';
import { GrncrnService } from 'src/app/Service/grncrn.service';
import { TimePeriodService } from 'src/app/Service/time-period.service';
import { SiteCustomerAutoModel } from 'src/app/_Model/grncrnModel';
import { BOQModel, BOQNOListModel, BOQReqModel, IBOQRequestequestService } from 'src/app/_Model/BOQRequestModel';
import { VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { BOQRequestequestService } from 'src/app/Service/boqrequestequest.service';
import { ApprovelStatusModel, CommonStaticClass, MenuName } from 'src/app/_Model/commonModel';
import { inArray } from 'jquery';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
import { HttpClient } from '@angular/common/http';
declare var jQuery: any;


@Component({
  selector: 'app-boqrequest',
  templateUrl: './boqrequest.component.html',
  styleUrls: ['./boqrequest.component.sass'],
  providers: [DatePipe],
})
export class BOQRequestComponent implements OnInit {
  // **********Grid Variable **********
  public columnDefs = [];  //grid column
  public rowData = [];  //  grid data
  public multiSortKey: string; //grid multy sort key
  tooltipShowDelay: any;
  gridApi: any;
  gridColumnApi: any;
  public loadingTemplate;
  frameworkComponents: any;

  // **********End Grid Variable **********
  model: any = {};

  //******MultiSelect DropDown****
  searchCustomerList: any[]=[];
  selectedSearchCustomerList: any[]=[];
  
  searchProjectTypeList:any[]=[];
  selectedSearchProjectTypeList:any[]=[];

  multiDropdownSettings: {
    singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; 
    enableSearchFilter: boolean;
    // limitSelection:1
    badgeShowLimit: number;
  };
  //******************************

  keyword = 'Text';
  autoCompleteBOQNOList = [];
  searchData: any;
  objBOQReqModel: BOQReqModel={CompanyId:0, circleId:"", customerId:"0",ProjectType:"0",
  fromDate:"",toDate:"", BOQId:0,Flag:1, UserId:0 };
  objCompanyModel: CompanyModel={Company_Id:0,FullName:"",Name:"" };
  commonSearchPanelData: any;
  
  scmPendingCount: number=0;
  scmApprovedCount: number=0;
  scmRejectCount: number=0;
  isApprovalTab: boolean;
  loading: boolean = false
  reasonDataList: any[]=[];
  userId: number=0;
  userName: any;
  boqReqId:number=0;
  userRoleId:[]=[];
  btnAppShowHide:boolean=false;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  IBoqService:IBOQRequestequestService=null;

  constructor(private datePipe: DatePipe, private router: Router, 
    public httpclient: HttpClient,
    private _objSearchpanelService: TimePeriodService,
    private _commonServices: CommonService, 
    //private _boqService: IBOQRequestequestService,
    private _commonPdfService: CommonpdfService,
    private _grnCrnService: GrncrnService) {  
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ApprovalButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      approvalTooltip: approvalTooltipComponent,
      customtooltip: CustomTooltipComponent
    }
    this._objSearchpanelService.SearchTimePeriodPanelSubject.subscribe(data => {
      this.commonSearchPanelData = data;
    });
  }

  ngOnInit(): void {
    this.IBoqService= new BOQRequestequestService(this.httpclient);
    this.objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.userId = objUserModel.User_Id;
    this.userRoleId= objUserModel.Role_Id.split(',');
    this.userName = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    
    // if(inArray("18",this.UserRoleId)!=-1){
    //   this.BtnAppShowHide=true
    // }else{
    //   this.BtnAppShowHide=false
    // }



    this.getCustomerName();  
    this.multiSelectConfig();
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
    });
     //brahamjot kaur 31/10/2022
     this.GetUserPageRight();
    }
  
    //brahamjot kaur 31/10/2022
    async GetUserPageRight() {
      this._commonServices.GetUserPageRight(this.userId, MenuName.MaterialIndent).subscribe(data => {
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
 // fetch the Customer name
  getCustomerName() {
    var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
    objSiteCustomerAutoModel.SCNo = "";
    objSiteCustomerAutoModel.CompanyId = this.objCompanyModel.Company_Id;
    objSiteCustomerAutoModel.flag = "Customer";
    this._grnCrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel).subscribe((AutoCom) => {
      this.searchCustomerList = AutoCom.Data;
    })
  }

  // multi select properties
  multiSelectConfig(){
    this.multiDropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };
  }

  // bind the project list with multi select
  bindProjectList(para:string){    
    this.objBOQReqModel.customerId="0";
    this.objBOQReqModel.ProjectType="0";
    this.searchProjectTypeList=[];
    this.selectedSearchProjectTypeList=[];
    if (para == "DelAll") {
      this.selectedSearchCustomerList = [];      
    } else if (this.selectedSearchCustomerList.length > 0) {
      this.objBOQReqModel.customerId=this.selectedSearchCustomerList.map(xx => xx.id).join(',');
      var objSiteCustomerAutoModel = new SiteCustomerAutoModel();
      objSiteCustomerAutoModel.SCNo = this.objBOQReqModel.customerId;
      objSiteCustomerAutoModel.CompanyId = this.objCompanyModel.Company_Id;
      objSiteCustomerAutoModel.flag = "ProjectType";
      this._grnCrnService.GetAutoCompleteSiteAndCustomer(objSiteCustomerAutoModel)
      .subscribe((AutoCom) => {
        this.searchProjectTypeList = AutoCom.Data;
        this.selectedSearchProjectTypeList=[];
      })
    }
  }

  // delete all select method for project type
  delProjectTypeList(para:string){
    this.objBOQReqModel.ProjectType="0";
    this.searchProjectTypeList=[];
    this.selectedSearchProjectTypeList=[];
  }

  // bind columns with dynamic method
  bindGrid(){
    this.columnDefs = [
      {
        headerName: 'Approved  Rejected',
        cellRendererSelector:function (params) {
          var showFile = {
            component: 'buttonRenderer'
          };
          var hideFile = {
            component: ''
          };
          if (params.data.ApprovalRole==0) {
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
          if (params.data.BOQReqId == null || params.data.BOQReqId == '') {
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
        width: 100,
        filter: false
      },
      {
        headerName: 'Approval Status (L1|L2)',
        cellRendererFramework: ApprovalrendererComponent,
        pinned: 'left',
        width: 110,
        filter: false,
        resizable: true,
        field: 'BOQReqId',
        tooltipField: 'BOQReqId', tooltipComponent: 'approvalTooltip',
      },
      { headerName: 'MI For', field: 'MIFor', width: 130, filter: false, resizable: true },
      { headerName: 'Circle Name', field: 'CirCleName', width: 130, filter: false, resizable: true },
      { headerName: 'Customer', field: 'ClientName', width: 130, filter: false, resizable: true },
      { headerName: 'Project Type', field: 'ProjectType', width: 130, filter: false, resizable: true },      
      { headerName: 'Material IndentNo', field: 'BOQReqNo', width: 130, filter: false, resizable: true },
      { headerName: 'BOQTemplate', field: 'BOQType', width: 130, filter: false, resizable: true },
      { headerName: 'SiteCount', field: 'SiteCount', width: 130, filter: false, resizable: true },
      { headerName: 'CreatedOn', field: 'CreatedOn', width: 130, filter: false, resizable: true },
      { headerName: 'CreatedBy', field: 'Name', width: 130, filter: false, resizable: true }
    ];
    this.multiSortKey = 'ctrl';
    this.loadingTemplate = `<span class="ag-overlay-loading-center">loading...</span>`;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.rowData = this.rowData;
  }

  approvedClick(e) {
    this.boqReqId=e.rowData.BOQReqId;
    jQuery('#ApproveModalPopup').modal('show');
  }

  rejectedClick(e) {
    this.boqReqId=e.rowData.BOQReqId;
    jQuery('#RejectModalPopup').modal('show');
  }

  showMRPdfPreviewDetail(e) {
    try {
     var objBOQModel=new BOQModel();
     objBOQModel.BOQId=e.rowData.BOQReqId;
     objBOQModel.CompanyId=this.objCompanyModel.Company_Id;
     objBOQModel.UserId=this.userId;
     this.IBoqService.GetBOQRequestPdfDetail(objBOQModel).subscribe(data => {
      if (data.Status == 1) {
        if (data.Data != null) {        
        this._commonPdfService.BOQRequestGeneratePDF(data.Data);
      }
      }
      });    
    } catch (Error) {
      this._commonServices.ErrorFunction(this.objCompanyModel.Name, Error.message, "ShowMRPdfPreviewDetail", "BOQRequest");
    }
  }

  searchBOQRequest(para: string) {
    try {
      this.gridApi.showLoadingOverlay();
      this.objBOQReqModel.circleId="";

      if (this.selectedSearchProjectTypeList.length > 0) {
        this.objBOQReqModel.ProjectType=this.selectedSearchProjectTypeList.map(xx => xx.id).join(',');
      }else{
        this.objBOQReqModel.ProjectType="0";
      }
      this.objBOQReqModel.CompanyId= this.objCompanyModel.Company_Id;
      this.objBOQReqModel.UserId= this.userId;
      this.objBOQReqModel.fromDate=this.commonSearchPanelData.Startdate;
      this.objBOQReqModel.toDate=this.commonSearchPanelData.Enddate;
      this.objBOQReqModel.Flag=1;
      this.IBoqService.GetBOQRequestList(this.objBOQReqModel).subscribe(data => {
      // this._boqService.GetBOQRequestList(this.objBOQReqModel).subscribe(data => {
        this.gridApi.hideOverlay();
        if (data.Status == 1) {
          if (para == "LIST") {            
            this.isApprovalTab = true;
             this.scmPendingCount = 0;
             this.scmApprovedCount = 0;
             this.scmRejectCount = 0;
            if (data.Data != null) {
              this.rowData = data.Data;
              this.searchData = data.Data;
              const filterValue = 0;
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
            }
          }
          // else if (para == "Export") {
          //   if (data.Data != null) {
          //     var CurrentDate = this.datePipe.transform(Date(), "dd/MM/yyyy");
          //     this._PurchaseOrderService.exportAsExcelFile(data.Data, 'MaterialRequisition' + CurrentDate);
          //   } else {
          //     alert('try again');
          //   }
          // }
        }else{
          this.rowData=[];
        }
      });
    } catch (Error) {
      this._commonServices.ErrorFunction(this.objCompanyModel.Name, Error.message, "SearchApprovalMRStatusList", "ApprovalStatus");
    }
  }

  clearedBOQNO() {
    this.autoCompleteBOQNOList = [];
    this.objBOQReqModel.BOQId = 0;
  }

  selectBOQNO(items:any) {
    this.objBOQReqModel.BOQId =items.Id
  }

  onFocused(e) {
  }

  onChangeBOQNOId(val: string) {
    try {
      this.objBOQReqModel.BOQId=0;
      var objModel=new BOQNOListModel();  
      objModel.CompanyId=this.objCompanyModel.Company_Id;
      objModel.SearchText=val;
      objModel.Flag=2;
      this.IBoqService.GetBOQNoORBOQRequestNo(objModel).subscribe((data) => {
        if (data.Data != "") {
          this.autoCompleteBOQNOList = data.Data;
        }
      })
    } catch (Error) {
      this._commonServices.ErrorFunction(this.objCompanyModel.Name, Error.message, "onChangeBOQNOId", "BOQRequest");
    }
  }

  searchTabTypeData(Id: any) {
      var filterTabGridData = this.searchData.filter(
        m => m.SCMApprovalStatusId === Id);
      this.rowData = filterTabGridData;
   }

  saveApprovalStatus(ApprovalStatusId: any) {
    try {
      if (ApprovalStatusId == CommonStaticClass.Reject) {
        if (this.validationApprovalStatus() == 1) {
          return false;
        }
      }
      var objApprovelStatusModel = new ApprovelStatusModel();
      objApprovelStatusModel.Menu_Id = 29;
      objApprovelStatusModel.Table_Id = this.boqReqId;
      objApprovelStatusModel.User_Id = this.userId;
      objApprovelStatusModel.ApprovalStatus_Id = ApprovalStatusId;
      objApprovelStatusModel.Reason_Id = this.model.ApprovalReason;
      objApprovelStatusModel.Remarks = this.model.Remarks;
      objApprovelStatusModel.CompanyId = this.objCompanyModel.Company_Id;
      this._commonServices.SaveApprovalStatusHistory(objApprovelStatusModel).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#ApproveModalPopup').modal('hide');
          jQuery('#RejectModalPopup').modal('hide');
          setTimeout(() => {
            alert('Approval Status SuccessFully Save')
          }, 300);
          this.clearPopuptext();
        } else if (data.Status == 2) {
          jQuery('#ApproveModalPopup').modal('hide');
          jQuery('#RejectModalPopup').modal('hide');
          setTimeout(() => {
            alert('Approval Status SuccessFully Update')
          }, 300);
        }
      });
    } catch (Error) {
      this._commonServices.ErrorFunction(this.objCompanyModel.Name, Error.message, "SaveApprovalStatus",
       "BOQRequest");
    }
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

  clearPopuptext() {
    this.model.ApprovalStatus = "0";
    this.model.ApprovalReason = "0";
    this.model.Remarks = "";
  }
}
