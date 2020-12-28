import React from "react";
import { Pagination, Table } from "react-bootstrap";
import Block from "../../atoms/Block";
import FlexBlock from "../../atoms/FlexBlock";
import Link from "../../atoms/LInk";
import Section from "../../atoms/Section";
import Filter from "../../molecules/Filter";
import { headers, entity_sizes } from "./data";

const RepairsOrders = () => {
  return (
    <Section className="border p-4 text-center mb-4">
      <h3>Repair orders</h3>

      <Table className="text-center repairs-orders">
        <thead>
          <tr>
            <Filter headers={headers} />
          </tr>
          <tr>
            {headers.map((e) => (
              <th scope="col">{e.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="success">
            {headers.map((e) => (
              <td scope="col">123</td>
            ))}
          </tr>
          <tr className="success">
            <td scope="col" colspan="10">
              <FlexBlock justify="space-between">
                <Block>Не заводится. Чихает. Глохнет</Block>
                <Link href="/order/1">Edit</Link>
              </FlexBlock>
            </td>
          </tr>
          <tr className="">
            {headers.map((e) => (
              <td scope="col">123</td>
            ))}
          </tr>
          <tr className="">
            <td scope="col" colspan="10">
              <FlexBlock justify="space-between">
                <Block>Не заводится. Чихает. Глохнет</Block>
                <Link href="/order/1">Edit</Link>
              </FlexBlock>
            </td>
          </tr>
        </tbody>
      </Table>

      <Block className="sizesSelBlock">
        Show
        <Block className="selectCont">
          <select className="form-control" style={{ padding: ".15rem .15rem" }}>
            {entity_sizes.map((e) => (
              <option>{e}</option>
            ))}
          </select>
        </Block>
        entries
      </Block>

      <FlexBlock justify="space-between">
        <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Ellipsis />

          <Pagination.Item>{10}</Pagination.Item>
          <Pagination.Item>{11}</Pagination.Item>
          <Pagination.Item active>{12}</Pagination.Item>
          <Pagination.Item>{13}</Pagination.Item>
          <Pagination.Item disabled>{14}</Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Item>{20}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>

        <Link>Contact developers</Link>
      </FlexBlock>
    </Section>
  );
};

export default RepairsOrders;
