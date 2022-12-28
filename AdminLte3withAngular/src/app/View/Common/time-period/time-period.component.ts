import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbDateAdapter, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import { CommonService } from 'src/app/Service/common.service';
import { CommonSearchPanelModel, CommonTimePeriodPanelModel } from 'src/app/_Model/commonModel';

import { TimePeriodService } from 'src/app/Service/time-period.service';
@Component({
  selector: 'app-time-period',
  templateUrl: './time-period.component.html',
  styleUrls: ['./time-period.component.sass'],
  providers: [DatePipe]
})
export class TimePeriodComponent implements OnInit {
  model: any = {};
  CompanyId: any;
  StartDateModel: NgbDateStruct; // start date
  EndDateModel: NgbDateStruct;// end date

  objCommonSearchPanelModel: CommonTimePeriodPanelModel = {
    Startdate: '', Enddate: '',
  }

  minDate: { year: number; month: number; day: number; };
  constructor(private SearchTimePanel: TimePeriodService, private _Commonservices: CommonService, private datePipe: DatePipe,) { }

  ngOnInit(): void {
    this.model.TimePeriod = "1W";
    this.changeTimePeriod('1W');

    var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
    this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
    this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);

    var EDate = this._Commonservices.checkUndefined(this.model.EndDateModel);
    this.objCommonSearchPanelModel.Enddate = EDate.year + '/' + EDate.month + '/' + EDate.day;
    this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth()+1,
      day: current.getDate(),
    }

  }
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
      this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.objCommonSearchPanelModel.Enddate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);

    } else if (TimePeriodVal == 'Yst') {
      stDate.setDate(stDate.getDate() - 1);
      toDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
      this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.objCommonSearchPanelModel.Enddate = SDate.year + '/' + SDate.month + '/' + SDate.day;
      this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);

    } else if (TimePeriodVal == '24Last') {
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 1);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };
      this.objCommonSearchPanelModel.Startdate = fromDate;
      this.objCommonSearchPanelModel.Enddate = toDate;
      this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);

    } else if (TimePeriodVal == '1W') {
      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 6);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      this.objCommonSearchPanelModel.Startdate = fromDate;
      this.objCommonSearchPanelModel.Enddate = toDate;
      this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);


    } else if (TimePeriodVal == '1M') {

      toDate = this.datePipe.transform(sfDate, "yyyy/MM/dd");
      stDate.setDate(stDate.getDate() - 30);
      fromDate = this.datePipe.transform(stDate, "yyyy/MM/dd");
      this.model.StartDateModel = { year: parseInt(fromDate.split('/')[0]), month: parseInt(fromDate.split('/')[1]), day: parseInt(fromDate.split('/')[2]) };
      this.model.EndDateModel = { year: parseInt(toDate.split('/')[0]), month: parseInt(toDate.split('/')[1]), day: parseInt(toDate.split('/')[2]) };

      this.objCommonSearchPanelModel.Startdate = fromDate;
      this.objCommonSearchPanelModel.Enddate = toDate;
      this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);
    } else if (TimePeriodVal == 'Dsd') {
      this.model.StartDateModel = null;
      this.model.EndDateModel = null;

      this.objCommonSearchPanelModel.Startdate = '';
      this.objCommonSearchPanelModel.Enddate = '';
      this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);

    }


  }
  StatDateInput(event: any) {
    var SDate = this._Commonservices.checkUndefined(this.model.StartDateModel);
    this.objCommonSearchPanelModel.Startdate = SDate.year + '/' + SDate.month + '/' + SDate.day;
    this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);
  }

  EndDateInput(event: any) {
    var EDate = this._Commonservices.checkUndefined(this.model.EndDateModel);
    this.objCommonSearchPanelModel.Enddate = EDate.year + '/' + EDate.month + '/' + EDate.day;
    this.SearchTimePanel.SearchTimePeriodPaneChanges(this.objCommonSearchPanelModel);
  }
}
