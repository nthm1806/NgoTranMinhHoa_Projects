import React, { useState, useEffect } from "react";
import styles from "./GiftShop.module.css";
import axios from "axios";
import { useAuth } from "../../../src/globalContext/AuthContext";

function GiftShop() {
  const { customerID } = useAuth();
  const [chooseType, setChooseType] = useState("Tất cả");
  const [allVouchers, setAllVouchers] = useState([]);
  const [chooseVouchers, setChooseVouchers] = useState([]);
  const [savedVouchers, setSavedVouchers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [customerCoin, setCustomerCoin] = useState(0); 
  const [FirstName, setFirstName] = useState(""); 
  const [Lastname, setLastName] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "", action: null, voucherID: null });

  //  Lấy danh sách voucher đã lưu
  const fetchSavedVouchers = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/VoucherDetail/ListSavedVouchers`, {
        params: { customerID }
      });

      setSavedVouchers(response.data.map((v) => v.VoucherID));
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách voucher đã lưu:", error);
    }
  };

  // Lấy số xu của khách hàng
  const fetchCustomerCoin = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customers/${customerID}`);
      setCustomerCoin(response.data.xu);
      setFirstName(response.data.FirstName);
      setLastName(response.data.LastName);
    } catch (error) {
      console.error("❌ Lỗi khi lấy số xu:", error);
    }
  };

  //  Lấy danh sách tất cả voucher
  const fetchVoucher = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/Voucher/fetchAllVouchers");
      setAllVouchers(response.data);
      setChooseVouchers(response.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách voucher:", error);
    }
  };

  //  Gọi API khi `customerID` thay đổi
  useEffect(() => {
    if (customerID) {
      fetchSavedVouchers();
      fetchCustomerCoin();
    }
  }, [customerID]);

  //  Gọi API để lấy danh sách voucher khi trang load
  useEffect(() => {
    fetchVoucher();
  }, []);

    const openPopup = (message, action, voucherID) => {
      setPopup({ show: true, message, action, voucherID });
    };
  
    const closePopup = () => {
      setPopup({ show: false, message: "", action: null, voucherID: null });
    };

  //  Hàm tìm kiếm voucher theo từ khóa
  const searchVoucher = () => {
    const filteredVouchers = allVouchers.filter((v) =>
      v.VoucherName.toLowerCase().includes(searchText.toLowerCase())
    );
    setChooseVouchers(filteredVouchers);
  };

  const changeType = (type) => {
    setChooseType(type);
    if (type === "Sàn") {
      setChooseVouchers(allVouchers.filter((item) => item.ShopID === null));
    } else if (type === "Cửa hàng") {
      setChooseVouchers(allVouchers.filter((item) => item.ShopID !== null));
    } else if (type === "Sản phẩm") {
      setChooseVouchers(allVouchers.filter((item) => item.type === "Sản phẩm"));
    } else if (type === "Giao hàng") {
      setChooseVouchers(allVouchers.filter((item) => item.type === "Giao hàng"));
    } else {
      setChooseVouchers(allVouchers);
    }
  };

  //  Hàm lưu voucher
  const saveVoucher = async (voucherID) => {
    if (!customerID) {
      openPopup("Bạn cần đăng nhập để lưu voucher!", null, null);
      return;
    }
    if (customerCoin < 30) {
      openPopup("❌ Bạn không đủ xu để lưu voucher!", null, null);
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/VoucherDetail/SaveVoucherID", {
        saveVoucherID: voucherID,
        customerID,
      });

      await axios.put(`http://localhost:3001/customers/${customerID}`, {
        xu: customerCoin - 30, // 🔹 Trừ 30 xu
      });

      setCustomerCoin((prev) => prev - 30); // 🔹 Cập nhật UI ngay lập tức
      setSavedVouchers((prev) => [...prev, voucherID]); // ✅ Dùng prev để tránh lỗi state
      openPopup("✅ Lưu voucher thành công!", null, null);
    } catch (error) {
      console.error("❌ Lỗi khi lưu voucher:", error);
      openPopup("❌ Lưu voucher thất bại!", null, null);
    }
  };

  //  Hàm hủy lưu voucher
  const unsaveVoucher = async (voucherID) => {
    if (!customerID) {
      openPopup("Bạn cần đăng nhập để thực hiện thao tác này!", null, null);
      return;
    }

    try {
      await axios.delete("http://localhost:3001/api/VoucherDetail/DeleteVoucherID", {
        params: { deleteVoucherID: voucherID, customerID },
      });

      setSavedVouchers((prev) => prev.filter((id) => id !== voucherID)); // ✅ Cập nhật state đúng cách
      openPopup("✅ Hủy lưu voucher thành công!", null, null);
    } catch (error) {
      console.error("❌ Lỗi khi hủy lưu voucher:", error);
      openPopup("❌ Hủy lưu voucher thất bại!", null, null);
    }
  };


  
return (
  <div className={styles.giftShop}>
    <h1>🎁 Danh sách mã giảm giá</h1>

    {/* Hiển thị số xu của khách hàng */}
    <div className={styles.customerCoin}>
      <p> Họ và Tên: <strong>{FirstName} {Lastname} </strong></p>
      <p>💰 Số xu của bạn: <strong>{customerCoin}</strong></p>
    </div>

    {/* Ô tìm kiếm */}
    <div className={styles.searchVoucherDiv}>
      <h2>Tìm kiếm mã giảm giá</h2>
      <div>
        <input
          type="text"
          placeholder="Nhập tên voucher..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={searchVoucher}>🔍 Tìm kiếm</button>
      </div>
    </div>

    {/* Bộ lọc loại voucher */}
    <div className={styles.typeVoucherList}>
      {["Tất cả", "Sàn", "Cửa hàng", "Sản phẩm", "Giao hàng"].map((type) => (
        <span
          key={type}
          onClick={() => changeType(type)}
          className={chooseType === type ? styles.chooseType : ""}
        >
          {type}
        </span>
      ))}
    </div>

    {/* Danh sách voucher */}
    <div className={styles.ListVoucher}>
      {chooseVouchers.length > 0 ? (
        chooseVouchers.map((item, index) => (
          <div className={styles.voucherDetail} key={index}>
            <img src={item.VoucherImg} alt={item.VoucherName} />
            <div className={styles.voucherInfo}>
              <p>{item.VoucherName}</p>
              <p>Hạn dùng: {new Date(item.EndDate).toLocaleDateString("en-GB")}</p>

              <div className={styles.buttonContainer}>
                {savedVouchers.includes(item.VoucherID) ? (
                  <button
                    className={styles.unsaveButton}
                    onClick={() => openPopup("Hủy voucher sẽ không hoàn lại xu! Bạn có chắc muốn hủy voucher này?", unsaveVoucher, item.VoucherID)}
                  >
                    Hủy lưu
                  </button>
                ) : (
                  <button
                    className={styles.saveButton}
                    onClick={() => openPopup("Bạn có chắc muốn lưu voucher này (-30 xu)?", saveVoucher, item.VoucherID)}
                  >
                    Lưu Voucher (-30 xu)
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>❌ Không có mã giảm giá</div>
      )}
    </div>

    {/* Popup xác nhận & thông báo */}
    {popup.show && (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <p>{popup.message}</p>
          {popup.action ? (
            <div className={styles.popupActions}>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  popup.action(popup.voucherID);
                  closePopup();
                }}
              >
                Đồng ý
              </button>
              <button className={styles.cancelButton} onClick={closePopup}>Hủy</button>
            </div>
          ) : (
            <button className={styles.okButton} onClick={closePopup}>OK</button>
          )}
        </div>
      </div>
    )}
  </div>
);
}

export default GiftShop;
