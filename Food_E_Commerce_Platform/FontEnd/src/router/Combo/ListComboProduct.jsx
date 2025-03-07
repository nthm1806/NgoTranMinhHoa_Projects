import { useContext, useEffect, useState } from "react"
import { LayoutCommon } from "../../layout/layout-common/LayoutCommon"
import { getComboProduct } from "../../service/combo-product"
import { GlobalContext } from "../../globalContext/GlobalContext";
import { LikeOutlined, MessageOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import React from 'react';
import SlideDoAn from "./SlideDoAn";
import { formatMoney } from "../../utils";



const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);
export const ListComboProduct = () => {
    const {
        shopID,
    } = useContext(GlobalContext);
    const [filterValue, setFilterValue] = useState({
        keyword: '',
        pageIndex: 1
    })
    const [data, setData] = useState([])

    const handleGetData = async () => {
        const rs = await getComboProduct({
            ShopID: shopID,
            ...filterValue
        })
        setData(rs.data.docs?.map(combo => (
            {
                href: '/combo-detal/' + combo.ComboID,
                title: combo.Title,
                avatar: combo.ImageCombo || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsmKO_nJ4rcmioe89svnUJ-UCoAxabQoslcOMbYBx0-77eRckmKY8Oqn1EUspES4J4dwQ&usqp=CAU`,
                description: '',
                content: combo.Description,
                ...combo
            }
        )))
    }

    useEffect(() => {
        handleGetData()
    }, [filterValue, shopID])

    return (
        <LayoutCommon>
            <div>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            setFilterValue(pre => ({ ...pre, pageIndex: page }))
                        },
                        pageSize: 12,
                        style:{
                            marginRight: 50
                        }
                    }}
                    dataSource={data}
                    footer={
                        <div>
                        </div>
                    }
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                <IconText icon={ShoppingCartOutlined} key="list-vertical-message" />,
                            ]}
                            extra={
                                <div>
                                    <SlideDoAn products={item.products} style={{ maxWidth: "45vw" }} />
                                </div>

                            }
                            
                        >
                            <List.Item.Meta
                            style={{width: '100%'}}
                                avatar={<Avatar src={item.avatar} />}
                                title={<a href={item.href}>{item.title}</a>}
                                description={<div>
                                    <span style={{marginRight: 30}}>Giá: <strong>{formatMoney(item.Price)} VND</strong></span>
                                    <span style={{marginRight: 30}}>Giảm giá: <strong>{formatMoney(item.Discount || 0)} VND</strong></span>
                                    <span style={{marginRight: 30}}>Số lượng: <strong>{formatMoney(item.StockQuantity || 0)} </strong></span>
                                    <span style={{marginRight: 30}}>Đã bán: <strong>{formatMoney(item.SoldQuantity || 0)} </strong></span>
                                </div>}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </div>
        </LayoutCommon>
    )
}