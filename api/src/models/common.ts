/**
 * @pattern ^[\/-a-zA-z]*$
 */
export type UriPath = string

/**
 * @asType string
 * @format int64
 * @pattern ^\d+$
 */
export type UBigInt = bigint;

/**
 * @format email
 */
export type Email = string;
