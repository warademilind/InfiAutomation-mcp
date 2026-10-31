import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { parseCli, cacheDirectory, cachedNativeWorker, nativeWorkerPath, systemWorkingDirectory, VERSION } from '../src/runtime.js';
import { checksumFromManifest, verifyChecksum } from '../src/setup.js';
test('portable launcher accepts workspace before/after commands and rejects missing values',()=>{
  assert.deepEqual(parseCli(['--workspace','./tests','doctor']),{command:'doctor',args:[],workspace:resolve('tests')});
  assert.deepEqual(parseCli(['run','suite.json','--workspace=./tests']),{command:'run',args:['suite.json'],workspace:resolve('tests')});
  assert.throws(()=>parseCli(['--workspace']),/requires a directory/);
  assert.throws(()=>parseCli(['--workspace=']),/requires a directory/);
  assert.throws(()=>parseCli(['--workspace','--version']),/requires a directory/);
});
test('native cache is versioned and explicit worker paths take precedence',()=>{
  const env={TESTWEAVE_CACHE_DIR:resolve('.testweave/cache-check'),TESTWEAVE_NATIVE_WORKER:resolve('custom-worker.dll')};
  assert.equal(cacheDirectory(env),env.TESTWEAVE_CACHE_DIR);
  assert.ok(cachedNativeWorker(env).includes(VERSION));
  assert.equal(nativeWorkerPath(env),env.TESTWEAVE_NATIVE_WORKER);
});
test('checksum validation rejects corrupt, absent and duplicate release assets',()=>{
  const bytes=Buffer.from('fixture archive'),hash=createHash('sha256').update(bytes).digest('hex');
  assert.equal(checksumFromManifest(hash+'  worker.zip\r\n','worker.zip'),hash);
  verifyChecksum(bytes,hash);
  assert.throws(()=>verifyChecksum(Buffer.from('changed'),hash),/mismatch/);
  assert.throws(()=>checksumFromManifest(hash+'  other.zip','worker.zip'),/exactly one/);
  assert.throws(()=>checksumFromManifest(hash+'  worker.zip\n'+hash+'  worker.zip','worker.zip'),/exactly one/);
});
test('launcher avoids drive roots and Windows system folders as default workspaces',()=>{
  assert.equal(systemWorkingDirectory(resolve('/')),true);
  if(process.platform==='win32'){
    assert.equal(systemWorkingDirectory('C:\\Windows\\System32',{SystemRoot:'C:\\Windows'}),true);
    assert.equal(systemWorkingDirectory('D:\\project',{SystemRoot:'C:\\Windows'}),false);
  }
});
