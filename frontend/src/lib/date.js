/**
 * Date 포매팅
 * @param {*} y
 * @param {*} m
 * @param {*} d
 */
function makeDateFormat(y, m, d) {
  return `${y}/${formatDigitToTens(m)}/${formatDigitToTens(d)}`;
}

/**
 * 한자릿수를 두자릿수로 포매팅
 * @param {*} time
 */
function formatDigitToTens(time) {
  return time < 10 && time.length < 2 ? `0${time}` : time;
}

/**
 * 트리거 할 시각을 포매팅
 * @param {*} h
 * @param {*} m
 */
function makeTimeFormat(h, m) {
  return `${formatDigitToTens(h)}:${formatDigitToTens(m)}`;
}

export default {
  makeDateFormat,
  makeTimeFormat
};
