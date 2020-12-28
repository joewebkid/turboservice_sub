import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import RepairsOrders from "../components/organisms/RepairsOrders/RepairsOrders";
import TopOrderView from "../components/organisms/TopOrderView/TopOrderView";

export default function Home() {
  return (
    <Container className="login-container">
      <TopOrderView statistics />
      <RepairsOrders />
    </Container>
  );
}
