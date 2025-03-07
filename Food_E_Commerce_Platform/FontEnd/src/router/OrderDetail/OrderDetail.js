import React from 'react'
import Header from '../../layout/Header/Header'
import Footer from '../../layout/Footer/Footer'
import {useParams,useLocation, useNavigate} from 'react-router-dom'
import styles from './OrderDetail.module.css'
import {useEffect,useState} from 'react'
import axios from 'axios';
import { useCustomer } from "../../Context";

function OrderDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { customer } = useCustomer();
    const orderDetail = location.state || null;
    const [shop, setShop] = useState(null);
    const [shipper, setShipper] = useState(null);
    const [chooseQuantity,setChooseQuantity] = useState(null)
    const [buyOrder,setBuyOrder] = useState(null);
    const [reviewPopup,setReviewPopup] = useState(null);
    const [productShop, setProductShop] = useState([]);
      const [messPopup,setMessPopup] = useState(null);
    const [formReview, setFormReview] = useState({
        category: "",
        reviewText: "",
        rating:0
      });
    const statusMap = {
      "Hoàn thành": "Đã giao hàng",
      "Vận chuyển": "Đang vận chuyển",
      "Hoàn đơn": "Đơn hàng đã bị hoàn",
      "Chờ thanh toán": "Chưa thanh toán",
    };
    useEffect(()=>{
      console.log(orderDetail)
      fetchShop();
    },[])
    async function fetchShop(){
      const response = await axios.get(`http://localhost:3001/api/shop/?shopID=${orderDetail.ShopID}`);
      await setShop(response.data[0])
      const shipperID = orderDetail.shipperID;
      const response1 = await axios.post('http://localhost:3001/api/Shipper/getShipperByID',{shipperID});
      await setShipper(response1.data[0]);
      const response2 = await axios.post('http://localhost:3001/api/Products/getProductByShopID',{ShopID: orderDetail.ShopID});
      await setProductShop(response2.data)
    }
    async function payment(orders){
      const response = await axios.post('http://localhost:3001/api/Order/getOrderByOrderItem',{OrderID: orders.orderID});
      const order = response.data
      navigate('/OrderCheckOut',{state:order})
    }
    const chooseQuantityPopup = async(order)=>{
      await setBuyOrder(order);
      await setChooseQuantity(1);
    }
    const closeReviewPopup = async()=>{
      await setReviewPopup(null)
      await setFormReview({
        category: "",
        reviewText: "",
        rating:0
      })
    }
    const handleChange =async (e) => {
      if(e.target.name === 'rating' && (e.target.value <0 || e.target.value >5)){
        alert('Số sao chỉ từ 0 đến 5');
        await setFormReview({ ...formReview, rating: 0});
      }
      if(e.target.value === 'shipper' && orderDetail.shipperID == null){
        alert('Sản phẩm này chưa có người giao hàng nên không thể đánh giá');
        await setFormReview({ ...formReview, category: ''});
      }
      setFormReview({ ...formReview, [e.target.name]: e.target.value });
    };
    const handleSubmit=async()=>{
      if(formReview.category === '' || formReview.reviewText === ""){
        alert('hãy nhập đủ thông tin')
        return;
      }
      const cusID = customer.CustomerID 
      let categoryID;
      if(formReview.category === 'product'){
        categoryID = orderDetail.productID;
      }else if(formReview.category === 'shop'){
        categoryID = orderDetail.shopID;
      }else{
        categoryID = orderDetail.shipperID;
      }
      const response = await axios.post('http://localhost:3001/api/Review/review',{formReview,cusID,categoryID})
      if(response.status === 200){
        await setMessPopup("thành công");
      }else{
        await setMessPopup("thất bại");
      }
      closeReviewPopup();
    }
    const changeQuantity = async (e)=>{
      console.log(e.target.value)
      await setChooseQuantity(e.target.value);
      
    }
    const buyAgain = async()=>{
      const selectCart = [{...buyOrder, Quantity : chooseQuantity,totalAmount: chooseQuantity * buyOrder.productPrice + 32000,}]
      console.log(selectCart)
      navigate('/OrderCheckOut',{state:selectCart})
    }
  return (
    <div className={styles.page}>
        <Header></Header>
        <div className={styles.content}>
            <img alt='' src={orderDetail.productImg} />
            <div className={styles.infor}>
              <h2>{orderDetail.productName}</h2>
              <p style={{color:'#8f8f8f'}}>Mô tả: {orderDetail.description}</p>
              <p>Loại sản phẩm : {orderDetail.productCategory}</p>
              <p>Cửa hàng: {shop ? shop.ShopName :''}</p>
              <p> {shipper ?`Người giao hàng: ${shipper.FirstName} ${shipper.LastName}`: ''}</p>
              <p> {shipper ?`Người giao hàng: ${shipper.FirstName} ${shipper.LastName}`: ''}</p>
              <button onClick={()=>setReviewPopup(orderDetail)} >Đánh Giá</button>
                <button className= {`${orderDetail.status === 'Chờ thanh toán' ? styles.hidden: ''}`} onClick={()=> chooseQuantityPopup(orderDetail)}>Mua Lại</button>
              
                <button className={`${orderDetail.status === 'Chờ thanh toán' ? '' :styles.hidden}`}  onClick={()=> payment(orderDetail)}>Thanh toán</button>
            </div>
            <div style={{paddingLeft:'20px',borderLeft:'2px solid #c5c5c5',marginLeft:'10px'}}>
              <h2>{statusMap[orderDetail.status]}</h2>
              <p>Giá sản phẩm : {Number(orderDetail.productPrice).toLocaleString('vi',{style:'currency',currency:'VND'})}</p>
              <p>Số lượng : {orderDetail.Quantity}</p>
              <p>Phí vận chuyển : {Number(orderDetail.feeShip).toLocaleString('vi',{style:'currency',currency:'VND'})}</p>
              <p>Tổng chi phí: {Number(orderDetail.totalAmount).toLocaleString('vi',{style: 'currency', currency:'VND'  })}</p>
              <div className={styles.listButton}>

              </div>
            </div>
        </div>
        <div className={styles.favorite}>
          <h2>Các sản phẩm của cửa hàng {shop ? shop.ShopName :''} </h2>
          <div style={{display:'flex',height:'30vh'}}>
          {productShop.length !== 0 ? productShop.map((item)=>(
            <div className={styles.favoriteItem} onClick={()=>navigate(`/product/${item.ProductID}`)}>
              <img alt='' src={item.ProductImg} />
              <div>
                <p>{item.ProductName}</p>
                <p>{item.Description}</p>
                <p>Giá: {item.Price}</p>
                <p>Khối lượng: {item.Weight}g</p>
                <p>Còn: {item.StockQuantity} sản phẩm</p>
              </div>
            </div>
          )): (<h3>Bạn chưa thích sản phẩm nào</h3>)}
          
          </div>
        </div>
        {reviewPopup !== null ?(
        <div className={styles.popup} onClick={(e)=>e.target === e.currentTarget? closeReviewPopup():''}>
          <div className={styles.innerPopup}>
            <h2>Đánh giá sản phẩm {orderDetail.productName}</h2>
            <label>Chọn danh mục:</label>
            <select name="category" value={formReview.category} onChange={handleChange}>
              <option value="">-- Chọn --</option>
              <option value="product">Sản phẩm</option>
              <option value="shipper">Người giao hàng</option>
              <option value="shop">Cửa hàng</option>
            </select>
            <label>Chọn số sao (1 đến 5):</label>
            <input
              type="number"
              name="rating"
              value={formReview.rating}
              onChange={handleChange}
              min="1"
              max="5"
            />
            <label>Nhập đánh giá:</label>
            <textarea
              name="reviewText"
              value={formReview.reviewText}
              onChange={handleChange}
              rows="5"
            ></textarea>
            <button className='' onClick={handleSubmit}>Gửi Đánh Giá</button>
          </div>
        </div>
      ):''}
      {messPopup !== null ? (
        <div className={styles.popup} onClick={(e)=>e.target === e.currentTarget? setMessPopup(null):''}>
          <div className={styles.innerPopup}>
            <h2 style={{marginTop:'50%',transform:'translateY(-50%)',textAlign:'center'}}>Đánh giá {messPopup}</h2>
          </div>
        </div>
      ):''}
      {chooseQuantity !== null ? (
        <div className={styles.popup} onClick={(e)=>e.target === e.currentTarget? setChooseQuantity(null):''}>
          <div className={styles.poupQuantity}>
          <label>Chọn số lượng:</label><br/><br/>
            <input
              type="number"
              name="quantity"
              value={chooseQuantity}
              onChange={changeQuantity}
            /><br/><br/>
            <button onClick={()=>buyAgain()}>Mua lại</button>
          </div>
        </div>
      ):''}
        <Footer></Footer>
    </div>
  )
}

export default OrderDetail
