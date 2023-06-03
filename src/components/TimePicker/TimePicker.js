import styles from "./TimePicker.module.css";

function TimePicker(props) {
  const clickHandler = (event) => {
    props.onTimescaleSelected(event.currentTarget.value);
  };

  return (
    <div>
      <ul className={styles.buttonList}>
        <li>
          <button value="1" onClick={clickHandler} className={styles.button}>
            <span>day</span>
          </button>
        </li>
        <li>
          <button value="5" onClick={clickHandler} className={styles.button}>
            <span>week</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default TimePicker;
