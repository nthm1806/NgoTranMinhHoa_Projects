import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import styles from "./BlogDetail.module.css";
import Swal from "sweetalert2";

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [categoryName, setCategoryName] = useState(null);
    const [customerID, setCustomerID] = useState("");
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editComment, setEditComment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const inforFullUser = localStorage.getItem("user");
        if (inforFullUser) {
            const user = JSON.parse(inforFullUser);
            setCustomerID(user.id);
            console.log("Customer ID:", user.id);
        }
    }, []);


    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/comment/blog/${id}`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    useEffect(() => {
        if (!customerID) return;
        const checkIsLiked = async () => {
            try {
                if (customerID) {
                    const response = await axios.get(`http://localhost:3001/api/blog/${id}/isLiked`, {
                        params: { customerID }
                    });
                    setIsLiked(response.data.isliked);
                }
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        };

        checkIsLiked();
    }, [customerID, id]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/blog/${id}`);
                setBlog(response.data);
                setLikes(response.data.Likes);

                const categoryResponse = await axios.get(`http://localhost:3001/api/blogcategory`);
                const categories = categoryResponse.data || [];

                const category = categories.find(c => c.ID === response.data.CategoryID);
                setCategoryName(category ? category.Name : "Không xác định");
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };

        fetchBlog();
    }, [id]);

    if (!blog) {
        return <div>Đang tải...</div>;
    }

    const sortedImages = (blog.Images || []).sort((a, b) => a.SortOrder - b.SortOrder);
    const sortedSections = (blog.Sections || []).sort((a, b) => a.SortOrder - b.SortOrder);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const toggleLike = async () => {
        if (!customerID) {
            Swal.fire({
                title: 'Chưa đăng nhập!',
                text: 'Bạn cần đăng nhập để thích bài viết này',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const action = isLiked ? "unlike" : "like";
            await axios.post(`http://localhost:3001/api/blog/${id}/like`, {
                action,
                customerID,
            });

            setLikes(prev => (action === "like" ? prev + 1 : Math.max(prev - 1, 0)));
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Lỗi khi ấn like hoặc unlike!", error);
        }
    }

    const handleEditComment = async (comment) => {
        setNewComment(comment.content);
        setEditComment(comment.commentID);
    };

    const handleDeleteComment = async (commentID) => {
        const result = await Swal.fire({
            title: "Xóa bình luận",
            text: "Bạn có chắc chắn muốn xóa bình luận này?",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            reverseButtons: true
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3001/api/comment/${commentID}`);
                Swal.fire("Đã xóa", "Bình luận được xóa thành công");
                fetchComments();
            } catch (error) {
                console.error("Lỗi khi xóa bình luận:", error);
                Swal.fire("Lỗi", "Có lỗi khi xóa bình luận");
            }
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !customerID) {
            Swal.fire({
                title: 'Chưa đăng nhập!',
                text: 'Bạn cần đăng nhập để bình luận',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            if (editComment) {
                await axios.put(`http://localhost:3001/api/comment/${editComment}`, {
                    content: newComment,
                });
            } else {
                await axios.post("http://localhost:3001/api/comment", {
                    blogID: id,
                    customerID: customerID,
                    content: newComment,
                });
            }
            setNewComment("");
            setEditComment(null);
            fetchComments();
        } catch (error) {
            console.error("Lỗi gửi bình luận:", error);
        }
    };

    return (
        <div className={styles.blogDetailWrapper}>
            <Header />
            <div className={styles.container}>
                <div className={styles.topPage}>
                    <button className={styles.backButton} onClick={() => navigate(`/blog`)}>Quay lại</button>
                    <h2 className={styles.title}>{blog.Title}</h2>
                    {blog.CustomerID === customerID && (
                        <button className={styles.editButton} onClick={() => navigate(`/blog/update/${id}`)}>Sửa</button>
                    )}
                </div>
                <div className={styles.infoWrapper}>
                    <p className={styles.category}>
                        <strong>Danh mục:</strong> {categoryName}
                    </p>

                    <p className={styles.date}>
                        <strong>Ngày tạo:</strong> {formatDate(blog.CreatedAt)}
                    </p>
                </div>

                <p className={styles.author}>
                    <strong>Người viết:</strong> {blog.FirstName} {blog.LastName}
                </p>

                <div className={styles.imageWrapper}>
                    <img src={blog.Image} alt={blog.Title} className={styles.blogImage} />
                </div>

                <p className={styles.shortDescription}>{blog.ShortDescription}</p>

                <div className={styles.contentWrapper}>
                    {sortedImages.length > 0 && sortedSections.length > 0 ? (
                        sortedImages.map((img, index) => (
                            <div key={index} className={styles.contentBlock}>
                                <img src={img.ImageURL} alt={`Ảnh ${index + 1}`} className={styles.blogImage} />
                                {sortedSections[index] && (
                                    <p className={styles.contentSection}>{sortedSections[index].Content}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        sortedSections.map((section, index) => (
                            <div key={index} className={styles.contentBlock}>
                                <p className={styles.contentSection}>{section.Content}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.interactionBar}>
                    <button onClick={toggleLike} className={styles.likeButton}>
                        <img src="/likeIcon.png" alt="likeIcon"
                            style={{ width: "20px", height: "20px" }}
                        />
                        <span>{likes} {isLiked ? "Đã thích" : "Thích"}</span>
                    </button>

                    <div className={styles.commentInline}>
                        <h4 className={styles.commentTitle}>Bình luận</h4>
                        <div className={styles.commentList}>
                            {comments.map((comment, index) => (
                                <div key={index} className={styles.commentItem}>
                                    <p style={{ margin: 0 }}>
                                        <strong>{comment.firstName} {comment.lastName}</strong>: {comment.content}
                                    </p>

                                    {Number(comment.customerID) === Number(customerID) && (
                                        <span className={styles.commentActions}>
                                            <span onClick={() => handleEditComment(comment)} className={styles.editComment}>Sửa</span>
                                            <span onClick={() => handleDeleteComment(comment.commentID)} className={styles.deleteComment}>Xóa</span>
                                        </span>
                                    )}
                                </div>
                            ))}

                            {comments.length === 0 && <p>Không có bình luận nào!</p>}
                        </div>
                        <textarea
                            className={styles.commentInput}
                            placeholder="Nhập bình luận..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className={styles.buttonWrapper}>
                            <button onClick={handleSubmitComment} className={styles.commentButton}>
                                {editComment ? "Cập nhật" : "Gửi"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    )
}

export default BlogDetail