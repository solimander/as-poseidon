import { BigInt } from './bigint';
import { C_VALUES, M_VALUES } from './constants';

class Field {
  static MODULUS: BigInt = BigInt.from('3618502788666131213697322783095070105623107215331596699973092056135872020481');
  static ZERO: BigInt = BigInt.from(0);

  add(a: BigInt, b: BigInt): BigInt {
    const res = a.add(b);
    if (res.gte(Field.MODULUS)) {
      return res.sub(Field.MODULUS);
    }
    return res;
  }

  mul(a: BigInt, b: BigInt): BigInt {
    return a.mul(b).mod(Field.MODULUS);
  }

  square(a: BigInt): BigInt {
    return a.mul(a).mod(Field.MODULUS);
  }
}

const N_ROUNDS_F = 8;
const N_ROUNDS_P = 83;
const RATE = 2;
const M = 3;
const ROUND_COUNT = N_ROUNDS_F + N_ROUNDS_P;
const F = new Field();

const pow3 = (a: BigInt): BigInt => F.mul(a, F.square(a));

function poseidon(inputs: BigInt[]): BigInt[] {
  const t = inputs.length;
  let state = inputs.slice(); // Copy inputs to state

  for (let r = 0; r < ROUND_COUNT; r++) {
    let newState1 = new Array<BigInt>(t);
    for (let i = 0; i < t; i++) {
      newState1[i] = F.add(
        state[i],
        BigInt.from(C_VALUES[t - 2][r * t + i])
      );
    }
    state = newState1;

    if (r < N_ROUNDS_F / 2 || r >= N_ROUNDS_F / 2 + N_ROUNDS_P) {
      let newState2 = new Array<BigInt>(t);
      for (let i = 0; i < t; i++) {
        newState2[i] = pow3(state[i]);
      }
      state = newState2;
    } else {
      state[2] = pow3(state[2]);
    }

    let newState3 = new Array<BigInt>(t);
    for (let i = 0; i < t; i++) {
      let sum = Field.ZERO;
      for (let j = 0; j < t; j++) {
        sum = F.add(
          sum,
          F.mul(BigInt.from(M_VALUES[t - 2][i][j]), state[j])
        );
      }
      newState3[i] = sum;
    }
    state = newState3;
  }

  return state;
}

export function poseidonHashMany(values: string[]): string {
  if (!Array.isArray(values)) throw new Error('BigInt array expected in values');

  const padded = values.slice(); // Copy
  padded.push('1');

  while (padded.length % RATE !== 0) padded.push('0');
  let state: BigInt[] = new Array<BigInt>(M).fill(BigInt.from(0));
  for (let i = 0; i < padded.length; i += RATE) {
    for (let j = 0; j < RATE; j++) state[j] = state[j].add(padded[i + j]);
    state = poseidon(state);
  }
  return state[0].toString();
}
