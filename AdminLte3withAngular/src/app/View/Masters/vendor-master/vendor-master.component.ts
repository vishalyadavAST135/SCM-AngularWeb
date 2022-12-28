import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { isNumeric } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { MaterialMovementService } from 'src/app/Service/material-movement.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { SearchDispatchTrackerModel } from 'src/app/_Model/DispatchModel';
import { DynamicItemGrid, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IfStmt } from '@angular/compiler';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { DynamicVendorAddres, VendorAddresDetial, VendorModel } from 'src/app/_Model/MastersModel';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { first } from 'rxjs/operators';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';


var PDFdata = null;

@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.sass'],
  providers: [DatePipe]
})

export class VendorMasterComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  dynamicArrayVendorAddres: Array<DynamicVendorAddres> = [];
  dynamicArrayVendorAddresList: Array<DynamicVendorAddres> = [];
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public multiSortKey: string;
  public columnDefs = [];
  rowData = [];
  CompanyData = [];
  SearchStateList = [];
  SearchVendorList = [];
  SearchItemNameList = [];
  WHStateList = [];
  SiteStateList = [];
  VendorStateList = [];
  UserId: any;
  CompanyId: any;
  IsDeleted: boolean;
  CommonSearchPanelData: any;
  tooltipShowDelay: any;
  frameworkComponents: any;
  ItemAddrowhideshow: boolean;
  public MultidropdownSettings = {};


  closeResult: string;
  @ViewChild("content") modalContent: TemplateRef<any>;
  StateList: any;
  VendorNameList: any;
  VendorCodeList: any;
  SelectedStatusList = [];
  SearchStatusList = [];
  StatusData: string;
  CountryDataList: any;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  gridColumnApi: any;
  VendorId: number = 0;


  constructor(private router: Router, private _Commonservices: CommonService,
    private _MaterialMovementService: MaterialMovementService,
    private _objSearchpanelService: SearchpanelService, private Loader: NgxSpinnerService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService, private _PurchaseOrderService: PurchaseOrderService,
    private datePipe: DatePipe, private modalService: NgbModal, private _MasterService: MasterservicesService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent
    }

    this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
      this.CommonSearchPanelData = data;
    });
  }

  ngOnInit(): void {
    this.isShownList = true;
    this.isShownEdit = false;
    this.GettAllState();
    this.model.SearchStatus = "2";
    this.model.SearchVendorName = "0";
    this.model.SearchVendorCode = "0";
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }

    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;


    // if(sessionStorage.getItem("CompStatVenItmSession")==null||sessionStorage.getItem("CompStatVenItmSession")=="null"){ 
    //   this.BindCompanyStateVendorItem();
    // }else{
    //   debugger
    //   var objCSVTdata=new CompanyStateVendorItemModel();  
    //   objCSVTdata =JSON.parse(sessionStorage.getItem("CompStatVenItmSession"));
    //   this.SearchVendorList=objCSVTdata.VendorArray;
    //   this.VendorCodeList=objCSVTdata.VendorArray;
    // }
    // this.SearchGetAllVendorandVendorcodeByComId();
    try {
      var objParameter = new DropdownModel();
      objParameter.User_Id = this.UserId;
      objParameter.Parent_Id = "";
      objParameter.Other_Id = "";
      objParameter.Company_Id = this.CompanyId;
      objParameter.Flag = "VendorMaster";
      this._Commonservices.getdropdown(objParameter).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.SearchVendorList = data.Data;
            this.VendorCodeList = data.Data;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "getdropdown";
      objWebErrorLogModel.ErrorPage = "VendorMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowVendotMasterDeatil.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false,
      },
      { headerName: 'Vendor Name', field: 'VendorName', width: 150, resizable: true, filter: true, },
      { headerName: 'Vendor Code', field: 'VendorCode', width: 130, sortable: true, filter: true, },
      { headerName: 'Mobile No', field: 'MobileNo', width: 130, filter: true, },
      { headerName: 'Pan No', field: 'PanNo', width: 150, filter: false, },
      { headerName: 'Contact Person', field: 'Contact', width: 150 },
      { headerName: 'Vendor GSTNo', field: 'VenGSTNo', width: 150, resizable: true },
      { headerName: 'Vendor Address', field: 'VenAddress', width: 250, resizable: true },
      { headerName: 'Status', field: 'IsActive', width: 100 },

    ];
    this.multiSortKey = 'ctrl';
    this.MultidropdownSettings = {
      singleSelection: false,
      // text:"Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      // limitSelection:1
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
    this.SearchChangeStatus(event);
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.VendorId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.VendorMaster).subscribe(data => {
      if (data.Status == 1) {
        console.log(id);
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


        // console.log(this.Edit);
      }
    })
  }


  async BindCompanyStateVendorItem() {
    try {
      var objCSVTdata = new CompanyStateVendorItemModel();
      objCSVTdata.Company_Id = parseInt(this.CompanyId);
      this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
      if (this.apiCSVIData.Status == 1) {
        objCSVTdata.VendorArray = this.apiCSVIData.VendorArray;
        this.CompanyData = objCSVTdata.CompanyArray;
        this.SearchVendorList = objCSVTdata.VendorArray;
        this.VendorCodeList = objCSVTdata.VendorArray;

        sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
      }
    } catch (Error) {
      console.log(Error.message)
    }
  }

  onGridReady(params) {

    //           console.log(this.Edit);
    // this.gridColumnApi = params.columnApi;
    //   const theMakeColumn = this.gridColumnApi.getAllColumns().find(x => x.colDef.headerName == 'Edit');
    //   console.log(this.Edit);
    //   this.gridColumnApi.setColumnVisible(theMakeColumn, this.Edit);
  }

  ChangevendorName(Id: any) {
    var FilterVendorNameList = this.SearchVendorList.filter(
      m => m.id === parseInt(Id));
    this.model.SearchVendorCode = FilterVendorNameList[0].id;
  }
  ChangevendorCode(Id: any) {
    var FilterVendorCodeList = this.VendorCodeList.filter(
      m => m.id === parseInt(Id));
    this.model.SearchVendorName = FilterVendorCodeList[0].id;
  }

  CreateNew() {
    this.isShownList = false;
    this.isShownEdit = true;
    this.model.hiddenVendorId = null;
    this.model.hiddenVendorId = 0;
    this.ClearVendorMasterForm();
  }

  GettAllState() {
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = "";///2589 for local
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'CountryData';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.CountryDataList = item.Data;
      }, error => {
        this._Commonservices.ErrorFunction('', error.message, "Vendor", "Dispatch");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction('', Error.message, "Vendor", "Dispatch");
    }
  }

  ChangeCountryName(Id: any, index: any,) {
    $(this).find('.CountryId').css('border-color', '');
    try {
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = Id;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Flag = 'StateData';
      this._Commonservices.getdropdown(objdropdownmodel).pipe(first()).subscribe(item => {
        this.dynamicArrayVendorAddres[index].StateList = item.Data;
      }, error => {
        this._Commonservices.ErrorFunction('', error.message, "Vendor", "Vendor");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction('', Error.message, "Vendor", "Vendor");
    }

  }

  ConfirmmationClick() {
    var y = 'Cross click'
    this.getDismissReason(y);

    //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    this.modalService.open(this.modalContent, { size: <any>'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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


  BackPage() {
    this.isShownList = true;
    this.isShownEdit = false;
  }

  AddUpdateVendorBasicDetial() {
    try {
      if (this.ValidationBasic() == 1) {
        return false;
      }
      var objVendorModel = new VendorModel();
      objVendorModel.VendorId = this.model.hiddenVendorId;
      objVendorModel.UserId = this.UserId;
      objVendorModel.CompanyId = this.CompanyId;
      objVendorModel.VendorName = this.model.VendorName;
      objVendorModel.VendorCode = this.model.VendorCode;
      objVendorModel.PanNo = this.model.PanNo;
      objVendorModel.PinCode = this.model.PinCodeNo;
      objVendorModel.MobileNo = this.model.MobileNo;
      objVendorModel.Email = this.model.EmailId;
      objVendorModel.Contact = this.model.Contact;
      objVendorModel.Status = this.model.StatusId;
      objVendorModel.VendorTypeId = this.model.VendorTypeId;
      this._MasterService.SaveVendorBasicDetial(JSON.stringify(objVendorModel)).subscribe(data => {
        if (data.Status == 1) {
          this.model.hiddenVendorId = data.Value;
          this.model.VendorCode = data.Remarks;
          setTimeout(() => {
            alert('your data has been save successfully with Vendor Code-' + data.Remarks)
          }, 300);

        } else if (data.Status == 2) {
          setTimeout(() => {
            alert(data.Remarks)
          }, 300);
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SaveVendorBasicDetial";
      objWebErrorLogModel.ErrorPage = "VendorMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      // console.log(Error.message)
    }
  }

  AddUpdateVendorAddressDetial() {
    var hiddenVendor = this._Commonservices.checkUndefined(this.model.hiddenVendorId);
    try {
      if (hiddenVendor == 0 || hiddenVendor == "" || hiddenVendor == null) {
        alert('Please Fill First Vendor Basic Information');
        return false;
      }
      this.dynamicArrayVendorAddresList = [];
      if (this.ValidationAddress() == 1) {
        return false;
      }
      var objVendorAddresDetial = new VendorAddresDetial();
      for (var i = 0, len = this.dynamicArrayVendorAddres.length; i < len; i++) {
        var objPoItemDetial = new DynamicVendorAddres();
        objPoItemDetial.VendorId = this.model.hiddenVendorId;
        objPoItemDetial.UserId = this.UserId;
        objPoItemDetial.CompanyId = this.CompanyId;
        objPoItemDetial.Id = this.dynamicArrayVendorAddres[i].Id;
        objPoItemDetial.CountryId = this.dynamicArrayVendorAddres[i].CountryId;
        objPoItemDetial.StateId = this.dynamicArrayVendorAddres[i].StateId;
        objPoItemDetial.GSTINNo = this.dynamicArrayVendorAddres[i].GSTINNo;
        objPoItemDetial.Address = this.dynamicArrayVendorAddres[i].Address;
        objPoItemDetial.Pincode = this.dynamicArrayVendorAddres[i].Pincode;
        objPoItemDetial.ContactPerson = this.dynamicArrayVendorAddres[i].ContactPerson;
        objPoItemDetial.MobileNo = this.dynamicArrayVendorAddres[i].MobileNo;
        objPoItemDetial.Email = this.dynamicArrayVendorAddres[i].Email;
        objPoItemDetial.Isactive = this.dynamicArrayVendorAddres[i].Isactive;
        this.dynamicArrayVendorAddresList.push(objPoItemDetial)
      }
      objVendorAddresDetial.VendorAddressDetialList = this.dynamicArrayVendorAddresList;
      this._MasterService.SaveVendorAddressDetial(JSON.stringify(objVendorAddresDetial)).subscribe(data => {
        if (data.Status == 1) {
          setTimeout(() => {
            alert(data.Remarks)
          }, 300);
          //this.ClearPoItem();
        }
        else if (data.Status == 2) {
          this.SearchGetAllVendotMasterDeatilByVendorId(this.model.hiddenVendorId);
          setTimeout(() => {
            alert(data.Remarks)
          }, 300);
        }
      });

    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SaveVendorAddressDetial";
      objWebErrorLogModel.ErrorPage = "VendorMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel)
      //console.log(Error.message)
    }
  }

  SearchChangeStatus(event) {
    var stId = this.SelectedStatusList.map(o => o.id).join();
    this.StatusData = stId;
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

  SearchVendorMasterGridList(para: string) {
    try {
      var StatusId = this._Commonservices.checkUndefined(this.StatusData);
      var objpara = new VendorModel();
      objpara.CompanyId = this.CompanyId;
      if (this.model.SearchVendorName == "0") {
        objpara.VendorId = 0;
      } else {
        objpara.VendorId = this.model.SearchVendorName;
      }
      if (StatusId != '') {
        objpara.Status = StatusId;
      }
      objpara.Flag = para;
      this._MasterService.GetVendorMasterList(objpara).subscribe(data => {
        if (data.Status == 1) {
          if (para == "List") {
            this.Loader.hide();
            if (data.Data != null) {
              this.rowData = data.Data;
            } else {
              this.rowData = null;
            }
          }

          if (para == 'Export') {
            if (data.Data != null) {
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'VendorMaster');
            } else {

            }
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetVendorMasterList";
      objWebErrorLogModel.ErrorPage = "VendorMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }

  ShowVendotMasterDeatil(e) {
    this.isShownList = false;
    this.isShownEdit = true;
    // if(e==null){
    //   this.Save = 1;
    // }else{
    //   this.Save = this.Edit;
    // }
    this.VendorId = e.rowData.VendorId;
    this.GetUserPageRight(this.VendorId);
    this.SearchGetAllVendotMasterDeatilByVendorId(e.rowData.VendorId);
  }

  SearchGetAllVendotMasterDeatilByVendorId(Id: any) {
    try {
      var objModel = new VendorModel();
      objModel.VendorId = Id;
      this.ItemAddrowhideshow = false;
      this._MasterService.GetAllVendotMasterDeatilById(objModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.model.hiddenVendorId = data.Data[0].VendorId;
            this.model.VendorName = data.Data[0].VendorName;
            this.model.VendorCode = data.Data[0].VendorCode;
            this.model.PanNo = data.Data[0].PanNo;
            this.model.PinCodeNo = data.Data[0].PinCode;
            this.model.MobileNo = data.Data[0].MobileNo;
            this.model.EmailId = data.Data[0].Email;
            this.model.Contact = data.Data[0].Contact;
            this.model.VendorTypeId = data.Data[0].VendorTypeFlag;
            // this.StateList = null;
            // this.StateList = JSON.parse(data.Data[0].JsonStateList)
            if (data.Data[0].IsActive == true) {
              this.model.StatusId = "1";
            } else {
              this.model.StatusId = "0";
            }
          }
          if (data.VendAddressData != null && data.VendAddressData != "" && data.VendAddressData.length > 0) {
            this.BindVendorAddress(data.VendAddressData);
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllVendotMasterDeatilById";
      objWebErrorLogModel.ErrorPage = "VendorMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }


  async BindVendorAddress(ItemEditDataArr: any) {
    this.dynamicArrayVendorAddres = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objdynamic = new DynamicVendorAddres();
        objdynamic.Id = ItemEditDataArr[i].AddressId;
        objdynamic.Address = ItemEditDataArr[i].Address;
        objdynamic.CountryId = ItemEditDataArr[i].CountryId;
        objdynamic.StateList = JSON.parse(ItemEditDataArr[i].JsonStateList)
        objdynamic.StateId = ItemEditDataArr[i].State_Id;
        objdynamic.GSTINNo = ItemEditDataArr[i].GSTINNo;
        objdynamic.Email = ItemEditDataArr[i].Email;
        objdynamic.MobileNo = ItemEditDataArr[i].MobileNo;
        objdynamic.Pincode = ItemEditDataArr[i].Pincode;
        objdynamic.ContactPerson = ItemEditDataArr[i].ContactPerson;
        objdynamic.Isactive = ItemEditDataArr[i].Isactive;
        this.dynamicArrayVendorAddres.push(objdynamic);
      }
    }
  }


  addRow() {
    var objNewItemGrid = new DynamicVendorAddres();
    objNewItemGrid.StateId = "0";
    objNewItemGrid.CountryId = "0";
    objNewItemGrid.GSTINNo = "";
    objNewItemGrid.Address = "";
    objNewItemGrid.Pincode = "";
    objNewItemGrid.Email = "";
    objNewItemGrid.MobileNo = "";
    objNewItemGrid.ContactPerson = "";
    objNewItemGrid.Isactive = "";
    this.dynamicArrayVendorAddres.push(objNewItemGrid);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArrayVendorAddres.length == 1) {
      return false;
    } else {
      this.dynamicArrayVendorAddres.splice(index, 1);
      return true;
    }

  }
  ClearVendorMasterForm() {
    this.model.VendorName = "";
    this.model.VendorCode = "";
    this.model.PanNo = "";
    this.model.PinCodeNo = "";
    this.model.MobileNo = "";
    this.model.EmailId = "";
    this.model.Contact = "";
    this.model.StatusId = "";
    this.model.VendorTypeId = "1";
    this.dynamicArrayVendorAddres = [];
  }


  //#region  validation
  ChangeStateName(ItemNameId: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueStateId = $(this).find('.StateId').val();
      if (valueStateId != '0') {
        $(this).find('.StateId').css('border-color', '');
      }
    });
  }

  GSTINNoKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.GSTINNo').val();
      if (valueItem != '') {
        $(this).find('.GSTINNo').css('border-color', '');
      }
    });
  }

  AddressKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Address').val();
      if (valueItem != '') {
        $(this).find('.Address').css('border-color', '');
      }
    });
  }

  PincodeKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Pincode').val();
      if (valueItem != '') {
        $(this).find('.Pincode').css('border-color', '');
      }
    });
  }

  ContactPersonKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.ContactPerson').val();
      if (valueItem != '') {
        $(this).find('.ContactPerson').css('border-color', '');
      }
    });
  }
  MobileNoKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.MobileNo').val();
      if (valueItem != '') {
        $(this).find('.MobileNo').css('border-color', '');
      }
    });
  }
  ChangeStatus() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Isactive').val();
      if (valueItem != '') {
        $(this).find('.Isactive').css('border-color', '');
      }
    });
  }


  onKeypressVendorName() {
    $("#txtVendorName").css('border-color', '');
  }
  onKeypressPanNo() {
    $("#txtPanNo").css('border-color', '');
  }
  onKeypressMobileNo() {
    $("#txtMobileNo").css('border-color', '');
  }
  // onKeypressPoDate(event: any){
  //   $("#txtPodate").css('border-color', '');
  // }

  ValidationBasic() {
    var flag = 0;
    if (this._Commonservices.checkUndefined(this.model.VendorName) == "") {
      $('#txtVendorName').css('border-color', 'red')
      $('#txtVendorName').focus();
      flag = 1;
    } else {
      $("#txtVendorName").css('border-color', '')
    }
    if (this._Commonservices.checkUndefined(this.model.PanNo) == "") {
      $('#txtPanNo').css('border-color', 'red')
      $('#txtPanNo').focus();
      flag = 1;
    } else {
      $("#txtPanNo").css('border-color', '')
    }
    // if (this._Commonservices.checkUndefined(this.model.MobileNo) == "" ) {
    //   $('#txtMobileNo').css('border-color', 'red')
    //     $('#txtMobileNo').focus();
    //     flag = 1;
    // } else {
    //   $("#txtMobileNo").css('border-color', '')
    // }
    // if (this._Commonservices.checkUndefined(this.model.StatusId) == "") {
    //   $('#txtStatus').addClass('box')
    //     $('#txtStatus').focus();
    //     flag = 1;
    // } else {
    //   $("#txtStatus").css('border-color', '')
    // }


    return flag;
  }
  ValidationAddress() {
    var flag = 0;
    $('#tblOne > tbody  > tr').each(function () {
      var valueCountryId = $(this).find('.CountryId').val();
      if (valueCountryId == '0') {
        flag = 1;
        $(this).find('.CountryId').css('border-color', 'red');
      }
      var valueStateId = $(this).find('.StateId').val();
      if (valueStateId == '0') {
        flag = 1;
        $(this).find('.StateId').css('border-color', 'red');
      }
      var valueGSTINNo = $(this).find('.GSTINNo').val();
      if (valueGSTINNo == '') {
        flag = 1;
        $(this).find('.GSTINNo').css('border-color', 'red');
      }
      var valueAddress = $(this).find('.Address').val();
      if (valueAddress == '') {
        flag = 1;
        $(this).find('.Address').css('border-color', 'red');
      }
      var valuePincode = $(this).find('.Pincode').val();
      if (valuePincode == '') {
        flag = 1;
        $(this).find('.Pincode').css('border-color', 'red');
      }
      var valueContactPerson = $(this).find('.ContactPerson').val();
      if (valueContactPerson == '') {
        flag = 1;
        $(this).find('.ContactPerson').css('border-color', 'red');
      }
      var valueMobileNo = $(this).find('.MobileNo').val();
      if (valueMobileNo == '') {
        flag = 1;
        $(this).find('.MobileNo').css('border-color', 'red');
      }
      var valueIsactive = $(this).find('.Isactive').val();
      if (valueIsactive == "") {
        flag = 1;
        $(this).find('.Isactive').css('border-color', 'red');
      }
    });
    return flag;
  }

  //#endregion


}
