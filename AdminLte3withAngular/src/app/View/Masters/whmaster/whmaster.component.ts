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
import { DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { DynamicItemGrid, VendorOrWhModel } from 'src/app/_Model/purchaseOrderModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { IfStmt } from '@angular/compiler';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { DynamicWHAddress, VendorModel, WHAddresDetial, WHModel } from 'src/app/_Model/MastersModel';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-whmaster',
  templateUrl: './whmaster.component.html',
  styleUrls: ['./whmaster.component.sass'],
  providers: [DatePipe]
})
export class WhmasterComponent implements OnInit {
  model: any = {};
  apiCSVIData: any = {};
  dynamicArrayWHAddres: Array<DynamicWHAddress> = [];
  dynamicArrayWHAddresList: Array<DynamicWHAddress> = [];
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public multiSortKey: string;
  public columnDefs = [];
  rowData = [];
  CompanyData = [];
  SearchStateList = [];
  SearchWHList = [];
  WHStateList = [];
  UserId: any;
  CompanyId: any;
  IsDeleted: boolean;
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
  DisabledWHName: boolean;
  ObjUserPageRight = new UserPageRight();
  Save: any;
  WHId: number = 0;
  constructor(private router: Router, private _Commonservices: CommonService,
    private _MaterialMovementService: MaterialMovementService, private Loader: NgxSpinnerService,
    private _GlobalErrorHandlerService: GlobalErrorHandlerServiceService, private _PurchaseOrderService: PurchaseOrderService,
    private _MasterService: MasterservicesService) {
    this.tooltipShowDelay = 0;
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      fileRenderer: FileRendererComponent,
      customtooltip: CustomTooltipComponent
    }

    // this._objSearchpanelService.SearchPanelSubject.subscribe(data => {
    //   this.CommonSearchPanelData = data;
    // });
  }

  ngOnInit(): void {
    this.isShownList = true;
    this.isShownEdit = false;
    this.model.SearchStatus = "2";
    this.model.SearchStateId = "0";
    this.model.SearchWHId = "0";
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
      objWebErrorLogModel.ErrorFunction = "GettAllProjectTypeandOther";
      objWebErrorLogModel.ErrorPage = "WHMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }
    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowWHMasterDeatil.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      { headerName: 'State Name', field: 'StateName', width: 130, sortable: true, filter: true, },
      { headerName: 'WH Name', field: 'WHName', width: 150, resizable: true, filter: true, },
      { headerName: 'Mobile No', field: 'ContactNo', width: 130, filter: true, },
      { headerName: 'InCharge', field: 'WH_InChargeName', width: 150 },
      { headerName: 'GSTNo', field: 'GSTIN_UIN', width: 150, resizable: true },
      { headerName: 'WH Address', field: 'WHAddress', width: 250, resizable: true },
      { headerName: 'Office Address', field: 'OfficeAddress', width: 250, resizable: true },
      { headerName: 'WH Code', field: 'WhCode', width: 100, filter: false, },
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
    this.PageLoadAllState();
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.WHId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.WHMaster).subscribe(data => {
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


  PageLoadAllState() {
    var objParameter = new DropdownModel();
    objParameter.User_Id = this.UserId;
    objParameter.Parent_Id = "";
    objParameter.Other_Id = "";
    objParameter.Company_Id = this.CompanyId;
    objParameter.Flag = "StateMaster";
    this._Commonservices.getdropdown(objParameter).subscribe(data => {
      if (data.Status == 1) {
        if (data.Data != null && data.Data != "") {
          this.StateList = data.Data;
          this.SearchStateList = data.Data;
        }
      }
    });
  }

  onGridReady(params) {
  }

  CreateNew() {
    this.isShownList = false;
    this.isShownEdit = true;
    this.model.hiddenWHId = 0;
    this.model.StateId = "0"
    this.ClearWHMasterForm();
    this.addRow();

  }

  BackPage() {
    this.isShownList = true;
    this.isShownEdit = false;
  }

  AddUpdateWHBasicDetial() {
    debugger
    try {
      if (this.ValidationBasic() == 1) {
        return false;
      }
      var objWHModel = new WHModel();
      objWHModel.WHId = this.model.hiddenWHId;
      objWHModel.UserId = this.UserId;
      objWHModel.CompanyId = this.CompanyId;
      objWHModel.WHName = this.model.WHName;
      objWHModel.WHCode = this.model.WHCode;
      objWHModel.StateId = this.model.StateId;
      objWHModel.MobileNo = this.model.MobileNo;
      objWHModel.Email = this.model.EmailId;
      objWHModel.GSTNo = this.model.GSTNo;
      objWHModel.Status = this.model.StatusId;
      this._MasterService.SaveWHBasicDetial(JSON.stringify(objWHModel)).subscribe(data => {
        if (data.Status == 1) {
          this.model.hiddenWHId = data.Value;
          setTimeout(() => {
            alert(data.Remarks)
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
      objWebErrorLogModel.ErrorFunction = "SaveWHBasicDetial";
      objWebErrorLogModel.ErrorPage = "WHMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      // console.log(Error.message)
    }
  }

  AddUpdateWHAddressDetail() {
    var hiddenWH = this._Commonservices.checkUndefined(this.model.hiddenWHId);
    try {
      if (hiddenWH == 0 || hiddenWH == "" || hiddenWH == null) {
        alert('Please Fill First WH Basic Information');
        return false;
      }
      this.dynamicArrayWHAddresList = [];
      if (this.ValidationAddress() == 1) {
        return false;
      }
      var count = 0;
      for (var i = 0, len = this.dynamicArrayWHAddres.length; i < len; i++) {
        if (this.dynamicArrayWHAddres[i].Isactive == "1") {
          count = count + 1;
        }
      }
      if (count > 1) {
        alert('Only one WH Address Active one Time');
        return false;
      }
      var objWHAddresDetial = new WHAddresDetial();
      for (var i = 0, len = this.dynamicArrayWHAddres.length; i < len; i++) {
        var objPoItemDetial = new DynamicWHAddress();
        objPoItemDetial.Id = this.dynamicArrayWHAddres[i].Id;
        objPoItemDetial.WHId = this.model.hiddenWHId;
        objPoItemDetial.WHAddress = this.dynamicArrayWHAddres[i].WHAddress;
        objPoItemDetial.OfficeAddress = this.dynamicArrayWHAddres[i].OfficeAddress;
        objPoItemDetial.InChargeName = this.dynamicArrayWHAddres[i].InChargeName;
        objPoItemDetial.ContactNo = this.dynamicArrayWHAddres[i].ContactNo;
        objPoItemDetial.Email = this.dynamicArrayWHAddres[i].Email;
        objPoItemDetial.Isactive = this.dynamicArrayWHAddres[i].Isactive;
        this.dynamicArrayWHAddresList.push(objPoItemDetial)
      }
      objWHAddresDetial.WHAddressDetialList = this.dynamicArrayWHAddresList;
      this._MasterService.SaveWHAddressDetail(JSON.stringify(objWHAddresDetial)).subscribe(data => {
        if (data.Status == 2) {
          setTimeout(() => {
            alert(data.Remarks)
          }, 300);
          this.ClearWHMasterForm()
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SaveWHAddressDetail";
      objWebErrorLogModel.ErrorPage = "WHMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel)
      //console.log(Error.message)
    }
  }

  SearchChangeStatus(event) {
    var stId = this.SelectedStatusList.map(o => o.id).join();
    this.StatusData = stId;
  }

  onSearchWHDeSelectAll(item: any) {
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

  SearchWHMasterGridList(para: string) {
    try {
      var StatusId = this._Commonservices.checkUndefined(this.StatusData);
      var objpara = new WHModel();
      objpara.CompanyId = this.CompanyId;
      if (this.model.SearchVendorName == "0") {
        objpara.WHId = 0;
      } else {
        objpara.WHId = this.model.SearchWHId;
      }
      objpara.StateId = this.model.SearchStateId;
      if (StatusId != '') {
        objpara.Status = StatusId;
      }
      objpara.Flag = para;
      this._MasterService.GetWHMasterList(objpara).subscribe(data => {
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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'WHMaster');
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

  ShowWHMasterDeatil(e) {
    //// debugger
    this.isShownList = false;
    this.isShownEdit = true;
    this.WHId = e.rowData.WHId;
    this.GetUserPageRight(this.WHId);
    this.SearchGetAllWHMasterDeatilByWHId(e.rowData.WHId);
  }

  SearchGetAllWHMasterDeatilByWHId(Id: any) {
    try {
      var objModel = new WHModel();
      objModel.WHId = Id;
      this.DisabledWHName = true;
      this._MasterService.GetAllWHMasterDeatilById(objModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.model.hiddenWHId = data.Data[0].Id;
            this.model.StateId = data.Data[0].State_Id;
            this.model.WHName = data.Data[0].WHName;
            this.model.WHCode = data.Data[0].WhCode;
            this.model.GSTNo = data.Data[0].GSTNo;
            this.model.MobileNo = data.Data[0].ContactNo;
            this.model.WHInChargeName = data.Data[0].WH_InChargeName;
            this.model.EmailId = data.Data[0].Email;
            if (data.Data[0].IsActive == true) {
              this.model.StatusId = "1";
            } else {
              this.model.StatusId = "0";
            }
          }
          if (data.WHAddressData != null && data.WHAddressData != "" && data.WHAddressData.length > 0) {
            this.BindVendorAddress(data.WHAddressData);
            // this.addRow();
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
    this.dynamicArrayWHAddres = [];
    if (ItemEditDataArr != null && ItemEditDataArr != "") {
      for (var i = 0, len = ItemEditDataArr.length; i < len; i++) {
        var objdynamic = new DynamicWHAddress();
        objdynamic.Id = ItemEditDataArr[i].Id;
        objdynamic.OfficeAddress = ItemEditDataArr[i].OfficeAddress;
        objdynamic.WHAddress = ItemEditDataArr[i].WHAddress;
        objdynamic.Email = ItemEditDataArr[i].Email;
        objdynamic.ContactNo = ItemEditDataArr[i].ContactNo;
        objdynamic.InChargeName = ItemEditDataArr[i].WH_InChargeName;
        if (ItemEditDataArr[i].Isactive == true) {
          objdynamic.Isactive = "1";
        } else {
          objdynamic.Isactive = "0";
        }
        this.dynamicArrayWHAddres.push(objdynamic);
      }
    }
  }


  addRow() {
    var objNewItemGrid = new DynamicWHAddress();
    objNewItemGrid.Id = "0";
    objNewItemGrid.WHId = "";
    objNewItemGrid.WHAddress = "";
    objNewItemGrid.OfficeAddress = "";
    objNewItemGrid.Email = "";
    objNewItemGrid.ContactNo = "";
    objNewItemGrid.InChargeName = "";
    objNewItemGrid.Isactive = "";
    this.dynamicArrayWHAddres.push(objNewItemGrid);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArrayWHAddres.length == 1) {
      return false;
    } else {
      this.dynamicArrayWHAddres.splice(index, 1);
      return true;
    }
  }

  ClearWHMasterForm() {
    this.model.hiddenWHId = 0;
    this.model.WHName = "";
    this.model.WHCode = "";
    this.model.StateId = "0";
    this.model.GSTNo = "";
    this.model.MobileNo = "";
    this.model.EmailId = "";
    this.model.WHInChargeName = "";
    this.model.StatusId = "";
    this.DisabledWHName = false;
    this.dynamicArrayWHAddres = [];
  }


  //#region  validation




  WHAddressKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.WhAddress').val();
      if (valueItem != '') {
        $(this).find('.WhAddress').css('border-color', '');
      }
    });
  }
  OfficeAddressKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.officeAddress').val();
      if (valueItem != '') {
        $(this).find('.officeAddress').css('border-color', '');
      }
    });
  }
  EmailKeyPress() {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Email').val();
      if (valueItem != '') {
        $(this).find('.Email').css('border-color', '');
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

  ChangeStatus(Id: any, index: any) {
    $('#tblOne > tbody  > tr').each(function () {
      var valueItem = $(this).find('.Isactive').val();
      if (valueItem != '') {
        $(this).find('.Isactive').css('border-color', '');
      }
    });
  }

  ChangeStateName() {
    $("#ddlStateId").css('border-color', '');
  }
  onKeypressWH() {
    $("#txtWHName").css('border-color', '');
  }
  onKeypressWHCode() {
    $("#txtWHCode").css('border-color', '');
  }
  onKeypressMobileNo() {
    $("#txtMobileNo").css('border-color', '');
  }
  onKeypressGSTNo() {
    $("#txtGSTNo").css('border-color', '');
  }

  ValidationBasic() {
    var flag = 0;
    if (this._Commonservices.checkUndefined(this.model.StateId) == "0") {
      $('#ddlStateId').css('border-color', 'red')
      $('#ddlStateId').focus();
      flag = 1;
    } else {
      $("#ddlStateId").css('border-color', '')
    }
    if (this._Commonservices.checkUndefined(this.model.WHName) == "") {
      $('#txtWHName').css('border-color', 'red')
      $('#txtWHName').focus();
      flag = 1;
    } else {
      $("#txtWHName").css('border-color', '')
    }
    if (this._Commonservices.checkUndefined(this.model.WHCode) == "") {
      $('#txtWHCode').css('border-color', 'red')
      $('#txtWHCode').focus();
      flag = 1;
    } else {
      $("#txtWHCode").css('border-color', '')
    }
    if (this._Commonservices.checkUndefined(this.model.GSTNo) == "") {
      $('#txtGSTNo').css('border-color', 'red')
      $('#txtGSTNo').focus();
      flag = 1;
    } else {
      $("#txtGSTNo").css('border-color', '')
    }
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
      var valueWhAddress = $(this).find('.WhAddress').val();
      if (valueWhAddress == '') {
        flag = 1;
        $(this).find('.WhAddress').css('border-color', 'red');
      }

      var valueAddress = $(this).find('.officeAddress').val();
      if (valueAddress == '') {
        flag = 1;
        $(this).find('.officeAddress').css('border-color', 'red');
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
      var valueEmail = $(this).find('.Email').val();
      if (valueEmail == '') {
        flag = 1;
        $(this).find('.Email').css('border-color', 'red');
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
