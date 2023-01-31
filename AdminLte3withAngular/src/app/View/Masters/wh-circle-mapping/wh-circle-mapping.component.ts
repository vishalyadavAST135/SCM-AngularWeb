
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CommonSearchPanelModel, CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { SearchWHCircleMappingModel, WHCircleMappingModel } from 'src/app/_Model/MastersModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';


@Component({
  selector: 'wh-circle-mapping',
  templateUrl: './wh-circle-mapping.component.html',
  styleUrls: ['./wh-circle-mapping.component.sass']
})
export class WhCircleMappingComponent implements OnInit {
  public isShownList: boolean; // Grid List
  public MultidropdownSettings = {};
  public SingledropdownSettings = {};

  UserId: any;
  CompanyId: any;

  SearchWHList: any = [];
  SearchCircleList = [];

  rowData = [];
  public columnDefs = [];
  frameworkComponents: any;
  tooltipShowDelay: any;
  public multiSortKey: string;

  apiCSVIData: any = {};

  dropdownList = [];
  dropdownSettings = {};
  searchMappingModel: SearchWHCircleMappingModel = { WHId: "0", CircleId: "0", SelectedCircleList: [], CompanyId: 0, Flag: '' };
  mappingModel: WHCircleMappingModel = { UserId: 0, WHId: 0, CircleId: "0", SelectedCircleList: [] };

  @ViewChild("content") modalContent: TemplateRef<any>;
  closeResult: string;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  WHId: number = 0;

  constructor(private _Commonservices: CommonService,
    private router: Router, private _MasterService: MasterservicesService,
    private _PurchaseOrderService: PurchaseOrderService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private SearchPanel: SearchpanelService,
    private modalService: NgbModal,) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent
    }

  }

  ngOnInit(): void {
    this.isShownList = true;
    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };

    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    //grid
    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowCircleMappingDeatil.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      { headerName: 'WH Name', field: 'WHName', width: 400, sortable: true, filter: true, },
      { headerName: 'Circle Name', field: 'CircleName', width: 400, sortable: true, filter: true, },
      { headerName: 'Created By', field: 'CreatedBy', width: 400, sortable: true, filter: true, }
    ];
    this.multiSortKey = 'ctrl';

    this.BindAllWhList();
    this.BindCompanyStateVendorItem();
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.WHId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.WhCircleMapping).subscribe(data => {
      if (data.Status == 1) {
        console.log(data);
        this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
        this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
        this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
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


  /// Create by : Vishal, CreatedDate: 12/09/2022
  /// Descriiption : This function used for  bind Wh Name List.
  BindAllWhList() {
    debugger
    try {
      var objParameter = new DropdownModel();
      objParameter.User_Id = this.UserId;
      objParameter.Parent_Id = "";
      objParameter.Other_Id = "";
      objParameter.Company_Id = this.CompanyId;
      objParameter.Flag = "WHMasterByCompany";
      this._Commonservices.getdropdown(objParameter).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.SearchWHList = data.Data;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "BindAllWhList";
      objWebErrorLogModel.ErrorPage = "WhCircleMapping";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }
  /// Create by : Vishal, CreatedDate: 12/09/2022
  /// Descriiption : This function used for  bind Wh Circle List.
  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CircleArray = this.apiCSVIData.CircleArray;
      this.SearchCircleList = objCSVTdata.CircleArray;

    }
  }

  /// Create by : Vishal, CreatedDate: 12/09/2022
  /// Descriiption : This function used for  search Wh Circle List.
  onClickSearchCircle(para: string) {
    this.searchMappingModel.CircleId = '0'
    if (para == "DelAll") {
      this.searchMappingModel.SelectedCircleList = [];
    } else if (this.searchMappingModel.SelectedCircleList.length > 0) {
      this.searchMappingModel.CircleId = this.searchMappingModel.SelectedCircleList.map(xx => xx.id).join(',');;
    }
  }
  /// Create by : Vishal, CreatedDate: 13/09/2022
  /// Descriiption : This function used on model popup for Wh Circle List.
  onClickCircle(para: string) {
    this.mappingModel.CircleId = ''
    if (para == "DelAll") {
      this.mappingModel.SelectedCircleList = [];
    } else if (this.mappingModel.SelectedCircleList.length > 0) {
      this.mappingModel.CircleId = this.mappingModel.SelectedCircleList.map(xx => xx.id).join(',');;
    }
  }

  onGridReady(params) {
  }

  /// Create by : Vishal, CreatedDate: 13/09/2022
  /// Descriiption : This function used for new WHCircleMapping.
  CreateNew() {
    this.ClearForm();
    this.ConfirmmationClick();
  }

  /// Create by : Vishal, CreatedDate: 13/09/2022
  /// Descriiption : This function used for model pop.
  ConfirmmationClick() {
    var y = 'Cross click'
    this.getDismissReason(y);
    this.modalService.open(this.modalContent,
      {
        size: <any>'sm',
        ariaLabelledBy: 'modal-basic-title',
        backdrop: "static"
      }).result.then((result) => {
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
  /// Create by : Vishal, CreatedDate: 12/09/2022
  /// Descriiption : This function used for  save circle mapping details. 
  AddUpdateWhCircleMasterDetail() {

    try {

      if (this.ValidationBasic() == 1) {
        return false;
      }
      this.mappingModel.UserId = this.UserId;
      this._MasterService.AddUpdateWhCircleMasterDetail(this.mappingModel).subscribe(data => {
        if (data.Status == 1) {
          setTimeout(() => {
            alert('your data has been save successfully ')
          }, 300);

          this.ClearForm();

        } else {
          setTimeout(() => {
            alert('Please try again')
          }, 300);

        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "AddUpdateWhCircleMasterDetial";
      objWebErrorLogModel.ErrorPage = "WHCircleMapping";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
  }

  /// Create by : Vishal, CreatedDate: 13/09/2022
  /// Descriiption : This function used for  edit grid list.
  ShowCircleMappingDeatil(e) {
    this.WHId = e.rowData.WHId;
    this.GetUserPageRight(this.WHId);
    this.searchMappingModel.WHId = e.rowData.WHId;
    this.searchMappingModel.Flag = "Edit";
    this._MasterService.GetWHCircleMappingList(this.searchMappingModel).subscribe(data => {
      if (data.Status == 1) {
        this.searchMappingModel.WHId = '0';
        this.searchMappingModel.Flag = "";

        this.ClearForm();
        this.ConfirmmationClick();
        this.mappingModel.WHId = data.Data[0].WHId;
        this.mappingModel.SelectedCircleList = JSON.parse(data.Data[0].CircleList);
      }
    });
  }

  /// Create by : Vishal, CreatedDate: 12/09/2022
  /// Descriiption : This function used for  search  Wh Circle List.
  GetWHCircleMappingList(para: string) {
    try {
      this.searchMappingModel.CompanyId = this.CompanyId;
      this.searchMappingModel.Flag = para;

      this._MasterService.GetWHCircleMappingList(this.searchMappingModel).subscribe(data => {
        if (data.Status == 1) {
          if (para == "List") {
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null;
            }
          }
          if (para == 'Export') {
            if (data.Data != null) {
              this._PurchaseOrderService.exportAsExcelFile(data.Data, '');
            } else {
            }
          }
        } else {
          alert("Please try again.");
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "Master/GetWHCircleMappingList";
      objWebErrorLogModel.ErrorPage = "WhCircleMapping";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }

  /// Create by : Vishal, CreatedDate: 13/09/2022
  /// Descriiption : This function used for clear dropdown form value.
  ClearForm() {
    this.mappingModel.WHId = 0;
    this.mappingModel.CircleId = "0"
    this.mappingModel.SelectedCircleList = [];
  }

  /// Create by : Vishal, CreatedDate: 13/09/2022
  /// Descriiption : This function used for validation on popup model.
  ValidationBasic() {
    var flag = 0;
    if (this._Commonservices.checkUndefined(this.mappingModel.WHId) == "") {
      $('#ddlWhName').css('border-color', 'red')
      $('#ddlWhName').focus();
      flag = 1;
    } else {
      $("#ddlWhName").css('border-color', '')
    }

    if (this.mappingModel.SelectedCircleList.length == 0) {
      $('#ddlCircleName').css('border-color', 'red')
      $('#ddlCircleName').focus();
      flag = 1;
    } else {
      $("#ddlCircleName").css('border-color', '')
    }

    if (flag == 1) {
      alert("Please entry mandatory field.");
      this.ConfirmmationClick();
    }

    return flag;
  }

}

