import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";

const StatusesSelect = (props) => {
  const { statuses, saveFilterValues } = props;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({});
  // saveFilterValues

  useEffect(() => {
    if (Object.keys(selected).length) {
      saveFilterValues(Object.keys(selected).filter((e) => selected[e]));
    } else saveFilterValues("");
  }, [selected]);

  return (
    <Dropdown show={open} drop="left">
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        onClick={() => {
          setOpen(!open);
        }}
      >
        Status
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {statuses.map((status, key) => (
          <Dropdown.Item
            onClick={(e) => {
              setSelected({
                ...selected,
                [status.ORDER_STATUS_ID]:
                  selected[status.ORDER_STATUS_ID] != undefined
                    ? !selected[status.ORDER_STATUS_ID]
                    : true,
              });
            }}
            key={key}
          >
            <input
              type="checkbox"
              style={{ marginRight: 10 }}
              id="exampleCheck1"
              checked={selected[status.ORDER_STATUS_ID]}
              name={status.ORDER_STATUS_NAME}
            />
            {status.ORDER_STATUS_NAME}
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={() => {
            setOpen(!open);
          }}
        >
          Закрыть<span style={{ float: "right" }}>✕</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default StatusesSelect;
