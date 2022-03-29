export const BASE_URL =
  "https://www.cbr-xml-daily.ru";

const checkResponse = (res) => (res.ok ? res.json() : Promise.reject(res));

export const getCurrency = () => {
  return fetch(`${BASE_URL}/daily_json.js`)
  .then(checkResponse);
};
// Не на все необходимые даты апи выдаёт корректный ответ
export const getYesterdayCurrency = (date) => {
return fetch(`${BASE_URL}/archive/${date}/daily_json.js`)
.then(checkResponse)
};
