import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DropdownModel, WebAPIConfig } from '../_Model/commonModel';
import { SearchEmployeeAccessoriesModel } from '../_Model/employeeAccessoriesModel';
import { EmpToolkitModel } from '../_Model/MastersModel';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Methods': 'POST'
});
const options = { headers: headers, crossDomain: true, withCredentials: false };
@Injectable({
  providedIn: 'root'
})

export class EmployeeAccessoriesService {
  private httpOptions: any;
  UserId: any;
  constructor(private httpclient: HttpClient) {
    var objUserModel = JSON.parse(sessionStorage.getItem("UserSession"));
    if (objUserModel != null) {
      this.UserId = objUserModel.User_Id;
    }
  }

  SearchEmployeeAccessoriesList(objSearchEmpAcr: SearchEmployeeAccessoriesModel): Observable<any> {
    var objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ToolkitAcr/GetToolkitList", objSearchEmpAcr);
  }

  SaveToolKitAccessories(objToolkitModel: SearchEmployeeAccessoriesModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ToolkitAcr/SaveEmployeeToolKit", objToolkitModel);
  }

  GetEditToolKitAccessories(objToolkitModel: SearchEmployeeAccessoriesModel): Observable<any> {
    let objBaseUrl = new WebAPIConfig();
    return this.httpclient.post(objBaseUrl.ApIUrl + "ToolkitAcr/GetToolKitEditById", objToolkitModel);
  }

  async GetWHAddressAndWHListByStId(objParameter: DropdownModel): Promise<any> {
    objParameter.User_Id = this.UserId;
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return await this.httpclient.get(objBaseUrl.ApIUrl + "Get/GetWHAddressAndWHListByStId", { params: params }).toPromise();
  }

  async GetToolkitItemList(objToolkitModel: EmpToolkitModel): Promise<any> {
    let objBaseUrl = new WebAPIConfig();
    return await this.httpclient.post(objBaseUrl.ApIUrl + "Toolkit/GetToolkitList", objToolkitModel).toPromise();
  }

  async GetAllEmployeeNameListBySiteId(objParameter: DropdownModel): Promise<any> {
    let Para = JSON.stringify(objParameter);
    let params = new HttpParams().set("para", Para);
    var objBaseUrl = new WebAPIConfig();
    return await this.httpclient.get(objBaseUrl.ApIUrl + "Get/GetAllEmployeeNameListBySiteId", { params: params }).toPromise();;
  }

  generateEmpAccessoriesPdf(data: any, action = 'open') {
    debugger
    let pdfData = data.Data[0];
    let pdfItemList = data.ItemData;
    let pdfRegData = data.RegData[0];
    debugger
    let dynamicWHAddressList = JSON.parse(data.RegData[0].RegWHAddressList);
    debugger

    let docDefinition = {
      pageSize: 'A4',
      content: [
        {
          text: 'Employee Accessories',
          style: 'header'
        },
        {
          margin: [0, 0, 0, 0],
          table: {
            body: [
              [
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              bold: true,
                              fontSize: 14,
                              alignment: 'center',
                              text: [
                                { text: `${pdfRegData.CompanyName}`, width: 240 },
                              ]
                            }
                          ]
                        }
                      ],
                      [
                        {
                          border: [0, 1, 0, 0],
                          columns: [
                            {

                              fontSize: 10,
                              text: [
                                { text: 'Regd.Office :', bold: true, }, { text: `${pdfRegData.OfficeAddress}`, alignment: 'justify', width: 230 },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 1, 0, 0],
                          width: 230,
                          columns: [
                            {
                              table: {
                                widths: ['auto', 'auto'],
                                body: [
                                  ...dynamicWHAddressList.map(p => ([
                                    { text: 'W/h Address', fontSize: 9, border: [0, 0, 0, 1] },
                                    { text: p.WHAddress, fontSize: 9, border: [0, 0, 0, 1] }])),
                                ]
                              }
                            }
                          ]
                        }
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN No :', bold: true },
                                { text: `${pdfRegData.GSTIN_UIN}`, width: 230 },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 1, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'CIN No : ', bold: true }, { text: `${pdfRegData.CIN}`, width: 230 },
                              ]
                            },
                          ]
                        },
                      ]
                    ]
                  }
                },
                ///start Document
                {
                  border: [1, 1, 1, 0],
                  width: 240,
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 100,
                              fontSize: 10,
                              text: [
                                { text: 'DocumentNo', bold: true }
                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 140,
                              fontSize: 10,
                              text: [
                                { text: `${pdfData.DocNo}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'Date : ', bold: true },
                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                {
                                  text: `${pdfData.CreatedOn}`
                                },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'EmpName : ', bold: true },
                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 110,
                              fontSize: 10,
                              text: [
                                { text: `${pdfData.CreatedBy}` },
                              ]
                            },
                          ]
                        },
                      ]
                    ]
                  }
                }
              ],
              [
                {

                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              alignment: 'center',
                              text: [
                                { text: 'SHIPPED FROM', bold: true, },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              text: [
                                { text: 'SHIPPED TO', bold: true, width: 240, alignment: 'center', },
                              ]
                            },
                          ]
                        }
                      ],
                    ]
                  }
                }
              ],
              [
                ////shipped From
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Name ', bold: true },

                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.CompanyName}` },
                              ]
                            },
                          ]
                        }
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Address ', bold: true },

                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.WHAddress}` },
                              ]
                            },
                          ]
                        }
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.StateName}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State Code ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                {
                                  text: `${pdfRegData.StateCode}`
                                },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN/Unique ID ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.GSTIN_UIN}` },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },
                ////shipped TO
                {
                  border: [1, 1, 1, 0],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Name ', bold: true }
                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 180,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.CompanyName}` },
                              ]
                            },
                          ]
                        }
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'EmpName ', bold: true },

                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfData.EmpName}`, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Email', bold: true },

                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfData.EmpEmail}`, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Mobile', bold: true },

                              ]
                            },
                          ]
                        },
                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfData.EmpMobile}`, },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.StateName}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'State Code ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.StateCode}` },
                              ]
                            },
                          ]
                        },
                      ],
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'GSTIN/Unique ID ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 0],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${pdfRegData.GSTIN_UIN}` },
                              ]
                            },
                          ]
                        },
                      ]
                    ]
                  }
                },
              ]
            ]
          }
        },
        {
          style: 'TableHeader',
          table: {
            headerRows: 1,
            widths: ['10%', '30%', '10%', '10%', '10%', '10%', '10%', '10%'],
            body: [
              [
                { text: 'S.No', bold: true, },
                { text: 'Description of Goods', bold: true, alignment: 'center' },
                { text: 'Name', bold: true, alignment: 'center' },
                { text: 'Make', bold: true, alignment: 'center' },
                { text: 'Code', bold: true, alignment: 'center' },
                { text: 'EqpType', bold: true, alignment: 'center' },
                { text: 'Unit', bold: true, alignment: 'center' },
                { text: 'Qty', bold: true, alignment: 'center' }
              ],
              ...pdfItemList.map(p => ([
                { text: p.RowId },
                { text: [{ text: p.ItemDescription }] },
                { text: p.ItemName, alignment: 'center' },
                { text: p.MakeName, alignment: 'center' },
                { text: p.ItemCode, alignment: 'center' },
                { text: p.EqpType, alignment: 'center' },
                { text: p.UnitName, alignment: 'center' },
                { text: p.Qty, alignment: 'center' }
                ])),              
            ]
          }
        },
        {
          table: {
            body: [
              [
                {
                  border: [1, 0, 1, 1],
                  table: {
                    body: [   
                      [
                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 246,
                              text: []
                            },
                          ]
                        },
                        {
                          border: [1, 1, 0, 0],
                          columns: [
                            {
                              fontSize: 10,
                              width: 240,
                              alignment: 'right',
                              text: [
                                { text: `for ${pdfRegData.CompanyName}` },
                                '\n\n',
                                { text: `Authorised Signatory`, fontSize: 8, },
                              ]
                            },
                          ]
                        },
                      ],
                    ]
                  }
                },
              ],
            ]
          }
        },
        {
          columns: [
            { text: 'This is a Computer Generated Document', alignment: 'center', fontSize: 9, }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          margin: [210, -40, 0, 0]
        },
        TableHeader: {
          fontSize: 10,
          hidden: false,
        },

        AddInfo: {
          decoration: 'underline',
          fontSize: 9,
        },
        HideColumn: {
          visible: false,
        }
      },
    }
    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else if (action === 'open') {
      pdfMake.createPdf(docDefinition).open();
    }
  }
}
