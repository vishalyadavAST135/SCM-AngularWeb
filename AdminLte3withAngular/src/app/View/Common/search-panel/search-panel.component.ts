import { Component, Input, OnInit } from '@angular/core';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CompanyStateVendorItemModel, DropdownModel, CommonSearchPanelModel, SearchItemLineTypeModel } from 'src/app/_Model/commonModel';
import { CompanyModel } from 'src/app/_Model/userModel';
import { CommonService } from 'src/app/Service/common.service';
import { NgbDateStruct, NgbDateAdapter, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.sass'],
  providers: [DatePipe]
})

export class SearchPanelComponent implements OnInit {
  model: any = {};
  CompanyId: any;
  StartDateModel: NgbDateStruct; // start date
  EndDateModel: NgbDateStruct;// end date
  apiCSVIData: any = {};
  apiItemCodeAndDescriptionData: any = {};
  SearchStateList = [];
  public MultidropdownSettings = {};
  public SingledropdownSettings = {};
  SelectedSearchStateList = [];
  SelectedSearchWHList = [];
  SearchWHList = [];
  SearchVendorList = [];
  SelectedSearchVendorList = [];
  SearchItemClassList = [];
  SelectedItemClassList = [];
  //ItemNameDetailData=[];
  SearchItemNameList = [];
  SelectedSearchItemNameList = [];
  SelectedSearchItemMakeList = [];
  SelectedSearchItemCodeList = [];
  SearchItemMakeList = [];
  SearchItemCodeList = [];
  SearchItemCapacityList = [];
  SelectedSearchItemCapacityList = [];
  CompanyData = [];
  VendorEditList = [];
  TempItemCodeData = [];
  TempItemCapacityData = [];
  SearchItemDescList=[];
  SelectedSearchItemDescList = [];
  UniqueSitekeyword = 'itemName';
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
  EquipmentTypeList: any;
  UserId: any;
  @Input() IsHiddenvendor: any = true;
  @Input() IsHiddenSearchCustomer: any = true;
  ClientList: any;
  minDate: { year: number; month: number; day: number; };
  IsTimeDisable: boolean = true; //vishal, 10/02/2023

  constructor(private SearchPanel: SearchpanelService, private _Commonservices: CommonService, private datePipe: DatePipe,) { }
  ngOnInit(): void {
    this.model.ddlCustomer = "0";
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;

    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.model.TimePeriod = "Tod";
    this.changeTimePeriod('Tod');

    var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
    this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);

    var EDate = this._Commonservices.checkUndefined(this.model.EndDateModel);
    this.objCommonSearchPanelModel.Enddate = EDate.year + '/' + EDate.month + '/' + EDate.day;
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);

    this.MultidropdownSettings = {
      singleSelection: false,
      text: "Select",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      // limitSelection:1
      badgeShowLimit: 1,
    };
    this.SingledropdownSettings = {
      singleSelection: true,
      text: "Select",
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
    };

    // if (sessionStorage.getItem("CompStatVenItmSession") == null || sessionStorage.getItem("CompStatVenItmSession") == "null") {
    //   this.BindCompanyStateVendorItem();
    // } else {
    //   var objCSVTdata = newsearchModel CompanyStateVendorItemModel();
    //   objCSVTdata = JSON.parse(sessionStorage.getItem("CompStatVenItmSession"));
    //   this.CompanyData = objCSVTdata.CompanyArray;
    //   this.SearchStateList = objCSVTdata.StateArray;
    //   this.SearchVendorList = objCSVTdata.VendorArray;
    //   //this.VendorEditList=objCSVTdata.VendorArray;
    //   this.SearchItemNameList = objCSVTdata.ItemArray;
    //   this.EquipmentTypeList = objCSVTdata.EquipmentArray;
    //   this.SearchItemClassList = objCSVTdata.ItemClassArray;
    //   this.ClientList = objCSVTdata.ClientArray;
    //   //this.ItemNameDetailData=objCSVTdata.ItemArray;
    // }
    this.BindCompanyStateVendorItem();
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth()+1,
      day: current.getDate()
    };    
  }

  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.VendorArray = this.apiCSVIData.VendorArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      objCSVTdata.WHId = this.apiCSVIData.WHId;
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      objCSVTdata.ItemClassArray = this.apiCSVIData.ItemClassArray;
      this.SearchStateList = objCSVTdata.StateArray;
      this.SearchVendorList = objCSVTdata.VendorArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      //this.ItemNameDetailData=objCSVTdata.ItemArray;
      this.SearchItemClassList = objCSVTdata.ItemClassArray;
      this.ClientList = objCSVTdata.ClientArray;
      sessionStorage.setItem("CompStatVenItmSession", JSON.stringify(objCSVTdata));
    }
  }

  BindSearchWHList(para: string) {
    this.objCommonSearchPanelModel.State_Id = '';
    this.SelectedSearchWHList = [];
    this.SearchWHList = [];

    if (para == "DelAll") {
      this.SelectedSearchStateList = [];
    } else if (this.SelectedSearchStateList.length > 0) {
      this.objCommonSearchPanelModel.State_Id = this.SelectedSearchStateList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Other_Id = this.objCommonSearchPanelModel.State_Id;
      objdropdownmodel.Parent_Id = this.CompanyId;
      objdropdownmodel.Flag = 'WHMaster';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
        this.SearchWHList = wh.Data;
      });
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  onClickWH(para: string) {
    this.objCommonSearchPanelModel.WHId = '';
    if (para == "DelAll") {
      this.SelectedSearchWHList = [];
    } else if (this.SelectedSearchWHList.length > 0) {
      this.objCommonSearchPanelModel.WHId = this.SelectedSearchWHList.map(xx => xx.id).join(',');;
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  onClickVendor(para: string) {
    this.objCommonSearchPanelModel.VendorId = '';
    if (para == "DelAll") {
      this.SelectedSearchVendorList = [];
    } else if (this.SelectedSearchVendorList.length > 0) {
      this.objCommonSearchPanelModel.VendorId = this.SelectedSearchVendorList.map(xx => xx.id).join(',');;
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  BindSearchItemName(para: string) {
    this.objCommonSearchPanelModel.ItemClassId = '';
    this.objCommonSearchPanelModel.ItemId = '';
    this.objCommonSearchPanelModel.MakeId = '';
    this.objCommonSearchPanelModel.ItemCodeId = '';
    this.objCommonSearchPanelModel.CapacityId = '';
    this.objCommonSearchPanelModel.DescriptionId = '';
    this.SearchItemNameList = [];
    this.SelectedSearchItemNameList = [];
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    this.SearchItemCapacityList = [];
    this.SelectedSearchItemCapacityList = [];
    this.SearchItemDescList = [];
    this.SelectedSearchItemDescList = [];
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
    this.objCommonSearchPanelModel.MakeId = '';
    this.objCommonSearchPanelModel.ItemCodeId = '';
    this.objCommonSearchPanelModel.CapacityId = '';
    this.objCommonSearchPanelModel.DescriptionId = '';
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
     this.SearchItemCapacityList = [];
     this.SelectedSearchItemCapacityList = [];
    this.SearchItemDescList = [];
    this.SelectedSearchItemDescList = [];
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
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemCapacityList = item.Data;
      });
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }



  BindSearchItemMake(para: string) {
    // this.objCommonSearchPanelModel.ItemId = '';
    this.objCommonSearchPanelModel.CapacityId = '';
    this.objCommonSearchPanelModel.MakeId = '';
    this.objCommonSearchPanelModel.ItemCodeId = '';
    this.objCommonSearchPanelModel.DescriptionId = '';
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    this.SearchItemDescList = [];
    this.SelectedSearchItemDescList = [];
    if (para == "DelAll") {
      this.SelectedSearchItemCapacityList = [];
    } else if (this.SelectedSearchItemCapacityList.length > 0) {
      this.objCommonSearchPanelModel.CapacityId = this.SelectedSearchItemCapacityList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objCommonSearchPanelModel.ItemId;
      objdropdownmodel.Other_Id = this.objCommonSearchPanelModel.CapacityId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'CommonSearchItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemMakeList = item.Data;
      });
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }



  BindSearchItemCodeAndDescription(para: string) {
    this.objCommonSearchPanelModel.MakeId = '';
    this.objCommonSearchPanelModel.ItemCodeId = '';
    this.objCommonSearchPanelModel.CapacityId = '';
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    // this.SearchItemCapacityList = [];
    // this.SelectedSearchItemCapacityList = [];
    this.SearchItemDescList = [];
    this.SelectedSearchItemDescList = [];
    if (para == "DelAll") {
      this.SelectedSearchItemMakeList = [];
    } else if (this.SelectedSearchItemMakeList.length > 0) {
      this.objCommonSearchPanelModel.MakeId = this.SelectedSearchItemMakeList.map(xx => xx.id).join(',');
    }
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  async SearchChangeItemCode(items: any) {
    // this.SearchItemCapacityList = [];
    // this.SelectedSearchItemCapacityList = [];
    this.SearchItemDescList = [];
    this.SelectedSearchItemDescList = [];
    var objdropdownmodel = new SearchItemLineTypeModel();
    objdropdownmodel.UserId = 0;
    if (this.objCommonSearchPanelModel.ItemId == null || this.objCommonSearchPanelModel.ItemId == '') {
      objdropdownmodel.ItemId = '0';
    } else {
      objdropdownmodel.ItemId = this.objCommonSearchPanelModel.ItemId;
    }
    if (this.objCommonSearchPanelModel.CapacityId == null || this.objCommonSearchPanelModel.CapacityId == '') {
      objdropdownmodel.CapacityId = '0';
    } else {
      objdropdownmodel.CapacityId = this.objCommonSearchPanelModel.CapacityId;
    }
    if (this.objCommonSearchPanelModel.MakeId == null || this.objCommonSearchPanelModel.MakeId == '') {
      objdropdownmodel.MakeId = '0';
    } else {
      objdropdownmodel.MakeId = this.objCommonSearchPanelModel.MakeId;
    }
    objdropdownmodel.CompanyId = this.CompanyId;
    objdropdownmodel.searchKey = items;
    this.apiItemCodeAndDescriptionData = await this._Commonservices.NewGetItemCodeAndItemDescription(objdropdownmodel);
    if (this.apiItemCodeAndDescriptionData.Status == 1) {
      this.SearchItemCodeList = this.apiItemCodeAndDescriptionData.ItemCodeArray;
      this.TempItemCodeData = this.apiItemCodeAndDescriptionData.ItemCodeArray;
      //this.SearchItemCapacityList = this.apiItemCodeAndDescriptionData.ItemDescriptionArray;
      this.TempItemCapacityData = this.apiItemCodeAndDescriptionData.ItemDescriptionArray;
    }
  }

  onClickDesc(para: string) {
    this.objCommonSearchPanelModel.DescriptionId = '';
    // if (para == "DelAll") {
    //   this.SelectedSearchItemCapacityList = [];
    // } else if (this.SelectedSearchItemCapacityList.length > 0) {
    //   this.objCommonSearchPanelModel.CapacityId = this.SelectedSearchItemCapacityList.map(xx => xx.id).join(',');;
    // }
    if (para == "DelAll") {
      this.SelectedSearchItemDescList = [];
    } else if (this.SelectedSearchItemDescList.length > 0) {
      this.objCommonSearchPanelModel.DescriptionId = this.SelectedSearchItemDescList.map(xx => xx.id).join(',');;
    }
    
    this.SearchPanel.StockSearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  changeTimePeriod(TimePeriodVal: string) {
    this.IsTimeDisable = true;
    var sfDate = new Date();
    var stDate = new Date();
    var fromDate = "";
    var toDate = "";
    if (TimePeriodVal == 'Tod') {
      this.IsTimeDisable = true;
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      this.model.StartDateModel = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
      this.model.EndDateModel = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };

      var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
      this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.objCommonSearchPanelModel.Enddate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);

    } else if (TimePeriodVal == 'Yst') {
      stDate.setDate(stDate.getDate() - 1);
      toDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
      this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.objCommonSearchPanelModel.Enddate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
    } else if (TimePeriodVal == '24Last') {
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 1);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };


      this.objCommonSearchPanelModel.Startdate = fromDate;
      this.objCommonSearchPanelModel.Enddate = toDate;
      this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);

    } else if (TimePeriodVal == '1W') {
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 6);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      this.objCommonSearchPanelModel.Startdate = fromDate;
      this.objCommonSearchPanelModel.Enddate = toDate;
      this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);


    } else if (TimePeriodVal == '1M') {

      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 30);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      this.objCommonSearchPanelModel.Startdate = fromDate;
      this.objCommonSearchPanelModel.Enddate = toDate;
      this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
    } else if (TimePeriodVal == 'Dsd') {
      this.IsTimeDisable = false;
      this.model.StartDateModel = null;
      this.model.EndDateModel = null;

      this.objCommonSearchPanelModel.Startdate = '';
      this.objCommonSearchPanelModel.Enddate = '';
      this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);

    }
  }

  StatDateInput(event: any) {
    var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
    this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  EndDateInput(event: any) {
    var EDate = this._Commonservices.checkUndefined(this.model.EndDateModel);
    this.objCommonSearchPanelModel.Enddate = EDate.year + '/' + EDate.month + '/' + EDate.day;
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  onSelectAutoItemCodeId(items: any) {
    //this.SelectedSearchItemCodeList=items.id;
    var FilterData = this.TempItemCapacityData.filter(m => m.id === parseInt(items.id));
    // this.SelectedSearchItemCapacityList = [{ "id": '' + FilterData[0].id + '', "itemName": '' + FilterData[0].itemName + '' }];
    // this.SearchItemCapacityList.push(FilterData[0]);

    this.SelectedSearchItemDescList = [{ "id": '' + FilterData[0].id + '', "itemName": '' + FilterData[0].itemName + '' }];
    this.SearchItemDescList.push(FilterData[0]);


    this.objCommonSearchPanelModel.ItemCodeId = items.id;
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

  ChangeCustomer(Id: any) {
    this.objCommonSearchPanelModel.CustomerId = Id;
    this.SearchPanel.SearchPanelDataChanges(this.objCommonSearchPanelModel);
  }

}
