import { useEffect, useState } from "react";
import { InputCustom } from "../input/InputCustom"
import { UserComment } from "./UserComment"
import styles from './styles.module.css';
import './star.css';

import { addReviewProduct, getReviewProduct } from "../../service/review";
import { Rate } from "antd";
import { checkUserCanComment } from "../../service/product";

export const Comments = ({ isPage, product }) => {
    const [comments, setComments] = useState([])
    const [textComment, setTextComment] = useState('')
    const [isReset, setIsReset] = useState(false)
    const [countRate, setCountRate] = useState(5)
    const [canRate, setCanRate] = useState(false)

    const handleCheckUserCanComment = async () => {
        try {
            const storedUser = localStorage.getItem("user");
            const userData = JSON.parse(storedUser);
            if (!userData?.id || !product.ProductID) return;

            const rs = await checkUserCanComment({
                ProductID: product.ProductID,
                CustomerID: userData?.id
            })
            if (rs.data[0]) {
                setCanRate(true)
            } else {
                setCanRate(false)

            }
        } catch (error) {
            console.error('error handleCheckUserCanComment: ', error);

        }
    }
    const handleGetData = async () => {
        if (!product.ProductID) return
        const rs = await getReviewProduct({
            form: {
                ProductID: product.ProductID,
                category: 'product'
            }
        })
        setComments(rs.data[0])
    }

    const onComment = async (text) => {
        try {
            const storedUser = localStorage.getItem("user");
            const userData = JSON.parse(storedUser);
            if (!userData?.id) return;
            const rs = await addReviewProduct({
                formReview: {
                    reviewText: text || textComment,
                    rating: countRate,
                    category: 'product'
                },
                cusID: userData.id,
                categoryID: product.ProductID
            })

            setCountRate(5)
            setIsReset(!isReset)
        } catch (error) {
            console.error('error onComment: ', error);

        }
    }

    useEffect(() => {
        handleGetData()
    }, [product, isReset])

    useEffect(() => {
            handleCheckUserCanComment()
    }, [product])

    return (
        <div className={isPage ? styles.comment_container_page : styles.comment_container}>
            {canRate ? <> <div className={styles.comment_rateContain}>
                <Rate allowHalf value={countRate} className={styles.comment_rate} onChange={(count) => setCountRate(count)} />

            </div>
                <InputCustom textComment={textComment} setTextComment={setTextComment} onComment={onComment} />
            </> : <></>}
            <div className={isPage ? styles.comment_body_page : styles.comment_body}>
                {comments?.map((i) => <UserComment review={i} />)}
            </div>
        </div>
    )
}