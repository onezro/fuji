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