import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import styles from "./UpdateBlog.module.css";
import Swal from "sweetalert2";

const UpdateBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [categoryID, setCategoryID] = useState("");
    const [categories, setCategories] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [sections, setSections] = useState([""]);
    const [images, setImages] = useState([]);
    const [coverImage, setCoverImage] = useState("");
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/blog/${id}`);
                const blogData = response.data;

                if (!blogData) {
                    console.error("Không tìm thấy blog với ID:", id);
                    return;
                }

                setCustomerName(`${blogData.FirstName} ${blogData.LastName}`);
                setTitle(blogData.Title || "");
                setShortDescription(blogData.ShortDescription || "");
                setCategoryID(blogData.CategoryID || "");
                setSections(blogData.Sections?.map(s => s.Content) || [""]);
                setExistingImages(blogData.Images?.map(img => img.ImageURL) || []);
                setCoverImage(blogData.Image || "");
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchBlog();
    }, [id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log(123)
                const response = await axios.get("http://localhost:3001/api/blogcategory");
                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    const addSection = () => setSections([...sections, ""]);

    const removeSection = (index) => {
        if (sections.length > 1) {
            const newSections = sections.filter((_, i) => i !== index);
            setSections(newSections);
        }
    };

    const handleCoverImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCoverImage(file);
        }
    };

    const removeCoverImage = () => {
        setCoverImage(null);
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);

        if (files.length > 0) {
            setImages([...images, ...files]);
        }
    };

    const removeExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };


    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim() || !shortDescription.trim()
            || !categoryID || sections.some(s => !s.trim())) {
            alert("Vui lòng nhập đầy đủ các trường!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("shortDescription", shortDescription);
        formData.append("categoryID", categoryID);

        if (coverImage instanceof File) {
            formData.append("coverImage", coverImage);
        } else if (coverImage) {
            formData.append("existingCoverImage", coverImage);
        }

        formData.append("existingImages", JSON.stringify(existingImages));

        images.forEach((image) => {
            formData.append("images", image);
        });

        sections.forEach((content, index) => {
            formData.append(`sections[${index}]`, content);
        });

        try {
            await axios.put(`http://localhost:3001/api/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Cập nhật blog thành công!");
            navigate(`/blog/${id}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật blog:", error);
            Swal.fire("Có lỗi khi cập nhật blog!");
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.topPage}>
                    <h2 className={styles.title}>Cập nhật Blog</h2>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>Quay lại</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Người viết Blog</label>
                        <input type="text" value={customerName || 'Đang tải...'}
                            readOnly className={styles.input} />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Tiêu đề</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            className={styles.input} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Danh mục</label>
                        <select value={categoryID} onChange={(e) => setCategoryID(e.target.value)}
                            className={styles.select} required>
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.ID} value={cat.ID}>{cat.Name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mô tả ngắn</label>
                        <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
                            className={styles.textarea} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Ảnh bìa</label>
                        <input type="file" onChange={handleCoverImageUpload} />
                        {coverImage && (
                            <div className={styles.coverImageContainer}>
                                <img
                                    src={coverImage instanceof File ? URL.createObjectURL(coverImage) : coverImage}
                                    alt="Ảnh bìa"
                                    className={styles.coverImage}
                                />
                                <button type="button" onClick={removeCoverImage} className={styles.removeImage}>X</button>
                            </div>
                        )}

                    </div>

                    <div className={styles.sectionContainer}>
                        <label className={styles.label}>Nội dung</label>
                        {sections.map((content, index) => (
                            <div key={index} className={styles.section}>
                                <textarea
                                    value={content}
                                    onChange={(e) => {
                                        const newSections = [...sections];
                                        newSections[index] = e.target.value;
                                        setSections(newSections);
                                    }}
                                    className={styles.sectionInput}
                                    required
                                />
                                {sections.length > 1 && (
                                    <button type="button" onClick={() => removeSection(index)}
                                        className={styles.removeButton}>-</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addSection} className={styles.addButton}>+</button>
                    </div>

                    <div className={styles.imagePreview}>
                        {existingImages.map((image, index) => (
                            <div key={`existing-${index}`} className={styles.previewContainer}>
                                <img src={image} alt="Ảnh đã tải lên" className={styles.previewImage} />
                                <button onClick={() => removeExistingImage(index)} className={styles.removeImage}>X</button>
                            </div>
                        ))}

                        {images.map((image, index) => (
                            <div key={`new-${index}`} className={styles.previewContainer}>
                                <img src={URL.createObjectURL(image)}
                                    alt="Ảnh mới tải lên" className={styles.previewImage} />
                                <button onClick={() => removeImage(index)} className={styles.removeImage}>X</button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.imageUploadContainer}>
                        <label>Thêm ảnh</label>
                        <input type="file" multiple onChange={handleImageUpload} />
                    </div>

                    <div className="submitContainer">
                        <button type="submit" className={styles.submitButton}>Cập nhật</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default UpdateBlog;