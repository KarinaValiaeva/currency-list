import "./App.css";
import { useState, useEffect } from "react";
import * as CbrApi from "../../utils/CrbApi";
import PrevValuesPopup from "../PrevValuesPopup/PrevValuesPopup";

function App() {
  const [valutes, setValutes] = useState([]);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [prevValues, setPrevValues] = useState([]);

  function getPrevDAte(i) {
    let now = new Date();
    let newDate = new Date();
    newDate.setDate(now.getDate() - i);
    return newDate.toLocaleDateString().split(".").reverse().join("/");
  }

  useEffect(() => {
    CbrApi.getCurrency()
      .then((data) => {
        const newArr = Object.keys(data.Valute).map((item) => ({
          id: data.Valute[item].ID,
          code: data.Valute[item].CharCode,
          name: data.Valute[item].Name,
          valute: data.Valute[item].Value.toFixed(2),
          prevValue: data.Valute[item].Previous.toFixed(2), // предыдущее значение есть по ссылке https://www.cbr-xml-daily.ru/daily_json.js
        }));

        setValutes(newArr);
      })
      .catch((res) => console.log(res.status));
  }, []);

  function difference(x, y) {
    let result = ((y - x) / x) * 100;
    return result.toFixed(2);
  }

  function getTenValues(valute) {
    let dataArr = [];
    for (let i = 1; i <= 10; i += 1) {
      // Не на все необходимые даты апи выдаёт корректный ответ
      CbrApi.getYesterdayCurrency(getPrevDAte(i))
        .then((data) => {
          const newArr = Object.keys(data.Valute).map((item) => ({
            date: data.Date,
            id: data.Valute[item].ID,
            code: data.Valute[item].CharCode,
            valute: data.Valute[item].Value.toFixed(2),
          }));
          const arr = newArr.find((item) => item.id === valute.id);
          dataArr.push(arr);
          localStorage.setItem("valutesArr", JSON.stringify(dataArr));
          setPrevValues(JSON.parse(localStorage.getItem("valutesArr")));
        })
        .catch((res) => 
          console.log(res)
        );
    }
  }

  function handleClickValute(valute) {
    getTenValues(valute);
    setSelectedItem(valute);
    setIsOpenPopup(true);
  }

  function handleClosePopup() {
    setIsOpenPopup(false);
    localStorage.clear();
  }

  return (
    <>
      <div className="App">
        <main className="currency-container">
          <h2 className="currency-container__title">Курс валют</h2>

          <div className="currency-list__item currency-list__item_title ">
            <div>Валюта</div>
            <div>Руб.</div>
            <div>Разница</div>
          </div>
          <ul className="currency-list">
            {valutes.map((item, index) => (
              <li
                className="currency-list__item"
                key={index}
                onClick={() => handleClickValute(item)}
              >
                <div>{item.code}:</div>
                <div>{item.valute}</div>
                <div>{difference(item.prevValue, item.valute)} &#37;</div>
                <span className="currency-list__item-tooltip">{item.name}</span>
              </li>
            ))}
          </ul>
          <PrevValuesPopup
            isOpen={isOpenPopup}
            prevValues={prevValues}
            valute={selectedItem}
            onClose={handleClosePopup}
          />
        </main>
      </div>
    </>
  );
}

export default App;
