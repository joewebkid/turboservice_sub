import React, { useEffect, useState } from "react";
import { Pagination, Spinner, Table, Button } from "react-bootstrap";
import Block from "../../atoms/Block";
import FlexBlock from "../../atoms/FlexBlock";
import CustomLink from "../../atoms/CustomLink";
import Section from "../../atoms/Section";
import Filter from "../../molecules/Filter";
import { headers, entity_sizes } from "./data";
import axios from "axios";
import { useRouter } from "next/router";
import Fade from "react-reveal/Fade";
import StatusTabs from "./StatusTabs";

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
  const {
    SESSIONID,
    setLoading,
    loading,
    filter_values,
    filter_status,
    saved_current_page,
  } = props;
  const router = useRouter();

  const [ordersByPage, setOrders] = useState([]);
  // const [ordersByPage, setOrdersByPage] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [pages, setPages] = useState(false);
  const [current_page, setCurrentPage] = useState(-1);
  const [elems_count, setElemCountOnPage] = useState(10);

  const [selectStatus, setSelectStatus] = useState(0);

  const [total, setTotal] = useState(false);
  const [limit, setLimit] = useState(false);
  const [offset, setOffset] = useState(false);

  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    console.log(saved_current_page);
    setCurrentPage(saved_current_page);
  }, [saved_current_page]);

  useEffect(() => {
    setSelectStatus(filter_status);
  }, [filter_status]);

  useEffect(() => {
    if (SESSIONID && router) {
      get_statuses(setStatuses, router, SESSIONID, setLoading);
      setCurrentPage(saved_current_page);
    }
  }, [SESSIONID]);

  useEffect(() => {
    const orders_length = total;
    if (orders_length > elems_count)
      setPages(Math.ceil(orders_length / elems_count));
    else setPages(false);
    setLimit(elems_count);
  }, [total, elems_count]);

  useEffect(() => {
    console.log(current_page * elems_count);
    setOffset(current_page * elems_count);
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
        <StatusTabs
          statuses={statuses}
          selectStatus={selectStatus}
          setSelectStatus={setSelectStatus}
        />
        <Table responsive className="text-center repairs-orders">
          <thead>
            <tr>
              {headers.map((e, key) => (
                <th scope="col" style={e.style ? e.style : {}} key={key}>
                  {e.title}
                </th>
              ))}
            </tr>
            <tr>
              <Filter
                setDataLoading={setDataLoading}
                headers={headers}
                selectStatus={selectStatus}
                saveData={setOrders}
                SESSIONID={SESSIONID}
                filter_callback={get_orders}
                // toFirstPage={() => setCurrentPage(0)}
                setTotal={setTotal}
                limit={limit}
                offset={offset}
                filter_values_saved={filter_values}
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
          <tbody className={dataLoading ? "dataLoading" : ""}>
            {ordersByPage.map((order, key) => (
              <>
                <tr
                  c={order["ORDER_STATUS_ID"]}
                  className={key % 2 ? "second" : ""}
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
                  className={key % 2 ? "second" : ""}
                  onDoubleClick={() => {
                    router.push("/order/" + order["WORKORDER_ID"]);
                  }}
                >
                  <td scope="col" colSpan="10">
                    <FlexBlock justify="space-between">
                      <Block>{order["REQUEST_TEXT"]}</Block>
                      <CustomLink
                        href={"/order/" + order["WORKORDER_ID"]}
                        className=" pr-3"
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="external-link-alt"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="btn btn-link"
                        >
                          <path
                            fill="currentColor"
                            d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"
                            class=""
                          ></path>
                        </svg>
                      </CustomLink>
                    </FlexBlock>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>

        <FlexBlock justify="space-between">
          <Block className="sizesSelBlock mr-2">
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
            entries of {total}
          </Block>
          <Pagination>
            {pages ? (
              <>
                {/* <Pagination.First /> */}
                <Pagination.Prev
                  onClick={() => {
                    localStorage.setItem(
                      "current_page",
                      current_page ? current_page - 1 : 0
                    );
                    setCurrentPage(current_page ? current_page - 1 : 0);
                  }}
                />
                {/* <Pagination.Ellipsis /> */}
                {[...Array(pages).keys()].map((k) => (
                  <Pagination.Item
                    active={current_page == k}
                    onClick={() => {
                      setCurrentPage(k);
                      localStorage.setItem("current_page", k);
                    }}
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
                  onClick={() => {
                    localStorage.setItem(
                      "current_page",
                      current_page != pages - 1 ? current_page + 1 : pages - 1
                    );
                    setCurrentPage(
                      current_page != pages - 1 ? current_page + 1 : pages - 1
                    );
                  }}
                />
                {/* <Pagination.Last /> */}
              </>
            ) : (
              <></>
            )}
          </Pagination>
        </FlexBlock>
      </Section>
    </Fade>
  );
};

export default RepairsOrders;
