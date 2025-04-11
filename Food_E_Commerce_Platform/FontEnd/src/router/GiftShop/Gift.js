import React from "react";
import { Layout } from "antd";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import GiftShop from "./GiftShop";

const { Content } = Layout;

const GiftPage = () => {
  return (
    <Layout>
      <Header></Header>
      <Content>
        <GiftShop />
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default GiftPage;
