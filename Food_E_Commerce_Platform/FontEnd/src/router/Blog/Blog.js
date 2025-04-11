import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../layout/Header/Header';
import Footer from '../../layout/Footer/Footer'
import styles from './Blog.module.css';
import { Link } from 'react-router-dom';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/blog/');
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/blogcategory/');

            console.log("Dữ liệu categories từ API:", response.data);

            if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                console.log("Không có danh mục nào, hiển thị mặc định.");
                setCategories([{ id: 'All', name: 'Tất cả' }]);
                return;
            }

            setCategories([{ id: 'All', name: 'Tất cả' }, ...response.data.map(category => ({ id: category.ID, name: category.Name }))]);
        } catch (error) {
            console.error('Lỗi khi lấy categories:', error);
            setCategories([{ id: 'All', name: 'Tất cả' }]);
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
        setSelectedCategory("All");
    }, []);

    useEffect(() => {
        console.log("Danh mục được chọn:", selectedCategory);
    }, [selectedCategory]);

    const filteredBlogs =
        selectedCategory === 'All' ?
            blogs :
            blogs.filter(blog => Number(blog.CategoryID) === Number(selectedCategory));


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={styles.blogWrapper}>
            <Header />
            <div className={styles.container}>
                <div className={styles.top_page}>
                    <h2 className={styles.title}>FoodBlog</h2>
                    <button className={styles.button_myblog} onClick={() => window.location.href = '/blog/myblog'}>Blog của tôi</button>
                </div>
                <div className={styles.categoryContainer}>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setCurrentPage(1);
                            }}
                            className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {currentItems.length > 0 ? (
                    <div className={styles.blogGrid}>
                        {currentItems.map(blog => {
                            const categoryName = categories.find(c => Number(c.id) === Number(blog.CategoryID))?.name || 'Chưa xác định';
                            return (
                                <div className={styles.blogCard} key={blog.BlogID}>
                                    <Link to={`/blog/${blog.BlogID}`} key={blog.BlogID} className={styles.blogLink}>
                                        <img src={blog.Image} alt={blog.Title} className={styles.blogImage} />
                                        <div className={styles.blogContent}>
                                            <p className={styles.blogCategory}>{categoryName}</p>
                                            <h3 className={styles.blogTitle}>{blog.Title}</h3>
                                            <p className={styles.blogDescription}>{blog.ShortDescription}</p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>Không tìm thấy blog nào!</p>
                )}

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.active : ''}`}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default BlogList;