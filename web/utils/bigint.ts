export const bigintMin = (...nums: bigint[]) => nums.reduce((min, num) => num < min ? num : min)
export const bigintMax = (...nums: bigint[]) => nums.reduce((max, num) => num > max ? num : max)
