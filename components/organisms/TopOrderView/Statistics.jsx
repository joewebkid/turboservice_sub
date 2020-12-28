import React from "react";
import { Table } from "react-bootstrap";

const Statistics = () => {
  return (
    <>
      <p className="text-left b500">Statistics for 30 days</p>
      <Table bordered striped className="text-center" style={{ maxWidth: 500 }}>
        <thead>
          <tr>
            <th scope="col">Total repair orders done</th>
            <th scope="col">Serviced vehicles</th>

            <th scope="col">Average norm hours</th>
            <th scope="col">Average vehicle repair time</th>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <th scope="row">12</th>
            <td>5</td>
            <td>15</td>

            <td>18</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default Statistics;
