import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import './styles.css'

export const LayoutCommon = ({children}) =>{
    return (
        <div className="container-layout">
                      <div className="header-layout"> <Header /></div>
                       <div className="body-layout">{children}</div>
                       <div className="footer-layout"><Footer/></div>

        </div>
    )
}