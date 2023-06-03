import styles from "./Card.module.css"

const Card = (props) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.heading}>{props.heading}</h2>
            {props.children}
        </div>
    );
};

export default Card;