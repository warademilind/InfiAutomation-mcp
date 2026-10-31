import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PACKAGE_ROOT } from './runtime.js';
import { Workspace } from './workspace.js';
import { importRequirements } from './documents.js';
import { createPlan, generateSuite } from './workflows.js';
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
