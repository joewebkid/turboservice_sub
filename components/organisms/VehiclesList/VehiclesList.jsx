import React, { useEffect, useState } from "react";
import { Spinner, Table, Button, Form } from "react-bootstrap";
import Block from "../../atoms/Block";
import FlexBlock from "../../atoms/FlexBlock";
import CustomLink from "../../atoms/CustomLink";
import Section from "../../atoms/Section";
import Filter from "../../molecules/Filter";
import { headers, entity_sizes } from "./data";
import axios from "axios";
import { useRouter } from "next/router";
import Fade from "react-reveal/Fade";
// import StatusTabs from "./StatusTabs";
import PaginationPart from "../../atoms/PaginationPart";
import { t } from "../../translation/data";

// Contractors/OrderStatusesList
// const get_statuses = (callback, router, SESSIONID, setLoading) => {
//   if (SESSIONID)
//     axios
//       .get(
//         process.env.NEXT_PUBLIC_URL +
//           "/api-v2/Contractors/OrderStatusesList?SESSIONID=" +
//           SESSIONID
//       )
//       .then(function (response) {
//         const { data } = response;
//         const { result } = data;
//         const { Response, Message, Status } = result;
//         // console.log(response);
//         if (Status == 0) {
//           const { OrderStatusesList } = Response;
//           callback(OrderStatusesList.data);
//           setLoading(true);
//         } else {
//           if (Message) {
//             router.push("/login?message=" + Message);
//           }
//         }
//       })
//       .catch(function (error) {
//         console.log(error);
//         if (
//           error.response &&
//           (error.response.status == 401 || error.response.status == 404)
//         ) {
//           router.push("/login?session");
//         } else {
//           // const { data } = response;
//           // const { result } = data;
//           // const { Message } = result;
//         }
//       });
// };
const get_orders = (
  callback,
  SESSIONID,
  search_string,
  setIsSearching,
  setTotal,
  offset,
  limit,
  onResponse,
  router
) => {
  // console.log("Я иду на запрос", offset);
  if (SESSIONID)
    return axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/VehiclesList?SESSIONID=" +
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
        const { VehiclesList } = Response;

        callback(VehiclesList.data);
        setIsSearching(false);
        setTotal(VehiclesList.totalRecords);
        onResponse();
        return response;
      })
      .catch(function (error) {
        if (error.response && error.response.status == 401) {
          router.push("/login?session&&redirectto=order/" + id);
        }
      });
  else
    return new Promise((resolve, reject) => {
      return [];
    });
};

const VehiclesList = (props) => {
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

  const [page_input, setpage_input] = useState("");

  const [selectStatus, setSelectStatus] = useState(0);

  const [total, setTotal] = useState(false);
  const [limit, setLimit] = useState(false);
  const [offset, setOffset] = useState(false);

  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    // console.log(total > elems_count);
    if (saved_current_page && total > elems_count)
      setCurrentPage(saved_current_page);
  }, [saved_current_page]);

  useEffect(() => {
    setSelectStatus(filter_status);
  }, [filter_status]);

  useEffect(() => {
    if (SESSIONID && router) {
      setLoading(true);
      setCurrentPage(total > elems_count ? saved_current_page : 0);
      // setCurrentPage(saved_current_page);
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
    setOffset(current_page * elems_count);
    setpage_input(Number(current_page) + 1);
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
        {/* <StatusTabs
          statuses={statuses}
          selectStatus={selectStatus}
          setSelectStatus={setSelectStatus}
          setCurrentPage={setCurrentPage}
        /> */}
        <Table responsive className="text-center repairs-orders">
          <thead>
            <tr>
              {headers.map((e, key) => (
                <th scope="col" style={e.style ? e.style : {}} key={key}>
                  {t(e.t)}
                </th>
              ))}
            </tr>
            <Filter
              setDataLoading={setDataLoading}
              headers={headers}
              selectStatus={selectStatus}
              saveData={setOrders}
              SESSIONID={SESSIONID}
              filter_callback={get_orders}
              setCurrentPage={setCurrentPage}
              setTotal={setTotal}
              limit={limit}
              offset={offset}
              filter_values_saved={filter_values}
              router={router}
            />
            <tr>
              {headers.map((e, key) => (
                <th scope="col" style={e.style ? e.style : {}} key={key}>
                  {t(e.t)}
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
                    router.push("/vehicles/" + order["VEHICLE_ID"]);
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
                    router.push("/vehicles/" + order["VEHICLE_ID"]);
                  }}
                >
                  <td scope="col" colSpan="10">
                    <FlexBlock justify="space-between">
                      <Block>{order["REQUEST_TEXT"]}</Block>
                      <Block className=" mr-3" style={{ width: 24 }}>
                        <CustomLink href={"/vehicles/" + order["VEHICLE_ID"]}>
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="external-link-alt"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="btn btn-link"
                            style={{ width: 47 }}
                          >
                            <path
                              fill="currentColor"
                              d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"
                              class=""
                            ></path>
                          </svg>
                        </CustomLink>
                      </Block>
                    </FlexBlock>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
        <FlexBlock justify="space-between">
          <FlexBlock align="center" className="sizesSelBlock mr-2">
            {/* {pages ? (
              <FlexBlock className="mr-2" align="center">
                Page{" "}
                <Form.Control
                  style={{ width: 50 }}
                  className="ml-2"
                  onChange={(e) => {
                    if (pages >= e.target.value) {
                      setpage_input(e.target.value);
                      if (e.target.value) setCurrentPage(e.target.value - 1);
                    }
                  }}
                  type="number"
                  value={page_input}
                />
              </FlexBlock>
            ) : (
              <></>
            )} */}
            <Block>
              {t("show")}
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
              {t("total_records")} {total}
            </Block>
          </FlexBlock>

          <PaginationPart
            setCurrentPage={setCurrentPage}
            current_page={current_page}
            pages={pages}
          />
        </FlexBlock>
      </Section>
    </Fade>
  );
};

export default VehiclesList;
