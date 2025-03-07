import React from "react";
import styles from "./styles.module.css";

export const ModalCustom = ({ isOpen, setIsOpen, children, title,hindTitle }) => {
  return (
    <div
      className={isOpen ? styles.modal : styles.modalHidden}
    >
      <div className={styles.modalContent}>
        <div className={styles.modal_title} style={hindTitle ? {borderBottom: 'none'} : {}}>
          <span> {title || ''}</span> <span className={styles.close} onClick={() => setIsOpen(false)}>
            &times;
          </span>
        </div>
        <div className={styles.modal_body}>
          {children}
        </div>
      </div>

    </div>
  );
};

