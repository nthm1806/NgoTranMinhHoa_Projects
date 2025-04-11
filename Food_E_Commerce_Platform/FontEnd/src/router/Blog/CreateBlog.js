import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import styles from "./CreateBlog.module.css";
import Swal from "sweetalert2";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [categoryID, setCategoryID] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerID, setCustomerID] = useState("");
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([""]);
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [coverImage, setCoverImage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const inforFullUser = localStorage.getItem("user");
        if (inforFullUser) {
            const user = JSON.parse(inforFullUser);
            setCustomerID(user.id);
            console.log("Customer ID:", user.id);
        }
    }, []);

    useEffect(() => {
        if (customerID) {
            const fetchCustomerName = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/customers/${customerID}`);
                    const fullName = `${response.data.FirstName} ${response.data.LastName}`;
                    setCustomerName(fullName);
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin khách hàng:", error);
                }
            };

            fetchCustomerName();
        }
    }, [customerID]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
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

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages([...images, ...files]);
    };

    const handleCoverImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCoverImage(file);
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const removeCoverImage = () => {
        setCoverImage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title.trim() || !shortDescription.trim() || !categoryID || !customerID || sections.some(s => !s.trim())) {
            alert("Vui lòng nhập đầy đủ các trường!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("shortDescription", shortDescription);
        formData.append("categoryID", categoryID);
        formData.append("customerID", customerID);
        formData.append("sections", JSON.stringify(sections));

        if (coverImage instanceof File) {
            formData.append("coverImage", coverImage);
        }

        images.forEach((image) =>
            formData.append("images", image));

        try {
            await axios.post("http://localhost:3001/api/blog", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Blog đã được tạo thành công!");
            navigate("/blog");
        } catch (error) {
            Swal.fire("Có lỗi xảy ra khi tạo blog!");
            console.error("Lỗi khi tạo blog:", error);
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.topPage}>
                    <h2 className={styles.title}>Tạo Blog mới</h2>
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
                                    alt="Cover preview"
                                    className={styles.coverImage}
                                />
                                <button type="button" onClick={removeCoverImage} className={styles.removeImage}>
                                    X
                                </button>
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

                    <div className={styles.imageUploadContainer}>
                        <label>Thêm ảnh</label>
                        <input type="file" multiple onChange={handleImageUpload} />
                        <div className={styles.imagePreview}>
                            {images.map((file, index) => (
                                <div key={index}>
                                    <img src={URL.createObjectURL(file)} alt="Preview" className={styles.previewImage} />
                                    <button onClick={() => removeImage(index)} className={styles.removeImage}>X</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="submitContainer">
                        <button type="submit" className={styles.submitButton}>Lưu</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default CreateBlog;