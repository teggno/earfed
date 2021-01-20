/** extracts the type of the value the promise wraps */
export type PromiseValue<T> = T extends Promise<infer U> ? U : never;

/** extracts the type of the elements in an array */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
