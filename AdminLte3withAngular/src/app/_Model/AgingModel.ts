import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export interface IAgingModel {
    reportName: string;
    CompanyId: number;
    ClientId: number;
    Startdate: string;
    StartDateModel: NgbDateStruct
}