import styles from "./styles.module.css";

export default function SlideDoAn({products, setCombo, combo, setProduct, type, style}) {

  const handleChooseProduct = (product) =>{
    if(!combo) return
    setCombo({...combo, [type]: [...(combo[type] || []), product.ProductID]})
  }

  return (
    <div className={styles.container} style={style || {}}>
      {(combo ? products.filter(i => !combo[type]?.includes(i.ProductID)) : products)?.map((product) => (
        <div key={product.ProductID} className={styles.card} onClick={() => handleChooseProduct(product)}>
          <img src={product.ProductImg} alt="" style={{width: 190, height: 100}} />
          <p className={styles.title}>{product.ProductName}</p>
        </div>
      ))}
    </div>
  );
}
