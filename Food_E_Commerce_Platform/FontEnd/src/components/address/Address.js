import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Address.module.css";

function Address({ setInfor, infor }) {
  const [address, setAddress] = useState([]);
  const [selectAddress, setSelectAddress] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const inforFullUser = localStorage.getItem("user");
  const [otherAddress, setOtherAddress] = useState(false);
  const [area, setArea] = useState("");
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [alert, setAlert] = useState(false);
  const [houseAddress, setHouseAddress] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const customerID = JSON.parse(inforFullUser).id;
  useEffect(() => {
    fetchAddress();
  }, []);
  async function fetchAddress() {
    const response = await axios.get(
      `http://localhost:3001/address/${customerID}`
    );
    await setAddress(response.data);
    if (!infor) {
      await setSelectAddress(
        response.data.find((item) => item.isDefault === 1)
      );
      const hehe = response.data.find((item) => item.isDefault == 1);
      console.log(response.data);
      await setInfor({
        addressID: hehe.AddressID,
        houseAddress: hehe.HouseAddress,
        area: hehe.Area,
      });
    } else {
      await setSelectAddress(infor);
      await setArea(infor.area);
      await setHouseAddress(infor.houseAddress);
    }
  }
  async function changeSelectAddress(value) {
    await setSelectAddress(address.find((item) => item.AddressID == value));
    await setArea("");
    await setHouseAddress("");
  }
  useEffect(() => {
    check();
  }, [selectAddress]);
  async function check() {
    if (selectAddress && selectAddress.isDefault === 1)
      await setIsChecked(true);
    else await setIsChecked(false);
  }
  async function setDefaultAddress() {
    const addressDefault = address.find((item) => item.isDefault == 1);
    const AddressID = [selectAddress.AddressID, addressDefault.AddressID];
    const response = await axios.post(
      "http://localhost:3001/address/setDefault",
      { AddressID, customerID }
    );
    setAddress(response.data);
    setShowPopup(false);
    setIsChecked((prev) => !prev);
    setConfirmPopup(false);
  }
  async function addAddress1() {
    if (!houseAddress || !area) {
      setAlert(true);
      return;
    }
    setConfirmAddress(true);
  }
  async function addAddress() {
    await axios.post("http://localhost:3001/address/", {
      customerID,
      houseAddress,
      area,
    });
    const response = await axios.get(
      `http://localhost:3001/address/${customerID}`
    );
    setAddress(response.data);
    setConfirmAddress(false);
  }
  async function chooseAddress() {
    if (otherAddress) {
      if (!houseAddress || !area) {
        setAlert(true);
        return;
      }
      await setInfor({
        addressID: null,
        houseAddress: houseAddress,
        area: area,
      });
    } else {
      await setInfor({
        addressID: selectAddress.AddressID,
        houseAddress: selectAddress.HouseAddress,
        area: selectAddress.Area,
      });
      await setArea("");
      await setHouseAddress("");
    }
    await setShowPopup(false);
  }
  async function closePopup() {
    await setShowPopup(false);
    await setArea("");
    await setHouseAddress("");
  }
  return (
    <>
      <img alt="" src="./addressIcon.png" />
      Tên - Số điện thoại - Địa chỉ:
      <span>
        {inforFullUser.FirstName} {inforFullUser.LastName}
      </span>
      <span>{inforFullUser.PhoneNumber}</span>
      {selectAddress ? (
        <span>
          {area == "" && houseAddress == ""
            ? `${selectAddress.HouseAddress} ${selectAddress.Area}`
            : `${houseAddress} ${area}`}
        </span>
      ) : (
        ""
      )}
      <button
        className={styles.changebutton}
        onClick={() => setShowPopup(true)}
      >
        Thay đổi địa chỉ
      </button>
      {showPopup ? (
        <div
          className={styles.popup}
          onClick={(e) => (e.target === e.currentTarget ? closePopup() : "")}
        >
          <div className={styles.innerPopup}>
            <h2>Thay đổi địa chỉ</h2>
            {otherAddress ? (
              <>
                <p>Chọn địa chỉ:</p>
                <select
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                >
                  <option value="">---Chọn---</option>
                  <option value="Khu A">Khu A</option>
                  <option value="Khu B">Khu B</option>
                  <option value="Khu C">Khu C</option>
                  <option value="Khu D">Khu D</option>
                </select>
                <br />
                <p>Địa chỉ cụ thể : </p>
                <input
                  type="text"
                  onChange={(event) => setHouseAddress(event.target.value)}
                  placeholder="Nhập địa chỉ cụ thể của bạn "
                />
                <br />
                <br />
                <button onClick={() => addAddress1()}>Thêm địa chỉ này</button>
                <button onClick={() => setOtherAddress(false)}>
                  Chọn địa chỉ sẵn có
                </button>
                <button onClick={() => chooseAddress()}>
                  Chọn địa chỉ này
                </button>
              </>
            ) : (
              <>
                <p>Chọn địa chỉ:</p>
                <select
                  defaultValue={selectAddress.AddressID}
                  onChange={(event) => changeSelectAddress(event.target.value)}
                >
                  {address.length !== 0 &&
                    address.map((item) => (
                      <option value={item.AddressID}>
                        <span>
                          {item.HouseAddress} {item.Area}
                        </span>
                      </option>
                    ))}
                </select>
                <br />
                <br />
                <input
                  type="radio"
                  checked={isChecked}
                  onChange={() => setConfirmPopup(true)}
                />
                Đặt làm địa chỉ mặc định
                <br />
                <br />
                <button onClick={() => setOtherAddress(true)}>
                  Thêm địa chỉ khác
                </button>
                <button onClick={() => chooseAddress()}>
                  Chọn địa chỉ này
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {confirmPopup ? (
        <div
          className={styles.popup}
          onClick={(e) =>
            e.target === e.currentTarget ? setConfirmPopup(false) : ""
          }
        >
          <div className={styles.innerPopup}>
            <h2>Thông báo</h2>
            <p>Bạn muốn đặt địa chỉ này làm địa chỉ mặc định ?</p>
            <button onClick={() => setDefaultAddress()}>Đồng ý</button>
            <button onClick={() => setConfirmPopup(false)}>Hủy</button>
          </div>
        </div>
      ) : (
        ""
      )}
      {alert ? (
        <div
          className={styles.popup}
          onClick={(e) => (e.target === e.currentTarget ? setAlert(false) : "")}
        >
          <div className={styles.innerPopup}>
            <p>Hãy nhập đủ thông tin</p>
          </div>
        </div>
      ) : (
        ""
      )}
      {confirmAddress ? (
        <div
          className={styles.popup}
          onClick={(e) =>
            e.target === e.currentTarget ? setConfirmAddress(false) : ""
          }
        >
          <div className={styles.innerPopup}>
            <h2>Thông báo</h2>
            <p>
              Bạn muốn thêm địa chỉ {houseAddress} {area} ?{" "}
            </p>
            <button onClick={() => addAddress()}>Đồng ý</button>
            <button onClick={() => setConfirmAddress(false)}>Hủy</button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Address;
