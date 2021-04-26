import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Block from "../Block";

const SelectInput = (props) => {
  const { options, saveFilterValues, header, value, style } = props;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  // console.log(selected, value);
  // saveFilterValues

  // useEffect(() => {
  //   console.log(options, value);
  // }, [value]);
  useEffect(() => {
    if (options && typeof options[0] == "object") {
      let opt_active = options.find((e) => Object.entries(e)[0][0] == value);
      setSelected(Object.entries(opt_active)[0][1]);
    } else {
      setSelected(value);
    }
  }, [options]);

  // useEffect(() => {
  //   // if (Object.keys(selected).length) {
  //   //   saveFilterValues(Object.keys(selected).filter((e) => selected[e]));
  //   // } else saveFilterValues("");
  // }, [selected]);

  return (
    <Block className="selectInput">
      {open ? (
        <Block
          className="fadeForClose"
          onClick={() => {
            setOpen(!open);
          }}
        ></Block>
      ) : (
        <></>
      )}
      <Dropdown show={open} drop="bottom">
        <Dropdown.Toggle
          // variant="success"
          id="dropdown-basic"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <Block className="selectTitleContainer" style={style ? style : {}}>
            {selected ? selected : header}
          </Block>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {!options ? (
            <></>
          ) : (
            options.map((option, key) => {
              let title, value;
              if (typeof option == "object") {
                title = Object.entries(option)[0][1];
                value = Object.entries(option)[0][0];
              } else {
                title = value = option;
              }

              return (
                <Dropdown.Item
                  onClick={(e) => {
                    setSelected(title);
                    setOpen(!open);
                    saveFilterValues(value);

                    // setSelected({
                    //   ...selected,
                    //   [status.ORDER_STATUS_ID]:
                    //     selected[status.ORDER_STATUS_ID] != undefined
                    //       ? !selected[status.ORDER_STATUS_ID]
                    //       : true,
                    // });
                  }}
                  key={key}
                >
                  <input
                    type="checkbox"
                    style={{ marginRight: 10 }}
                    id="exampleCheck1"
                    checked={selected == value || selected == title}
                    name={status.option}
                  />
                  {title}
                </Dropdown.Item>
              );
            })
          )}
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              setSelected(false);
              saveFilterValues("");
              setOpen(!open);
            }}
          >
            CLEAR <span style={{ float: "right" }}>✕</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Block>
  );
};

export default SelectInput;
