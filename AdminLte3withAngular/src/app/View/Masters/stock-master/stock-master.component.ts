import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { DeleteButtonRendererComponent } from 'src/app/renderer/delete-button-renderer.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { StockMasterService } from 'src/app/Service/stock-master.service';
import { MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { StockMasterModel } from 'src/app/_Model/MastersModel';
import { CompanyModel, UserModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare var jQuery: any;

@Component({
  selector: 'app-stock-master',
  templateUrl: './stock-master.component.html',
  styleUrls: ['./stock-master.component.sass']
})
export class StockMasterComponent implements OnInit {
  model: any = {};
  UserId: any;
  CompanyId: any;
  public isShownList: boolean; // Grid List
  @ViewChild("content") modalContent: TemplateRef<any>;
  public multiSortKey: string;
  public MultidropdownSettings = {};
  public columnDefs = [];
  //public loadingTemplate;
  gridApi: any;
  rowData: any[] = [];
  UserName: any;
  frameworkComponents: any;
  tooltipShowDelay: any;
  delId: number = 0;
  modalTitle: string = " Create New";
  btnName: string = "Save";
  ObjUserPageRight = new UserPageRight();
  Save: any;
  ReportNameId: number = 0;
  
 

  constructor(private modalService: NgbModal, private _Commonservices: CommonService,
    private _StockMasterService: StockMasterService, private _PurchaseOrderService: PurchaseOrderService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private loader: NgxSpinnerService,) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      deletebuttonRenderer: DeleteButtonRendererComponent
    }
  }

  ngOnInit(): void {
    this.isShownList = true;
    this.model.SearchStockName = "";
    this.getCompanydetail();
    this.getUserDetail();
    this.fnBindGrid();
   this.GetUserPageRight(this.ReportNameId)
    
  }
  getCompanydetail() {
    let objCompanyModel = new CompanyModel();
    objCompanyModel = this._Commonservices.GetCompanySession();
    this.CompanyId = objCompanyModel.Company_Id;
  }

  getUserDetail() {
    let objUserModel = new UserModel();
    objUserModel = this._Commonservices.GetUserSession();
    this.UserId = objUserModel.User_Id;
  }

  fnBindGrid() {
    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.openEditPopupForm.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      {
        headerName: 'Delete',
        cellRenderer: 'deletebuttonRenderer',
        cellRendererParams: {
          onClick: this.openDeletePopup.bind(this),
          label: 'delete'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      { headerName: 'Report Name', field: 'StockName', width: 180, sortable: true, filter: true, },
      { headerName: 'Created By', field: 'CreatedBy', width: 180, resizable: true, filter: true, },
      { headerName: 'Created On', field: 'CreatedOn', width: 180, sortable: true, filter: true, },
      { headerName: 'Modify By', field: 'ModifiedBy', width: 180, sortable: true, filter: true, },
      { headerName: 'Modify On', field: 'ModifiedOn', width: 180, sortable: true, filter: true, }
    ];
    this.multiSortKey = 'ctrl';
    //this.loadingTemplate = `<span class="ag-overlay-loading-center">loading...</span>`;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.rowData = this.rowData;
  }

  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.ReportMaster).subscribe(data => {
      if (data.Status == 1) {
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
        this.ObjUserPageRight.IsDelete = data.Data[0].IsDelete;
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

  //by: vishal function for open popup model
  openSaveModelPopUp() {
    jQuery('#ConfirmSaveUpdate').modal('show');
  }

  createNew() {
    this.model.hiddenId = 0;
    this.model.StockName = "";
    this.openSaveModelPopUp();
    this.cancelValidation();
    this.modalTitle = "Create New";
    this.btnName = "Save"
  }

  addUpdateStockName() {
    if (this.validationBasic() == 1) {
      return false;
    }
    this.loader.show();
    try {
      let objStockModel = new StockMasterModel();
      objStockModel.Id = this.model.hiddenId;
      objStockModel.UserId = this.UserId;
      objStockModel.CompanyId = this.CompanyId;
      objStockModel.StockName = this.model.StockName;

      if (objStockModel.Id > 0) {
        objStockModel.Flag = "update";
      } else {
        objStockModel.Flag = "new";
      }
      this._StockMasterService.AddUpdateStockMaster(objStockModel).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#ConfirmSaveUpdate').modal('hide');
          Swal.fire('', data.Remarks, 'success')
          setTimeout(() => {
            this.loader.hide()
          }, 500);
          this.getStockReportList('search')
        } else {
          Swal.fire('', data.Remarks, 'error');
          this.loader.hide()
        }
      });
    } catch (Error) {

      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "addUpdateStockName";
      objWebErrorLogModel.ErrorPage = "StockMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

  }

  getStockReportList(para: string) {
    this.loader.show();
    try {
      let objSearchPara = new StockMasterModel();
      objSearchPara.CompanyId = this.CompanyId;
      //objSearchPara.StockName = this.model.SearchStockName != "0" ? this.model.SearchStockName : "0";
      objSearchPara.StockName = this.model.SearchStockName;
      objSearchPara.Flag = "search";

      this._StockMasterService.GetStockReportList(objSearchPara).subscribe(data => {
        this.loader.hide();
        if (data.Status == 1) {

          if (para == "search") {
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = []
            }
          } else if (para == "export") {
            if (data.Data != null) {
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'StockReportName');
            }
          }
        } else if (data.Status == 2) {
          this.loader.hide();
        
          this.rowData = []
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "getStockReportList", "StockMaster");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "getStockReportList", "StockMaster");
    }
  }
  openEditPopupForm(e) {
    this.cancelValidation();
    this.openSaveModelPopUp();
    this.ReportNameId = e.rowData.Id;
    this.GetUserPageRight(this.ReportNameId);
    this.editStockReportDetail(this.ReportNameId);
    if (this.ReportNameId !=0 || this.ReportNameId!= null) {
      this.modalTitle = "Edit Report Name";
      this.btnName = "Update"
    } 
  }
  editStockReportDetail(Id: any) {
    try {
      let objModel = new StockMasterModel();
      objModel.Id = Id;
      objModel.Flag = "searchbyId";
      this._StockMasterService.EditStockReportDetail(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          this.model.hiddenId = data.Data[0].Id;
          this.model.StockName = data.Data[0].StockName;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "editStockReportDetail", "StockMaster");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "editStockReportDetail", "StockMaster");
    }
  }

  openDeletePopup(e) {
    jQuery('#ConfirmDelete').modal('show');
    this.delId = e.rowData.Id
  }

  deleteStockReportDetail(Id: any) {
    this.loader.show();
    Id = this.delId
    jQuery('#ConfirmDelete').modal('hide');
    let objModel = new StockMasterModel();
    objModel.Id = Id;
    objModel.UserId= this.UserId;
    objModel.Flag = "delete";
    this._StockMasterService.AddUpdateStockMaster(objModel).subscribe(data => {
      if (data.Status == 1) {
        Swal.fire('Deleted', data.Remarks, 'success')
        setTimeout(() => {
          this.loader.hide()
        }, 500);
        this.getStockReportList('search')
      }
    });
  }
  //by: vishal, 02/03/2023, validation for create new stock name
  validationBasic() {
    let flag = 0;
    if (this._Commonservices.checkUndefined(this.model.StockName) == "") {
      $('#txtStockName').css('border-color', 'red')
      $('#txtStockName').focus();
      flag = 1;
    } else {
      $("#txtStockName").css('border-color', '')
    }
    return flag;
  }

  cancelValidation() {
    $("#txtStockName").css('border-color', '');

  }

  

  
}
