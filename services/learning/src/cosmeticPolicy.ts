export const COSMETICS: Record<string, { cost: number; slot: 'head' | 'eyes' | 'neck' }> = {
  cap: { cost:500, slot:'head' }, crown: { cost:5000, slot:'head' },
  cyber_glasses: { cost:1500, slot:'eyes' }, gold_chain: { cost:2500, slot:'neck' },
  founder_tie: { cost:800, slot:'neck' },
};
export function purchaseCosmetic(balance: number, owned: string[], id: string) {
  const item = COSMETICS[id];
  if (!item) throw new Error('Unknown cosmetic.');
  if (!Number.isSafeInteger(balance) || balance < 0) throw new Error('Invalid coin balance.');
  if (owned.includes(id)) return { coins:balance, unlockedAccessories:owned, alreadyOwned:true };
  if (balance < item.cost) throw new Error('Not enough earned coins.');
  return { coins:balance-item.cost, unlockedAccessories:[...owned,id], alreadyOwned:false };
}
export function equipCosmetic(owned: string[], equipped: string[], id: string) {
  const item = COSMETICS[id];
  if (!item || !owned.includes(id)) throw new Error('Earn this cosmetic first.');
  if (equipped.includes(id)) return equipped.filter(value=>value!==id);
  return [...equipped.filter(value=>COSMETICS[value]?.slot!==item.slot), id];
}
