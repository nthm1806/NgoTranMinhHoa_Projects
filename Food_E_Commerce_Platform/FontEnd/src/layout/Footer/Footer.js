import styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={styles.footer_wrapper}>
      <div className={styles.footer_container_first}></div>
      <div className={styles.footer_container_second}>
         Group5Food lan tỏa vẻ đẹp truyền thống ẩm thực Việt!
      </div>
      <div className={styles.footer_container_third}>
        {[
          "Banhcuon.png", "Pho.png", "Banhcuon.png", "Bundau.png", "Chanem.png",
          "Comtam.png", "Gatan.png", "Phocuon.png", "TraCamXa.png", "XoiCom.png",
          "Sup.png", "LongLon.png", "RauCuQua.png", "NemChua.png", "TraSua.png",
          "Che.png", "MiQuang.png", "NuocEp.png", "BanhMy.png", "BunThang.png",
          "CafeMuoi.png", "ComRang.png", "TrungLonXaoMe.png", "Nom.png",
          "BanhRan.png", "NemLui.png", "Shashimi.png"
        ].map((imgSrc, index) => (
          <img key={index} src={"/" +imgSrc} alt={imgSrc.replace(".png", "")} />
        ))}
      </div>
      <div className={styles.footer_block_middle}>
        <img src="logo.png" alt="logo" />
      </div>
      <div className={styles.footer_block_end}>
        <div className={styles.footer_block_end_box_first}>
          Công Ty Cổ Phần Group5Food, thôn 3, Thạch Hòa, Thạch Thất, Hà Nội
        </div>
        <div className={styles.footer_block_end_box_first}>
          Email: support@group5food.vn
        </div>
        <div className={styles.footer_block_end_box_first}>
          Hotline: 0966.88.1862  (Mr.Hòa)
        </div>
      </div>
    </div>
  );
}

export default Footer;
