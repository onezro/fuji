export const updateParentMenus=(menus:any)=>{
    let foundComponent:any = null; 
    function traverseMenus(menus:any) {  
        menus.forEach((menu:any) => {  
            if (menu.childMenu) {  
                traverseMenus(menu.childMenu);  
            }  
            if (menu.MenuLevel === 3 && menu.component) {  
                foundComponent = menu.component;  
            }  
  
            if (menu.MenuLevel === 1 && foundComponent) {  
                menu.component = 'Layout'; 
                let parts = foundComponent.split('/');  
                menu.path = '/'+parts[0]; 
               
            }else{
                if(!menu.path){
                    menu.path='/'
                }
            }
            if (menu.MenuLevel === 2 && foundComponent&&menu.childMenu!==null) {  
                // let str=menu.childMenu[0].component
                // let parts = str.split('/');
                // menu.path = parts[1];
                menu.path = menu.MenuName 
            }  
        });  
    }  
  
    traverseMenus(menus);  
    let data=menus[0] 
    return data; 
}