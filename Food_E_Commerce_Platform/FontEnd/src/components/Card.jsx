import React, { useEffect, useState } from 'react';
import { formatMoney } from '../utils';
import styles from './card/styles.module.css'
import { ProductDetailModal } from './products/ProductDetailModal';
import { iconFavorite, iconFavoriteDefault } from './icon/Icon';
import { deleteProductFavorite, setProductFavorite } from '../service/product';
const Card = ({item, isFavoriteProduct}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)


  const handleSetFavorite = async() =>{
    setIsFavorite(!isFavorite)
    try {
      const storedUser = localStorage.getItem("user");
        const userData = JSON.parse(storedUser);
        if(!isFavorite){
          const rs = await setProductFavorite({
            CustomerID: userData.id,
            ProductID: item.ProductID
          })
        }else{
          const rs = await deleteProductFavorite({
            CustomerID: userData.id,
            ProductID: item.ProductID
          })
        }
     
      
    } catch (error) {
      console.error("error handleSetFavorite: ",error);
      
    }
  }

  useEffect(()=>{
    setIsFavorite(isFavoriteProduct)
  },[isFavoriteProduct])
  return (
    <div className={styles.card_container}>
      <div className={styles.card_imageContainer} >
        <img className={styles.card_image} src={item.ProductImg} onClick={()=> setIsOpen(true)}/>
      </div>
      <div className={styles.card_info}>
        <div className={styles.card_infoContainer}>
          <div className={styles.card_infoTitle}>
            <span className={styles.card_infoTitleName} onClick={()=> setIsOpen(true)}>{item.ProductName}</span>
            <p className={styles.card_infoQuantity}>SL: {item.StockQuantity}</p>
          </div>
          <div className={styles.card_infoRight}>
          <span className={styles.card_infoMoney}>{formatMoney(item.Price)} VND</span>
          <div onClick={handleSetFavorite} className={styles.card_infoRight_favorite}>{isFavorite ?iconFavorite : iconFavoriteDefault}</div>
          </div>

        </div>
        <button className={styles.card_button}>Add to cart</button>
      </div>
      <ProductDetailModal isOpen={isOpen}  setIsOpen={setIsOpen} product={item} />

    </div>
  );
}

export default Card;
