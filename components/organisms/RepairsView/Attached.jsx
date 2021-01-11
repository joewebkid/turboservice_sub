import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { jobs_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import CustomLink from "../../atoms/CustomLink";

const get_files = (callback, id, SESSIONID, auth_data) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderFiles/" +
        id +
        "?SESSIONID=" +
        SESSIONID
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkorderFiles } = Response;

      callback(WorkorderFiles.data);
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};
const Attached = (props) => {
  const { SESSIONID } = props;
  const router = useRouter();

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      console.log(get_files(setFiles, router.query.id, SESSIONID));
  }, [router]);

  return (
    <>
      <Section className="text-center mb-1">
        <Block className="text-left w500">Attached files</Block>
        {files.map((f) => (
          <Block className="text-left">
            <CustomLink href={f.FILE_URL}>{f.FILE_NAME}</CustomLink>
            <span className="deleteLink">✕</span>
          </Block>
        ))}
        <input
          type="file"
          className="form-control-file"
          id="exampleFormControlFile1"
        ></input>
      </Section>
    </>
  );
};

export default Attached;
