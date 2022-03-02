/***
 * 根据日期差（天数）获取日期
 * @param diffDay
 * @returns {Date}
 */
export function getDateByDiffDay(diffDay) {
  let time = new Date().getTime() + diffDay * 24 * 60 * 60 * 1000
  return new Date(time)
}
