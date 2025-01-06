export const setMenu = (data: any) => {
  let menu = data.map((m: any) => {
    // let parts = m.Component.split('/');
    // console.log(parts)
    // let englishOnly = m.Name.replace(/[^a-zA-Z]/g, '');  
    // console.log(englishOnly);
    return {
      ID: m.ID,
      FID: m.FID,
      MenuLevel: m.Level,
      MenuName: m.Name,
      title: m.Desc,
      path: m.Name,
      component: m.Component,
      EquipmentDesc: m.EquipmentDesc,
      EquipmentName: m.EquipmentName,
      sortId: m.sortId,
    }
  })
  let arr = OrganData(menu)
  return arr
}

export const OrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.ID, { ...org, childMenu: [] });
  });
  organizations.forEach((org: any) => {
    if (org.FID !== null) {
      const parentOrg = organizationMap.get(org.FID);
      if (parentOrg) {
        parentOrg.childMenu.push(organizationMap.get(org.ID));
      }
    }
  });
  return Array.from(organizationMap.values()).filter(org => org.FID === null);
}

export const shortcuts = [
  {
    text: '近三个月',
    value: () => {
      const end = new Date();
      let start = new Date(end);
      let targetMonth = end.getMonth() - 3;
      let targetYear = end.getFullYear();
      // 处理跨年情况
      if (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }
      start.setFullYear(targetYear);
      start.setMonth(targetMonth);
      // start.setDate(1); // 确保是月份的第一天
      return [start, end];
    },
  },
  {
    text: '本月',
    value: () => {
      const end = new Date()
      const start = new Date()
      const date = (new Date()).getDate() - 1
      start.setTime(start.getTime() - 3600 * 1000 * 24 * date)
      return [start, end]
    },
  },
  {
    text: '近七天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '当天',
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    },
  }
]

export const setTodayDate = () => {
  // 获取当前日期
  const now = new Date();
  // 格式化日期为YYYY-MM-DD
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return formattedDate;
};
export const setLastDate = () => {
  // 获取当前日期  
  const now = new Date();
  // 设置日期为七天前  
  now.setDate(now.getDate() - 7);
  // 格式化日期为YYYY-MM-DD  
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return formattedDate;

};

//限制三个月的选择
export const disabledDate = (time: Date) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // 今天的开始时间

  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayStart.getDate() + 1); // 今天的结束时间（下一天的开始时间，但不包括那一天）
  todayEnd.setMilliseconds(-1); // 为了确保今天的最后一毫秒也是可选的

  const threeMonthsAgo = new Date(todayStart);
  threeMonthsAgo.setMonth(todayStart.getMonth() - 3);

  // 禁用三个月之前的日期和今天之后的日期
  return time.getTime() < threeMonthsAgo.getTime() || time.getTime() >= todayEnd.getTime();


}