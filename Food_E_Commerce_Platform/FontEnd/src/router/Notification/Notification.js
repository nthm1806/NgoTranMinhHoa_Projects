import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import Background from "../../layout/Background/Background";
import Notification from "../../layout/Notification/Notification";
import { GlobalProvider } from "../../globalContext/GlobalContext";
import { AuthProvider } from "../../globalContext/AuthContext";
import Chatbot from "../../components/chatbox/ChatBox";

function Home() {
  return (
    <div>
      <GlobalProvider>
        <AuthProvider>
          <Header />
          <Background>
            <Notification></Notification>
            <Chatbot></Chatbot>
            <Footer></Footer>
          </Background>
        </AuthProvider>
      </GlobalProvider>
    </div>
  );
}

export default Home;
