import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PACKAGE_ROOT } from './runtime.js';
import { Workspace } from './workspace.js';
import { importRequirements } from './documents.js';
import { createPlan, generateSuite } from './workflows.js';
import { importApiDocument } from './api-documents.js';
export async function initE2eDemo(workspace:Workspace){
  try{await access(await workspace.safe('e2e-demo'));throw new Error('e2e-demo already exists. Keep your changes and choose an empty workspace.');}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
  const files=['server.mjs','requirements.md','plan.input.json','suite.json','openapi.yaml','math.wsdl','mixed-ui.suite.json'];
  for(const file of files)await workspace.write('e2e-demo/'+file,await readFile(join(PACKAGE_ROOT,'examples/unified-e2e',file),'utf8'));
  const document=await importRequirements('e2e-demo/requirements.md',workspace),api=await importApiDocument('e2e-demo/openapi.yaml',workspace),soap=await importApiDocument('e2e-demo/math.wsdl',workspace);
  const input=JSON.parse(await workspace.read('e2e-demo/plan.input.json'));
  const plan=await createPlan({...input,documents:[document.documentId],apiDocuments:[api.documentId,soap.documentId]},workspace);
  const suite=JSON.parse(await workspace.read('e2e-demo/suite.json'));suite.planPath='e2e-demo/plan.json';
  const generated=await generateSuite(suite,'e2e-demo/suite.json',workspace);
  return {workspace:workspace.root,plan,suite:generated,next:['In a separate terminal: node e2e-demo/server.mjs .','Keep the fixture running, then use: run e2e-demo/suite.json','Open the new report directory/index.html. The demo performs authorized synthetic API writes; database adapters only read.']};
}
export async function initDemo(workspace:Workspace){
  try{await access(await workspace.safe('infi-demo'));throw new Error('infi-demo already exists. Use an empty workspace or rename that folder to keep your edits.')}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error}
  const files=['requirements.md','fixture.html','plan.input.json','suite.json'];
  const contents=await Promise.all(files.map(file=>readFile(join(PACKAGE_ROOT,'examples/requirement-demo',file),'utf8')));
  for(let i=0;i<files.length;i++)await workspace.write('infi-demo/'+files[i],contents[i].replace(/^\uFEFF/,''));
  const imported=await importRequirements('infi-demo/requirements.md',workspace);
  const input=JSON.parse(contents[2].replace(/^\uFEFF/,''));
  const plan=await createPlan({...input,documents:[imported.documentId],path:'infi-demo/plan.md'},workspace);
  const generated=await generateSuite(JSON.parse(contents[3].replace(/^\uFEFF/,'')),'infi-demo/suite.json',workspace);
  return {workspace:workspace.root,documentId:imported.documentId,plan,suite:generated,next:'Run the same launcher with: run infi-demo/suite.json'};
}
