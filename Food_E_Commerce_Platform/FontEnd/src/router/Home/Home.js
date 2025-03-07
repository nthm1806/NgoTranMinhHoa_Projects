import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import Background from "../../layout/Background/Background";
import Main from "../../layout/Main/Main";
import { GlobalProvider } from "../../globalContext/GlobalContext";
import { AuthProvider } from "../../globalContext/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  return (
    <div>
      <AuthProvider>
        <GlobalProvider>
          <Header />
          <Background>
            <Main></Main>
            <Footer></Footer>
          </Background>
        </GlobalProvider>
      </AuthProvider>
    </div>
  );
}

export default Home;
