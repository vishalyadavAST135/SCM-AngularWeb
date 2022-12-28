import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { SearchMaterialRequisitionModel } from '../_Model/DispatchModel';
import { CommonService } from './common.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class CommonpdfService {
  model: any = {};
  constructor(private _Commonservices: CommonService) { }


  GenRateMRPdfByMRNo(Value: any) {
    try {
      var objModel = new SearchMaterialRequisitionModel();
      objModel.RequestId = Value;
      this._Commonservices.GetAllMRDetailByMRNo(objModel).pipe(first()).subscribe(data => {
        if (data.Status == 1) {
          if (data.Data != null && data.Data != '') {
            this.model.SiteId = data.Data[0].SiteId;
            this.model.SiteName = data.Data[0].SiteName;
            this.model.CircleName = data.Data[0].CircleName;
            this.model.Customer = data.Data[0].Customer;
            this.model.ComplaintId = data.Data[0].ComplaintId;
            

            this.model.MaterialRequestNo = data.Data[0].MaterialRequestNo;
            this.model.MaterialRequestDate = data.Data[0].MaterialRequestDate;
            this.model.MaterialRequestBy = data.Data[0].MaterialRequestBy;
            this.model.RequestPurpose = data.Data[0].RequestPurpose;

            this.model.ItemId = data.Data[0].ItemId;
            this.model.ItemName = data.Data[0].ItemName;
            this.model.ItemSpecs = data.Data[0].ItemSpecs;
            this.model.Capacity = data.Data[0].Capacity;
            this.model.ItemQuantity = data.Data[0].ItemQuantity;

            this.model.MR_Remark = data.Data[0].MR_Remark;
            this.model.SMARTApprovalNo = data.Data[0].SMARTApprovalNo;
            this.model.SMARTApprovalStatus = data.Data[0].SMARTApprovalStatus;
            this.model.SMARTApprovalDate = data.Data[0].SMARTApprovalDate;
            this.model.SMARTApprover = data.Data[0].SMARTApprover;
            this.model.SMART_Remark = data.Data[0].SMART_Remark;


            this.model.ReplacementType = data.Data[0].ReplacementType;
            this.model.DispatchStatus = data.Data[0].DispatchStatus;
            this.model.DispatchStatusDate = data.Data[0].DispatchStatusDate;

            

            this.generatePDF();
          }

        }
      }, error => {
        this._Commonservices.ErrorFunction("", error.message, "GenerateDispatchPdfbyDispatchId", "WHTOSite");
      });
    } catch (Error) {
      this._Commonservices.ErrorFunction("", Error.message, "GenerateDispatchPdfbyDispatchId", "WHTOSite");
    }
  }


  generatePDF(action = 'open') {
    let docDefinition = {
      pageSize: 'A4',
      content: [
        {
          text: 'Material Requisition Detail',
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
                              fontSize: 10,
                              alignment: 'center',
                              text: [
                                { text: 'SITE DETAIL', bold: true, },
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
                                { text: 'MATERIAL REQUISITION DETAIL', bold: true, width: 240, alignment: 'center', },
                              ]
                            },
                          ]
                        },


                      ],
                    ]
                  }
                },
              ],

              [
                ///Site Detail
                {
                  border: [1, 1, 1, 1],
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
                                { text: 'Site Id ', bold: true },

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
                                { text: `${this.model.SiteId}` },
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
                                { text: 'Site Name ', bold: true },

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
                                { text: `${this.model.SiteName}`, },
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
                                { text: 'Circle Name ', bold: true },

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
                                { text: `${this.model.CircleName}` },
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
                                { text: 'Customer', bold: true },

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
                                { text: `${this.model.Customer}` },
                              ]
                            },
                          ]
                        },
                      ],

                    ]
                  }
                },
                //Material Requisition Detail
                {
                  border: [1, 1, 1, 1],
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
                                { text: 'MR No ', bold: true },

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
                                { text: `${this.model.MaterialRequestNo}` },
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
                                { text: 'MR Date ', bold: true },

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
                                { text: `${this.model.MaterialRequestDate}`, },
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
                                { text: 'Requested by ', bold: true },

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
                                { text: `${this.model.MaterialRequestBy}` },
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
                                { text: ' ', bold: true },

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
                                { text: '' },
                              ]
                            },
                          ]
                        },
                      ],

                    ]
                  }
                },
              ],



              //SECOND ROW
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
                                { text: 'SMART APPROVAL DETAIL', bold: true, },
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
                                { text: 'ITEM DETAIL', bold: true, width: 240, alignment: 'center', },
                              ]
                            },
                          ]
                        },


                      ],
                    ]
                  }
                },
              ],

              [
                ///SMART Approval Detail
                {
                  border: [1, 1, 1, 1],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Approval No ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.SMARTApprovalNo}` },
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
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Approver ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.SMARTApprover}`, },
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
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Approval Date ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.SMARTApprovalDate}` },
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
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Approval Status', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 0],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.SMARTApprovalStatus}` },
                              ]
                            },
                          ]
                        },
                      ],

                    ]
                  }
                },
                //Item Detail
                {
                  border: [1, 1, 1, 1],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Item Name', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.ItemName}` },
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
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Item Specs ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.ItemSpecs}`, },
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
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Capacity ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.Capacity}` },
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
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Item Quantity', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 0],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.ItemQuantity}` },
                              ]
                            },
                          ]
                        },
                      ],

                    ]
                  }
                },
              ],

              //Third ROW
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
                                { text: 'REQUEST DETAIL', bold: true, },
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
                                { text: 'DISPATCH DETAIL', bold: true, width: 240, alignment: 'center', },
                              ]
                            },
                          ]
                        },


                      ],
                    ]
                  }
                },
              ],

              [
                ///Request Detail
                {
                  border: [1, 1, 1, 1],
                  table: {
                    body: [
                      [
                        {
                          border: [0, 0, 0, 1],
                          columns: [
                            {
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Request Purpose ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [1, 0, 0, 1],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.RequestPurpose}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 1, 0],
                          columns: [
                            {
                              width: 80,
                              fontSize: 10,
                              text: [
                                { text: 'Replacement Type ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 150,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.ReplacementType}`, },
                              ]
                            },
                          ]
                        },
                      ],


                    ]
                  }
                },
                //Dispatch Update Detail
                {
                  border: [1, 1, 1, 1],
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
                                { text: 'Status', bold: true },

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
                                { text: `${this.model.DispatchStatus}` },
                              ]
                            },
                          ]
                        },
                      ],

                      [
                        {
                          border: [0, 0, 1, 0],
                          columns: [
                            {
                              width: 60,
                              fontSize: 10,
                              text: [
                                { text: 'Status Date ', bold: true },

                              ]
                            },
                          ]
                        },

                        {
                          border: [0, 0, 0, 0],
                          columns: [
                            {
                              width: 170,
                              fontSize: 10,
                              text: [
                                { text: `${this.model.DispatchStatusDate}`, },
                              ]
                            },
                          ]
                        },
                      ],


                    ]
                  }
                },
              ]



            ]
          }
        },


        // {
        //   style: 'TableHeader',
        //   table: {
        //     headerRows: 1,
        //     widths: ['5%', '29%', '6%', '7%', '5.8%','8%', '8%', '10%', '10%', '14%'],
        //     body: [
        //       [{ text: 'S.No', bold: true, }, { text: 'Description of Goods', bold: true, alignment: 'center' }, { text: 'HSN', bold: true, alignment: 'center' }, { text: 'Qty', bold: true, alignment: 'center' }, { text: 'Unit', bold: true, alignment: 'center' }, { text: 'EquType', bold: true, alignment: 'center' },{ text: 'Rate', bold: true, alignment: 'center' }, { text: 'Amount', bold: true, alignment: 'center' }, { text: 'Discount', bold: true, alignment: 'center' }, { text: 'Grand Total', bold: true, alignment: 'center' }],
        //       ...this.dynamicArrayDispatchPdf.map(p => ([{ text: p.RowId }, { text: [{ text: p.ItemDescription }, '\n', { text: p.SubDescription, italics: true }] }, { text: p.HSN, alignment: 'center' }, { text: p.Qty, alignment: 'center' }, { text: p.UnitName, alignment: 'center' },{ text: p.EqpType, alignment: 'center' }, { text: p.Rate, alignment: 'center' }, { text: p.TotalAmount, alignment: 'center' }, { text: p.Discount, alignment: 'center' }, { text: this._Commonservices.thousands_separators(p.GetTotalAmount), alignment: 'center' }])),
        //      // [{}, { text: '', colSpan: 1, alignment: 'right', margin: this.TableHeight }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' },{ text: '' }],
        //       [{}, { text: 'Total Amount', colSpan: 1, alignment: 'right', bold: true }, { text: '' }, { text: `${this.model.totalSumPOQuantity}`, alignment: 'center', bold: true }, { text: '' }, { text: '' },{ text: '' }, { text: '' }, { text: '' }, { text: this._Commonservices.thousands_separators(`${this.model.GrossTotalAmount}`) + '₹', bold: true, alignment: 'center' }]

        //     ]
        //   }
        // },
        // {
        //   table: {
        //     body: [
        //       [
        //         {
        //           border: [1, 0, 1, 1],
        //           table: {
        //             body: [
        //               [
        //                 {
        //                   border: [0, 0, 0, 0],
        //                   columns: [
        //                     {
        //                       fontSize: 9,
        //                       width: 258,
        //                       text: [
        //                         'Amount Chargeable (in words)',
        //                         '\n',
        //                         { text: `${this.model.PdfAmountChargeable}`, fontSize: 10, bold: true, },
        //                       ]
        //                     },

        //                   ]
        //                 },

        //                 {
        //                   border: [0, 0, 0, 0],
        //                   columns: [
        //                     {
        //                       fontSize: 9,
        //                       width: 0,
        //                       alignment: 'right', italics: true,
        //                       text: [
        //                         //{text: `${this.model.AmountChargeable}`, fontSize:10, bold:true,},
        //                       ]
        //                     },
        //                   ]
        //                 },
        //               ],

        //               [
        //                 {
        //                   border: [0, 0, 0, 0],
        //                   columns: [
        //                     {
        //                       width: 246,
        //                       text: [
        //                         { text: 'Note', bold: true, fontSize: 11, decoration: 'underline', italics: true, },
        //                         '\n',
        //                         { text: `${this.model.PdfNote}`, fontSize: 10, },
        //                       ]
        //                     },

        //                   ]
        //                 },

        //                 {
        //                   border: [1, 1, 0, 0],
        //                   columns: [
        //                     {
        //                       fontSize: 10,
        //                       width: 240,
        //                       alignment: 'right',
        //                       text: [
        //                         { text: `for ${this.model.PdfCompanyName}` },
        //                         '\n\n',
        //                         { text: `Authorised Signatory`, fontSize: 8, },
        //                       ]
        //                     },

        //                   ]
        //                 },
        //               ],
        //             ]
        //           }
        //         },
        //       ],
        //     ]
        //   }
        // },
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
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  BOQRequestGeneratePDF(objdata:any) {

    let docDefinition = {
      pageSize: 'A4',
      content: [
        {
          text: 'Material Indent Detail',
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
                              fontSize: 10,
                              alignment: 'center',
                              text: [
                                { text: 'Project Detail', bold: true, },
                              ]
                            },
                          ]
                        },
                      ]
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
                                { text: 'Indent Detail', bold: true, width: 240, alignment: 'center', },
                              ]
                            },
                          ]
                        },


                      ],
                    ]
                  }
                },
              ],

              [
                ///Left Detail
                {
                  border: [1, 1, 1, 1],
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
                                { text: 'CirCleName ', bold: true },
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
                                { text: `${objdata[0].CirCleName}` },
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
                                { text: 'ClientName ', bold: true },
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
                                { text: `${objdata[0].ClientName}` },
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
                                { text: 'ProjectType ', bold: true },
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
                                { text: `${objdata[0].ProjectType}` },
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
                                { text: 'BOQTemplate ', bold: true },
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
                                { text: `${objdata[0].BOQType}` },
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
                                { text: 'MIFor ', bold: true },
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
                                { text: `${objdata[0].MIForText}` },
                              ]
                            },
                          ]
                        },
                      ] 
                    ]
                  }
                },

                //Right Detail
                {
                  border: [1, 1, 1, 1],
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
                                { text: 'BOQReqNo ', bold: true },

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
                                { text: `${objdata[0].BOQReqNo}` },
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
                                { text: 'CreatedBy ', bold: true },

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
                                { text: `${objdata[0].Name}` },
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
                                { text: 'CreatedOn ', bold: true },

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
                                { text: `${objdata[0].CreatedOn}` },
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
                                { text: 'BOQRemark ', bold: true },

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
                                { text: `${objdata[0].BOQRemark}` },
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
                                { text: 'HO/Ops Approval ', bold: true },

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
                                { text: `${objdata[0].OpsApproval}` },
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
                                { text: 'SCM HO Approval ', bold: true },

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
                                { text: `${objdata[0].SCMApproval}` },
                              ]
                            },
                          ]
                        },
                      ]                        
                    ]
                  }
                },
              ],

             
            ]
          }
        },
        ...objdata[0].CircleSiteList.map(dd => (
        {
          margin: [0, 0, 0, 0],
          widths: ['100%'],
          border: [1, 1, 1, 1],
          table: {
            body: [             
              [ 
                 { 
                  widths: ['100%'],
                  style:'TableHeader',
                  table: {                  
                    body: [                      
                      [ 
                        { text: "CircleName : "+dd.CircleName+", WHName :"+dd.WHName, alignment: 'center',border: [0, 0, 0, 0]}
                      ],
                    ]
                  }
                }              
              ],
              [
                {
                  widths: ['12%', '12%', '12%', '30%', '12%','12%', '10%'],
                  border: [1, 1, 1, 1],
                  style:'TableHeader',
                  table: {
                    headerRows: 1,
                    body:[
                        [
                            { text: 'ItemName', bold: true, alignment: 'center' }, 
                            { text: 'MakeName', bold: true, alignment: 'center' }, 
                            { text: 'ItemCode', bold: true, alignment: 'center' }, 
                            { text: 'ItemDescription', bold: true, alignment: 'center' }, 
                            { text: 'UnitName', bold: true, alignment: 'center' },
                            { text: 'Qty/Site', bold: true, alignment: 'center' }, 
                            { text: 'Total Qty', bold: true, alignment: 'center' }
                           ],
                           ...dd.EqpList.map(p => (
                               [
                               { text: p.ItemName, alignment: 'center', fontSize: 8 }, 
                               { text: p.MakeName, alignment: 'center',fontSize: 8 },
                               { text: p.ItemCode, alignment: 'center',fontSize: 8 }, 
                               { text: p.ItemDescription, alignment: 'center',fontSize: 8 }, 
                               { text: p.UnitName, alignment: 'center',fontSize: 8 },
                               { text: p.ItemQuantity, alignment: 'center',fontSize: 8 }, 
                               { text: p.TotalQuantity, alignment: 'center',fontSize: 8 }
                             ]
                             )),
                             [
                              { text: '',colspan:5}, 
                              { text: ''}, 
                              { text: ''}, 
                              { text: ''}, 
                              { text: 'Grand Total', alignment: 'center', fontSize: 8,bold: true },
                              { text: dd.EqpList.reduce((x, y) => x + y.ItemQuantity,0), alignment: 'center', fontSize: 8,bold: true  },
                              { text: dd.EqpList.reduce((x, y) => x + y.TotalQuantity,0), alignment: 'center', fontSize: 8,bold: true }
                             ]        
                      ]                    
                  }
                }              
              ]
            ]
          }
        }
        )),
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
    // if (action === 'download') {
    //   pdfMake.createPdf(docDefinition).download();
    // } else if (action === 'print') {
    //   pdfMake.createPdf(docDefinition).print();
    // } else {
      pdfMake.createPdf(docDefinition).open();
    //}
  }  

  DIGeneratePDF(objdata:any) {
    if(objdata[0].IsSRN==1 && objdata[0].IsDI_SRN==1){
      let docDefinitionWithDISRN = {
        pageSize: 'A4',
        content: [
          {
            text: 'Dispatch Instruction Detail',
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
                                fontSize: 10,
                                alignment: 'center',
                                text: [
                                  { text: 'SITE DETAIL', bold: true,},
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
                                  { text: 'DISPATCH INSTRUCTION DETAIL', bold: true, width: 240, alignment: 'center', },
                                ]
                              },
                            ]
                          }
                        ],
                      ]
                    }
                  },
                ],
  
                [
                  ///Site Detail
                  {
                    border: [1, 1, 1, 1],
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
                                  { text: 'Site Id ', bold: true },
  
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
                                  { text: `${objdata[0].SiteId}` },
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
                                  { text: 'Site Name ', bold: true },
  
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
                                  { text: `${objdata[0].SiteName}`, },
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
                                  { text: 'Circle Name ', bold: true },
  
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
                                  { text: `${objdata[0].CircleName}` },
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
                                  { text: 'Customer', bold: true },
  
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
                                  { text: `${objdata[0].ClientName}` },
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
                                  { text: 'Project Type', bold: true },
  
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
                                  { text: `${objdata[0].ProjectType}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                  //Material Requisition Detail
                  {
                    border: [1, 1, 1, 1],
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
                                  { text: 'DI No ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestNo}` },
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
                                  { text: 'DI Date ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestDate}`, },
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
                                  { text: 'Requested by ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestBy}` },
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
                                  { text: 'DI-Type', bold: true },
  
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
                                  { text: `${objdata[0].DIType}` },
                                ]
                              },
                            ]
                          },
                        ],

                       
  
                      ]
                    }
                  },
                ],
  
  
  
                //SECOND ROW
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
                                  { text: 'SMART APPROVAL DETAIL', bold: true, },
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
                                  { text: 'DISPATCH DETAIL', bold: true, width: 240, alignment: 'center', },
                                ]
                              },
                            ]
                          }
                        ]
                      ]
                    }
                  },
                ],
  
                [
                  ///SMART Approval Detail
                  {
                    border: [1, 1, 1, 1],
                    table: {
                      body: [
                        [
                          {
                            border: [0, 0, 0, 1],
                            columns: [
                              {
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval No ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprovalNo}` },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approver ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprover}`, },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval Date ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprovalDate}` },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval Status', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 0],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTAppStatus}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                  //Item Detail
                  {
                    border: [1, 1, 1, 1],
                    table: {
                      body: [                      
                        [
                          {
                            border: [0, 0, 0, 1],
                            columns: [
                              {
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Dispatch Status ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].DispatchStatus}` }
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Dispatch Status Date', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 0],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].DispatchStatusDate}` }
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                ]
  
              ]
            }
          },        
          {
            columns: [
              { text: 'Dispatch Instruction Item List', alignment: 'center', fontSize: 9, }
            ]
          },
          {
            margin: [0, 0, 0, 0],
            border: [1, 1, 1, 1],
            style:'TableHeader',
            table: {
            widths: ['8%', '6%', '8%','6%', '10%', '8%', '5%','8%','8%','10%','8%','6%','10%'],          
              headerRows: 1,
                body:[
                  [
                              { text: 'Item', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Capacity', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Make', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Code', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Description', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'UOM', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Qty', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Purpose', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Reason', bold: true, alignment: 'center',fontSize: 6 },
                              //created by:vishal 14/09/2022
                              { text: 'Billing To', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Expense Type', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'EMI Type', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Recovery Type', bold: true, alignment: 'center',fontSize: 6 },
                  ],
                  ...objdata[0].EqpList.map(p => 
                    (
                    [
                      { text: p.ItemName, alignment: 'center', fontSize: 6 }, 
                      { text: p.CapacityName, alignment: 'center',fontSize: 6 },
                      { text: p.MakeName, alignment: 'center',fontSize: 6 },
                      { text: p.ItemCode, alignment: 'center',fontSize: 6 }, 
                      { text: p.ItemDescription, alignment: 'center',fontSize: 6 }, 
                      { text: p.UnitName, alignment: 'center',fontSize: 6 },
                      { text: p.ItemQuantity, alignment: 'center',fontSize: 6 },
                      { text: p.Purpose, alignment: 'center',fontSize: 6 },
                      { text: p.Reason, alignment: 'center',fontSize: 6 },
                      // { text: p.Remark, alignment: 'center',fontSize: 6 },
                      
                      { text: p.BillingTo, alignment: 'center',fontSize: 6 },
                      { text: p.ExpenseType, alignment: 'center',fontSize: 6 },
                      { text: p.EMIType, alignment: 'center',fontSize: 6 },
                      { text: p.RecoveryType, alignment: 'center',fontSize: 6 }
                      //created by: vishal 14/09/2022
                    ]
                    )),
                    [
                      { text: '',colspan:5}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: 'Grand Total', alignment: 'center', fontSize: 8,bold: true },
                      { text: objdata[0].EqpList.reduce((x, y) => x + y.ItemQuantity,0), alignment: 'center', fontSize: 8,bold: true },
                      { text: ''}, 
                      { text: ''},                    
                      
                      { text: ''}, //by: vishal
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''},                     
                    ]
                                      
                    ]
                    }
          },
          {
            columns: [
              { text: 'SRN Item List', alignment: 'center', fontSize: 9, }
            ]
          },
          {
            margin: [0, 0, 0, 0],
            border: [1, 1, 1, 1],
            style:'TableHeader',
            table: {
              widths: ['10%', '9%', '8%', '10%', '15%', '10%', '5%','10%','10%','15%'],            
              headerRows: 1,
                body:[
                  [
                              { text: 'Item', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Capacity', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Make', bold: true, alignment: 'center' ,fontSize: 6}, 
                              { text: 'Code', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Description', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'UOM', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Qty', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Status', bold: true, alignment: 'center' ,fontSize: 6},
                              { text: 'Owner', bold: true, alignment: 'center' ,fontSize: 6},
                              { text: 'Remark', bold: true, alignment: 'center' ,fontSize: 6},

                  ],
                  ...objdata[0].SRNList.map(pp => 
                    (
                    [
                      { text: pp.ItemName, alignment: 'center', fontSize: 6 }, 
                      { text: pp.CapacityName, alignment: 'center',fontSize: 6 },
                      { text: pp.MakeName, alignment: 'center',fontSize: 6 },
                      { text: pp.ItemCode, alignment: 'center',fontSize: 6 }, 
                      { text: pp.ItemDescription, alignment: 'center',fontSize: 6 }, 
                      { text: pp.UnitName, alignment: 'center',fontSize: 6 },
                      { text: pp.ItemQuantity, alignment: 'center',fontSize: 6 },
                      { text: pp.MaterialStatusName, alignment: 'center',fontSize: 6 },
                      { text: pp.MaterialOwnerName, alignment: 'center',fontSize: 6 },
                      { text: pp.Remark, alignment: 'center',fontSize: 6 },
                    ]
                    )),
                    [
                      { text: '',colspan:5}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: 'Grand Total', alignment: 'center', fontSize: 8,bold: true },
                      { text: objdata[0].SRNList.reduce((x, y) => x + y.ItemQuantity,0), alignment: 'center', fontSize: 8,bold: true },
                      { text: ''}, 
                      { text: ''},                    
                      { text: ''},

                      
                    ]
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
      };
      pdfMake.createPdf(docDefinitionWithDISRN).open();
    }else if(objdata[0].IsSRN==0 && objdata[0].IsDI_SRN==1){
      let docDefinitionDI = {
        pageSize: 'A4',
        content: [
          {
            text: 'Dispatch Instruction Detail',
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
                                fontSize: 10,
                                alignment: 'center',
                                text: [
                                  { text: 'SITE DETAIL', bold: true, },
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
                                  { text: 'DISPATCH INSTRUCTION DETAIL', bold: true, width: 240, alignment: 'center', },
                                ]
                              },
                            ]
                          }
                        ],
                      ]
                    }
                  },
                ],
  
                [
                  ///Site Detail
                  {
                    border: [1, 1, 1, 1],
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
                                  { text: 'Site Id ', bold: true },
  
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
                                  { text: `${objdata[0].SiteId}` },
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
                                  { text: 'Site Name ', bold: true },
  
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
                                  { text: `${objdata[0].SiteName}`, },
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
                                  { text: 'Circle Name ', bold: true },
  
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
                                  { text: `${objdata[0].CircleName}` },
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
                                  { text: 'Customer', bold: true },
  
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
                                  { text: `${objdata[0].ClientName}` },
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
                                  { text: 'Project Type', bold: true },
  
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
                                  { text: `${objdata[0].ProjectType}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                  //Material Requisition Detail
                  {
                    border: [1, 1, 1, 1],
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
                                  { text: 'DI No ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestNo}` },
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
                                  { text: 'DI Date ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestDate}`, },
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
                                  { text: 'Requested by ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestBy}` },
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
                                  { text: 'DI-Type', bold: true },
  
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
                                  { text: `${objdata[0].DIType}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                ],
  
  
  
                //SECOND ROW
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
                                  { text: 'SMART APPROVAL DETAIL', bold: true, },
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
                                  { text: 'DISPATCH DETAIL', bold: true, width: 240, alignment: 'center', },
                                ]
                              },
                            ]
                          }
                        ]
                      ]
                    }
                  },
                ],
  
                [
                  ///SMART Approval Detail
                  {
                    border: [1, 1, 1, 1],
                    table: {
                      body: [
                        [
                          {
                            border: [0, 0, 0, 1],
                            columns: [
                              {
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval No ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprovalNo}` },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approver ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprover}`, },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval Date ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprovalDate}` },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval Status', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 0],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTAppStatus}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                  //Item Detail
                  {
                    border: [1, 1, 1, 1],
                    table: {
                      body: [                      
                        [
                          {
                            border: [0, 0, 0, 1],
                            columns: [
                              {
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Dispatch Status ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].DispatchStatus}` }
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Dispatch Status Date', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 0],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].DispatchStatusDate}` }
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                ]
  
              ]
            }
          },        
          {
            columns: [
              { text: 'Dispatch Instruction Item List', alignment: 'center', fontSize: 9, }
            ]
          },
          {
            margin: [0, 0, 0, 0],
            border: [1, 1, 1, 1],
            style:'TableHeader',
            table: {
            widths: ['10%', '8%', '8%','9%', '15%', '10%', '5%','10%','10%','15%', '8%', '8%', '8%', '8%'],          
              headerRows: 1,
                body:[
                  [
                              { text: 'Item', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Capacity', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Make', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Code', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Description', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'UOM', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Qty', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Purpose', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Reason', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Remark', bold: true, alignment: 'center',fontSize: 6 },
                              //Created by: vishal 14/09/2022
                              { text: 'Billing To', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Expense Type', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'EMI Type', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Recovery Type', bold: true, alignment: 'center',fontSize: 6 },
                              
                  ],
                  ...objdata[0].EqpList.map(p => 
                    (
                    [
                      { text: p.ItemName, alignment: 'center', fontSize: 6 }, 
                      { text: p.CapacityName, alignment: 'center',fontSize: 6 },
                      { text: p.MakeName, alignment: 'center',fontSize: 6 },
                      { text: p.ItemCode, alignment: 'center',fontSize: 6 }, 
                      { text: p.ItemDescription, alignment: 'center',fontSize: 6 }, 
                      { text: p.UnitName, alignment: 'center',fontSize: 6 },
                      { text: p.ItemQuantity, alignment: 'center',fontSize: 6 },
                      { text: p.Purpose, alignment: 'center',fontSize: 6 },
                      { text: p.Reason, alignment: 'center',fontSize: 6 },
                      { text: p.Remark, alignment: 'center',fontSize: 6 },

                      { text: p.BillingTo, alignment: 'center',fontSize: 6 },
                      { text: p.ExpenseType, alignment: 'center',fontSize: 6 },
                      { text: p.EMIType, alignment: 'center',fontSize: 6 },
                      { text: p.RecoveryType, alignment: 'center',fontSize: 6 },
                    ]
                    )),
                    [
                      { text: '',colspan:5}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: 'Grand Total', alignment: 'center', fontSize: 8,bold: true },
                      { text: objdata[0].EqpList.reduce((x, y) => x + y.ItemQuantity,0), alignment: 'center', fontSize: 8,bold: true },
                      { text: ''}, 
                      { text: ''},                    
                      { text: ''},
                      
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''},                    
                    ]                                      
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
      };
      pdfMake.createPdf(docDefinitionDI).open();
    }else{
      let docDefinitionWithSRN = {
        pageSize: 'A4',
        content: [
          {
            text: 'Dispatch Instruction Detail',
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
                                fontSize: 10,
                                alignment: 'center',
                                text: [
                                  { text: 'SITE DETAIL', bold: true, },
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
                                  { text: 'SRN INSTRUCTION DETAIL', bold: true, width: 240, alignment: 'center', },
                                ]
                              },
                            ]
                          }
                        ],
                      ]
                    }
                  },
                ],
  
                [
                  ///Site Detail
                  {
                    border: [1, 1, 1, 1],
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
                                  { text: 'Site Id ', bold: true },
  
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
                                  { text: `${objdata[0].SiteId}` },
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
                                  { text: 'Site Name ', bold: true },
  
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
                                  { text: `${objdata[0].SiteName}`, },
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
                                  { text: 'Circle Name ', bold: true },
  
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
                                  { text: `${objdata[0].CircleName}` },
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
                                  { text: 'Customer', bold: true },
  
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
                                  { text: `${objdata[0].ClientName}` },
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
                                  { text: 'Project Type', bold: true },
  
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
                                  { text: `${objdata[0].ProjectType}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                  //Material Requisition Detail
                  {
                    border: [1, 1, 1, 1],
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
                                  { text: 'DI No ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestNo}` },
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
                                  { text: 'DI Date ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestDate}`, },
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
                                  { text: 'Requested by ', bold: true },
  
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
                                  { text: `${objdata[0].MaterialRequestBy}` },
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
                                  { text: 'DI-Type', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [0, 0, 0, 0],
                            columns: [
                              {
                                width: 170,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].DIType}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                ],
  
  
  
                //SECOND ROW
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
                                  { text: 'SMART APPROVAL DETAIL', bold: true, },
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
                                  { text: 'DISPATCH DETAIL', bold: true, width: 240, alignment: 'center', },
                                ]
                              },
                            ]
                          }
                        ]
                      ]
                    }
                  },
                ],
  
                [
                  ///SMART Approval Detail
                  {
                    border: [1, 1, 1, 1],
                    table: {
                      body: [
                        [
                          {
                            border: [0, 0, 0, 1],
                            columns: [
                              {
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval No ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprovalNo}` },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approver ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprover}`, },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval Date ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTApprovalDate}` },
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Approval Status', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 0],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].SMARTAppStatus}` },
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                  //Item Detail
                  {
                    border: [1, 1, 1, 1],
                    table: {
                      body: [                      
                        [
                          {
                            border: [0, 0, 0, 1],
                            columns: [
                              {
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Dispatch Status ', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 1],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].DispatchStatus}` }
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
                                width: 80,
                                fontSize: 10,
                                text: [
                                  { text: 'Dispatch Status Date', bold: true },
  
                                ]
                              },
                            ]
                          },
  
                          {
                            border: [1, 0, 0, 0],
                            columns: [
                              {
                                width: 150,
                                fontSize: 10,
                                text: [
                                  { text: `${objdata[0].DispatchStatusDate}` }
                                ]
                              },
                            ]
                          },
                        ],
  
                      ]
                    }
                  },
                ]
  
              ]
            }
          },
          {
            columns: [
              { text: 'SRN Item List', alignment: 'center', fontSize: 9, }
            ]
          },
          {
            margin: [0, 0, 0, 0],
            border: [1, 1, 1, 1],
            style:'TableHeader',
            table: {
              widths: ['10%', '8%', '8%','9%', '15%', '10%', '5%','10%','10%','15%'],            
              headerRows: 1,
                body:[
                  [
                              { text: 'Item', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Capacity', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Make', bold: true, alignment: 'center' ,fontSize: 6}, 
                              { text: 'Code', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'Description', bold: true, alignment: 'center',fontSize: 6 }, 
                              { text: 'UOM', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Qty', bold: true, alignment: 'center',fontSize: 6 },
                              { text: 'Status', bold: true, alignment: 'center' ,fontSize: 6},
                              { text: 'Owner', bold: true, alignment: 'center' ,fontSize: 6},
                              { text: 'Remark', bold: true, alignment: 'center' ,fontSize: 6}
                  ],
                  ...objdata[0].SRNList.map(pp => 
                    (
                    [
                      { text: pp.ItemName, alignment: 'center', fontSize: 6 }, 
                      { text: pp.CapacityName, alignment: 'center',fontSize: 6 },
                      { text: pp.MakeName, alignment: 'center',fontSize: 6 },
                      { text: pp.ItemCode, alignment: 'center',fontSize: 6 }, 
                      { text: pp.ItemDescription, alignment: 'center',fontSize: 6 }, 
                      { text: pp.UnitName, alignment: 'center',fontSize: 6 },
                      { text: pp.ItemQuantity, alignment: 'center',fontSize: 6 },
                      { text: pp.MaterialStatusName, alignment: 'center',fontSize: 6 },
                      { text: pp.MaterialOwnerName, alignment: 'center',fontSize: 6 },
                      { text: pp.Remark, alignment: 'center',fontSize: 6 }
                    ]
                    )),
                    [
                      { text: '',colspan:5}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: ''}, 
                      { text: 'Grand Total', alignment: 'center', fontSize: 8,bold: true },
                      { text: objdata[0].SRNList.reduce((x, y) => x + y.ItemQuantity,0), alignment: 'center', fontSize: 8,bold: true },
                      { text: ''}, 
                      { text: ''},                    
                      { text: ''}                    
                    ]
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
      };
      pdfMake.createPdf(docDefinitionWithSRN).open();
    }    
  }  
}
