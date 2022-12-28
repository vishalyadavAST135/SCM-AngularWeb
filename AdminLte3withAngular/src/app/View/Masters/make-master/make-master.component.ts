import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { DropdownModel, MenuName, WebErrorLogModel } from 'src/app/_Model/commonModel';
import { ItemNameModel, MakeModel } from 'src/app/_Model/MastersModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { UserPageRight } from 'src/app/_Model/UserRoleButtonModel';

@Component({
  selector: 'app-make-master',
  templateUrl: './make-master.component.html',
  styleUrls: ['./make-master.component.sass']
})
export class MakeMasterComponent implements OnInit {
  model: any = {};
  public isShownList: boolean; // Grid List
  public isShownEdit: boolean; // Form Edit
  public MultidropdownSettings = {};
  public multiSortKey: string;
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
  ObjUserPageRight = new UserPageRight();
  Save: any;
  MakeNameId: number = 0;

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
      objParameter.Parent_Id = "";
      objParameter.Other_Id = "";
      objParameter.Company_Id = this.CompanyId;
      objParameter.Flag = "MakeMaster";
      this._Commonservices.getdropdown(objParameter).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.SearchItemNameList = data.Data;
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "getdropdown";
      objWebErrorLogModel.ErrorPage = "MakeMaster";
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
        width: 158,
        filter: false
      },
      { headerName: 'Item Make ', field: 'MakeName', width: 550, resizable: true, filter: true, },
      { headerName: 'Status', field: 'IsActive', width: 500 },

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
  this.GetUserPageRight(this.MakeNameId);
}

//brahamjot kaur 31/10/2022
async GetUserPageRight(id:number) {
  this._Commonservices.GetUserPageRight(this.UserId, MenuName.MakeList).subscribe(data => {
    if (data.Status == 1) {
      console.log(data);
      this.ObjUserPageRight.IsSearch = data.Data[0].IsSearch;
      this.ObjUserPageRight.IsExport = data.Data[0].IsExport;
      this.ObjUserPageRight.IsCreate = data.Data[0].IsCreate;
      this.ObjUserPageRight.IsEdit = data.Data[0].IsEdit;

      if(this.ObjUserPageRight.IsCreate == 1 && id == 0){
        this.Save = 1;
      }else if(this.ObjUserPageRight.IsEdit == 1 && id != 0){
        this.Save = 1;
      }else{
        this.Save = 0
      }
    }
  })
}

  onGridReady(params) {
  }



  CreateNew() {
    // this.isShownList=false;  
    // this.isShownEdit=true;
    this.model.Isactive = "2";
    this.ConfirmmationClick();
    this.model.hiddenMakeId = null;
    this.model.hiddenMakeId = 0;
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
      objItemNameModel.Id = this.model.hiddenMakeId;
      objItemNameModel.UserId = this.UserId;
      objItemNameModel.ItemName = this.model.MakeName;
      objItemNameModel.Status = this.model.Isactive;
      objItemNameModel.Flag = "MakeMaster";
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
      objWebErrorLogModel.ErrorFunction = "AddUpdateItemMasterDetial";
      objWebErrorLogModel.ErrorPage = "MakeMaster";
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
      var objpara = new MakeModel();
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
      this._MasterService.GetAllMakeMasterList(objpara).subscribe(data => {
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
              this._PurchaseOrderService.exportAsExcelFile(data.Data, 'ItemMakeMaster');
            } else {

            }
          }
        }
      });
    } catch (Error) {
      var objWebErrorLogModel = new WebErrorLogModel();
      objWebErrorLogModel.ErrorBy = this.UserId;
      objWebErrorLogModel.ErrorMsg = Error.message;
      objWebErrorLogModel.ErrorFunction = "GetAllMakeMasterList";
      objWebErrorLogModel.ErrorPage = "MakeMaster";
      this._GlobalErrorHandlerService.handleError(objWebErrorLogModel);
      //console.log(Error.message)
    }
  }




  ShowItemMasterDeatil(e) {
    this.MakeNameId = e.rowData.MakeNameId;
    this.GetUserPageRight(this.MakeNameId);
    var MakeEditData = this.rowData.filter(
      m => m.MakeNameId === parseInt(e.rowData.MakeNameId));
    if (MakeEditData != null) {
      this.ConfirmmationClick();
      this.model.hiddenMakeId = MakeEditData[0].MakeNameId;
      this.model.MakeName = MakeEditData[0].MakeName;
      if (MakeEditData[0].Status == true) {
        this.model.Isactive = "1";
      } else {
        this.model.Isactive = "0";
      }
    }


  }

  ClearItemMasterForm() {
    this.model.MakeName = "";
    this.model.Isactive = "2";
  }


  //#region  validation
  onKeypressVendorName() {
    $("#txtMakeName").css('border-color', '')
  }
  ChangeStatus() {
    $("#txtStatus").css('border-color', '')
  }

  ValidationBasic() {
    var flag = 0;
    if (this._Commonservices.checkUndefined(this.model.MakeName) == "") {
      $('#txtMakeName').css('border-color', 'red')
      $('#txtMakeName').focus();
      flag = 1;
    } else {
      $("#txtMakeName").css('border-color', '')
    }

    if (this.model.Isactive == "2") {
      $('#txtStatus').addClass('box')
      $('#txtStatus').focus();
      flag = 1;
    } else {
      $("#txtStatus").css('border-color', '')
    }
    return flag;
  }


  //#endregion

}
