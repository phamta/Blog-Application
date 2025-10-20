import React from 'react';
import styles from './Card.module.css';

const Card = ({ image, title, description }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt="Card Image" className={styles.cardImage} />
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};

export default Card;