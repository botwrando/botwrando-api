import merge, {
  MergedProperties, MinusKeys
} from './merge';

describe('merge', () => {
  interface TestA {
    key_a1: string,
    key_a2: { subkey_aa1: number, subkey_aa2: boolean },
    shared_key: string
  };
  interface TestB {
    key_b1: string,
    key_b2: { subkey_bb1: number, subkey_bb2: boolean },
    shared_key: string
  };
  type TestAPlusB = 
    MinusKeys<TestA, TestB> & MinusKeys<TestB, TestA> &
    MergedProperties<TestB, TestA>

  let a: TestA, b: TestB;
  beforeEach(() => {
    a = {
      key_a1: 'value a',
      key_a2: { subkey_aa1: 3, subkey_aa2: true },
      shared_key: 'value a'
    };
    b = {
      key_b1: 'value b',
      key_b2: { subkey_bb1: 5, subkey_bb2: false },
      shared_key: 'value b'
    };
  });

  test('merged contains all keys from a', () => {
    const merged: TestAPlusB = merge(a, b);
    for (const prop in a) {
      expect(merged).toHaveProperty(prop);
    }
  });
  test('merged contains all keys from b', () => {
    const merged: TestAPlusB = merge(a, b);
    for (const prop in b) {
      expect(merged).toHaveProperty(prop);
    }
  });
  test('merged sets value of shared properties to b value', () => {
    const merged: TestAPlusB = merge(a, b);
    expect(merged).toHaveProperty('shared_key');
    expect(merged.shared_key).toEqual(b.shared_key);
  });
});
