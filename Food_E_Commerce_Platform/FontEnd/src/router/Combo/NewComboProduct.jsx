import TextArea from 'antd/es/input/TextArea';
import { LayoutCommon } from '../../layout/layout-common/LayoutCommon';
import styles from './styles.module.css';
import { Button, Input, InputNumber, message, Select, Space, Typography } from 'antd';
import SlideDoAn from './SlideDoAn';
import { useContext, useEffect, useState } from 'react';
import { getAllShop } from '../../service/shop';
import { getProductByShop } from '../../service/product';
import { GlobalContext } from '../../globalContext/GlobalContext';
import { setComboProduct } from '../../service/combo-product';
import { ModalCustom } from '../../components/modal/ModalCustom';
import { iconFail, iconSuccess } from '../../components/icon/Icon';


export const NewComboProduct = () => {
    const [loading, setLoading] = useState(false)
    const [notify, setNotify] = useState({
        isOpen: false,
        message: '',
        icon: null
    })

    const [shops, setShops] = useState([])
    const [shop, setShop] = useState(null)
    const [productDoAn, setProductDoAn] = useState([])
    const [productDoUong, setProductDoUong] = useState([])
    const [searchDoAn, setSearchDoAn] = useState('')
    const [searchDoUong, setSearchDoUong] = useState('')
    const [combo, setCombo] = useState({
        title: '',
        description: '',
        price: null,
        discount: 0,
        quantity: null,
        doAn: null,
        doUong: null,

    })

    const {
        shopID,
    } = useContext(GlobalContext);


    const handleGetDataShop = async () => {
        setLoading(true)
        const rsShop = await getAllShop()
        setShops(rsShop.data?.[0] || [])
        setLoading(false)

    }

    const handleGetDataProductDoAn = async () => {
        const rsDoAn = await getProductByShop({
            ShopID: shopID,
            keyword: searchDoAn,
        })
        setProductDoAn(rsDoAn.data?.[0] || [])
    }

    const handleGetDataProductDoUong = async () => {
        const rsDoAn = await getProductByShop({
            ShopID: shopID,
            keyword: searchDoUong,
            type: 'Đồ Uống'
        })
        setProductDoUong(rsDoAn.data?.[0] || [])
    }

    const handleSave = async () => {
        if (!combo?.price || !combo.title || !combo.doAn || !combo.doAn || !(shop || shopID)) {
            setNotify({
                isOpen: true,
                message: 'Điền đầy đủ thông tin !!',
                icon: iconFail
            })

            setTimeout(() => {
                setNotify({
                    isOpen: false,
                })
            }, 2000)
            return

        }
        try {
            const rs = await setComboProduct({
                combo: {
                    Price: combo.price,
                    StockQuantity: combo.quantity,
                    Title: combo.title,
                    Description: combo.description,
                    ShopID: shop || shopID,
                    Discount: combo.discount,
                    DoAn: combo.doAn,
                    DoUong: combo.doUong,

                }
            })
            setNotify({
                isOpen: true,
                message: 'Tạo combo thành công',
                icon: iconSuccess
            })

            setTimeout(() => {
                setNotify({
                    isOpen: false,
                })
            }, 2000)

            setCombo({
                title: '',
                description: '',
                price: null,
                discount: 0,
                quantity: null,
                doAn: null,
                doUong: null,

            })
        } catch (error) {
            setNotify({
                isOpen: true,
                message: 'Tạo combo thất bại, kiểm tra lại !',
                icon: iconFail
            })

            setTimeout(() => {
                setNotify({
                    isOpen: false,
                })
            }, 2000)
        }
    }

    useEffect(() => {
        handleGetDataShop()
    }, [])

    useEffect(() => {
        handleGetDataProductDoAn()
    }, [searchDoAn])

    useEffect(() => {
        handleGetDataProductDoUong()
    }, [searchDoUong])

    const { Title } = Typography;


    return (
        <LayoutCommon>
            <div className={styles.new_combo_product_container}>
                <div className={styles.new_combo_product_btn_new}>
                    <Button type="primary" onClick={handleSave}>Tạo mới</Button>
                </div>
                <div className={styles.new_combo_product_detail}>

                    <div className={styles.new_combo_product_items}>
                        <Space align='baseline' direction='horizontal' >
                            <div className={styles.new_combo_product_item_s} >
                                <Title level={5}>Cửa hàng</Title>
                                <Select
                                    placeholder="Chọn cửa hàng"
                                    optionFilterProp="label"
                                    defaultValue={Number(shopID || '1')}

                                    // value={shop || shopID}
                                    onChange={(value) => setShop(value)}
                                    options={shops?.map(i => ({
                                        value: i.ShopID,
                                        label: i.ShopName
                                    }))}
                                />
                            </div>

                            <div className={styles.new_combo_product_item_xx}>
                                <Title level={5}>Tên combo {!combo.title && <span style={{ color: 'red' }}>*</span>}</Title>
                                <Input placeholder="Nhập tên combo" onChange={(e) => setCombo(pre => ({ ...pre, title: e.target.value }))} value={combo.title} />
                            </div>

                            <div className={styles.new_combo_product_item_y}>
                                <Title level={5} >Mô tả </Title>
                                <TextArea rows={4} placeholder='Miêu tả sản phẩm' value={combo.description} onChange={(e) => setCombo(pre => ({ ...pre, description: e.target.value }))} />
                            </div>


                        </Space>
                    </div>
                    <div className={styles.new_combo_product_items}>
                        <Space align='baseline' direction='horizontal'>
                            <div className={styles.new_combo_product_item}>
                                <Title level={5}>Đồ ăn {!combo.doAn?.length > 0 && <span style={{ color: 'red' }}>*</span>}</Title>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Chọn đồ ăn phía dưới"
                                    onChange={(value) => setCombo(pre => ({ ...pre, doAn: value }))}
                                    options={productDoAn?.map(i => ({
                                        value: i.ProductID,
                                        label: i.ProductName
                                        ,
                                    }))}
                                    value={combo.doAn}
                                />
                            </div>
                            <div className={styles.new_combo_product_item}>
                                <Title level={5}>Đồ uống {!combo.doUong?.length > 0 && <span style={{ color: 'red' }}>*</span>}</Title>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Chọn đồ uống phía dưới"
                                    onChange={(value) => setCombo(pre => ({ ...pre, doUong: value }))}
                                    options={productDoUong?.map(i => ({
                                        value: i.ProductID,
                                        label: i.ProductName
                                        ,
                                    }))}
                                    value={combo.doUong}
                                />
                            </div>
                        </Space>
                    </div>
                    <div className={styles.new_combo_product_items} >
                        <Space align='baseline' direction='horizontal' style={{ justifyContent: 'start', marginLeft: 55 }}>
                            <div className={styles.new_combo_product_item_x}>
                                <Title level={5}>Giá tiền {combo.price === null && <span style={{ color: 'red' }}>*</span>}</Title>
                                <InputNumber placeholder="Nhập giá tiền" onChange={(e) => setCombo(pre => ({ ...pre, price: e }))} value={combo.price}
                                    formatter={(value) => {
                                        if (!value) return "";
                                        const parts = value.toString().split(".");
                                        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
                                    }}
                                    parser={(value) => value.replace(/,/g, "")}
                                />

                            </div>

                            <div className={styles.new_combo_product_item_x}>
                                <Title level={5}>Giá Discount</Title>
                                <InputNumber
                                    placeholder="Nhập giá discount"
                                    onChange={(e) => setCombo((pre) => ({ ...pre, discount: e }))}
                                    value={combo.discount}
                                    formatter={(value) => {
                                        if (!value) return "";
                                        const parts = value.toString().split(".");
                                        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
                                    }}
                                    parser={(value) => value.replace(/,/g, "")}
                                />
                            </div>

                            <div className={styles.new_combo_product_item_x}>
                                <Title level={5}>Số lượng {combo.quantity === null && <span style={{ color: 'red' }}>*</span>}</Title>
                                <InputNumber placeholder="Nhập số lượng" onChange={(e) => setCombo(pre => ({ ...pre, quantity: e }))} value={combo.quantity}
                                    formatter={(value) => {
                                        if (!value) return "";
                                        const parts = value.toString().split(".");
                                        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
                                    }}
                                    parser={(value) => value.replace(/,/g, "")}
                                />

                            </div>
                        </Space>
                    </div>

                </div>
                <div className={styles.new_combo_product_doan}>
                    <Space align='end'><Title level={5}>Đồ ăn</Title>  <Input placeholder="Tìm kiếm đồ ăn"
                        onChange={(e) => {
                            setTimeout(() => {
                                setSearchDoAn(e.target.value)
                            }, 500)
                        }} />
                    </Space>

                    <div className={styles.new_combo_product_doan_slide}>
                        <SlideDoAn products={productDoAn} setCombo={setCombo} combo={combo} setProduct={setProductDoAn} type="doAn" />
                    </div>
                </div>

                <div className={styles.new_combo_product_douong}>
                    <Space align='end'><Title level={5}>Đồ uống</Title>  <Input placeholder="Tìm kiếm đồ uống"
                        onChange={(e) => {
                            setTimeout(() => {
                                setSearchDoUong(e.target.value)
                            }, 500)
                        }} />
                    </Space>

                    <div className={styles.new_combo_product_douong_slide}>
                        <SlideDoAn products={productDoUong} setCombo={setCombo} combo={combo} setProduct={setProductDoUong} type="doUong" />

                    </div>
                </div>
            </div>
            <ModalCustom isOpen={notify.isOpen} hindTitle setIsOpen={() => setNotify(pre => ({ ...pre, isOpen: false }))}>
                {/* {notify.message} */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
                    {notify.icon} <h3 style={{ marginLeft: 10 }}> {notify.message} </h3>
                </div>
            </ModalCustom>
        </LayoutCommon>
    )
}