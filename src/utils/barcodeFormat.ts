const regexPcb = /^P\d+$/; // PCB
const regexTool = /^SA\d+$/; // 工装治具
const regexResult = /^(OK|NG)$/i; // OK NG  
const regexBDY =  /^test\d+$/; // BDY
  

export  const checkStringType=(str:string)=> {  
  if (regexPcb.test(str)) {  
    return 'PCB';  
  } else if (regexTool.test(str)) {  
    return 'tool';  
  } else if (regexResult.test(str)) {  
    return 'result';  
  } 
  else if (regexBDY.test(str)) {  
    return 'BDY';  
  }else {  
    return 'none';  
  }  
} 