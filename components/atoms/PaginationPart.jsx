import React from "react";
import { Pagination } from "react-bootstrap";
// $outOfRange = false;
// for($i = 1; $i <= $count_pages; $i++) {

//     if ($i <= 2 || $i >= $count_pages - 2 || abs($i - $page) <= 2) {

//         // page number should be echoed so do as you did before

//         $outOfRange = false;

//         if($i == $page) {
//             echo "<li><a class='active-page' href='./latest.php?page=$i'>$i</a></li>";
//         } else {
//             echo "<li><a href='./latest.php?page=$i'>$i</a></li>";
//         }
//     } else {

//         // we are out of range! if not already out of range, echo ellipsis

//         if (!$outOfRange) {
//             echo ' ... ';
//         }

//         $outOfRange = true;

//     }
// }
export default function PaginationPart(props) {
  const { setCurrentPage, current_page, pages } = props;
  let out;

  return (
    <Pagination>
      {pages ? (
        <>
          <Pagination.First
            onClick={() => {
              localStorage.setItem("current_page", 0);
              setCurrentPage(0);
            }}
          />
          <Pagination.Prev
            onClick={() => {
              localStorage.setItem(
                "current_page",
                current_page ? current_page - 1 : 0
              );
              setCurrentPage(current_page ? current_page - 1 : 0);
            }}
          />

          {[...Array(pages).keys()].map((k, key) => {
            if (k <= 1 || k >= pages - 2 || Math.abs(k - current_page) <= 1) {
              out = false;
              return (
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
              );
            } else {
              if (!out) {
                out = true;
                return (
                  <>
                    <Pagination.Ellipsis />
                  </>
                );
              } else return <></>;
            }
          })}

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
          <Pagination.Last
            onClick={() => {
              localStorage.setItem("current_page", pages - 1);
              setCurrentPage(pages - 1);
            }}
          />
        </>
      ) : (
        <></>
      )}
    </Pagination>
  );
}
