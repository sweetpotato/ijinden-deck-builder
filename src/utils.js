// Iterator.prototype.reduce() を使わない総和。
// Safari on iOS では reduce がサポートされていない[1]ため必要。
// [1] https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Iterator#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7
//
export function sum(array) {
  var result = 0;
  for (const it of array) {
    result += it;
  }
  return result;
}
