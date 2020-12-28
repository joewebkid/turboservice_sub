import React from "react";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { jobs_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";

const JobsSection = () => {
  return (
    <>
      <Section className="text-center mb-1">
        <FlexBlock justify="flex-end" className="mb-1">
          <FlexBlock>
            <Button variant="secondary" className="mr-1">
              Load from file
            </Button>
            <Button variant="secondary">?</Button>
          </FlexBlock>
        </FlexBlock>

        <Block className="text-left w500">Jobs</Block>

        <Table>
          <thead>
            <tr>
              {jobs_struct.map((e) => (
                <th scope="col">{e.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {jobs_struct.map((e) => (
                <td scope="col">
                  <input
                    value="H55NV"
                    className="form-control"
                    placehorder="repair order"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </Section>
    </>
  );
};

export default JobsSection;
