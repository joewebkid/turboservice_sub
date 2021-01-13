import React, { useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import Block from "../../atoms/Block";
import FlexBlock from "../../atoms/FlexBlock";
import CustomLink from "../../atoms/CustomLink";
import Section from "../../atoms/Section";
import Filter from "../../molecules/Filter";
import { headers, entity_sizes } from "./data";
import axios from "axios";
import { useRouter } from "next/router";
import Fade from "react-reveal/Fade";

// Contractors/OrderStatusesList
const get_statuses = (callback, router, SESSIONID) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/OrderStatusesList?SESSIONID=" +
          SESSIONID
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { OrderStatusesList } = Response;
        // console.log(response);
        callback(OrderStatusesList.data);
      })
      .catch(function (error) {
        console.log(error);
        router.push("/login?session");
      });
};
const get_orders = (callback, SESSIONID) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/WorkorderList?SESSIONID=" +
          SESSIONID
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { WorkorderList } = Response;
        // console.log(response);
        callback(WorkorderList.data);
      })
      .catch(function (error) {
        console.log(error);
      });
};

const RepairsOrders = (props) => {
  const { SESSIONID } = props;
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [ordersByPage, setOrdersByPage] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [pages, setPages] = useState(false);
  const [current_page, setCurrentPage] = useState(-1);
  const [elems_count, setElemCountOnPage] = useState(10);

  useEffect(() => {
    if (SESSIONID) {
      get_orders(setOrders, SESSIONID);
      get_statuses(setStatuses, router, SESSIONID);
      setCurrentPage(0);
    }
  }, [SESSIONID]);

  useEffect(() => {
    const orders_length = orders.length;
    if (orders_length > elems_count)
      setPages(Math.ceil(orders_length / elems_count));
    else setPages(false);

    setOrdersByPage(
      orders.slice(
        current_page * elems_count,
        current_page * elems_count + elems_count
      )
    );
  }, [orders, elems_count]);

  useEffect(() => {
    setOrdersByPage(
      orders.slice(
        current_page * elems_count,
        current_page * elems_count + elems_count
      )
    );
  }, [current_page]);
  if (current_page == -1) return <></>;
  return (
    <Fade>
      <Section className="border p-4 text-center mb-4">
        <h3>Repair orders</h3>

        <Table responsive className="text-center repairs-orders">
          <thead>
            <tr>
              <Filter
                headers={headers}
                statuses={statuses}
                saveData={setOrders}
                SESSIONID={SESSIONID}
              />
            </tr>
            <tr>
              {headers.map((e) => (
                <th scope="col" style={e.style ? e.style : {}}>
                  {e.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordersByPage.map((order) => (
              <>
                <tr
                  c={order["ORDER_STATUS_ID"]}
                  className={
                    order["ORDER_STATUS_ID"] == 2
                      ? "success"
                      : order["ORDER_STATUS_ID"] == 1
                      ? "warning"
                      : "second"
                  }
                >
                  {headers.map((e, k) => {
                    let val = order[e.slug];
                    if (e.type == "date" && val) {
                      const d = new Date(val);
                      val =
                        d.getDate() +
                        "." +
                        (d.getMonth() + 1) +
                        "." +
                        d.getFullYear();
                    }
                    return (
                      <td scope="col" key={k}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
                <tr
                  className={
                    order["ORDER_STATUS_ID"] == 2
                      ? "success"
                      : order["ORDER_STATUS_ID"] == 1
                      ? "warning"
                      : "second"
                  }
                >
                  <td scope="col" colSpan="10">
                    <FlexBlock justify="space-between">
                      <Block>{order["REQUEST_TEXT"]}</Block>
                      <CustomLink href={"/order/" + order["WORKORDER_ID"]}>
                        Edit
                      </CustomLink>
                    </FlexBlock>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>

        <Block className="sizesSelBlock">
          Show
          <Block className="selectCont">
            <select
              className="form-control"
              style={{ padding: ".15rem .15rem" }}
              onChange={(e) => setElemCountOnPage(e.target.value)}
            >
              {entity_sizes.map((e) => (
                <option selected={e == elems_count}>{e}</option>
              ))}
            </select>
          </Block>
          entries
        </Block>

        <FlexBlock justify="space-between">
          <Pagination>
            {pages ? (
              <>
                {/* <Pagination.First /> */}
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage(current_page ? current_page - 1 : 0)
                  }
                />
                {/* <Pagination.Ellipsis /> */}
                {[...Array(pages).keys()].map((k) => (
                  <Pagination.Item
                    active={current_page == k}
                    onClick={() => setCurrentPage(k)}
                  >
                    {k + 1}
                  </Pagination.Item>
                ))}
                {/* <Pagination.Item>{11}</Pagination.Item>
              <Pagination.Item active>{12}</Pagination.Item>
              <Pagination.Item>{13}</Pagination.Item>
              <Pagination.Item disabled>{14}</Pagination.Item> */}
                {/* <Pagination.Ellipsis /> */}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage(
                      current_page != pages - 1 ? current_page + 1 : pages - 1
                    )
                  }
                />
                {/* <Pagination.Last /> */}
              </>
            ) : (
              <></>
            )}
          </Pagination>

          <CustomLink>Contact support</CustomLink>
        </FlexBlock>
      </Section>
    </Fade>
  );
};

export default RepairsOrders;
