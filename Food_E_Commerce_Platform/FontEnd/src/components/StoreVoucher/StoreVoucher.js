import React,{useState,useEffect} from 'react'
import styles from './StoreVoucher.module.css'
import axios from 'axios'
import { useCustomer } from "../../Context";

function StoreVoucher() {
  const { customer } = useCustomer();
    const [chooseType,setChooseType] = useState('Tất cả');
    const [allVouchers,setAllVouchers] = useState([]);
    const [chooseVouchers,setChooseVouchers] = useState([]);
    const [searchText,setSearchText] = useState('');
    useEffect(()=>{
        fetchVoucher();
    },[])
    const fetchVoucher = async()=>{
        const cusID = customer.CustomerID
        const response = await axios.post('http://localhost:3001/api/Voucher/fetchVoucherByCusID',{cusID});
        await setAllVouchers(response.data);
        await setChooseVouchers(response.data);
    }
    const changeType = async(type)=>{
        await setChooseType(type);
        if(type === 'Sàn'){
            await setChooseVouchers(allVouchers.filter(item => item.ShopID === null))
        }else if(type === 'Cửa hàng'){
            await setChooseVouchers(allVouchers.filter(item=>item.ShopID !== null))
        }else if(type === 'Tất cả'){
            await setChooseVouchers(allVouchers)
        }else if(type === 'Sản phẩm'){
            await setChooseVouchers(allVouchers.filter(item=>item.type === 'Sản phẩm'));
        }else{
            await setChooseVouchers(allVouchers.filter(item=>item.type !== 'Sản phẩm'));
        }
    }
    const searchVoucher = async()=>{
        const vouchers = allVouchers.filter(v => v.VoucherName.toLowerCase().includes(searchText.toLowerCase()));
        await setChooseVouchers(vouchers)
    }   
  return (
    <div className={styles.storeVoucher}>
      <h1>Kho mã giảm giá</h1>
      <div className={styles.searchVoucherDiv}>
        <h2>Mã giảm giá</h2>
        <div>
        <input type='text' value={searchText} onChange={(e)=>setSearchText(e.target.value)}></input>
        <button onClick={()=>searchVoucher()}>Tìm kiếm</button>
        </div>
      </div>
      <div className={styles.typeVoucherList}>
        <span onClick={()=>changeType('Tất cả')} className={chooseType === 'Tất cả' ? styles.chooseType:''}>Tất cả</span>
        <span onClick={()=>changeType('Sàn')} className={chooseType === 'Sàn' ? styles.chooseType:''}>Sàn</span>
        <span onClick={()=>changeType('Cửa hàng')} className={chooseType === 'Cửa hàng' ? styles.chooseType:''}>Cửa hàng</span>
        <span onClick={()=>changeType('Sản phẩm')} className={chooseType === 'Sản phẩm' ? styles.chooseType:''}>Sản phẩm</span>
        <span onClick={()=>changeType('Giao hàng')} className={chooseType === 'Giao hàng' ? styles.chooseType:''}>Giao hàng</span>
      </div>
      <div className={styles.ListVoucher}>
        {chooseVouchers.length !== 0 && chooseVouchers.map((item, index)=>(
            <div className={styles.voucherDetail}>
                <img alt='' src={item.VoucherImg} />
                <div>
                    <p>{item.VoucherName}</p>
                    <p>Hạn dùng đến ngày: {new Date(item.EndDate).toLocaleDateString("en-GB", { timeZone: "Asia/Bangkok" })}</p>
                </div>
            </div>
        ))}
        {chooseVouchers.length === 0 && (<div> Không có mã giảm giá</div>)}
      </div>
    </div>
  )
}

export default StoreVoucher
