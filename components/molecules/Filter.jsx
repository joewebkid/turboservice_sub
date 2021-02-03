import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import Block from "../atoms/Block";
import DataInput from "../atoms/DataInput";
import FilterData from "../atoms/FilterInput/FilterData";
import FilterInput from "../atoms/FilterInput/FilterInput";
import StatusesSelect from "../atoms/FilterInput/StatusesSelect";
import useDebounce from "../atoms/FilterInput/useDebounce";
import FlexBlock from "../atoms/FlexBlock";
import { formatDate } from "./data";

const Filter = (props) => {
  const {
    headers,
    // statuses,
    saveData,
    SESSIONID,
    filter_callback,
    setTotal,
    limit,
    offset,
    toFirstPage,
    selectStatus,
    setDataLoading,
  } = props;

  const [filter_values, saveFilterValues] = useState(false);
  const [selected_statuses, setSelectedStatuses] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [search_string, setSearchString] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(1);

  const debouncedSearchTerm = useDebounce(search_string, 500);

  // console.log(filter_values, selected_statuses);
  useEffect(() => {
    console.log(selectStatus);
    if (!isSearching) {
      let stringInput = Object.keys(filter_values)
        .map(function (i) {
          return [i, filter_values[i]].join("=");
        })
        .join("&");

      stringInput = stringInput + "&OrderStatusID[]=" + selectStatus;
      setSearchString(stringInput);
    }
  }, [filter_values, selectStatus]);

  useEffect(() => {
    toFirstPage();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      return;
    }
    if (!isSearching) {
      setIsSearching(true);
      setDataLoading(true);
      filter_callback(
        saveData,
        SESSIONID,
        search_string,
        setIsSearching,
        setTotal,
        offset,
        limit
      );
      setTimeout(() => {
        setIsSearching(false);
        setDataLoading(false);
      }, 500);
    }
  }, [debouncedSearchTerm, offset, limit]);

  // const handleSubmit = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }

  //   setValidated(true);
  // };

  return (
    <>
      {headers.map((h, key) => (
        <th className={isSearching ? "loadingBlock" : ""} key={key}>
          {h.type == "text" ? (
            <Block className="filterControll">
              <Form.Control
                required
                type="text"
                placeholder="ALL"
                onChange={(e) => {
                  saveFilterValues({
                    ...filter_values,
                    [h.filter]: e.target.value,
                  });
                }}
                readonly={isSearching ? 1 : false}
              />
            </Block>
          ) : h.type == "date" ? (
            <FlexBlock className="dateRangeFilter">
              <DataInput
                short
                clear
                placeholder="FROM"
                className="dateFrom"
                callback={(e) => {
                  // console.log(e);
                  const formDate = formatDate(e);
                  saveFilterValues({
                    ...filter_values,
                    [h.filterFrom]: formDate,
                  });
                }}
                readonly={isSearching ? 1 : false}
              />
              <DataInput
                short
                clear
                placeholder="TO"
                className="dateTo"
                callback={(e) => {
                  // console.log(e);
                  const formDate = formatDate(e);
                  saveFilterValues({
                    ...filter_values,
                    [h.filterTo]: formDate,
                  });
                }}
                readonly={isSearching}
              />
            </FlexBlock>
          ) : h.type == "select" ? (
            <StatusesSelect
              {...props}
              saveFilterValues={(values) => {
                setSelectedStatuses(values);
              }}
            />
          ) : (
            <></>
          )}
        </th>
      ))}

      {isSearching ? (
        <FlexBlock
          justify="center"
          align="center"
          className="loadingSpinnerBlock"
        >
          <Spinner animation="grow" />
        </FlexBlock>
      ) : (
        <></>
      )}
    </>
  );
  // return (
  //   <Form noValidate validated={validated} onSubmit={handleSubmit}>
  //     <Form.Row>
  //       <Form.Group md="4" controlId="validationCustom01">
  //         <Form.Label>First name</Form.Label>
  //         <Form.Control
  //           required
  //           type="text"
  //           placeholder="First name"
  //           defaultValue="Mark"
  //         />
  //         <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  //       </Form.Group>
  //       <Form.Group md="4" controlId="validationCustom02">
  //         <Form.Label>Last name</Form.Label>
  //         <Form.Control
  //           required
  //           type="text"
  //           placeholder="Last name"
  //           defaultValue="Otto"
  //         />
  //         <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  //       </Form.Group>
  //       <Form.Group md="4" controlId="validationCustomUsername">
  //         <Form.Label>Username</Form.Label>
  //         <InputGroup>
  //           <InputGroup.Prepend>
  //             <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
  //           </InputGroup.Prepend>
  //           <Form.Control
  //             type="text"
  //             placeholder="Username"
  //             aria-describedby="inputGroupPrepend"
  //             required
  //           />
  //           <Form.Control.Feedback type="invalid">
  //             Please choose a username.
  //           </Form.Control.Feedback>
  //         </InputGroup>
  //       </Form.Group>
  //     </Form.Row>
  //     <Form.Row>
  //       <Form.Group md="6" controlId="validationCustom03">
  //         <Form.Label>City</Form.Label>
  //         <Form.Control type="text" placeholder="City" required />
  //         <Form.Control.Feedback type="invalid">
  //           Please provide a valid city.
  //         </Form.Control.Feedback>
  //       </Form.Group>
  //       <Form.Group md="3" controlId="validationCustom04">
  //         <Form.Label>State</Form.Label>
  //         <Form.Control type="text" placeholder="State" required />
  //         <Form.Control.Feedback type="invalid">
  //           Please provide a valid state.
  //         </Form.Control.Feedback>
  //       </Form.Group>
  //       <Form.Group md="3" controlId="validationCustom05">
  //         <Form.Label>Zip</Form.Label>
  //         <Form.Control type="text" placeholder="Zip" required />
  //         <Form.Control.Feedback type="invalid">
  //           Please provide a valid zip.
  //         </Form.Control.Feedback>
  //       </Form.Group>
  //     </Form.Row>
  //     <Form.Group>
  //       <Form.Check
  //         required
  //         label="Agree to terms and conditions"
  //         feedback="You must agree before submitting."
  //       />
  //     </Form.Group>
  //     <Button type="submit">Submit form</Button>
  //   </Form>
  // );
};

export default Filter;
