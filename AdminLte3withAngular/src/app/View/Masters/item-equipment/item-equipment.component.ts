import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { ItemEquipmentDetail, ItemNameModel, MakeModel } from 'src/app/_Model/MastersModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-item-equipment',
  templateUrl: './item-equipment.component.html',
  styleUrls: ['./item-equipment.component.sass']
})
export class ItemEquipmentComponent implements OnInit {
  model: any = {};
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public MultidropdownSettings = {};
  public MultidropdownSettings1 = {};
  public multiSortKey: string;
  public columnDefs = [];
  rowData = [];
  CompanyData = [];
  SearchItemNameList = [];
  SaveItemNameList = [];
  SearchMakeNameList = [];
  SaveMakeNameList = [];
  SearchUnitNameList = [];
  SaveUnitNameList = [];
  UserId: any;
  CompanyId: any;
  tooltipShowDelay: any;
  frameworkComponents: any;
  ItemAddrowhideshow: boolean;
  closeResult: string;
  Editdata: any;
  SelectedStatusList = [];
  SearchStatusList = [];
  StatusData: string;
  StatusItem: string;
  StatusMake: string;
  StatusUnit: string;
  SearchddlItem = [];
  SearchddlMake = [];
  SearchddlUnit = [];
  IsEditItemCode: boolean = false;

  @ViewChild("content") modalContent: TemplateRef<any>;
  UnitList: any;
  MakeList: any;
  apiCSVIData: any = {};
  SaveddlUnit = [];
  Unitmaster = [];
  CapacityList: any;
  itemName: any;
  ArrayRoleId: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  EquipmentId: number = 0;

  constructor(private router: Router, private _Commonservices: CommonService, private _PurchaseOrderService: PurchaseOrderService,
    private Loader: NgxSpinnerService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService,
    private modalService: NgbModal, private _MasterService: MasterservicesService) {
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
    this.model.ddlItem = "0";
    this.model.ddlMake = "0";
    this.model.ddlConversionUnit = "0";
    this.model.IsConversion = "";
    this.model.SearchddlItem = "0";
    this.model.SearchddlMake = "0";
    this.model.SearchddlUnit = "0";
    this.model.IsActive = "";
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.ArrayRoleId = objUserModel.Role_Id.split(',');
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowItemEquipmentMasterDeatil.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      { headerName: 'Item Name ', field: 'ItemName', width: 120, resizable: true, filter: true, },
      { headerName: 'Capacity', field: 'CapacityName', width: 120, resizable: true, filter: true, },
      { headerName: 'Item Make ', field: 'MakeName', width: 160, resizable: true, filter: true, },
      { headerName: 'Item Unit ', field: 'UnitName', width: 100, resizable: true, filter: true, },
      { headerName: 'Item Code ', field: 'ItemCode', width: 100, resizable: true, filter: true, },
      { headerName: 'Item Specs ', field: 'ItemSpecs', width: 200, resizable: true, filter: true, },
      { headerName: 'Item Description ', field: 'ItemDescription', width: 300, resizable: true, filter: true, },
      { headerName: 'Status', field: 'Status', width: 100 },
      { headerName: 'Created Date', field: 'CreatedDate', width: 100 }
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

    this.MultidropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      badgeShowLimit: 1,
    };

    this.SelectedStatusList = [{
      id: 1,
      itemName: "Active"
    },]

    this.SearchStatusList = [
      {
        id: 1,
        itemName: "Active"
      },
      {
        id: 0,
        itemName: "Deactive"
      }
    ]

    try {
      this._MasterService.GetAllItemMakeUnitList().subscribe(data => {
        if (data.Status == 1) {
          if (data.ItemData != null && data.ItemData != '') {
            this.SearchItemNameList = data.ItemData;
            this.SaveItemNameList = data.ItemData;
          }
          if (data.UnitData != null && data.UnitData != '') {
            this.SearchUnitNameList = data.UnitData;
            // this.SaveUnitNameList = data.UnitData;
          }
          if (data.MakeData != null && data.MakeData != '') {
            this.SearchMakeNameList = data.MakeData;
            // this.SaveMakeNameList = data.MakeData;
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
    this.SearchChangeStatus(event);
    this.BindCompanyStateVendorItem();

    //this.ArrayRoleId.filter()
    //UserRightModel
    this.GetUserPageRight(this.EquipmentId);
  }

  //#region Add new Function Ravinder
  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    console.log(this.apiCSVIData);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      this.CompanyData = objCSVTdata.CompanyArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }

  // brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.ItemList).subscribe(data => {
      //hemant Tyagi
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
  // //#endregion

  onGridReady(params) {
  }

  CreateNew() {
    this.ConfirmmationClick();
    this.model.hiddenEquipmentId = null;
    this.model.hiddenEquipmentId = 0;
    this.IsEditItemCode = false;
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

  AddUpdateItemEquipmentDetial() {
    try {
      if (this.ValidationBasic() == 1) {
        return false;
      }
      var objItemEquipmentDetail = new ItemEquipmentDetail();
      objItemEquipmentDetail.Id = this.model.hiddenEquipmentId;
      objItemEquipmentDetail.UserId = this.UserId;
      objItemEquipmentDetail.ItemMasterId = this.model.ddlItem;
      objItemEquipmentDetail.CapacityId = this.model.ddlCapacityId;
      objItemEquipmentDetail.MakeMasterId = this.model.ddlMake;
      objItemEquipmentDetail.CompanyMasterId = this.model.ddlCompany;
      objItemEquipmentDetail.ItemCode = this.model.itemCode;
      objItemEquipmentDetail.ItemDescription = this.model.itemDescription; //brahamjot kaur 07-06-2022
      objItemEquipmentDetail.ItemSpecs = this.model.itemSpecs;
      objItemEquipmentDetail.UnitMasterId = this.SaveddlUnit.map(o => o.id).join();
      objItemEquipmentDetail.IsActive = this.model.IsActive;
      objItemEquipmentDetail.ConversionUnit = this.model.ddlConversionUnit;
      objItemEquipmentDetail.IsConversion = this.model.IsConversion;
      objItemEquipmentDetail.ConversionValue = this.model.ConversionValue;
      objItemEquipmentDetail.CellVolt = this.model.CellVolt;
      this._MasterService.AddUpdateItemEquipmentDetial(objItemEquipmentDetail).subscribe(data => {
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
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "AddUpdateItemMasterDetial";
      objWebErrorLogModel.ErrorPage = "ItemEquipmentMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      // console.log(Error.message)
    }
  }

  SearchChangeUnit(event) {
    $('#txtUnit .selected-list .c-btn').attr('style', 'border-color: ');
    var UnitId = this.SearchddlUnit.map(o => o.id).join();
    this.StatusUnit = UnitId;
  }
  SearchChangeMakeName(event) {
    var MakeId = this.SearchddlMake.map(o => o.id).join();
    this.StatusMake = MakeId;
  }
  SearchChangeItem(event) {
    var itemId = this.SearchddlItem.map(o => o.id).join();
    this.StatusItem = itemId;
  }

  SearchChangeStatus(event) {
    var stId = this.SelectedStatusList.map(o => o.id).join();
    this.StatusData = stId;
  }


  ChangeItemName(Id: any) {
    //Brahamjot kaur 08/06/2022
    let selectedOptions = Id.target.value;
    this.itemName = this.SaveItemNameList.filter(x => x.id == selectedOptions)[0].itemName;
    this.model.itemDescription = this.itemName + ", " + this.model.itemSpecs;
    console.log(selectedOptions);
    this.model.ddlCapacityId = "0"
    this.model.ddlMake = "0";
    this.CapacityList = null;
    $("#txtddlItem").css('border-color', '')
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = selectedOptions;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'CommonSearchCapacity';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      if (item.Data != null) {
        this.CapacityList = item.Data;
        console.log(this.CapacityList);
      } else {
        this.CapacityList = null;;
        this.model.ddlCapacityId = "0";
      }
    });

    try {
      var objItemEquipmentModel = new ItemEquipmentDetail();
      objItemEquipmentModel.ItemMasterId = selectedOptions;
      objItemEquipmentModel.Flag = "ItemMaster";
      this._MasterService.ChangeItemGetUnitNameList(objItemEquipmentModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null) {
            this.SaveUnitNameList = data.Data;
          } else {
            this.SaveUnitNameList = null;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ChangeItemGetUnitNameList";
      objWebErrorLogModel.ErrorPage = "ItemEquipmentMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }

  //Brahamjot kaur 08/06/2022
  EditChangeItemName(Id: any) {
    let selectedOptions = Id;
    console.log(selectedOptions);
    this.model.ddlCapacityId = "0"
    this.model.ddlMake = "0";
    this.CapacityList = null;
    $("#txtddlItem").css('border-color', '')
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = selectedOptions;
    objdropdownmodel.Other_Id = "0";
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'CommonSearchCapacity';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      if (item.Data != null) {
        this.CapacityList = item.Data;
        console.log(this.CapacityList);
      } else {
        this.CapacityList = null;;
        this.model.ddlCapacityId = "0";
      }
    });

    try {
      var objItemEquipmentModel = new ItemEquipmentDetail();
      objItemEquipmentModel.ItemMasterId = selectedOptions;
      objItemEquipmentModel.Flag = "ItemMaster";
      this._MasterService.ChangeItemGetUnitNameList(objItemEquipmentModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null) {
            this.SaveUnitNameList = data.Data;
          } else {
            this.SaveUnitNameList = null;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "ChangeItemGetUnitNameList";
      objWebErrorLogModel.ErrorPage = "ItemEquipmentMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }

  // Brahamjot kaur 08/06/2022
  onSpecs() {
    this.model.itemDescription = this.itemName + ", " + this.model.itemSpecs;
  }
  ChangeCapacity(CapacityId: any) {
    this.model.ddlMake = "0";
    this.SaveMakeNameList = null;
    $("#txtCapacityId").css('border-color', '')
    var objdropdownmodel = new DropdownModel();
    objdropdownmodel.User_Id = 0;
    objdropdownmodel.Parent_Id = this.model.ItemId;
    objdropdownmodel.Other_Id = CapacityId;
    objdropdownmodel.Company_Id = this.CompanyId;
    objdropdownmodel.Flag = 'CreateItemMake';
    this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
      if (item.Data != null) {
        this.SaveMakeNameList = item.Data;
      } else {
        this.model.ddlMake = "0"
        this.SaveMakeNameList = null;
      }

    });


  }

  onSearchCommonDeSelectAll(item: any) {
    if (item == 1) {
      this.SearchddlItem = [];
    } else if (item == 2) {
      this.SearchddlMake = [];
    } else if (item == 3) {
      this.SearchddlUnit = []
    } else if (item == 4) {
      this.SaveddlUnit = []
    }

  }

  onSearchVenDeSelectAll(item: any) {
    this.SelectedStatusList = [{
      id: 1,
      itemName: "Active"
    },]
    this.SearchChangeStatus(event);
  }
  onSearchDeSelectSingle(item: any) {
    this.SelectedStatusList = [{
      id: 0,
      itemName: "Deactive"
    },]
    this.SearchChangeStatus(event);
  }

  GetAllEquipmentMasterList(para: string) {
    try {
      var objItemEquipmentModel = new ItemEquipmentDetail();
      var StatusId = this._Commonservices.checkUndefined(this.StatusData);
      if (this._Commonservices.checkUndefined(this.StatusItem) != "") {
        objItemEquipmentModel.ItemMasterId = this.StatusItem;
      } else {
        objItemEquipmentModel.ItemMasterId = '';
      }
      if (this._Commonservices.checkUndefined(this.StatusUnit) != "") {
        objItemEquipmentModel.UnitMasterId = this.StatusUnit;
      } else {
        objItemEquipmentModel.UnitMasterId = '';
      }
      if (this._Commonservices.checkUndefined(this.StatusMake) != "") {
        objItemEquipmentModel.MakeMasterId = this.StatusMake;
      } else {
        objItemEquipmentModel.MakeMasterId = '';
      }
      objItemEquipmentModel.UserId = this.UserId;
      objItemEquipmentModel.CompanyMasterId = this.CompanyId;
      if (StatusId == '') {
        objItemEquipmentModel.Status = '';
      } else {
        objItemEquipmentModel.Status = StatusId;
      }
      objItemEquipmentModel.ItemCode = this.model.ItemCode;
      objItemEquipmentModel.Flag = para;
      this._MasterService.GetAllEquipmentMasterList(objItemEquipmentModel).subscribe(data => {
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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'ItemMaster');
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
      objWebErrorLogModel.ErrorFunction = "GetAllEquipmentMasterList";
      objWebErrorLogModel.ErrorPage = "ItemEquipmentMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }

  ItemClick() {
    window.location.href = "/ItemMaster"
  }

  MakeClick() {
    window.location.href = "/MakeMaster"
  }
  UnitClick() {
    window.location.href = "/UnitMaster"
  }

  ShowItemEquipmentMasterDeatil(e) {
    this.EquipmentId = e.rowData.EquipmentId;
    this.GetUserPageRight(this.EquipmentId);
    var EquipmentEditData = this.rowData.filter(
      m => m.EquipmentId === parseInt(e.rowData.EquipmentId));
    if (EquipmentEditData != null) {
      this.ConfirmmationClick();
      if (EquipmentEditData[0].IsPoItem > 0) {
        this.IsEditItemCode = true;
      } else {
        this.IsEditItemCode = false;
      }
      this.model.hiddenEquipmentId = EquipmentEditData[0].EquipmentId;
      this.model.ddlItem = EquipmentEditData[0].ItemMaster_Id;
      this.EditChangeItemName(this.model.ddlItem);
      // var objItemEquipmentModel = new ItemEquipmentDetail();
      // objItemEquipmentModel.ItemMasterId = this.model.ddlItem;
      // objItemEquipmentModel.Flag = "ItemMaster";
      // this.SaveUnitNameList = [];
      // this._MasterService.ChangeItemGetUnitNameList(objItemEquipmentModel).subscribe(data => {
      //   if (data.Status == 1) {
      //     if (data.Data != null) {
      //       this.SaveUnitNameList = data.Data;
      //     } else {
      //       this.SaveUnitNameList = null;
      //     }
      //   }
      // });

      if (EquipmentEditData[0].Capacity != 0) {
        this.model.ddlCapacityId = EquipmentEditData[0].Capacity;
      } else {
        this.model.ddlCapacityId = "0";
      }

      this.ChangeCapacity(this.model.ddlCapacityId);
      this.model.ddlMake = EquipmentEditData[0].MakeMaster_Id;
      this.Unitmaster = JSON.parse(EquipmentEditData[0].UnitList);
      if (this.Unitmaster != null) {
        if (this.Unitmaster.length > 0) {
          this.SaveddlUnit = this.Unitmaster;
        } else {
          this.SaveddlUnit = [];
        }
      }
      this.model.itemSpecs = EquipmentEditData[0].ItemSpecs;
      this.model.itemCode = EquipmentEditData[0].ItemCode;
      this.model.itemDescription = EquipmentEditData[0].ItemDescription;
      this.model.ddlCompany = EquipmentEditData[0].CompanyMaster_Id;
      this.model.CellVolt = EquipmentEditData[0].CellVolt;
      this.model.ConversionValue = EquipmentEditData[0].ConversionValue;
      if (EquipmentEditData[0].IsActive == true) {
        this.model.IsActive = "1";
      } else {
        this.model.IsActive = "0";
      }
      if (EquipmentEditData[0].IsConversion != null) {
        this.model.IsConversion = EquipmentEditData[0].IsConversion;
      } else {
        this.model.IsConversion = "";
      }
      if (EquipmentEditData[0].ConversionUnit != null) {
        this.model.ddlConversionUnit = EquipmentEditData[0].ConversionUnit;
      } else {
        this.model.ddlConversionUnit = "0";
      }
    }
  }

  ClearItemEquipmentMasterForm() {
    this.model.ddlItem = "0";
    this.model.ddlMake = "0";
    //this.model.ddlUnit = "0";
    this.SaveddlUnit = []
    this.model.itemSpecs = "";
    this.model.itemCode = "";
    this.model.ddlCompany = "0";
    this.model.itemDescription = "";
    this.model.IsActive = "";
    this.model.CellVolt = "";
    this.model.ConversionValue = "";
    this.model.ddlConversionUnit = "0";
    this.model.ddlCapacityId = "0";
    this.model.IsConversion = "";
  }


  //#region  validation
  keyPressItemcode() {
    $("#txtitemCode").css('border-color', '')
  }
  keyPressSpecs() {
    $("#txtitemSpecs").css('border-color', '')
  }
  keyPressDescription() {
    $("#txtitemDescription").css('border-color', '')
  }
  keyPressCellVolt() {
    $("#txtCellVolt").css('border-color', '')
  }
  keyPressConversionValue() {
    $("#txtConversionValue").css('border-color', '')
  }

  ChangeItemMake() {
    $("#txtddlMake").css('border-color', '')
  }
  ChangeItemUnit() {
    $("#txtConversionUnit").css('border-color', '')
  }
  ChangeConversion() {
    $("#txtIsConversion").css('border-color', '')
  }
  Changestatus() {
    $("#txtddlIsActive").css('border-color', '')
  }
  ChangeCompany() {
    $("#txtddlCompany").css('border-color', '')
  }


  ValidationBasic() {
    var flag = 0;
    if (this.model.ddlItem == "0") {
      $('#txtddlItem').css('border-color', 'red')
      $('#txtddlItem').focus();
      flag = 1;
    } else {
      $("#txtddlItem").css('border-color', '')
    }
    if (this.model.ddlCapacityId == "0") {
      $('#txtCapacityId').css('border-color', 'red')
      $('#txtCapacityId').focus();
      flag = 1;
    } else {
      $("#txtCapacityId").css('border-color', '')
    }
    if (this.model.ddlMake == "0") {
      $('#txtddlMake').css('border-color', 'red')
      $('#txtddlMake').focus();
      flag = 1;
    } else {
      $("#txtddlMake").css('border-color', '')
    }
    if (this.SaveddlUnit.length == 0) {
      $('#txtUnit .selected-list .c-btn').attr('style', 'border-color: red');
      $('#txtddlUnit').focus();
      flag = 1;
    } else {
      $('#txtUnit .selected-list .c-btn').attr('style', 'border-color: ');
    }

    if (this.model.itemCode == "") {
      $('#txtitemCode').css('border-color', 'red')
      $('#txtitemCode').focus();
      flag = 1;
    } else {
      $("#txtitemCode").css('border-color', '')
    }
    if (this.model.itemSpecs == "") {
      $('#txtitemSpecs').css('border-color', 'red')
      $('#txtitemSpecs').focus();
      flag = 1;
    } else {
      $("#txtitemSpecs").css('border-color', '')
    }
    // Brahamjot kaur 07-06-2022
    // if (this.model.itemDescription == "") {
    //   $('#txtitemDescription').css('border-color', 'red')
    //   $('#txtitemDescription').focus();
    //   flag = 1;
    // } else {
    //   $("#txtitemDescription").css('border-color', '')
    // }
    if (this.model.IsActive == "") {
      $('#txtddlIsActive').css('border-color', 'red')
      $('#txtddlIsActive').focus();
      flag = 1;
    } else {
      $("#txtddlIsActive").css('border-color', '')
    }
    if (this.model.ddlCompany == "0") {
      $('#txtddlCompany').css('border-color', 'red')
      $('#txtddlCompany').focus();
      flag = 1;
    } else {
      $("#txtddlCompany").css('border-color', '')
    }

    if (this.model.ddlItem == "20") {
      if (this.model.IsConversion == "") {
        $('#txtIsConversion').css('border-color', 'red')
        $('#txtIsConversion').focus();
        flag = 1;
      } else {
        $("#txtIsConversion").css('border-color', '')
      }
      if (this.model.IsConversion == "1") {
        if (this.model.ddlConversionUnit == "0") {
          $('#txtConversionUnit').css('border-color', 'red')
          $('#txtConversionUnit').focus();
          flag = 1;
        } else {
          $("#txtConversionUnit").css('border-color', '')
        }
        if (this.model.ConversionValue == "") {
          $('#txtConversionValue').css('border-color', 'red')
          $('#txtConversionValue').focus();
          flag = 1;
        } else {
          $("#txtConversionValue").css('border-color', '')
        }
      }
    }
    if (this.model.ddlItem == "4") {
      $("#txtConversionValue").css('border-color', '');
      $("#txtConversionUnit").css('border-color', '');
      $("#txtIsConversion").css('border-color', '')
      if (this.model.CellVolt == "") {
        $('#txtCellVolt').css('border-color', 'red')
        $('#txtCellVolt').focus();
        flag = 1;
      } else {
        $("#txtCellVolt").css('border-color', '')
      }

    }
    return flag;
  }

  //#endregion

}
