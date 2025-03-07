import React from "react";

import { ModalCustom } from "../modal/ModalCustom"
import styles from './stylesProduct.module.css'
import { formatMoney } from "../../utils";
import { Flex } from "antd";
import { Comments } from "../comment/Comments";
import { ProductDetail } from "./ProductDetail";

export const ProductDetailModal = ({ product, isOpen, setIsOpen }) => {
    return (
        <ModalCustom isOpen={isOpen} setIsOpen={setIsOpen} hindTitle>
             <ProductDetail product={product} isOpen={isOpen}/>
        </ModalCustom>
    )
}