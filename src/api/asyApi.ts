import request from "@/utils/asyRequest";
//扫码保存
export function CleanCodeSave(data:any) {
    return request({
        url: "/api/clean/CleanCodeSave",
        method: "post",
        data
    });
}
//清洗条码历史记录
export function QueryCleanCodeRecord(data:any) {
    return request({
        url: "/api/clean/QueryCleanCodeRecord",
        method: "post",
        params:{
            workstation:data.workstationName,
            orderNumber:data.MfgOrderName
        }
    });
}
//重新清洗
export function ReloadCleanCode(data:any) {
    return request({
        url: "/api/clean/ReloadCleanCode",
        method: "post",
        data
    });
}
export function QueryCleanKeyMaterial(data:any) {
    return request({
        url: "/api/clean/QueryKeyMaterial",
        method: "post",
        data
    });
}


export function JudgeMaterial(data:any) {
    return request({
        url: "/api/clean/JudgeMaterial",
        method: "post",
        data
    });
}

//点胶
export function DispenseStationMoveOut(data:any) {
    return request({
        url: "/api/Dispense/DispenseStationMoveOut",
        method: "post",
        data
    });
}
export function PressingStationMoveOut(data:any) {
    return request({
        url: "/api/clean/PressingStationMoveOut",
        method: "post",
        data
    });
}
//盖板过站
export function CoverInstallStationMoveOut(data:any) {
    return request({
        url: "/api/CoverInstall/CoverInstallStationMoveOut",
        method: "post",
        data
    });
}
//盖板打印
export function CoverInstallPrint(data:any) {
    return request({
        url: "/api/CoverInstall/CoverInstallPrint",
        method: "post",
        params:{
            orderNumber:data
        }
    });
}
//查询关键物料
export function QueryKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/QueryKeyMaterial",
        method: "post",
        data
    });
}
//判断关键物料是否存在
export function JudgeKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/JudgeKeyMaterial",
        method: "post",
        data
    });
}
//过站并扣料
export function ScreeSMTCompBindMoveStd(data:any) {
    return request({
        url: "/api/SMTCompBind/ScreeSMTCompBindMoveStd",
        method: "post",
        data
    });
}
//盖板获取关键料
export function QueryCoverKeyMaterial(data:any) {
    return request({
        url: "/api/CoverInstall/QueryAssemblyKeyMaterial",
        method: "post",
        data
    });
}
//盖板验证关键料
export function JudgeCoverKeyMaterial(data:any) {
    return request({
        url: "/api/CoverInstall/JudgeAssemblyKeyMaterial",
        method: "post",
        data
    });
}
//盖板过站并扣料
export function CoverSMTCompBindMoveStd(data:any) {
    return request({
        url: "/api/SMTCompBind/CoverSMTCompBindMoveStd",
        method: "post",
        data
    });
}
//装配合成查询关键物料
export function QueryAssemblyKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/QueryAssemblyKeyMaterial",
        method: "post",
        data
    });
}
//判断关键物料是否存在
export function JudgeAssemblyKeyMaterial(data:any) {
    return request({
        url: "/api/SMTCompBind/JudgeAssemblyKeyMaterial",
        method: "post",
        data
    });
}
//过站并扣料
export function AssemblySynthesisMoveStd(data:any) {
    return request({
        url: "/api/SMTCompBind/AssemblySynthesisMoveStd",
        method: "post",
        data
    });
}


//查询SN条码
export function VibrationDetail(data:any) {
    return request({
        url: "/api/Vibration/VibrationDetail",
        method: "post",
        data
    });
}

// //工单查询
export function OrderQuery(data:any) {
    return request({
        url: "/api/workstation/OrderQuery",
        method: "post",
        data
    })
}
//历史过站记录
export function QueryMoveHistory(data:any) {
    return request({
        url: "/api/workstation/QueryMoveHistory",
        method: "post",
        data
    })
}
export function VerifyContainer(data:any) {
    return request({
        url: "/api/SoftwareUpgrade/VerifyContainer",
        method: "post",
     data
    })
}
//查询工单软件信息
export function QueryOrderSoftwareInfo(data:any) {
    return request({
        url: "/api/SoftwareUpgrade/QueryOrderSoftwareInfo",
        method: "post",
       params:{
        productModel:data
       }
    })
}

//比对软件信息并过站(自动)
export function AutoComparisonInfoMovestd(data:any) {
    return request({
        url: "/api/SoftwareUpgrade/AutoComparisonInfoMovestd",
        method: "post",
        data
    })
}

//比对软件信息并过站(手动)
export function ManualComparisonInfoMovestd(data:any) {
    return request({
        url: "/api/SoftwareUpgrade/ManualComparisonInfoMovestd",
        method: "post",
        data
    })
}
//在线烧录验证
export function JudgeContainerProProcess(data:any) {
    return request({
        url: "/api/ASYBurn/JudgeContainerProProcess",
        method: "post",
        data
    })
}
//在线烧录绑定
export function JudgeAfterStartUpQrCode(data:any) {
    return request({
        url: "/api/ASYBurn/JudgeAfterStartUpQrCode",
        method: "post",
        data
    })
}

//不良登记查询
export function QueryDefectCode(data:any) {
    return request({
        url: "/api/DefectProductRecord/QueryDefectCode",
        method: "post",
       data
    })
}
//不良登记
export function DefectProductRecord(data:any) {
    return request({
        url: "/api/DefectProductRecord/DefectProductRecord",
        method: "post",
        data
    })
}

//EOL人工检测
export function EolManualTestStationMoveOut(data:any) {
    return request({
        url: "/api/EolManualTest/EolManualTestStationMoveOut",
        method: "post",
        data
    })
}

//
export function eolQueryDefectCode(data:any) {
    return request({
        url: "/api/EolManualTest/QueryDefectCode",
        method: "post",
        params:{
            containerName:data
        }
    })
}

//过站
export function MoveStdNew(data:any) {
    return request({
        url: "/api/workstation/MoveStdNew",
        method: "post",
        data
    })
}
//点胶历史记录
export function QueryDisMoveHistory(data:any) {
    return request({
        url: "/api/Dispense/QueryMoveHistory",
        method: "post",
        data
    })
}

//返修登记
export function QuerySMTDefectRecordDetail(data: any) {
    return request({
      url: "/api/repair/QuerySMTDefectRecordDetail",
      method: "post",
      params: {
        ContainerName: data,
      },
    });
  }
  //返修工序
  export function QueryWorkflowList(data: any) {
    return request({
      url: "/api/repair/QueryWorkflowList",
      method: "post",
      params: {
        workflowName: data,
      },
    });
  }
  //提交返修登记
  export function SaveRepairRecord(data: any) {
    return request({
      url: "/api/repair/SaveRepairRecord",
      method: "post",
      data,
    });
  }
  //查询返修修操作
  export function QueryRepairAction(data: any) {
    return request({
      url: "/api/repair/QueryRepairAction",
      method: "post",
      params: {
        operationName: data,
      },
    });
  }
  //根据工序查询不良记录
  export function QueryRepairRecord(data: any) {
    return request({
      url: "/api/repair/QueryRepairRecord",
      method: "post",
      params: {
        workStaion: data,
      },
    });
  }

  //查询TUID烧录二维码信息
  export function ueryOrderTUIDQRInfo(data: any) {
    return request({
      url: "/api/ASYBurn/QueryOrderTUIDQRInfo",
      method: "post",
      params: {
        productModel: data,
      },
    });
  }



