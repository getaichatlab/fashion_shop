import test from 'node:test';
import assert from 'node:assert/strict';
import {adjustAlphaEdge,cleanAlphaIslands} from '../src/lib/studio.ts';

test('cleanup removes isolated debris but retains marked, diagonal and largest parts',()=>{
 const w=20,h=20,alpha=new Uint8Array(w*h),seeds=new Uint8Array(w*h);
 for(let y=3;y<10;y++)for(let x=3;x<10;x++)alpha[y*w+x]=255;
 alpha[10*w+10]=255; // A diagonal strap connected to the main garment.
 alpha[1*w+18]=255;alpha[2*w+18]=80; // Unmarked debris including a soft edge.
 alpha[17*w+2]=255;alpha[17*w+3]=255;seeds[17*w+2]=1; // Separate protected detail.
 const before=alpha.slice(),result=cleanAlphaIslands(alpha,seeds,w,h,.01);
 assert.equal(result.removedComponents,1);assert.equal(result.removedPixels,2);
 assert.equal(result.alpha[1*w+18],0);assert.equal(result.alpha[2*w+18],0);
 assert.equal(result.alpha[10*w+10],255);assert.equal(result.alpha[17*w+3],255);
 assert.equal(result.alpha[5*w+5],255);assert.deepEqual(alpha,before);
});

test('cleanup preserves a tiny sole object and an empty mask',()=>{
 const alpha=new Uint8Array(100);alpha[33]=255;
 assert.deepEqual(cleanAlphaIslands(alpha,new Uint8Array(100),10,10,.01).alpha,alpha);
 assert.equal(cleanAlphaIslands(new Uint8Array(100),new Uint8Array(100),10,10).removedPixels,0);
});

test('edge trim shrinks and expands the mask by the requested source pixels',()=>{
 const w=9,h=9,alpha=new Uint8Array(w*h);
 for(let y=2;y<=6;y++)for(let x=2;x<=6;x++)alpha[y*w+x]=255;
 const shrunk=adjustAlphaEdge(alpha,w,h,1),expanded=adjustAlphaEdge(alpha,w,h,-1);
 assert.equal(shrunk.filter(v=>v===255).length,9);
 assert.equal(expanded.filter(v=>v===255).length,49);
 assert.equal(alpha.filter(v=>v===255).length,25);
 assert.equal(shrunk[4*w+4],255);assert.equal(shrunk[2*w+4],0);
});
