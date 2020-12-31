import React, { useEffect, useState } from "react";
import { Table, Button, Popover, OverlayTrigger } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { jobs_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import { useRouter } from "next/router";
import axios from "axios";
import CustomLink from "../../atoms/CustomLink";

const get_jobs = (callback, id, SESSIONID) => {
  if (id && SESSIONID)
    axios
      .get(
        "https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkorderJobs/" +
          id +
          "?SESSIONID=" +
          SESSIONID,
        {
          auth: {
            username: "RID_vol",
            password: "1",
          },
        }
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { WorkorderJobs } = Response;

        callback(WorkorderJobs.data);
      })
      .catch(function (error) {
        console.log(error);
      });
};

const set_job = (callback, id, SESSIONID) => {
  if (id && SESSIONID)
    axios
      .post(
        "https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkorderJobs/" +
          id +
          "?SESSIONID=" +
          SESSIONID,
        {
          params: {
            username: "RID_vol",
          },
        },
        {
          auth: {
            username: "RID_vol",
            password: "1",
          },
          headers: {
            "Content-type": "application/json",
          },
        }
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { WorkorderJobs } = Response;

        callback(WorkorderJobs.data);
      })
      .catch(function (error) {
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
const changeHandler = (value, slug, setJobs, jobs, key) => {};

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
  let tempArr = jobs;
  let jobsSum = {};

  useEffect(() => {
    get_jobs(setJobs, router.query.id, SESSIONID);
  }, [router]);
  // console.log(jobs);
  return (
    <>
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
              {jobs_struct.map((e) => (
                <th scope="col" style={e.width ? { width: e.width } : {}}>
                  {e.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, key) => (
              <tr key={key}>
                {jobs_struct.map((struct) => {
                  if (!jobsSum[struct.slug]) jobsSum[struct.slug] = 0;
                  jobsSum[struct.slug] =
                    jobsSum[struct.slug] + Number(job[struct.slug]);

                  console.log(job[struct.slug]);
                  return (
                    <td scope="col">
                      <input
                        value={job[struct.slug]}
                        className="form-control"
                        placehorder="repair order"
                        onChange={(e) => {
                          tempArr[key][struct.slug] = e.target.value;

                          // set_job(console.log, router.query.id, SESSIONID);
                          setJobs([...tempArr]);
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              {jobs_struct.map((s) => {
                const num = Number(Number(jobsSum[s.slug]).toFixed(2));
                // console.log(typeof num);
                return (
                  <td scope="col">
                    <Block className={s.hide ? "d-none" : "show"}>
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
          onClick={() => addNew(jobs, setJobs, jobs_struct)}
        >
          +
        </Button>
      </Section>
    </>
  );
};

export default JobsSection;
