import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoWidthCalculator } from 'ag-grid-community';
import { param } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { stringify } from 'querystring';
import { audit, first } from 'rxjs/operators';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { DeleteButtonRendererComponent } from 'src/app/renderer/delete-button-renderer.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { PoConfigSeriesService } from 'src/app/Service/po-config-service.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { StockMasterService } from 'src/app/Service/stock-master.service';
import { MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { StockMasterModel } from 'src/app/_Model/MastersModel';
import { PODropDownModel, PoSearchModel, PoSeriesDetailModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel, UserModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare var jQuery: any;
@Component({
  selector: 'app-po-config',
  templateUrl: './po-config.component.html',
  styleUrls: ['./po-config.component.sass']
})
export class PoConfigComponent implements OnInit {

  model: any = {};
  public isShownList: boolean; // Grid List
  @ViewChild("content") modalContent: TemplateRef<any>;
  closeResult: string;
  CompanyId: any;
  PODropDownClass: PODropDownModel = new PODropDownModel();
  UserId: any;
  UserName: any;
  frameworkComponents: any;
  tooltipShowDelay: any;
  public multiSortKey: string;
  public MultidropdownSettings = {};
  public columnDefs = [];
  //public loadingTemplate;
  rowData: any[] = [];
  delId: any;
  gridApi: any;
  StockReportNameList: [];
  modalTitle: string = " Create New";
  btnName: string = "Save"
  ObjUserPageRight = new UserPageRight();
  Save: any;
  PoConfigId: number = 0;
 

  constructor(private modalService: NgbModal, private _PurchaseOrderService: PurchaseOrderService,
    private _Commonservices: CommonService, private loader: NgxSpinnerService,
    private _Poconfigservice: PoConfigSeriesService, private _StockMasterService: StockMasterService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,) {
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
    this.clearSearchFilter();
    this.getCompanydetail();
    this.getUserDetail();
    this.fnBindCustomerEMIExpenseAndCategoryDropDown();
    this.fnBindGrid();
    this.fnBindStockReportNameDropDown();
    this.GetUserPageRight(this.PoConfigId)
  }

  clearSearchFilter() {
    this.model.SearchCustomerId = 0;
    this.model.SearchEMITypeId = 0;
    this.model.SearchPoCategoryId = 0;
    this.model.SearchExpenseTypeId = 0;
    this.model.SearchReportNameId = 0
    this.model.SearchMakePOSeries = "";
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
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.PoConfig).subscribe(data => {
      if (data.Status == 1) {
        console.log(data);
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

  fnBindCustomerEMIExpenseAndCategoryDropDown() {
    let objPOSModel = new PoSearchModel();
    objPOSModel.CompanyId = this.CompanyId;
    objPOSModel.UserId = this.UserId;
    this._PurchaseOrderService.GetPOSeriesRelatedMasterData(objPOSModel).subscribe(st => {
      if (st.Status == 1) {
        let objPO = new PODropDownModel();
        objPO.ClientList = st.ClientList;
        objPO.EMIList = st.EMIList;
        objPO.ExpenseTypeList = st.ExpenseTypeList;
        objPO.POCategoryList = st.POCategoryList;
        this.PODropDownClass = objPO;
      }
    });
  }

  fnBindStockReportNameDropDown() {
    let objStockReportModel = new StockMasterModel();
    objStockReportModel.CompanyId = this.CompanyId;
    objStockReportModel.UserId = this.UserId;
    objStockReportModel.Flag = 'search'
    this._StockMasterService.GetStockReportList(objStockReportModel).subscribe(data => {
      if (data.Status == 1) {
        this.StockReportNameList = data.Data;
      }
    });
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
      { headerName: 'Customer', field: 'Customer', width: 150, sortable: true, filter: true, },
      { headerName: 'EMI Type', field: 'EMIType', width: 130, filter: true, },
      { headerName: 'Expense Type', field: 'ExpenseType', width: 180, sortable: true, filter: true, },
      { headerName: 'Category Name', field: 'CategoryName', width: 180, sortable: true, filter: true, },
      { headerName: 'Report Name', field: 'ReportName', width: 180, sortable: true, filter: true, },
      { headerName: 'PO Series', field: 'Series', width: 180, sortable: true, filter: true, }
    ];
    this.multiSortKey = 'ctrl';
    //this.loadingTemplate = `<span class="ag-overlay-loading-center">loading...</span>`;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.rowData = this.rowData;
  }

  createNew() {
    this.clearPoCinfigForm();
    this.openSaveModelPopUp();
    this.cancelValidation();
     this.modalTitle = "Create New";
    this.btnName = "Save"
  }

  clearPoCinfigForm() {
    this.model.hiddenId = 0;
    this.model.CustomerId = 0
    this.model.EMITypeId = 0;
    this.model.PoCategoryId = 0;
    this.model.ExpenseTypeId = 0;
    this.model.ReportNameId = 0;
    this.model.MakePOSeries = "";
  }

  //by: vishal function for open popup model
  openSaveModelPopUp() {
    jQuery('#ConfirmSaveUpdate').modal('show');
  }

  //By: Vishal, 02/03/2023, desc: function for save update PO series detail.
  addUpdatePoSeriesDetail() {
    if (this.validationBasic() == 1) {
      return false;
    }
    this.loader.show();
    try {
      let objPoSeriesModel = new PoSeriesDetailModel();
      objPoSeriesModel.Id = this.model.hiddenId;
      objPoSeriesModel.UserId = this.UserId;
      objPoSeriesModel.CompanyId = this.CompanyId;
      objPoSeriesModel.CustomerId = this.model.CustomerId;
      objPoSeriesModel.EMITypeId = this.model.EMITypeId;
      objPoSeriesModel.ExpenseTypeId = this.model.ExpenseTypeId;
      objPoSeriesModel.PoCategoryId = this.model.PoCategoryId;
      objPoSeriesModel.ReportNameId = this.model.ReportNameId;
      objPoSeriesModel.MakePOSeries = this.model.MakePOSeries;
      if (objPoSeriesModel.Id > 0) {
        objPoSeriesModel.Flag = "update";
      } else {
        objPoSeriesModel.Flag = "new";
      }

      //let jsonstr = JSON.stringify(objPoSeriesModel);
      //console.log(jsonstr);

      this._Poconfigservice.AddUpdatePoSeriesDetail(objPoSeriesModel).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#ConfirmSaveUpdate').modal('hide');
          Swal.fire('', data.Remarks, 'success')
          setTimeout(() => {
            this.loader.hide()
          }, 500);
          this.getPoSeriesConfigList('search')
        } else {
          Swal.fire('', data.Remarks, 'error');
          this.loader.hide()
        }
      });
    } catch (Error) {

      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "addUpdatePoSeriesDetail";
      objWebErrorLogModel.ErrorPage = "PoConfig";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  //by: vishal, 04/03/2023, function for grid  data

  getPoSeriesConfigList(para: string) {
    //this.gridApi.showLoadingOverlay();
    this.loader.show();
    try {
      let objSearchPara = new PoSeriesDetailModel();
      objSearchPara.CompanyId = this.CompanyId;
      objSearchPara.CustomerId = this.model.SearchCustomerId;
      objSearchPara.EMITypeId = this.model.SearchEMITypeId;
      objSearchPara.ExpenseTypeId = this.model.SearchExpenseTypeId;
      objSearchPara.PoCategoryId = this.model.SearchPoCategoryId;
      objSearchPara.ReportNameId = this.model.SearchReportNameId;
      objSearchPara.MakePOSeries = this.model.SearchMakePOSeries;
      objSearchPara.Flag = "search";

      this._Poconfigservice.GetPoSeriesConfigList(objSearchPara).subscribe(data => {
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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'PoSeries');
            }
          }
        } else if (data.Status == 2) {
          this.loader.hide();
          this.rowData = []
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "getPoSeriesConfigList", "PoConfig");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "getPoSeriesConfigList", "PoConfig");
    }
  }


  //by: vishal, 06/03/2023, function for edit list data

  openEditPopupForm(e) {
    this.cancelValidation();
    this.openSaveModelPopUp();
    this.PoConfigId = e.rowData.Id;
    this.GetUserPageRight(this.PoConfigId);
    this.editPoSeriesConfigDetail(this.PoConfigId);
    if (this.PoConfigId !=0 || this.PoConfigId!= null) {
      this.modalTitle = "Edit PO Config";
      this.btnName = "Update"
    } 
  }

  editPoSeriesConfigDetail(Id: any) {
    try {
      let objModel = new PoSeriesDetailModel();
      objModel.Id = Id;
      objModel.CompanyId = this.CompanyId;
      objModel.Flag = "search";
      this._Poconfigservice.EditPoSeriesConfigDetail(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          this.model.hiddenId = data.Data[0].Id;
          this.model.CustomerId = data.Data[0].CustomerId;
          this.model.EMITypeId = data.Data[0].EMITypeId;
          this.model.ExpenseTypeId = data.Data[0].ExpenseTypeId;
          this.model.PoCategoryId = data.Data[0].CategoryId;
          this.model.ReportNameId = data.Data[0].ReportNameId;
          this.model.MakePOSeries = data.Data[0].Series;
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "EditPoSeriesConfigDetail", "PoConfig");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "EditPoSeriesConfigDetail", "PoConfig");
    }
  }
  //by: vishal, 07/03/2023, function for delete list data

  openDeletePopup(e) {
    jQuery('#ConfirmDelete').modal('show');
    this.delId = e.rowData.Id
  }

  deletePoSeriesConfigDetail(Id: any) {
    this.loader.show();
    Id = this.delId
    jQuery('#ConfirmDelete').modal('hide');
    let objPoSeriesModel = new PoSeriesDetailModel();
    objPoSeriesModel.Id = Id;
    objPoSeriesModel.Flag = "delete";
    this._Poconfigservice.AddUpdatePoSeriesDetail(objPoSeriesModel).subscribe(data => {
      if (data.Status == 1) {
        Swal.fire('Deleted', data.Remarks, 'success')
        //alert(data.Remarks);

        setTimeout(() => {
          this.loader.hide()
        }, 500);
        this.getPoSeriesConfigList('search')
      }
    });
  }

  //by: vishal, 02/03/2023, validation for create new PO Series
  validationBasic() {
    let flag = 0;

    if (this._Commonservices.checkUndefined(this.model.CustomerId) == 0) {
      $('#ddlCustmerId').css('border-color', 'red')
      $('#ddlCustmerId').focus();
      flag = 1;
    } else {
      $("#ddlCustmerId").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.model.EMITypeId) == 0) {
      $('#ddlEMIType').css('border-color', 'red')
      $('#ddlEMIType').focus();
      flag = 1;
    } else {
      $("#ddlEMIType").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.model.PoCategoryId) == 0) {
      $('#ddlPoCategory').css('border-color', 'red')
      $('#ddlPoCategory').focus();
      flag = 1;
    } else {
      $("#ddlPoCategory").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.model.ExpenseTypeId) == 0) {
      $('#ddlExpenseType').css('border-color', 'red')
      $('#ddlExpenseType').focus();
      flag = 1;
    } else {
      $("#ddlExpenseType").css('border-color', '')
    }
    if (this._Commonservices.checkUndefined(this.model.ReportNameId) == 0) {
      $('#ddlReportName').css('border-color', 'red')
      $('#ddlReportName').focus();
      flag = 1;
    } else {
      $("#ddlReportName").css('border-color', '')
    }
    if (this._Commonservices.checkUndefined(this.model.MakePOSeries) == "") {
      $('#txtPoSeries').css('border-color', 'red')
      $('#txtPoSeries').focus();
      flag = 1;
    } else {
      $("#txtPoSeries").css('border-color', '')
    }
    return flag;
  }

  cancelValidation() {
    $("#ddlCustmerId").css('border-color', '');
    $("#ddlEMIType").css('border-color', '');
    $("#ddlPoCategory").css('border-color', '')
    $("#ddlExpenseType").css('border-color', '')
    $("#ddlReportName").css('border-color', '')
    $("#txtPoSeries").css('border-color', '')

  }
}



