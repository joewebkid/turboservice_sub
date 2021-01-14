import React, { useEffect, useState } from "react";
import { Table, Button, Popover, OverlayTrigger } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { jobs_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import { useRouter } from "next/router";
import axios from "axios";
import CustomLink from "../../atoms/CustomLink";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import MessageToast from "./MessageToast";

const get_jobs = (callback, id, SESSIONID) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJobs/" +
        id +
        "?SESSIONID=" +
        SESSIONID
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const WorkorderJobs = Response["WorkorderContractJobs"];
      console.log(WorkorderJobs);
      callback(WorkorderJobs.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const set_job = (callback, id, SESSIONID, changedJobs, setMessage) => {
  const JOB_ID = changedJobs.JOB_ID;
  // delete changedJobs["JOB_ID"];

  axios
    .post(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJob/" +
        id +
        (JOB_ID ? "/" + JOB_ID : "") +
        "?SESSIONID=" +
        SESSIONID,
      changedJobs,
      {
        // auth: auth_data,
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
      const { WorkorderContractJob } = Response;
      setMessage({ type: "success", text: "success", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2000);
      callback(WorkorderContractJob.data);
    })
    .catch(function (error) {
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
      console.log(error);
    });
};
const addNew = (jobs, setJobs, jobs_struct) => {
  const titles = jobs_struct.map((s) => {
    return s.slug;
  });
  let empty_object = {};
  titles.forEach((key, index) => {
    empty_object[`${key}`] = "";
  });

  setJobs([...jobs, empty_object]);
};
// const changeHandler = (value, slug, setJobs, jobs, key) => {};

const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Load from file</Popover.Title>
    <Popover.Content>
      You can load <CustomLink href="#">template</CustomLink>
    </Popover.Content>
  </Popover>
);

const JobsSection = (props) => {
  const { SESSIONID } = props;
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);
  const [message, setMessage] = useState({});
  let tempArr = jobs;
  let jobsSum = {};

  const debouncedSearchTerm = useDebounce(jobs, 500);

  useEffect(() => {
    console.log("Come here", addNewStringFlag);

    if (SESSIONID && router && router.query && router.query.id) {
      if (addNewStringFlag) {
        setAddNewStringFlag(0);
        return;
      }

      if (jobs[changedStringId]) {
        const changedJobs = jobs[changedStringId];
        const isFull = !Object.keys(changedJobs).find(
          (e) => e != "JOB_ID" && !changedJobs[e]
        );

        if (isFull)
          set_job(
            console.log,
            router.query.id,
            SESSIONID,
            changedJobs,
            setMessage
          );
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_jobs(setJobs, router.query.id, SESSIONID, setMessage);
  }, [router]);

  return (
    <>
      {message.show ? <MessageToast {...message} /> : <></>}
      <Section className="text-center mb-1 relative">
        <FlexBlock justify="flex-end" className="mb-1">
          <FlexBlock>
            <label className="btn btn-secondary mr-1">
              Load from file
              <input
                id="exampleFormControlFile1"
                type="file"
                class="form-control-file"
                style={{ display: "none" }}
              ></input>
            </label>
            <OverlayTrigger trigger="click" placement="left" overlay={popover}>
              <Button
                variant="secondary"
                style={{
                  height: 38,
                }}
              >
                ?
              </Button>
            </OverlayTrigger>
          </FlexBlock>
        </FlexBlock>

        <Block className="text-left w500">Jobs</Block>

        <Table>
          <thead>
            <tr>
              {jobs_struct.map((struct) =>
                struct.type != "hidden" ? (
                  <th
                    scope="col"
                    style={struct.width ? { width: struct.width } : {}}
                  >
                    {struct.title}
                  </th>
                ) : (
                  <></>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, key) => (
              <tr key={key}>
                {jobs_struct.map((struct) => {
                  if (!jobsSum[struct.slug]) jobsSum[struct.slug] = 0;
                  jobsSum[struct.slug] =
                    jobsSum[struct.slug] + Number(job[struct.slug]);

                  if (struct.type != "hidden")
                    return (
                      <td scope="col">
                        <input
                          value={job[struct.slug]}
                          className="form-control"
                          placehorder="repair order"
                          onChange={(e) => {
                            tempArr[key][struct.slug] = e.target.value;

                            setJobs([...tempArr]);
                            setChangedStringId(key);
                          }}
                        />
                      </td>
                    );
                })}
              </tr>
            ))}
            <tr>
              {jobs_struct.map((struct) => {
                const num = Number(Number(jobsSum[struct.slug]).toFixed(2));
                if (struct.type != "hidden")
                  return (
                    <td scope="col">
                      <Block className={struct.hide ? "d-none" : "show"}>
                        {!num ? 0 : num}
                      </Block>
                    </td>
                  );
              })}
            </tr>
          </tbody>
        </Table>
        <Button
          size="sm"
          variant="success"
          title="Add new"
          className="addNewString"
          onClick={() => {
            setAddNewStringFlag(1);
            addNew(jobs, setJobs, jobs_struct);
          }}
        >
          +
        </Button>
      </Section>
    </>
  );
};

export default JobsSection;
