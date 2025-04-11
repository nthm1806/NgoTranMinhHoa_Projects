import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Bills.module.css";
import { GlobalContext } from "../../globalContext/GlobalContext";
import { useAuth } from "../../globalContext/AuthContext";

function Bills() {
  const { setTypeBill, billsList = [] } = useContext(GlobalContext);
  const [selectedCategory, setSelectedCategory] = useState("Điện");
  const [sortBillList, setSortBillList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [searchType, setSearchType] = useState("month"); // Default search by month

  const { inforFullUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setSortBillList(billsList);
  }, [billsList]);

  useEffect(() => {
    setTypeBill(selectedCategory);
  }, []);

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    let sortedBills;

    if (sortValue === "Hóa đơn mới nhất") {
      sortedBills = [...billsList].sort(
        (a, b) => new Date(b.end_date) - new Date(a.end_date) // Sắp xếp theo ngày kết thúc
      );
    } else if (sortValue === "Giá tiền tăng dần") {
      sortedBills = [...billsList].sort(
        (a, b) => a.bill_amount - b.bill_amount
      );
    } else if (sortValue === "Giá tiền giảm dần") {
      sortedBills = [...billsList].sort(
        (a, b) => b.bill_amount - a.bill_amount
      );
    } else if (sortValue === "Hóa đơn chưa thanh toán") {
      sortedBills = billsList.filter(
        (bill) => bill.status === "Chưa thanh toán"
      );
    } else if (sortValue === "Hóa đơn đã thanh toán") {
      sortedBills = billsList.filter((bill) => bill.status === "Đã thanh toán");
    }

    setSortBillList(sortedBills);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const filteredBills = sortBillList.filter((bill) => {
    if (searchQuery === "") return true;

    const billDate = new Date(bill.end_date);
    if (searchType === "month") {
      return billDate.getMonth() + 1 === parseInt(searchQuery);
    } else if (searchType === "year") {
      return billDate.getFullYear() === parseInt(searchQuery);
    } else if (searchType === "both") {
      const [month, year] = searchQuery.split("/").map(Number);
      return (
        billDate.getMonth() + 1 === month && billDate.getFullYear() === year
      );
    }
    return false;
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setTypeBill(category);
  };

  async function handlePayBill(item, inforFullUser) {
    const response = await axios.post(
      "http://localhost:3001/api/PayBills/PayBillsQR",
      { item, inforFullUser }
    );
    window.location.href = response.data.payUrl;
  }

  return (
    <div className={styles.container}>
      <span style={{ position: "relative", display: "flex" }}>
        <h3>Thanh toán Hóa Đơn Ngay - Nhận Xu Liền Tay</h3>
        <h3 style={{ position: "absolute", right: "0vw" }}>
          Tổng xu của bạn là:{" "}
          <span style={{ color: "red" }}>{inforFullUser?.xu || 0}</span>
        </h3>
      </span>

      <div className={styles.tab_menu}>
        <div
          className={`${styles.tab_item} ${
            selectedCategory === "Điện" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("Điện")}
        >
          Hóa Đơn Điện
        </div>
        <div
          className={`${styles.tab_item} ${
            selectedCategory === "Nước" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("Nước")}
        >
          Hóa Đơn Nước
        </div>
        <div
          className={`${styles.tab_item} ${
            selectedCategory === "Mạng" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("Mạng")}
        >
          Hóa Đơn Mạng
        </div>
      </div>

      <div className={styles.sort_search_options}>
        <div className={styles.sort_options}>
          <span>Sắp xếp theo:</span>
          <select id="sort" name="sort" onChange={handleSortChange}>
            <option value="Hóa đơn mới nhất">Hóa đơn mới nhất</option>
            <option value="Giá tiền tăng dần">Giá tiền tăng dần</option>
            <option value="Giá tiền giảm dần">Giá tiền giảm dần</option>
            <option value="Hóa đơn chưa thanh toán">
              Hóa đơn chưa thanh toán
            </option>
            <option value="Hóa đơn đã thanh toán">Hóa đơn đã thanh toán</option>
          </select>
        </div>

        <div className={styles.search_options}>
          <span>Tìm kiếm theo:</span>
          <div className={styles.search_select}>
            <select onChange={handleSearchTypeChange}>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
              <option value="both">Năm và Tháng</option>
            </select>
            <input
              type="text"
              placeholder="Nhập theo lựa chọn: (ví dụ: 2 hoặc 2025 hoặc 2/2025)"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.bills_list}>
        {filteredBills.length > 0 ? (
          filteredBills.map((item, index) => (
            <div
              key={index}
              className={`${styles.bill_item} ${
                item.status === "Chưa thanh toán" ? styles.pending : styles.paid
              }`}
            >
              {item.bill_type === "Nước" && (
                <img
                  src="/Nuoc.png"
                  alt="nuoc"
                  className={styles.provider_img}
                />
              )}
              {item.bill_type === "Điện" && (
                <img
                  src="/Dien.png"
                  alt="Điện"
                  className={styles.provider_img}
                />
              )}
              {item.bill_type === "Mạng" && (
                <img
                  src="/Mang.png"
                  alt="Mạng"
                  className={styles.provider_img}
                />
              )}
              <div className={styles.bill_details}>
                <p className={styles.bill_name}>
                  Hóa Đơn {item.bill_type} {item.thang_nam}
                </p>
                <p className={styles.bill_amount}>
                  Tổng Tiền:
                  <span style={{ color: "red" }}>
                    {Number(item.bill_amount).toLocaleString("vi-VI", {
                      style: "decimal",
                      maximumFractionDigits: 0,
                    })}{" "}
                    VNĐ
                  </span>
                </p>
                <p className={styles.bill_due_date}>
                  Ngày Kết Thúc:
                  <span style={{ color: "red" }}>
                    {new Date(item.end_date).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </span>
                </p>
              </div>
              {item.status === "Chưa thanh toán" ? (
                <button
                  className={styles.pay_btn}
                  onClick={() => handlePayBill(item, inforFullUser)}
                >
                  Thanh toán
                </button>
              ) : (
                <button
                style={{border: "none"}}
                  disabled
                >
                  Đã Thanh Toán
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Không Có Hóa Đơn </p>
        )}
      </div>
    </div>
  );
}

export default Bills;
