import React from "react";
import { Container } from "react-bootstrap";
import RepairView from "../../components/organisms/RepairsView/RepairView";
import TopOrderView from "../../components/organisms/TopOrderView/TopOrderView";

const OrderView = () => {
  return (
    <Container className="login-container">
      <TopOrderView repair_order_list />
      <RepairView />
    </Container>
  );
};

export default OrderView;
