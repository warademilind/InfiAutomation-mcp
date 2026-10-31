import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
test('MCP stdio handshake, tool schemas, prompts, resource and validated generation',async()=>{
  const transport=new StdioClientTransport({command:process.execPath,args:['dist/cli.js'],cwd:process.cwd(),stderr:'pipe',env:{...process.env,INFIAUTOMATION_WORKSPACE:process.cwd()} as Record<string,string>});
  const client=new Client({name:'infiautomation-verifier',version:'1.0.0'});
  try{
    await client.connect(transport);
    const tools=await client.listTools();assert.ok(tools.tools.length>=18);assert.ok(tools.tools.some(t=>t.name==='test_run'));
    const prompts=await client.listPrompts();assert.equal(prompts.prompts.length,3);
    const resources=await client.listResources();assert.ok(resources.resources.some(r=>r.uri==='infiautomation://guide'));
    const doctor=await client.callTool({name:'doctor',arguments:{}});assert.ok(!doctor.isError);
    const invalid=await client.callTool({name:'session_start',arguments:{target:{kind:'electron'}}});assert.equal(invalid.isError,true);
    const generated=await client.callTool({name:'test_generate',arguments:{path:'.infiautomation/mcp/generated.json',suite:{schemaVersion:1,name:'MCP verification',target:{kind:'web'},tests:[{id:'test',name:'Title',steps:[{name:'Verify title',action:'assertTitle',value:'Fixture'}]}]}}});assert.ok(!generated.isError,JSON.stringify(generated));
    const plan=await client.callTool({name:'plan_create',arguments:{name:'Fixture plan',goal:'Check the title',target:{kind:'web'},requirements:['Title must identify the app'],scenarios:[{name:'Title',requirementIds:['R01'],steps:['Open app','Read title'],expected:'Fixture'}],path:'.infiautomation/mcp/plan.md'}});assert.ok(!plan.isError,JSON.stringify(plan));
    const imported=await client.callTool({name:'requirements_import',arguments:{path:'examples/requirement-demo/requirements.md'}});assert.ok(!imported.isError,JSON.stringify(imported));const source=imported.structuredContent as any;assert.match(source.text,/REQ-SAVE-001/);
    const chunk=await client.callTool({name:'requirements_read',arguments:{documentId:source.documentId,offset:0,limit:20}});assert.ok(!chunk.isError);assert.equal((chunk.structuredContent as any).nextOffset,20);
    const linkedPlan=await client.callTool({name:'plan_create',arguments:{name:'Requirement-linked plan',goal:'Save feedback',documents:[source.documentId],target:{kind:'web'},requirements:[{id:'REQ-SAVE-001',text:'Save shows feedback'}],scenarios:[{name:'Save',requirementIds:['REQ-SAVE-001'],steps:['Save'],expected:'Saved'}],path:'.infiautomation/mcp/linked.md'}});assert.ok(!linkedPlan.isError,JSON.stringify(linkedPlan));
    const linkedSuite={schemaVersion:1,name:'Linked suite',target:{kind:'web'},tests:[{id:'save',name:'Save',requirements:['REQ-SAVE-001'],steps:[{name:'Verify',action:'assertTitle',value:'Fixture'}]}]};
    const linked=await client.callTool({name:'test_generate',arguments:{suite:linkedSuite,path:'.infiautomation/mcp/linked.suite.json',planPath:'.infiautomation/mcp/linked.json'}});assert.ok(!linked.isError,JSON.stringify(linked));
    const coverage=await client.callTool({name:'traceability_get',arguments:{directory:'.infiautomation/mcp/linked.suite.coverage'}});assert.ok(!coverage.isError);assert.equal((coverage.structuredContent as any).summary.notRun,1);
    const unsupported=await client.callTool({name:'heal_apply',arguments:{path:'.infiautomation/mcp/generated.json',testId:'test',stepIndex:0,locator:{text:'Fake'},apply:true}});assert.equal(unsupported.isError,true);
  }finally{await client.close()}
});
