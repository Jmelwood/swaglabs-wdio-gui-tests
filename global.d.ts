import type { Chance } from 'chance';

declare global {
  var chance: Chance.Chance;
  namespace NodeJS {
    interface Global {
      chance: typeof chance;
    }
  }
}

export {};
