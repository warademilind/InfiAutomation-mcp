import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { DesktopDriver } from '../dist/drivers/desktop.js';
import { targetSchema } from '../dist/schema.js';
const driver=new DesktopDriver(targetSchema.parse({kind:'desktop',executable:resolve('integration/fixtures/native/bin/Release/net8.0-windows/Fixture.exe'),timeoutMs:10000}));
try {await driver.start();const menus=await driver.menus(12);console.log(JSON.stringify(menus,null,2));await driver.act({name:'Check title',action:'assertTitle',value:'TestWeave Native Lab',contains:false});}finally{await driver.close().catch(()=>{})}
