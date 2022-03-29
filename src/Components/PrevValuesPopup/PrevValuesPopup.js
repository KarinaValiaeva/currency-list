import "./PrevValuesPopup.css";

function PrevValuesPopup(props) {
  function getDate(date) {
    return date.slice(0, 10);
  }

  return (
    <div className={`values-popup ${props.isOpen && "values-popup_opened"}`}>
      <div className="values-popup__container">
        <button
          className="values-popup__button-close"
          type="button"
          onClick={props.onClose}
        >
          &#10006;
        </button>
        <p className="values-popup__title"> Валюта: {props.valute.code}</p>
        <ul className="values-popup__list">
          {props.prevValues.map((item, index) => (
            <li className="values-popup__list-item" key={index}>
              <div>{getDate(item.date)}</div>
              <div>{item.valute}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PrevValuesPopup;
