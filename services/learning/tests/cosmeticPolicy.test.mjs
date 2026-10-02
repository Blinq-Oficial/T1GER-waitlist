import test from 'node:test';
import assert from 'node:assert/strict';
import { purchaseCosmetic, equipCosmetic } from '../lib/cosmeticPolicy.js';
test('repeated purchases keep the balance and ownership unchanged',()=>{
  const first=purchaseCosmetic(500,[], 'cap');
  assert.equal(first.coins,0);
  assert.deepEqual(purchaseCosmetic(first.coins,first.unlockedAccessories,'cap'), {...first,alreadyOwned:true});
});
test('invalid and insufficient purchases never produce a balance',()=>{
  assert.throws(()=>purchaseCosmetic(499,[],'cap'));
  assert.throws(()=>purchaseCosmetic(10000,[],'free-crown'));
  assert.throws(()=>purchaseCosmetic(-5,[],'cap'));
});
test('equipment requires ownership and replaces only the matching slot',()=>{
  assert.throws(()=>equipCosmetic([],[],'crown'));
  assert.deepEqual(equipCosmetic(['cap','crown','gold_chain'],['cap','gold_chain'],'crown'),['gold_chain','crown']);
  assert.deepEqual(equipCosmetic(['crown'],['crown'],'crown'),[]);
});
