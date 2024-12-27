const regexPcb = /^P\d+$/; // PCB

const regexResult = /^(OK|NG)$/i; // OK NG
const regexBDY = /^BD.*$/; // BDY
const regexSCR = /^S[A-Za-z\d]+$/;
// 工装治具

export const checkStringType = (str: string) => {
  if (regexPcb.test(str)) {
    return "PCB";
  }else if (regexResult.test(str)) {
    return "result";
  } else if (regexBDY.test(str)) {
    return "BDY";
  } else if (regexSCR.test(str)) {
    return "SCR";
  } else {
    return "none";
  }
};
