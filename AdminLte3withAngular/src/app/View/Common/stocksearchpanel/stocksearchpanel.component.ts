import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/Service/common.service';
import { SearchpanelService } from 'src/app/Service/searchpanel.service';
import { CommonSearchPanelModel, CompanyStateVendorItemModel, DropdownModel, SearchItemLineTypeModel, StockSearchPanelModel } from 'src/app/_Model/commonModel';
import { CompanyModel } from 'src/app/_Model/userModel';

@Component({
  selector: 'app-stocksearchpanel',
  templateUrl: './stocksearchpanel.component.html',
  styleUrls: ['./stocksearchpanel.component.sass'],
  providers: [DatePipe]
})

export class StocksearchpanelComponent implements OnInit {
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
  SearchItemClassList = [];
  SelectedItemClassList = [];
  SearchItemNameList = [];
  ItemNameDetailData = [];
  SelectedSearchItemNameList = [];
  SelectedSearchItemMakeList = [];
  SelectedSearchItemCodeList = [];
  SelectedSearchItemCapacityList = [];
  SearchItemMakeList = [];
  SearchItemCodeList = [];
  SearchItemCapacityList = [];
  CompanyData = [];
  VendorEditList = [];
  TempItemCodeData = [];
  TempItemCapacityData = [];

  objStockSearchPanelModel: StockSearchPanelModel = {
    Startdate: '', Enddate: '', State_Id: '', MakeId: '',
    ItemCodeId: '', CapacityId: '', ItemId: '', ItemClassId: '', WHId: '', ClientId: '', ReportTypeId: '1',
  }
  EquipmentTypeList: any;
  UserId: any;
  WareHouseId: any;
  ClientList: any;
  UniqueSitekeyword = 'itemName';

  constructor(private SearchPanel: SearchpanelService, private _Commonservices: CommonService, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    var objCompanyModel = new CompanyModel();
    objCompanyModel = JSON.parse(sessionStorage.getItem("CompanyIdSession"));
    this.CompanyId = objCompanyModel.Company_Id;
    this.BindCompanyStateVendorItem();
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    this.UserId = objUserModel.User_Id;
    this.model.TimePeriod = "Dsd";
    this.changeTimePeriod('Dsd');
    this.model.ClientId = "0";
    this.model.ReportTypeId = "1";
    var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
    this.objStockSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);

    var EDate = this._Commonservices.checkUndefined(this.model.EndDateModel);
    this.objStockSearchPanelModel.Enddate = EDate.year + '/' + EDate.month + '/' + EDate.day;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);

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


  }

  async BindCompanyStateVendorItem() {
    var objCSVTdata = new CompanyStateVendorItemModel();
    objCSVTdata.Company_Id = parseInt(this.CompanyId);
    this.apiCSVIData = await this._Commonservices.getCompanyStateVendorItem(objCSVTdata);
    if (this.apiCSVIData.Status == 1) {
      objCSVTdata.CompanyArray = this.apiCSVIData.CompanyArray;
      objCSVTdata.StateArray = this.apiCSVIData.StateArray;
      objCSVTdata.ItemArray = this.apiCSVIData.ItemArray;
      objCSVTdata.EquipmentArray = this.apiCSVIData.EquipmentArray;
      objCSVTdata.ClientArray = this.apiCSVIData.ClientArray;
      objCSVTdata.ItemClassArray = this.apiCSVIData.ItemClassArray;
      this.WareHouseId = this.apiCSVIData.WHId;
      this.SearchStateList = objCSVTdata.StateArray;
      this.SearchItemNameList = objCSVTdata.ItemArray;
      this.EquipmentTypeList = objCSVTdata.EquipmentArray;
      this.ClientList = objCSVTdata.ClientArray;
      this.SearchItemClassList = objCSVTdata.ItemClassArray;
      sessionStorage.setItem("WareHouseIdes", this.WareHouseId);
    }
  }

  BindSearchWHList(para: string) {
    this.objStockSearchPanelModel.State_Id = '';
    this.SelectedSearchWHList = [];
    this.SearchWHList = [];
    
    if (para == "DelAll") {
      this.SelectedSearchStateList = [];
    } else if (this.SelectedSearchStateList.length > 0) {
      this.objStockSearchPanelModel.State_Id = this.SelectedSearchStateList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Other_Id = this.objStockSearchPanelModel.State_Id;
      objdropdownmodel.Parent_Id = this.CompanyId;
      objdropdownmodel.Flag = 'WHMaster';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(wh => {
        this.SearchWHList = wh.Data;
      });
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  onClickWH(para: string) {
    this.objStockSearchPanelModel.WHId = '';      
    if (para == "DelAll") {
      this.SelectedSearchWHList = [];
    } else if (this.SelectedSearchWHList.length > 0) {
      this.objStockSearchPanelModel.WHId = this.SelectedSearchWHList.map(xx => xx.id).join(',');;      
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  ChangeClient(items: any) {
    this.objStockSearchPanelModel.ClientId = this.model.ClientId;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }


  BindSearchItemName(para: string) {
    this.objStockSearchPanelModel.ItemClassId = '';
    this.objStockSearchPanelModel.ItemId = '';
    this.objStockSearchPanelModel.CapacityId = '';
    this.objStockSearchPanelModel.MakeId = '';
    this.objStockSearchPanelModel.ItemCodeId = '';
    
    
    this.SearchItemNameList = [];
    this.SelectedSearchItemNameList = [];
    this.SearchItemCapacityList = [];
    this.SelectedSearchItemCapacityList = [];
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    if (para == "DelAll") {
      this.SelectedItemClassList = [];
    }else if (this.SelectedItemClassList.length > 0) {
      this.objStockSearchPanelModel.ItemClassId = this.SelectedItemClassList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objStockSearchPanelModel.ItemClassId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'ItemName';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemNameList = item.Data;
      });
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  BindSearchCapacity(para: string) {
    this.objStockSearchPanelModel.ItemId = '';
    this.objStockSearchPanelModel.CapacityId = '';
    this.objStockSearchPanelModel.MakeId = '';
    this.objStockSearchPanelModel.ItemCodeId = '';
    
    this.SearchItemCapacityList = [];
    this.SelectedSearchItemCapacityList = [];
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];

    if (para == "DelAll") {
      this.SelectedSearchItemNameList = [];
    } else if (this.SelectedSearchItemNameList.length > 0) {
      this.objStockSearchPanelModel.ItemId = this.SelectedSearchItemNameList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objStockSearchPanelModel.ItemId;
      objdropdownmodel.Other_Id = "0";
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'CommonSearchCapacity';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemCapacityList = item.Data;
      });
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  BindSearchItemMake(para: string) {
    this.objStockSearchPanelModel.CapacityId = '';
    this.objStockSearchPanelModel.MakeId = '';
    this.objStockSearchPanelModel.ItemCodeId = '';
    
    this.SearchItemMakeList = [];
    this.SelectedSearchItemMakeList = [];
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];
    
    if (para == "DelAll") {
      this.SelectedSearchItemCapacityList = [];
    } else if (this.SelectedSearchItemCapacityList.length > 0) {
      this.objStockSearchPanelModel.CapacityId = this.SelectedSearchItemCapacityList.map(xx => xx.id).join(',');
      var objdropdownmodel = new DropdownModel();
      objdropdownmodel.User_Id = 0;
      objdropdownmodel.Parent_Id = this.objStockSearchPanelModel.ItemId;
      objdropdownmodel.Other_Id = this.objStockSearchPanelModel.CapacityId;
      objdropdownmodel.Company_Id = this.CompanyId;
      objdropdownmodel.Flag = 'CommonSearchItemMake';
      this._Commonservices.getdropdown(objdropdownmodel).subscribe(item => {
        this.SearchItemMakeList = item.Data;
      });
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }


  BindSearchItemCodeAndDescription(para: string) {
    this.objStockSearchPanelModel.MakeId = '';
    this.objStockSearchPanelModel.ItemCodeId = '';
    
    this.SearchItemCodeList = [];
    this.SelectedSearchItemCodeList = [];

    if (para == "DelAll") {
      this.SelectedSearchItemMakeList = [];
    }else if (this.SelectedSearchItemMakeList.length > 0) {
      this.objStockSearchPanelModel.MakeId = this.SelectedSearchItemMakeList.map(xx => xx.id).join(',');
    }
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  async SearchChangeItemCode(items: any) {
    // this.SearchItemCapacityList = [];
    // this.SelectedSearchItemCapacityList = [];
    var objdropdownmodel = new SearchItemLineTypeModel();
    objdropdownmodel.UserId = 0;
    if (this.objStockSearchPanelModel.ItemId == null || this.objStockSearchPanelModel.ItemId == '') {
      objdropdownmodel.ItemId = '0';
    } else {
      objdropdownmodel.ItemId = this.objStockSearchPanelModel.ItemId;
    }
    if (this.objStockSearchPanelModel.CapacityId == null || this.objStockSearchPanelModel.CapacityId == '') {
      objdropdownmodel.CapacityId = '0';
    } else {
      objdropdownmodel.CapacityId = this.objStockSearchPanelModel.CapacityId;
    }
    if (this.objStockSearchPanelModel.MakeId == null || this.objStockSearchPanelModel.MakeId == '') {
      objdropdownmodel.MakeId = '0';
    } else {
      objdropdownmodel.MakeId = this.objStockSearchPanelModel.MakeId;
    }
    objdropdownmodel.CompanyId = this.CompanyId;
    objdropdownmodel.searchKey = items;
    this.apiItemCodeAndDescriptionData = await this._Commonservices.NewGetItemCodeAndItemDescription(objdropdownmodel);
    if (this.apiItemCodeAndDescriptionData.Status == 1) {
      this.SearchItemCodeList = this.apiItemCodeAndDescriptionData.ItemCodeArray;
      //this.TempItemCodeData = this.apiItemCodeAndDescriptionData.ItemCodeArray;
      //this.TempItemCapacityData = this.apiItemCodeAndDescriptionData.ItemDescriptionArray;
    }
  }

  // onClickCapacity(para: string) {
  //   this.objStockSearchPanelModel.CapacityId = '';      
  //   if (para == "DelAll") {
  //     this.SelectedSearchItemCapacityList = [];
  //   } else if (this.SelectedSearchItemCapacityList.length > 0) {
  //     this.objStockSearchPanelModel.CapacityId = this.SelectedSearchItemCapacityList.map(xx => xx.id).join(',');;      
  //   }
  //   this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  // }

  changeTimePeriod(TimePeriodVal: string) {
    var sfDate = new Date();
    var stDate = new Date();
    var fromDate = "";
    var toDate = "";
    if (TimePeriodVal == 'Tod') {
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      this.model.StartDateModel = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };
      this.model.EndDateModel = { day: parseInt(toDate.split('/')[2]), month: parseInt(toDate.split('/')[1]), year: parseInt(toDate.split('/')[0]) };

      var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
      this.objStockSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.objStockSearchPanelModel.Enddate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);

    } else if (TimePeriodVal == 'Yst') {
      stDate.setDate(stDate.getDate() - 1);
      toDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
      this.objStockSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.objStockSearchPanelModel.Enddate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);

    } else if (TimePeriodVal == '24Last') {
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 1);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };


      this.objStockSearchPanelModel.Startdate = fromDate;
      this.objStockSearchPanelModel.Enddate = toDate;
      this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);

    } else if (TimePeriodVal == '1W') {
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 7);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      this.objStockSearchPanelModel.Startdate = fromDate;
      this.objStockSearchPanelModel.Enddate = toDate;
      this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);


    } else if (TimePeriodVal == '1M') {

      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 30);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      this.objStockSearchPanelModel.Startdate = fromDate;
      this.objStockSearchPanelModel.Enddate = toDate;
      this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
    } else if (TimePeriodVal == 'Dsd') {
      //  this.model.StartDateModel=null;
      //  this.model.EndDateModel=null;

      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");

      this.model.StartDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt("1") };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      this.objStockSearchPanelModel.Startdate = this.model.StartDateModel;
      this.objStockSearchPanelModel.Enddate = toDate;
      this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);

    }
  }

  StatDateInput(event: any) {
    var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
    this.objStockSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  EndDateInput(event: any) {
    var EDate = this._Commonservices.checkUndefined(this.model.EndDateModel);
    this.objStockSearchPanelModel.Enddate = EDate.year + '/' + EDate.month + '/' + EDate.day;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  onChangeReportType() {
    this.objStockSearchPanelModel.ReportTypeId = this.model.ReportTypeId;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

  onSelectAutoItemCodeId(items: any) {
    //this.SelectedSearchItemCodeList=items.id;
    // var FilterData = this.TempItemCapacityData.filter(m => m.id === parseInt(items.id));
    // this.SelectedSearchItemCapacityList = [{ "id": '' + FilterData[0].id + '', "itemName": '' + FilterData[0].itemName + '' }];
    // this.SearchItemCapacityList.push(FilterData[0]);

    this.objStockSearchPanelModel.ItemCodeId = items.id;
    this.SearchPanel.StockSearchPanelDataChanges(this.objStockSearchPanelModel);
  }

}