export function padDate(value) {
  return value < 10 ? '0' + value : value;
}

export function formatDate(value) {
  let date = new Date(value);
  let year = date.getFullYear();
  let month = padDate(date.getMonth() + 1);
  let day = padDate(date.getDate());
  return year + '-' + month + '-' + day;
}

export function formatTime(value) {
  let date = new Date(value)
  let hours = padDate(date.getHours());
  let minutes = padDate(date.getMinutes());
  let seconds = padDate(date.getSeconds());
  return hours + ':' + minutes + ':' + seconds;
}
