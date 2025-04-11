import { useEffect, useState } from "react";
import styles from "./Search.module.css";
import { useNavigate, useRoutes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFilterSearchRedux } from "../../redux/filterSearch";
import { iconSearch } from "../../components/icon/Icon";

function Search() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();

  useEffect(() => {
    setText(params.get("keyword") || '')
    dispatch(setFilterSearchRedux({ keyword: params.get("keyword") || '' }))
  }, [])
  const handleSearchProduct = () => {
    navigate('/search?keyword=' + text)
    dispatch(setFilterSearchRedux({ keyword: text || '' }))

  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchProduct();
    }
  };
  
  return (
    <div className={styles.fhs_search_header}>
      <input placeholder="Tìm Kiếm Sản Phẩm..." onChange={(e) => setText(e.target.value)} value={text}  onKeyDown={handleKeyDown}/>
      <span className={`${styles.fhs_button_search_header} ${styles.fhs_mouse_point}`} onClick={handleSearchProduct}>
       {iconSearch}
      </span>
    </div>
  );
}

export default Search;
