import { useContext, useEffect, useState } from 'react';
import styles from './stylesProduct.module.css'
import { getProductDetail } from '../../service/product';
import { useNavigate, useParams, useRoutes } from 'react-router-dom';
import { formatMoney } from '../../utils';
import { Comments } from '../comment/Comments';
import { LayoutCommon } from '../../layout/layout-common/LayoutCommon';
import { GlobalContext } from '../../globalContext/GlobalContext';


export const ProductDetail = ({ product, setIsOpen, isPage,isOpen }) => {
      const {setShopID, shopID: id, fetchInforShopList } = useContext(GlobalContext);
  const navigate = useNavigate();

    const handleGoToShop = () =>{
        const shopID = product?.ShopID
        if(!shopID) return
        setShopID(shopID)
        navigate('/shop')
    }
    if (!product) return (<></>)
    return (
        <div className={isPage ? styles.productModal_container_page : styles.productModal_container}>
            <div className={isPage ? styles.product_container_page : styles.product_container}>
                <div className={styles.product_imageContainer} >
                    <img className={styles.product_image} src={product?.ProductImg} onClick={() => { if (setIsOpen) setIsOpen(true) }} />
                </div>
                <div className={styles.product_info}>
                    <div className={styles.product_infoShop}>
                       <span>Cửa hàng:</span> <p onClick={handleGoToShop}>{product.ShopName}</p>
                    </div>
                    <div className={styles.product_infoContainer}>
                        <div className={styles.product_infoTitle}>
                            <span className={isPage ? styles.product_infoTitleName_page : styles.product_infoTitleName} onClick={() => { if (setIsOpen) setIsOpen(true) }}>{product.Category} - {product.ProductName}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: 'center' }}> <span className={styles.product_infoQuantity}>SL: {product.StockQuantity}</span>
                            <span className={styles.product_infoMoney}>{formatMoney(product.Price)} VND</span></div>
                    </div>
                    <div className=''>
                    <div className={styles.sAOZ6s}><div className= {styles.ZDu7mK} style={{width: '63.9809%'}}><div className={`${styles.r6CPBG} ${styles.dG6ROf}`}></div></div><div className= {`${styles.VAir_o} ${styles.XLXeSo}`}></div></div>
                    </div>
                    <div className={styles.product_infoDescription}>
                        <div className={styles.product_infoDescription_title}>
                            Mô Tả Sản Phẩm
                        </div>
                        <div className={styles.product_infoDescription_content}>
                            <h4>✪ Thông tin sản phẩm</h4> <p>{product.Description}</p>
                        </div>
                        <div className={styles.product_infoDescription_content}>
                            <h4>✪ Lưu ý</h4> <p>Khách tham khảo kỹ bảng size, mô tả sản phẩm và ảnh cận chất liệu để lựa chọn sản phẩm phù hợp với mình (tránh trường hợp mua sản phẩm không phù hợp với ý thích). Mọi thắc mắc khác vui lòng liên hệ qua hệ thống chat để được trả lời nhanh nhất.</p>
                        </div>
                    </div>
                </div>

            </div>
            <Comments isPage={isPage} product={product} isOpen={isOpen}/>
        </div>
    )
}

export const PageProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        navigate(`/product/${id}`, { replace: true });
    }, [navigate]);
    const [product, setProduct] = useState()
    const getData = async () => {

        if (!id) return
        const rs = await getProductDetail({ productID: id })
        setProduct(rs.data[0]?.[0])
    }
    useEffect(() => {
        getData()
    }, [id])
    return (
        <LayoutCommon>
            <div>
                <ProductDetail product={product} isPage />
            </div>
        </LayoutCommon>
    )
}