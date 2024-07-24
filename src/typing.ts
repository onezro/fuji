export interface FistTableData {
    Name: string,
    Step: number,
    InspectContent: string,
    Step1: number,
    SubItem1: number,
    StepItemList: Array<StepItem>
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
    SubItemType: string
}

export interface AllInspection {
    Product: string,
    InspectType: string,
    WorkSection: string,
    StepList: Array<FistTableData>,
    StepItemList: Array<FistTableData>
}

export interface InspectionResult {
    InspectOrder: string,
    step1: string,
    stepItemList: Array<ResultItem>
}

export interface ResultItem {
    Name: string,
    InspectContent: string,
    Step: number,
    Status: number,
    Remark: string,
    Attachment: Array<string>,
    step1: string,
}

