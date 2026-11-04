const {app,BrowserWindow,Menu}=require('electron');
if(process.argv.includes('--multi-window'))app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.whenReady().then(async()=>{
if(process.argv.includes('--multi-window')) {
 const splash=new BrowserWindow({show:false});
 await splash.loadURL('data:text/html,<title>Fixture splash</title><p>Starting</p>');
 await new Promise(resolve=>setTimeout(resolve,300));
}
const window=new BrowserWindow({width:1000,height:760,webPreferences:{contextIsolation:true,nodeIntegration:false}});
Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'File',submenu:[{label:'Export',submenu:[{label:'Export JSON',click:()=>window.webContents.executeJavaScript('document.getElementById("status").textContent="Export ready"')} ]},{role:'quit'}]},{label:'Tools',submenu:[{label:'Diagnostics',enabled:false},{label:'Flag',type:'checkbox',click:item=>window.webContents.executeJavaScript('document.getElementById("status").textContent='+JSON.stringify('Flag '+item.checked))}]}]));
await window.loadFile(require('path').join(__dirname,'../web.html'));
if(process.argv.includes('--multi-window')) {
 const settings=new BrowserWindow({show:false});
 await settings.loadURL('data:text/html,<title>Fixture settings</title><p data-testid="settings">Settings ready</p>');
}
});
app.on('window-all-closed',()=>app.quit());
