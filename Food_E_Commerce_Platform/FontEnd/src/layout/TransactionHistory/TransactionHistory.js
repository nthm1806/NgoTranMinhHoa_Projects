import React, { useState, useContext, useEffect, axios } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TransactionHistory.module.css";
import { GlobalContext } from "../../globalContext/GlobalContext";
import { useAuth } from "../../globalContext/AuthContext";

const TransactionDetailsModal = ({ item, closeModal }) => {
  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <button className={styles.close_button} onClick={closeModal}>
          X
        </button>
        <div className={styles.modal_header}>
          <h2>Chi Tiết Giao Dịch</h2>
        </div>
        <div className={styles.modal_body}>
          <img
            src={item.img || "/default-logo.png"}
            alt="provider"
            className={styles.provider_img_modal}
          />
          <div className={styles.transaction_details_modal}>
            <p>
              <strong>Loại Giao Dịch:</strong> {item.bill_type || "Đơn Hàng"}
            </p>
            <p>
              <strong>Số tiền ban đầu:</strong>{" "}
              {Number(item.payment_amount || item.payment_amountOrder).toLocaleString()}{" "}
              VNĐ
            </p>
            <p>
              <strong>Ngày Giao Dịch:</strong>{" "}
              {new Date(item.payment_date || item.end_date).toLocaleString(
                "vi-VN",
                { timeZone: "Asia/Ho_Chi_Minh" }
              )}
            </p>
            <p>
              <strong>Phương Thức Thanh Toán:</strong> {item.payment_method}
            </p>
            <p>
              <strong>Trạng Thái:</strong> {item.status}
            </p>
            <p>
              {item.VoucherID && (
                <>
                  <strong>Mã Giảm Giá:</strong> {item.VoucherID}
                </>
              )}
            </p>
            <p>
              <strong>Tổng Tiền Thanh Toán:</strong>{" "}
              {(
                (Number(item.payment_amount || item.payment_amountOrder) || 0) -
                (Number(item.discount) || 0)
              ).toLocaleString()}{" "}
              VNĐ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function TransactionHistory() {
  const { transactionHistoryList = [], setTypeTransactionHistory } =
    useContext(GlobalContext);
  const [selectedCategory, setSelectedCategory] = useState("Order");
  const [sortBillList, setSortBillList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchType, setSearchType] = useState("month");
  const [sortType, setSortType] = useState("Ngày thanh toán mới nhất");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  console.log(transactionHistoryList);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setSortBillList([...transactionHistoryList]);
  }, [transactionHistoryList]);

  useEffect(() => {
    setTypeTransactionHistory(selectedCategory);
  }, [selectedCategory]);

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortType(sortValue);

    let sortedBills;

    if (sortValue === "Ngày thanh toán mới nhất") {
      sortedBills = [...transactionHistoryList].sort(
        (a, b) =>
          new Date(b.payment_date || b.end_date) -
          new Date(a.payment_date || a.end_date)
      );
    }  else if (sortValue === "Số tiền tăng dần") {
      // Sắp xếp theo số tiền tăng dần
      sortedBills = [...transactionHistoryList].sort((a, b) => {
        // Sử dụng payment_amount hoặc TotalAmount tùy theo trường hợp
        const amountA = Number(a.payment_amount || a.payment_amountOrder) || 0;
        const amountB = Number(b.payment_amount || b.payment_amountOrder) || 0;
        return amountA - amountB; // Tăng dần
      });
    } else if (sortValue === "Số tiền giảm dần") {
      // Sắp xếp theo số tiền giảm dần
      sortedBills = [...transactionHistoryList].sort((a, b) => {
        const amountA = Number(a.payment_amount || a.payment_amountOrder) || 0;
        const amountB = Number(b.payment_amount || b.payment_amountOrder) || 0;
        return amountB - amountA; // Giảm dần
      });
    }

    setSortBillList(sortedBills);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const filteredBills = sortBillList.filter((item) => {
    if (searchQuery === "") return true;

    const itemDate = new Date(item.payment_date || item.end_date);
    if (searchType === "month") {
      return itemDate.getMonth() + 1 === parseInt(searchQuery);
    } else if (searchType === "year") {
      return itemDate.getFullYear() === parseInt(searchQuery);
    } else if (searchType === "both") {
      const [month, year] = searchQuery.split("/").map(Number);
      return (
        itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year
      );
    }
    return false;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBills.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setTypeTransactionHistory(category);
  };

  const handlePageChange = (direction) => {
    if (direction === "next") {
      // If the current page is the last page, go to the first page
      if (currentPage * itemsPerPage >= filteredBills.length) {
        setCurrentPage(1); // Reset to first page
      } else {
        setCurrentPage(currentPage + 1);
      }
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h3>Chọn loại giao dịch</h3>
        <div
          className={`${styles.tab_item} ${
            selectedCategory === "Order" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("Order")}
        >
          Lịch sử đơn hàng
        </div>

        <div
          className={`${styles.tab_item} ${
            selectedCategory === "Điện" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("Điện")}
        >
          Lịch sử giao dịch Điện
        </div>
        <div
          className={`${styles.tab_item} ${
            selectedCategory === "Nước" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("Nước")}
        >
          Lịch sử giao dịch Nước
        </div>
        <div
          className={`${styles.tab_item} ${
            selectedCategory === "Mạng" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("Mạng")}
        >
          Lịch sử giao dịch Mạng
        </div>

        <div className={styles.sort_options}>
          <span style={{ marginLeft: "0vw", marginBottom: "3vh" }}>
            Sắp xếp theo:
          </span>
          <div>
            <span
              style={{
                marginLeft: "0.8vw",
                marginBottom: "2vh",
                fontWeight: "400",
              }}
            >
              <input
                type="radio"
                id="sortNew"
                name="sort"
                value="Ngày thanh toán mới nhất"
                checked={sortType === "Ngày thanh toán mới nhất"}
                onChange={handleSortChange}
              />
              <label htmlFor="sortNew">Ngày thanh toán mới nhất</label>
            </span>
            <span
              style={{
                marginLeft: "0.8vw",
                marginBottom: "2vh",
                fontWeight: "400",
              }}
            >
              <input
                type="radio"
                id="sortPriceAsc"
                name="sort"
                value="Số tiền tăng dần"
                checked={sortType === "Số tiền tăng dần"}
                onChange={handleSortChange}
              />
              <label htmlFor="sortPriceAsc">Số tiền tăng dần</label>
            </span>
            <span
              style={{
                marginLeft: "0.8vw",
                marginBottom: "2vh",
                fontWeight: "400",
              }}
            >
              <input
                type="radio"
                id="sortPriceDesc"
                name="sort"
                value="Số tiền giảm dần"
                checked={sortType === "Số tiền giảm dần"}
                onChange={handleSortChange}
              />
              Số tiền giảm dần
            </span>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <h3>Lịch sử giao dịch</h3>
        <div className={styles.search_options}>
          <span>Tìm kiếm theo:</span>
          <div className={styles.search_select}>
            <span>
              <input
                type="radio"
                id="searchMonth"
                name="searchType"
                value="month"
                checked={searchType === "month"}
                onChange={handleSearchTypeChange}
              />
              <label htmlFor="searchMonth">Tháng</label>
            </span>
            <span>
              <input
                type="radio"
                id="searchYear"
                name="searchType"
                value="year"
                checked={searchType === "year"}
                onChange={handleSearchTypeChange}
              />
              <label htmlFor="searchYear">Năm</label>
            </span>
            <span>
              <input
                type="radio"
                id="searchBoth"
                name="searchType"
                value="both"
                checked={searchType === "both"}
                onChange={handleSearchTypeChange}
              />
              <label htmlFor="searchBoth">Năm và Tháng</label>
            </span>
            <input
              style={{ width: "30vw" }}
              type="text"
              placeholder="Nhập theo lựa chọn: (ví dụ: 2 hoặc 2025 hoặc 2/2025)"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className={styles.transaction_list}>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.transaction_item} ${styles.pending}`}
              >
                <img
                  src={item.img || "/default-logo.png"}
                  alt="provider"
                  className={styles.provider_img}
                />
                <div className={styles.transaction_details}>
                  <p className={styles.transaction_name}>
                    Giao Dịch {item.bill_type || "Đơn Hàng"}
                  </p>
                  <p className={styles.transaction_amount}>
                    Tổng Tiền:{" "}
                    <span style={{ color: "#1e62f6" }}>
                      {(
                        (Number(item.payment_amount || item.payment_amountOrder) || 0) -
                        (Number(item.discount) || 0)
                      ).toLocaleString()}{" "}
                      VNĐ
                    </span>
                  </p>
                  <p className={styles.transaction_date}>
                    Ngày:{" "}
                    <span style={{ color: "#1e62f6" }}>
                      {new Date(
                        item.payment_date || item.end_date
                      ).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </span>
                  </p>
                </div>
                <button
                  className={styles.pay_btn}
                  onClick={() => handleOpenModal(item)}
                >
                  Xem Chi Tiết
                </button>
              </div>
            ))
          ) : (
            <p>Không có giao dịch nào</p>
          )}

          {modalOpen && (
            <TransactionDetailsModal
              item={selectedItem}
              closeModal={handleCloseModal}
            />
          )}
        </div>

        {/* Pagination buttons */}
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            <button style={{ background: "#1e62f6" }}>{currentPage}</button>{" "}
            <span
              style={{ fontWeight: "500", margin: "0vw", fontSize: "1.5vw" }}
            >
              {"/"}{" "}
            </span>
            <button>{totalPages}</button>{" "}
          </span>
          <button onClick={() => handlePageChange("next")}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
