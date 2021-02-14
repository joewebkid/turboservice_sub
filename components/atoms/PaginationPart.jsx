import React from "react";
import { Pagination } from "react-bootstrap";

export default function PaginationPart(props) {
  const { setCurrentPage, current_page, pages } = props;
  return (
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
          {[...Array(pages).keys()].map((k, key) => (
            <Pagination.Item
              active={current_page == k}
              onClick={() => {
                setCurrentPage(k);
                localStorage.setItem("current_page", k);
              }}
              key={key}
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
  );
}
