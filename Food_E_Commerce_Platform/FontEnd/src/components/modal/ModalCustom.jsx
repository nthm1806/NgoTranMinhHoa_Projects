import React, { useEffect } from "react";
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

export const ModalNotify = ({notify, setNotify}) =>{

  useEffect(()=>{
    if(notify.isOpen){
      setTimeout(()=>{
        setNotify(pre => ({ ...pre, isOpen: false }))
      }, 2000)
    }
  },[notify])

  return(
    <ModalCustom isOpen={notify.isOpen} hindTitle setIsOpen={() => setNotify(pre => ({ ...pre, isOpen: false }))}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
          {notify.icon} <h3 style={{ marginLeft: 10 }}> {notify.message} </h3>
        </div>
      </ModalCustom>
  )
}
