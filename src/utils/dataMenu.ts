export const setMenu=(data:any)=>{
    let menu=data.map((m:any)=>{
      // let parts = m.Component.split('/');
      // console.log(parts)
      // let englishOnly = m.Name.replace(/[^a-zA-Z]/g, '');  
      // console.log(englishOnly);
        return {
            ID:m.ID,
            FID:m.FID,
            MenuLevel:m.Level,
            MenuName:m.Name,
            title:m.Desc,
            path:m.Name,
            component:m.Component,
            EquipmentDesc:m.EquipmentDesc,
            EquipmentName:m.EquipmentName,
            sortId:m.sortId,
        }
    })
    let arr=OrganData(menu)
    return arr
}

export  const OrganData = (organizations: any) => {
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
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
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
    // 格式化日期为YYYY-MM-DD
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate() - 6).padStart(2, "0")}`;
    return formattedDate;
  };