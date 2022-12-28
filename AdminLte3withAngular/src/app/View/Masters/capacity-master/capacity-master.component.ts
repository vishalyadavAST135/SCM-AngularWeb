import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CommonSearchPanelModel, CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { CapacityMasterDetail, ItemNameModel } from 'src/app/_Model/MastersModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';
declare var jQuery: any;
@Component({
  selector: 'app-capacity-master',
  templateUrl: './capacity-master.component.html',
  styleUrls: ['./capacity-master.component.sass']
})
export class CapacityMasterComponent implements OnInit {
  model: any = {};
  public multiSortKey: string;
  public MultidropdownSettings = {};
  public columnDefs = [];
  rowData = [];
  CapacityList = [];
  UserId: any;
  StatusData: string;
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  CompanyId: any;
  tooltipShowDelay: any;
  frameworkComponents: any;
  @ViewChild("content") modalContent: any;
  closeResult: string;
  SearchItemClassList: any;
  SearchItemNameList: any;
  SaveItemNameList: any;
  apiCSVIData: any = {};
  public MultidropdownSettings1 = {};
  SearchddlItem = [];
  StatusItem: string;
  SelectedItemClassList: any = [];
  SelectedSearchItemNameList: any = [];
  objCommonSearchPanelModel: CommonSearchPanelModel = {
    Startdate: '',
    Enddate: '',
    State_Id: '',
    MakeId: '',
    ItemCodeId: '',
    CapacityId: '',
    ItemId: '',
    VendorId: '',
    ItemClassId: '',
    WHId: '',
    CustomerId: '',
    DescriptionId: ''
  }
  ObjUserPageRight = new UserPageRight();
  Save: any;
  CapacityId: number = 0;
  constructor(
    private router: Router,
    private _Commonservices: CommonService,
    private _PurchaseOrderService: PurchaseOrderService,
    private Loader: NgxSpinnerService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private modalService: NgbModal,
    private _MasterService: MasterservicesService,
    private SearchPanel: SearchpanelService,) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent
    }
  }

  ngOnInit(): void {
    this.isShownList = true;
    this.isShownEdit = false;
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    try {
      this._MasterService.GetAllItemMakeUnitList().subscribe(data => {
        console.log(data);
        if (data.Status == 1) {
          if (data.ItemData != null && data.ItemData != '') {
            this.SaveItemNameList = data.ItemData;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllItemMakeUnitList";
      objWebErrorLogModel.ErrorPage = "ItemEquipment";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowCapacityMasterDetail.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      { headerName: 'Capacity Name', field: 'CapacityName', sortable: true, filter: true, },
      { headerName: 'Size', field: 'Size', sortable: true, filter: true, },
      { headerName: 'ItemName', field: 'ItemName', resizable: true, filter: true, },
      { headerName: 'Created On', field: 'CreatedOn', resizable: true, filter: true, },
      { headerName: 'Created By', field: 'CreatedBy', resizable: true, filter: true, }
    ];
    this.multiSortKey = 'ctrl';

    this.MultidropdownSettings1 = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };
    this.BindCompanyStateVendorItem();
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.CapacityId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.CapacityMaster).subscribe(data => {
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
  //Brahamjot Kaur 14/June/2022

  //Brahamjot Kaur 14/June/2022
  CreateNew() {
    this.ConfirmmationClick();
    this.ClearItemEquipmentMasterForm();
  }

  ConfirmmationClick() {
    var y = 'Cross click'
    this.getDismissReason(y);
    //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    this.modalService.open(this.modalContent, { size: <any>'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
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

  onGridReady(params) {
  }

  //Brahamjot Kaur 14/June/2022
  AddUpdateCapacityMasterDetail() {
    this.model.UserId = this.UserId;
    this.model.ItemIds = this.model.ItemIds.map(r => r.id).toString();
    this._MasterService.AddUpdateCapacityMasterDetail(this.model).subscribe(data => {
      if (data.Status == 1) {

        setTimeout(() => {
          alert(data.Remarks)
        }, 300);
        this.ClearItemEquipmentMasterForm();


      } else if (data.Status == 2) {
        setTimeout(() => {
          alert(data.Remarks)
        }, 300);
      } else if (data.Status == 3) {
        setTimeout(() => {
          alert(data.Remarks)
        }, 300);
      }
      else if (data.Status == 0) {
        setTimeout(() => {
          alert('Please try again')
        }, 300);
      }
    });
  }

  ClearItemEquipmentMasterForm() {
    this.model.CapacityId = 0;
    this.model.CapacityName = "";
    this.model.ItemIds = [];
    this.model.Size = "";
    this.model.CapacityName.un
  }

  GetAllCapacityMasterList(para: string) {
    debugger
    try {
      var objCapacityMasterDetail = new CapacityMasterDetail();
      objCapacityMasterDetail.CapacityId = 0;
      if (this._Commonservices.checkUndefined(this.model.capacity) == '') {
        objCapacityMasterDetail.CapacityName = '';
      } else {
        objCapacityMasterDetail.CapacityName = this.model.capacity;
      }
      if (this._Commonservices.checkUndefined(this.SelectedSearchItemNameList) == '') {
        objCapacityMasterDetail.ItemIds = '0';
      } else {
        objCapacityMasterDetail.ItemIds = this.SelectedSearchItemNameList.map(r => r.id).toString();
      }
      if (this._Commonservices.checkUndefined(this.SelectedItemClassList) == '') {
        objCapacityMasterDetail.ItemClass = '0';
      } else {
        objCapacityMasterDetail.ItemClass = this.SelectedItemClassList.map(r => r.id).toString();
      }
      objCapacityMasterDetail.Flag = para;
      this._MasterService.GetAllCapacityMasterList(objCapacityMasterDetail).subscribe(data => {
        if (data.Status == 1) {
          if (para == "List") {
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null;
            }
          } else if (para == 'Export') {
            if (data.Data != null) {
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'CapacityMaster');
            }
          }
        } else if (data.Status == 0) {
          alert(data.remarks);
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllCapacityMasterList";
      objWebErrorLogModel.ErrorPage = "CapacityMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);    
    }
  }

  ShowCapacityMasterDetail(e) {
    try {
      this.CapacityId = e.rowData.CapacityId;
      this.GetUserPageRight(this.CapacityId);
      this.ConfirmmationClick();
      var objCapacityMasterDetail = new CapacityMasterDetail();
      objCapacityMasterDetail.CapacityId = parseInt(e.rowData.CapacityId);
      objCapacityMasterDetail.Flag = "Edit";
      this._MasterService.GetAllCapacityMasterList(objCapacityMasterDetail).subscribe(data => {
        if (data.Status == 1) {
          this.model.CapacityId = data.Data[0].CapacityId;
          this.model.CapacityName = data.Data[0].CapacityName;
          this.model.ItemIds = JSON.parse(data.Data[0].ItemList);
          this.model.Size = data.Data[0].Size;
        } else {
          alert("Contact To IT.");
        }
      });

    } catch (Exception) {
      alert("Contact To IT.");
    }
  }

  onSearchCommonDeSelectAll() {
    this.model.ItemIds = [];
  }
  // Brahamjot kaur 27/06/2022
  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    console.log(this.apiCSVIData);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.ItemClassArray = this.apiCSVIData.ItemClassArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.SearchItemClassList = objCSVTdata.ItemClassArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }

  BindSearchItemName(para: string) {
    this.objCommonSearchPanelModel.ItemClassId = '';
    this.objCommonSearchPanelModel.ItemId = '';
    this.SearchItemNameList = [];
    this.SelectedSearchItemNameList = [];
    if (para == "DelAll") {
      this.SelectedItemClassList = [];
    } else if (this.SelectedItemClassList.length > 0) {
      this.objCommonSearchPanelModel.ItemClassId = this.SelectedItemClassList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objCommonSearchPanelModel.ItemClassId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemName';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemNameList = item.Data;
      });
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  BindSearchCapacity(para: string) {
    this.objCommonSearchPanelModel.ItemId = '';
    this.model.capacity = "";
    if (para == "DelAll") {
      this.SelectedSearchItemNameList = [];
    } else if (this.SelectedSearchItemNameList.length > 0) {
      this.objCommonSearchPanelModel.ItemId = this.SelectedSearchItemNameList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objCommonSearchPanelModel.ItemId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'CommonSearchCapacity';
      // this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      //   this.SearchItemCapacityList = item.Data;
      // });
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

}
