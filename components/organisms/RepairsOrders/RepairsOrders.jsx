import React, { useEffect, useState } from "react";
import { Pagination, Spinner, Table } from "react-bootstrap";
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
const get_statuses = (callback, router, SESSIONID, setLoading) => {
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
        const { Response, Message, Status } = result;
        // console.log(response);
        if (Status == 0) {
          const { OrderStatusesList } = Response;
          callback(OrderStatusesList.data);
          setLoading(true);
        } else {
          if (Message) {
            router.push("/login?message=" + Message);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        if (
          error.response &&
          (error.response.status == 401 || error.response.status == 404)
        ) {
          router.push("/login?session");
        } else {
          // const { data } = response;
          // const { result } = data;
          // const { Message } = result;
        }
      });
};
const get_orders = (
  callback,
  SESSIONID,
  search_string,
  setIsSearching,
  setTotal,
  offset,
  limit
) => {
  // console.log("Я иду на запрос", SESSIONID);
  if (SESSIONID)
    return axios
      .get(
        "https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkorderList?SESSIONID=" +
          SESSIONID +
          "&Total=1" +
          (offset ? "&Offset=" + offset : "") +
          (limit ? "&Limit=" + limit : "") +
          (search_string ? "&" + search_string : "")
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { WorkorderList } = Response;

        callback(WorkorderList.data);
        setIsSearching(false);
        setTotal(WorkorderList.totalRecords);

        return response;
      })
      .catch(function (error) {
        console.log(error);
      });
  else
    return new Promise((resolve, reject) => {
      return [];
    });
};

// const get_orders = (callback, SESSIONID) => {
//   if (SESSIONID)
//     axios
//       .get(
//         process.env.NEXT_PUBLIC_URL +
//           "/api-v2/Contractors/WorkorderList?SESSIONID=" +
//           SESSIONID +
//           // ""
//           "&Total=1"
//       )
//       .then(function (response) {
//         const { data } = response;
//         const { result } = data;
//         const { Response } = result;
//         const { WorkorderList } = Response;

//         console.log(WorkorderList.data);
//         // callback(WorkorderList.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
// };

const RepairsOrders = (props) => {
  const { SESSIONID, setLoading, loading } = props;
  const router = useRouter();

  const [ordersByPage, setOrders] = useState([]);
  // const [ordersByPage, setOrdersByPage] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [pages, setPages] = useState(false);
  const [current_page, setCurrentPage] = useState(-1);
  const [elems_count, setElemCountOnPage] = useState(10);

  const [total, setTotal] = useState(false);
  const [limit, setLimit] = useState(false);
  const [offset, setOffset] = useState(false);

  useEffect(() => {
    if (SESSIONID && router) {
      // get_orders(setOrders, SESSIONID);
      get_statuses(setStatuses, router, SESSIONID, setLoading);
      setCurrentPage(0);
    }
  }, [SESSIONID]);

  useEffect(() => {
    const orders_length = total;
    if (orders_length > elems_count)
      setPages(Math.ceil(orders_length / elems_count));
    else setPages(false);
    setLimit(elems_count);

    // setOrdersByPage(
    //   orders.slice(
    //     current_page * elems_count,
    //     Number(current_page * elems_count) + Number(elems_count)
    //   )
    // );
  }, [total, elems_count]);

  useEffect(() => {
    // console.log(
    //   current_page * elems_count,
    //   Number(current_page * elems_count) + Number(elems_count)
    // );
    // setOrdersByPage(
    //   orders.slice(
    //     current_page * elems_count,
    //     Number(current_page * elems_count) + Number(elems_count)
    //   )
    // );
    setOffset(current_page * elems_count);
    // setLimit(Number(current_page * elems_count) + Number(elems_count));
  }, [current_page]);

  if (current_page == -1) return <></>;

  if (!loading)
    return (
      <Section className="loadscreen">
        <Spinner animation="grow" />
      </Section>
    );

  return (
    <Fade>
      <Section className="border p-4 text-center mb-4 box">
        <h3>Repair orders</h3>

        <Table responsive className="text-center repairs-orders">
          <thead>
            <tr>
              <Filter
                headers={headers}
                statuses={statuses}
                saveData={setOrders}
                SESSIONID={SESSIONID}
                filter_callback={get_orders}
                setTotal={setTotal}
                limit={limit}
                offset={offset}
              />
            </tr>
            <tr>
              {headers.map((e, key) => (
                <th scope="col" style={e.style ? e.style : {}} key={key}>
                  {e.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordersByPage.map((order, key) => (
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
                  key={key}
                  onDoubleClick={() => {
                    router.push("/order/" + order["WORKORDER_ID"]);
                  }}
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
                  onDoubleClick={() => {
                    router.push("/order/" + order["WORKORDER_ID"]);
                  }}
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
              onChange={(e) => {
                setElemCountOnPage(e.target.value);
                setCurrentPage(0);
              }}
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

          <CustomLink href="mailto:Support@CarService.Software">
            Contact support
          </CustomLink>
        </FlexBlock>
      </Section>
    </Fade>
  );
};

export default RepairsOrders;
