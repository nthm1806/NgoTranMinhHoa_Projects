import styles from "./Notification.module.css";
import { GlobalContext } from "../../globalContext/GlobalContext";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../globalContext/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Notification() {
  const { user, customerID } = useAuth();
  const [activeIndex, setActiveIndex] = useState(() => {
    // Lấy giá trị từ localStorage và chuyển nó thành số (nếu không có thì mặc định là 0)
    return Number(localStorage.getItem("activeIndex")) || 0;
  });
  const navigate = useNavigate();
  const {
    typeNotification,
    setTypeNotification,
    setStatusNotification,
    statusNotification,
    order_ID,
    setOrder_ID,
    voucher_ID,
    setVoucher_ID, 
    notificationsList = [],
    setNotificationsList, 
    setImg
  } = useContext(GlobalContext);
  const items = ["Thông Báo", "Đơn Mua", "Kho Voucher"];
  const itemNoti = ["Tất Cả Thông Báo", "Cập Nhật Đơn Hàng", "Khuyến Mãi"];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null)


  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = (item) => {
    setModalOpen(false);
    window.location.reload();

  };

  console.log(notificationsList);

  const TransactionDetailsModal = ({ item, closeModal }) => {
    // Định dạng thời gian Hồ Chí Minh
    const formatDate = (date) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        ...options,
      });
    };

    // Định dạng tiền VND
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    };
    return (
      <div className={styles.modal_overlay}>
        <div className={styles.modal_content}>
          <button
            className={styles.close_button}
            onClick={handleCloseModal}
          >
            X
          </button>
          <div className={styles.modal_header}>
            <h2>Chi Tiết Thông Báo</h2>
          </div>
          <div className={styles.modal_body}>
            <img
              src={item.ProductImg || item.VoucherImg}
              alt="provider"
              className={styles.provider_img_modal}
            />
            <div className={styles.transaction_details_modal}>
              <p>
                {item.ProductImg && (
                  <>
                    <strong>Thông báo:</strong> Đơn Hàng
                  </>
                )}
                {item.VoucherImg && (
                  <>
                    <strong>Thông báo:</strong> Voucher
                  </>
                )}
              </p>
              <p>
                {item.ProductImg && (
                  <>
                    <strong>Mã đơn hàng:</strong> {item.OrderID}
                  </>
                )}
                {item.VoucherImg && (
                  <>
                    <strong>Mã giảm giá:</strong> {item.VoucherID}
                  </>
                )}
              </p>
              <p>
                {item.ProductImg && (
                  <>
                    <strong>Tên sản phẩm:</strong> {item.ProductName}
                  </>
                )}
                {item.VoucherImg && (
                  <>
                    <strong>Tên Voucher:</strong> {item.VoucherName}
                  </>
                )}
              </p>
              <p>
                {item.ProductImg && (
                  <>
                    <strong>Loại sản phẩm:</strong> {item.Category}
                  </>
                )}
                {item.VoucherImg && (
                  <>
                    <strong>Ngày kết thúc:</strong> {formatDate(item.EndDate)}
                  </>
                )}
              </p>
              <p>
                {item.ProductImg && (
                  <>
                    <strong>Trạng Thái:</strong> {item.Status}
                  </>
                )}
              </p>
              <p>
                {item.ProductImg && (
                  <>
                    <strong>Địa chỉ:</strong>{" "}
                    {item.address === "" ? "Đại học FPT" : item.address}
                  </>
                )}
              </p>
              <p>
                {item.ProductImg && (
                  <>
                    <strong>Tổng tiền:</strong>{" "}
                    {formatCurrency(item.TotalAmount)}
                  </>
                )}
                {item.VoucherImg && (
                  <>
                    <strong>Được giảm:</strong> {formatCurrency(item.Discount)}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Hiển thị thông báo Voucher
  const renderVoucherNotification = (item) => (
    <div
      onClick={() => {
        setOrder_ID(null);
        setStatusNotification("read");
        setImg(item.VoucherImg);
        setVoucher_ID(item.VoucherID);
        handleOpenModal(item);
      }}
      className={`${styles.focus} ${
        !item.status_voucherDetail || item.status_voucherDetail === "unread"
          ? styles.unread
          : ""
      }`}
    >
      <img className={styles.img_noti} src={item.VoucherImg} alt="Khuyến Mãi" />
      <div
        style={{ display: "flex", flexDirection: "column", marginLeft: "3vw" }}
      >
        <div className={styles.show_noti_item}>{item.VoucherTitle}</div>
        <div className={styles.show_noti_item}>{item.VoucherName}</div>
        <div className={styles.show_noti_item}>
          End:{" "}
          {new Date(item.EndDate).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          })}
        </div>
      </div>
      <button className={styles.button_detail}>Xem Chi Tiết</button>
    </div>
  );

  const markAllAsRead = async () => {
    // Thêm từ khóa 'async'
    try {
      // Gọi API để đánh dấu tất cả thông báo là đã đọc
      const response = await axios.post(
        "http://localhost:3001/api/notifications/readAll",
        {
          notificationsList,
          typeNotification,
          customerID,
        }
      );

      // Xử lý kết quả trả về từ API
      if (response.data.success) {
        // Nếu thành công, cập nhật trạng thái "read" cho tất cả thông báo
        const updatedNotifications = notificationsList.map((item) => {
          if (item.OrderID) {
            item.statusRead = "read";
          }
          if (item.VoucherID) {
            item.status_voucherDetail = "read";
          }
          return item;
        });

        // Cập nhật lại danh sách thông báo trong state
        setNotificationsList(updatedNotifications);

        // Thông báo thành công
        console.log("Tất cả thông báo đã được đánh dấu là đã đọc.");
      } else {
        // Nếu không thành công
        console.error("Cập nhật không thành công");
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi gọi API:", error);
    }
  };

  // Hiển thị thông báo Order
  const renderOrderNotification = (item) =>
    item.ProductImg && (
      <div
        onClick={() => {
          setOrder_ID(item.OrderID);
          setStatusNotification("read");
          setImg(item.ProductImg);
          setVoucher_ID(null);
          handleOpenModal(item);
        }}
        className={`${styles.focus} ${
          !item.statusRead || item.statusRead === "unread"
            ? styles.unread
            : ""
        }`}
      >
        <img className={styles.img_noti} src={item.ProductImg} alt="Đơn Hàng" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "3vw",
          }}
        >
          <div className={styles.show_noti_item}>{item.Status}</div>
          <div className={styles.show_noti_item}>
            Đơn Hàng
            <span style={{ marginLeft: "0.5vw" }} className={styles.highlight}>
              {item.OrderID}
            </span>
            {"  "} Đã {"  "}{" "}
            <span className={styles.highlight}>{item.Status}</span>
          </div>
          <div className={styles.show_noti_item}>
            {new Date(item.CreateAt).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            })}
          </div>
        </div>
        <button className={styles.button_detail}>Xem Chi Tiết</button>
      </div>
    );

  // Hàm xử lý hiển thị các thông báo theo `typeNotification`
  const renderNotifications = (notifications) => {
    
    return notifications.map((item, index) => {
      return (
        <div key={index}>
          {item.VoucherImg
            ? renderVoucherNotification(item)
            : renderOrderNotification(item)}
        </div>
      );
    });
  };


  const handleClick = (item) => {
    if (item === "Đơn Mua") {
      navigate("/OrderandVoucher");
    } else if (item === "Kho Voucher") {
      navigate("/OrderandVoucher");
    }
  };

  useEffect(() => {
    // Lưu activeIndex vào localStorage khi nó thay đổi
    localStorage.setItem('activeIndex', activeIndex);
    console.log("ki: ",activeIndex)
  }, [activeIndex]);

  useEffect(() => {
    const savedActiveIndex = localStorage.getItem('activeIndex');
    console.log("ac: ",Number(savedActiveIndex))
    if (savedActiveIndex !== null) {
      setActiveIndex(Number(savedActiveIndex));
      console.log("ac: ",Number(savedActiveIndex))
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.sideBar}>
        <div
          style={{
            display: "flex",
            paddingBottom: "1.5vh",
            borderBottom: "1px solid blue",
            marginBottom: "2vh",
          }}
        >
          {user ? (
            <>
              <img src={user.avatar} alt="Avatar" className={styles.avatar} />
              <div style={{ flexDirection: "column" }}>
                <div className={styles.profile}>{user.name}</div>
                <span
                  onClick={() => navigate("/customers/customer-info")}
                  className={styles.edit_profile}
                >
                  Sửa Hồ Sơ
                </span>
              </div>
            </>
          ) : (
            <p>Ko có dữ liệu</p>
          )}
        </div>
        <div className={styles.block_items}>
          {items.map((item, itemIndex) => (
            <div key={itemIndex}>
              <div onClick={() => handleClick(item)} className={styles.items}>
                {item}
              </div>
              {item === "Thông Báo" && (
                <ul className={styles.block_itemNoti}>
                  {itemNoti.map((noti, index) => (
                    <li
                      key={index}
                      className={`${styles.itemNoti} ${
                        activeIndex === index ? styles.active : ""
                      }`}
                      onClick={() => {
                        setActiveIndex(index);
                        setTypeNotification(noti);
                      }}
                    >
                      {noti}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.block_show_noti}>
        <div className={styles.check_status_noti}>
          <button
            onClick={() => markAllAsRead()}
            style={{
              padding: "0.2vh 0.2vw",
              fontSize: "1vw",
              fontWeight: "700",
            }}
          >
            Đánh Dấu Đã Đọc Tất Cả
          </button>
        </div>
        {typeNotification === "Tất Cả Thông Báo" &&
          renderNotifications(notificationsList)}
        {typeNotification === "Cập Nhật Đơn Hàng" &&
          renderNotifications(notificationsList)}
        {typeNotification === "Khuyến Mãi" &&
          renderNotifications(notificationsList)}
        {modalOpen && (
          <TransactionDetailsModal
            item={selectedItem}
            closeModal={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default Notification;
