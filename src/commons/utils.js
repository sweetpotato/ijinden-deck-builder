// SPDX-License-Identifier: MIT

// Iterator.prototype.reduce() を使わない総和。
// Safari on iOS では reduce がサポートされていないため必要。
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/reduce#browser_compatibility
//
// Array.prototype.reduce() ならサポートされているため、こちらを使う。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7
//
export function sum(iterable) {
  return [...iterable].reduce((a, b) => a + b, 0)
}
