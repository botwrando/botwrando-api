type Defined<T> = T extends undefined ? never : T;

export type MinusKeys<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export type MergedProperties<T, U> = {
  [K in keyof T & keyof U]: (
    undefined extends T[K] ? Defined<T[K] | U[K]> : T[K]
  )
};

export type MergedType<A, B> =
  MinusKeys<A, B> & MinusKeys<B, A> & MergedProperties<B, A>;


export default function merge<
  A extends object,
  B extends object
>(a: A, b: B): MergedType<A, B> {
  const merged: MergedType<A, B> = {
    ...a as object,
    ...b as object
  } as MergedType<A, B>;
  return merged;
}
