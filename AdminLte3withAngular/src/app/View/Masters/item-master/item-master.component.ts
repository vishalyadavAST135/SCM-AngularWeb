import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { identity } from 'rxjs';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer.component';
import { CustomTooltipComponent } from 'src/app/renderer/customtooltip.component';
import { FileRendererComponent } from 'src/app/renderer/file-renderer.component';
import { CommonService } from 'src/app/Service/common.service';
import { GlobalErrorHandlerServiceService } from 'src/app/Service/global-error-handler-service.service';
import { MasterservicesService } from 'src/app/Service/masterservices.service';
import { PurchaseOrderService } from 'src/app/Service/purchase-order.service';
import { CompanyStateVendorItemModel, DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { ItemNameModel, VendorModel } from 'src/app/_Model/MastersModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.sass']
})
export class ItemMasterComponent implements OnInit {
  model: any = {};
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public multiSortKey: string;
  public MultidropdownSettings = {};
  public columnDefs = [];
  rowData = [];
  CompanyData = [];
  SearchItemNameList = [];
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
  @ViewChild("content") modalContent: TemplateRef<any>;
  SearchItemClassList: any;
  apiCSVIData: any = {};
  ObjUserPageRight = new UserPageRight();
  Save: any;
  ItemNameId: number = 0;


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
    this.model.SearchItemName = "0";
    this.model.IsSerialReq = "2";
    this.model.IsCertificate = "2";
    this.model.ItemClass = "0";
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    if (objUserModel == null || objUserModel == "null") {
      this.router.navigate(['']);
    }
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;



    try {
      var objParameter = new DropdownModel();
      objParameter.User_Id = this.UserId;
      objParameter.Parent_Id = "0";
      objParameter.Other_Id = "";
      objParameter.Company_Id = this.CompanyId;
      objParameter.Flag = "ItemName";
      this._Commonservices.getdropdown(objParameter).subscribe(data => {
        console.log(data);
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.SearchItemNameList = data.Data;
            console.log(this.SearchItemNameList);
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "getdropdown";
      objWebErrorLogModel.ErrorPage = "ItemMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
    }

    this.columnDefs = [
      {
        headerName: 'Edit',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.ShowItemMasterDeatil.bind(this),
          label: 'edit'
        }, pinned: 'left',
        width: 58,
        filter: false
      },
      { headerName: 'Item Class', field: 'Class', width: 200, sortable: true, filter: true, },
      { headerName: 'Item Name', field: 'ItemName', width: 200, resizable: true, filter: true, },
      { headerName: 'HSN Code', field: 'HSNCode', width: 180, sortable: true, filter: true, },
      { headerName: 'Certificate Req', field: 'IsCertificate', width: 200, sortable: true, filter: true, },
      { headerName: 'Serial No Req', field: 'IsSerialReq', width: 200, sortable: true, filter: true, },
      { headerName: 'Status', field: 'IsActive', width: 150 },
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
    this.BindCompanyStateVendorItem();
    //brahamjot kaur 31/10/2022
    this.GetUserPageRight(this.ItemNameId);
  }

  //brahamjot kaur 31/10/2022
  async GetUserPageRight(id: number) {
    this._Commonservices.GetUserPageRight(this.UserId, MenuName.ItemMasters).subscribe(data => {
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


  async BindCompanyStateVendorItem() {

    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.ItemClassArray = this.apiCSVIData.ItemClassArray;
      this.SearchItemClassList = objCSVTdata.ItemClassArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }

  onGridReady(params) {
  }

  CreateNew() {
    // this.isShownList=false;  
    // this.isShownEdit=true;
    this.model.Isactive = "2";
    this.ConfirmmationClick();
    this.model.hiddenItemNameId = null;
    this.model.hiddenItemNameId = 0;
    this.ClearItemMasterForm();
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

  AddUpdateItemMasterDetial() {
    try {
      if (this.ValidationBasic() == 1) {
        return false;
      }
      var objItemNameModel = new ItemNameModel();
      objItemNameModel.Id = this.model.hiddenItemNameId;
      objItemNameModel.UserId = this.UserId;
      objItemNameModel.ItemName = this.model.ItemName;
      objItemNameModel.HSNCode = this.model.HSNCode;
      objItemNameModel.Status = this.model.Isactive;
      objItemNameModel.IsSerialReq = this.model.IsSerialReq;
      objItemNameModel.IsCertificate = this.model.IsCertificate;
      objItemNameModel.ItemClass = this.model.ItemClass;
      objItemNameModel.Flag = "ItemMaster";
      this._MasterService.AddUpdateItemMasterDetial(objItemNameModel).subscribe(data => {
        if (data.Status == 1) {
          setTimeout(() => {
            alert('your data has been save successfully ')
          }, 300);
          this.ClearItemMasterForm();
        } else if (data.Status == 2) {
          setTimeout(() => {
            alert('your data has been update successfully ')
          }, 300);
        } else if (data.Status == 0) {
          setTimeout(() => {
            alert('Please try again')
          }, 300);
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "SaveVendorBasicDetial";
      objWebErrorLogModel.ErrorPage = "ItemMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      // console.log(Error.message)
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


  SearchItemMasterGridList(para: string) {
    try {
      var objpara = new ItemNameModel();
      var ItemId = this._Commonservices.checkUndefined(this.model.SearchItemName);
      var StatusId = this._Commonservices.checkUndefined(this.StatusData);
      if (ItemId != "") {
        objpara.Id = this.model.SearchItemName;
      } else {
        objpara.Id = 0;
      }
      if (StatusId == '') {
        objpara.Status = '';
      } else {
        objpara.Status = StatusId;
      }
      objpara.Flag = para;
      this._MasterService.GetAllItemMasterList(objpara).subscribe(data => {
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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'ItemNameMaster');
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
      objWebErrorLogModel.ErrorPage = "ItemNameMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }

  ShowItemMasterDeatil(e) {
    this.ItemNameId = e.rowData.ItemNameId;
    this.GetUserPageRight(this.ItemNameId);
    this.SearchGetAllItemMasterDeatilById(this.ItemNameId);
  }

  SearchGetAllItemMasterDeatilById(Id: any) {
    try {
      var objModel = new ItemNameModel();
      objModel.Id = Id;
      objModel.Flag = "ItemMaster";
      this._MasterService.GetAllItemMasterDeatilById(objModel).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.ConfirmmationClick();
            this.model.hiddenItemNameId = data.Data[0].ItemNameId;
            this.model.ItemName = data.Data[0].ItemName;
            this.model.HSNCode = data.Data[0].HSNCode;
            if (data.Data[0].IsActive == true) {
              this.model.Isactive = 1;
            } else {
              this.model.Isactive = 0;
            }
            if (data.Data[0].IsSerialReq == true) {
              this.model.IsSerialReq = 1;
            } else {
              this.model.IsSerialReq = 0;
            }
            if (data.Data[0].IsCertificate == true) {
              this.model.IsCertificate = 1;
            } else {
              this.model.IsCertificate = 0;
            }
            var VItemClass = this.SearchItemClassList.filter(
              m => m.id === parseInt(data.Data[0].Class));
            this.model.ItemClass = VItemClass[0].id;
          } else {
            this.model.ItemClass = "0";
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllItemMasterDeatilById";
      objWebErrorLogModel.ErrorPage = "ItemMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }






  ClearItemMasterForm() {
    this.model.ItemName = "";
    this.model.HSNCode = "";
    this.model.Isactive = "2";
  }


  //#region  validation
  onKeypressVendorName() {
    $("#txtItemName").css('border-color', '')
  }

  ChangeStatus() {
    $("#txtStatus").css('border-color', '')
  }
  ChangeSerialReq() {
    $("#txtSerial").css('border-color', '')
  }
  ChangeItemClass() {
    $("#txtClass").css('border-color', '')
  }
  ChangeCertificate() {
    $("#txtCertificate").css('border-color', '')
  }

  ValidationBasic() {
    var flag = 0;
    if (this._Commonservices.checkUndefined(this.model.ItemName) == "") {
      $('#txtItemName').css('border-color', 'red')
      $('#txtItemName').focus();
      flag = 1;
    } else {
      $("#txtStatus").css('border-color', '')
    }

    // if (this._Commonservices.checkUndefined(this.model.MobileNo) == "" ) {
    //   $('#txtMobileNo').css('border-color', 'red')
    //     $('#txtMobileNo').focus();
    //     flag = 1;
    // } else {
    //   $("#txtMobileNo").css('border-color', '')
    // }

    if (this.model.Isactive == "2") {
      $('#txtStatus').addClass('box')
      $('#txtStatus').focus();
      flag = 1;
    } else {
      $("#txtStatus").css('border-color', '')
    }
    if (this.model.IsSerialReq == "2") {
      $('#txtSerial').addClass('box')
      flag = 1;
    } else {
      $("#txtSerial").css('border-color', '')
    }
    if (this.model.IsCertificate == "2") {
      $('#txtCertificate').addClass('box')
      flag = 1;
    } else {
      $("#txtCertificate").css('border-color', '')
    }
    if (this.model.ItemClass == "0") {
      $('#txtClass').addClass('box')
      flag = 1;
    } else {
      $("#txtClass").css('border-color', '')
    }


    return flag;
  }


  //#endregion


}
