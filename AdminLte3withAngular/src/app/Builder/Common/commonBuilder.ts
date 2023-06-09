import { DynamicItemGrid } from "src/app/_Model/purchaseOrderModel";

export interface ICommonBuilder {
    UpdateEntryDTSRN(para: DynamicItemGrid);
}


export class CommonBuilder implements ICommonBuilder {

    constructor() {
    }
    
    UpdateEntryDTSRN(para: DynamicItemGrid) {
        throw new Error("Method not implemented.");
    }

}