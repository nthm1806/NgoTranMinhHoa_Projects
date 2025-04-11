import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyBlog.module.css";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import Swal from "sweetalert2";

const MyBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [customerID, setCustomerID] = useState("");

    useEffect(() => {
        const inforFullUser = localStorage.getItem("user");
        if (inforFullUser) {
            const user = JSON.parse(inforFullUser);
            setCustomerID(user.id);
            console.log("Customer ID:", user.id);
        }
    }, []);

    const fetchMyBlogs = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/blog/by-customer/${customerID}`);
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDelete = async (blogID) => {
        const result = await Swal.fire({
            title: "Bạn muốn xóa blog này?",
            text: "Blog này sẽ bị xóa vĩnh viễn",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            reverseButtons: true
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/api/blog/${blogID}`);
                Swal.fire("Đã xóa", "Blog đã được xóa thành công");
                fetchMyBlogs();
            } catch (error) {
                console.error(error);
                Swal.fire("Lỗi", "Có lỗi khi xóa blog");
            }
        }
    };

    useEffect(() => {
        if (customerID) {
            fetchMyBlogs();
        }
    }, [customerID]);

    return (
        <div>
            <Header />
            <div className={styles.myBlogContainer}>
                <div className={styles.myBlogHeader}>
                    <button className={styles.backButton} onClick={() => navigate(`/blog`)}>Quay lại</button>
                    <button className={styles.button_add} onClick={() => window.location.href = '/blog/add'}>Tạo Blog</button>
                    <h2 className={styles.title}>Blog của tôi</h2>
                </div>
                {blogs.length === 0 ? (
                    <p style={{ textAlign: "center" }}>Bạn chưa có blog nào</p>
                ) : (
                    <div className={styles.content}>
                        {blogs.map((blog) => (
                            <div key={blog.BlogID} className={styles.blogItem}>
                                <img src={blog.Image} alt={blog.Title} className={styles.blogThumbnail} />
                                <div className={styles.blogInfo}>
                                    <h3>{blog.Title}</h3>
                                    <p>{blog.ShortDescription}</p>
                                    <div className={styles.blogActions}>
                                        <button onClick={() => navigate(`/blog/update/${blog.BlogID}`)}>Sửa</button>
                                        <button onClick={() => handleDelete(blog.BlogID)}>Xóa</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyBlog;