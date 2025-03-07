import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import Background from "../../layout/Background/Background";
import Notification from "../../layout/Notification/Notification";
import { GlobalProvider } from "../../globalContext/GlobalContext";
import { AuthProvider } from "../../globalContext/AuthContext";

function Home() {
  return (
    <div>
      <GlobalProvider>
        <AuthProvider>
          <Header />
          <Background>
            <Notification></Notification>
            <Footer></Footer>
          </Background>
        </AuthProvider>
      </GlobalProvider>
    </div>
  );
}

export default Home;
