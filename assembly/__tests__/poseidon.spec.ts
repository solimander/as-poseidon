import { BigInt } from '../bigint';
import { poseidonHashMany } from '../index';

const B1 = BigInt.from('1');
const B2 = BigInt.from('2');
const B3 = BigInt.from('3');
const B4 = BigInt.from('4');
const B5 = BigInt.from('5');

describe('Poseidon Hashing', () => {
  it('should compute the correct poseidon hash with a single element', () => {
    expect<string>(poseidonHashMany([B1]).toString()).toStrictEqual(
      '154809849725474173771833689306955346864791482278938452209165301614543497938'
    );
  });

  it('should compute the correct poseidon hash with multiple inputs', () => {
    const input = [B1, B2, B3, B4, B5];

    expect<string>(poseidonHashMany(input).toString()).toStrictEqual(
      '611250879885582549814822745980582240134120981459161846704834910080944450980'
    );
  });
});
