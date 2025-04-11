import React from "react";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import GameCanvas from "./GameCanvas";
import { Layout } from "antd";

const { Content } = Layout;

const GamePage = () => {
    return (
      <Layout>
        <Header></Header>
        <Content>
          <GameCanvas/>
        </Content>
        <Footer></Footer>
      </Layout>
    );
  };
  
  export default GamePage;
  