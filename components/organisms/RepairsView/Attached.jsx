import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { jobs_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import CustomLink from "../../atoms/CustomLink";

const get_files = (callback, id, SESSIONID) => {
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

const put_file = (callback, id, SESSIONID, file) => {
  var data = new FormData();
  data.append("File", file, file.name);

  axios
    .post(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderFile/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
      data,
      {
        content: data,
        headers: {
          "Content-type": "application/json",
          // "Content-type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkorderFile } = Response;

      callback(WorkorderFile.data);
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

const delete_file = (callback, id, SESSIONID, file_name, files) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderFile/" +
        id +
        "/" +
        file_name +
        "?SESSIONID=" +
        SESSIONID,
      {
        headers: {
          "Content-type": "application/json",
          // "Content-type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Message } = result;

      if (Message == "Ok")
        callback(files.filter((f) => f.FILE_NAME != file_name));
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

const _handleFileChange = (e, callback, id, SESSIONID) => {
  e.preventDefault();
  let file = e.target.files[0];
  put_file(callback, id, SESSIONID, file);
};

const Attached = (props) => {
  const { SESSIONID, status } = props;
  const router = useRouter();

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [files, setFiles] = useState([]);

  // console.log(files);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_files(setFiles, router.query.id, SESSIONID);
  }, [router]);

  return (
    <>
      <Section className="text-left mb-1">
        <Block className="text-left w500  mb-1">Attached files</Block>
        {files.map((f, key) => (
          <Block className="text-left" key={key}>
            <CustomLink target="_blank" href={f.FILE_URL}>
              {f.FILE_NAME}
            </CustomLink>

            {status != 2 ? (
              <span
                className="deleteLink"
                onClick={() => {
                  delete_file(
                    setFiles,
                    router.query.id,
                    SESSIONID,
                    f.FILE_NAME,
                    files,
                    key
                  );
                }}
              >
                ✕
              </span>
            ) : (
              <></>
            )}
          </Block>
        ))}
        {status != 2 ? (
          <label className="btn btn-secondary mr-1 mt-2">
            Upload file
            <input
              id="attachedFile"
              onChange={(e) =>
                _handleFileChange(
                  e,
                  (WorkorderFile) => setFiles([...files, WorkorderFile]),
                  router.query.id,
                  SESSIONID
                )
              }
              type="file"
              class="form-control-file"
              style={{ display: "none" }}
            ></input>
          </label>
        ) : (
          <></>
        )}
      </Section>
    </>
  );
};

export default Attached;
