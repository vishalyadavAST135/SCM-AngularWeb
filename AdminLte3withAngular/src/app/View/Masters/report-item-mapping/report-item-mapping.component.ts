import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { DeleteButtonRendererComponent } from 'src/app/renderer/delete-button-renderer.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { ReportItemNameMappingService } from 'src/app/Service/report-item-mapping.service';
import { StockMasterService } from 'src/app/Service/stock-master.service';
import { CompanyStateVendorItemModel, DropdownModel, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { ReportItemMappingModel, StockMasterModel } from 'src/app/_Model/MastersModel';
import { CompanyModel, UserModel } from 'src/app/_Model/userModel';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var jQuery: any;

@Component({
  selector: 'app-report-item-mapping',
  templateUrl: './report-item-mapping.component.html',
  styleUrls: ['./report-item-mapping.component.sass']
})
export class ReportItemMappingComponent implements OnInit {

  model: any = {};
  CompanyId: any;
  UserId: any;
  StockReportNameList: any[] = [];
  POCategoryList: any[] = [];
  SearchPOCategoryList: any[] = [];

  apiCSVIData: any = {};
  ItemClassList: any;
  ItemNameList: any[] = [];
  public MultidropdownSettings = {};
  public SingledropdownSettings = {};
  SelectedItemNameList: any[] = [];
  public isShownEdit: boolean; // Form Edit
  public isShownList: boolean; // Grid List
  rowData: any[] = [];
  UserName: any;
  frameworkComponents: any;
  tooltipShowDelay: any;
  public multiSortKey: string;
  public columnDefs = [];
  gridApi: any;
  public isEditable: boolean;
  delId: any;

  constructor(private modalService: NgbModal, private _StockMasterService: StockMasterService,
    private _Commonservices: CommonService, private _PurchaseOrderService: PurchaseOrderService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private _MasterService: MasterservicesService, private loader: NgxSpinnerService,
    private _ReportItemService: ReportItemNameMappingService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent,
      deletebuttonRenderer: DeleteButtonRendererComponent
    }
  }

  ngOnInit(): void {
    this.getCompanydetail();
    this.getUserDetail();
    // get report name list.
    this.fnBindStockReportNameDropDown();
    // get item class list.
    this.bindCompanyStateVendorItem();
    // clear search panel.
    this.clearSearchFilter();
    //get grid data
    this.fnBindGrid();
    this.isShownList = false;
    this.isShownEdit = true;

    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1
    };

  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.rowData = this.rowData;
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

  async bindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.ItemClassArray = this.apiCSVIData.ItemClassArray;
      //this.ItemNameList = objCSVTdata.ItemArray;
      this.ItemClassList = objCSVTdata.ItemClassArray;
    }
  }

  fnBindGrid() {
    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.openEditForm.bind(this),
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
      { headerName: 'Report Name', field: 'ReportName', width: 180, sortable: true, filter: true, },
      { headerName: 'Category Name', field: 'CategoryName', width: 180, sortable: true, filter: true, },
      { headerName: 'Item Class', field: 'ItemClass', width: 180, sortable: true, filter: true, },
      { headerName: 'Item Name', field: 'ItemName', width: 180, sortable: true, filter: true, },
      { headerName: 'Created By', field: 'CreatedBy', width: 180, sortable: true, filter: true, },
      { headerName: 'Created On', field: 'CreatedOn', width: 180, sortable: true, filter: true, },


    ];
    this.multiSortKey = 'ctrl';
  }

  async ChangeReportName(ReportMaster_Id: any) {
    this.POCategoryList = [];
    this.model.PoCategoryId = 0;
    try {
      let objParameter = new DropdownModel();
      objParameter.User_Id = this.UserId;
      objParameter.Parent_Id = ReportMaster_Id;
      objParameter.Other_Id = "0";
      objParameter.Company_Id = this.CompanyId;
      objParameter.Flag = "POCategorybyreptId";
      await this._Commonservices.getdropdown2(objParameter).then((data: any) => {
        debugger
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.POCategoryList = data.Data;
          }
        }
      });
    } catch (Error) {
      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "getdropdown";
      objWebErrorLogModel.ErrorPage = "ReportItemNameMapping";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  ChangeSearchReportName(SearchReportNameId: any) {
    this.SearchPOCategoryList = [];
    this.model.SearchPoCategoryId = 0;
    try {
      let objParameter = new DropdownModel();
      objParameter.User_Id = this.UserId;
      objParameter.Parent_Id = SearchReportNameId;
      objParameter.Other_Id = "0";
      objParameter.Company_Id = this.CompanyId;
      objParameter.Flag = "POCategorybyreptId";
      this._Commonservices.getdropdown(objParameter).subscribe(data => {
        debugger
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.SearchPOCategoryList = data.Data;
          }
        }
      });
    } catch (Error) {
      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "getdropdown";
      objWebErrorLogModel.ErrorPage = "ReportItemNameMapping";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }


  async onChangeItemClass(itemClassId: string) {
    this.ItemNameList = [];
    this.SelectedItemNameList = [];
    let objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = itemClassId;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'ItemName';
    await this._Commonservices.getdropdown2(objdropdownmodel).then((item: any) => {
      debugger
      this.ItemNameList = item.Data;
    });
  }


  createNew() {
    this.clearNewMappingForm();
    this.cancelValidation()
    this.isShownEdit = false;
    this.isShownList = true;
  }

  BackPage() {
    this.isShownList = false;
    this.isShownEdit = true;
    this.cancelValidation()
  }

  clearNewMappingForm() {
    this.model.hiddenId = 0;
    this.model.ReportNameId = 0;
    this.model.PoCategoryId = 0;
    this.model.ItemClassId = 0;
    this.SelectedItemNameList = []
  }

  clearSearchFilter() {
    this.model.SearchReportNameId = 0
    this.model.SearchPoCategoryId = 0;
  }

  /// Create by : Vishal, CreatedDate: 17/03/2023
  /// Descriiption : This function used for  save report-item mapping details. 
  addUpdateReportMappingDetail() {
    if (this.validationBasic() == 1) {
      return false;
    }
    this.loader.show();
    try {
      let objReportModel = new ReportItemMappingModel();
      objReportModel.Id = this.model.hiddenId;
      objReportModel.UserId = this.UserId;
      objReportModel.CompanyId = this.CompanyId;
      objReportModel.ReportNameId = this.model.ReportNameId;
      objReportModel.PoCategoryId = this.model.PoCategoryId;
      objReportModel.ItemClassId = this.model.ItemClassId;
      objReportModel.ItemNameId = this.SelectedItemNameList.map(function (val) {
        return val.id;
      }).join(',');
      // if (objReportModel.Id > 0) {
      //   objReportModel.Flag = "update";
      // } else {
      //   objReportModel.Flag = "new";
      // }
      // let jsonstr = JSON.stringify(objReportModel);
      // console.log(jsonstr);

      this._ReportItemService.AddUpdateReportMappingDetail(objReportModel).subscribe(data => {
        if (data.Status == 1) {
          jQuery('#ConfirmSaveUpdate').modal('hide');
          Swal.fire('', data.Remarks, 'success')
          setTimeout(() => {
            this.loader.hide()
          }, 500);
          this.clearNewMappingForm()

        } else {
          Swal.fire(data.Remarks);
        }
      });
    } catch (Error) {

      let objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "addUpdateReportMappingDetail";
      objWebErrorLogModel.ErrorPage = "ReportMapping";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  //by: vishal, 21/03/2023, function for grid  data

  getReportAndItemMappingList(para: string) {
    this.loader.show();
    try {
      let objSearchPara = new ReportItemMappingModel();
      objSearchPara.CompanyId = this.CompanyId;
      objSearchPara.PoCategoryId = this.model.SearchPoCategoryId != 0 ? this.model.SearchPoCategoryId : "";
      objSearchPara.ReportNameId = this.model.SearchReportNameId != 0 ? this.model.SearchReportNameId : "";
      objSearchPara.Flag = "search";

      this._ReportItemService.GetReportItemMappedList(objSearchPara).subscribe(data => {
        debugger
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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'ReportAndItemMapping');
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

  openEditForm(e) {
    this.editReportAndItemMappingDetail(e.rowData.Id);
    this.isShownList = true;
    this.isShownEdit = false;
  }

  editReportAndItemMappingDetail(Id: any) {
    try {
      this.clearNewMappingForm();
      let objModel = new ReportItemMappingModel();
      objModel.Id = Id;
      objModel.CompanyId = this.CompanyId;
      objModel.Flag = "search";
      this._ReportItemService.GetReportItemMappedList(objModel).pipe(first()).subscribe(async data => {
        if (data.Status == 1) {
          this.model.hiddenId = data.Data[0].Id;
          this.model.ReportNameId = data.Data[0].ReportNameId;
          await this.ChangeReportName(data.Data[0].ReportNameId)
          this.model.PoCategoryId = data.Data[0].CategoryId;
          this.model.ItemClassId = data.Data[0].ItemClassId;
          await this.onChangeItemClass(data.Data[0].ItemClassId);
          this.SelectedItemNameList = JSON.parse(data.Data[0].ItemList);
        }
      }, error => {
        this._Commonservices.ErrorFunction(this.UserName, error.message, "editReportAndItemMappingDetail", "ReportItemMapping");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction(this.UserName, Error.message, "editReportAndItemMappingDetail", "ReportItemMapping");
    }
  }

  //by: vishal, 21/03/2023, function for delete list data

  openDeletePopup(e) {
    jQuery('#ConfirmDelete').modal('show');
    this.delId = e.rowData.Id
  }

  deleteReportItemMappingDetail(Id: any) {
    this.loader.show();
    Id = this.delId
    jQuery('#ConfirmDelete').modal('hide');
    let objModel = new ReportItemMappingModel();
    objModel.Id = Id;
    objModel.Flag = "delete";
    this._ReportItemService.AddUpdateReportMappingDetail(objModel).subscribe(data => {
      if (data.Status == 1) {
        Swal.fire('Deleted', data.Remarks, 'success')

        setTimeout(() => {
          this.loader.hide()
        }, 500);
        this.getReportAndItemMappingList('search')
      }
    });
  }
  //by: vishal, 21/03/2023, validation for create new PO Series
  validationBasic() {
    let flag = 0;

    if (this._Commonservices.checkUndefined(this.model.PoCategoryId) == 0) {
      $('#ddlPoCategory').css('border-color', 'red')
      $('#ddlPoCategory').focus();
      flag = 1;
    } else {
      $("#ddlPoCategory").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.model.ReportNameId) == 0) {
      $('#ddlReportName').css('border-color', 'red')
      $('#ddlReportName').focus();
      flag = 1;
    } else {
      $("#ddlReportName").css('border-color', '')
    }

    if (this._Commonservices.checkUndefined(this.model.ItemClassId) == 0) {
      $('#ddlItemClass').css('border-color', 'red')
      $('#ddlItemClass').focus();
      flag = 1;
    } else {
      $("#ddlItemClass").css('border-color', '')
    }

    if (this.SelectedItemNameList.length == 0) {
      $('#ddlItemName').css('border-color', 'red')
      $('#ddlItemName').focus();
      flag = 1;
      alert("Please entry mandatory field.");
    } else {
      $("#ddlItemName").css('border-color', '')
    }

    return flag;

  }
  cancelValidation() {

    $("#ddlPoCategory").css('border-color', '')
    $("#ddlReportName").css('border-color', '')
    $("#ddlItemClass").css('border-color', '')

  }



}
