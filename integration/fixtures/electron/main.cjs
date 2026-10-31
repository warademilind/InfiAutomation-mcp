const {app,BrowserWindow,Menu}=require('electron');
app.whenReady().then(()=>{const window=new BrowserWindow({width:1000,height:760,webPreferences:{contextIsolation:true,nodeIntegration:false}});
Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'File',submenu:[{label:'Export',submenu:[{label:'Export JSON',click:()=>window.webContents.executeJavaScript('document.getElementById("status").textContent="Export ready"')} ]},{role:'quit'}]},{label:'Tools',submenu:[{label:'Diagnostics',enabled:false}]}]));
window.loadFile(require('path').join(__dirname,'../web.html'));});
app.on('window-all-closed',()=>app.quit());
