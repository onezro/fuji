export interface FistTableData {
    Name: string,
    Step: number,
    InspectContent: string,
    Step1: number,
    SubItem1: number,
    stepItemList: Array<StepItem>
}

export interface StepItem {
    Step1: String,
    Step: string,
    Status: string,
    Name: String,
    InspectContent: string,
    SubItem: String,
    SubItemName: String,
    SubItemAim: String,
    SubItemMethod: String,
    SubItemBasic: String,
    SubItemSolution: String,
    SubItemType:string
}

export interface AllInspection{
    product: string,
    inspectType: string,
    stepList:Array<FistTableData>
}