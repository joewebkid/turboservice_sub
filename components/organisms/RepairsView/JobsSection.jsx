import React, { useEffect, useState } from "react";
import { Table, Button, Popover, OverlayTrigger, Alert } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { jobs_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import { useRouter } from "next/router";
import axios from "axios";
import CustomLink from "../../atoms/CustomLink";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import MessageToast from "./MessageToast";
// import XMLParser from "react-xml-parser";
import { parseXml } from "./DomXml";
import { formatDateForPost } from "../../molecules/data";

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
      // console.log(WorkorderJobs);
      callback(WorkorderJobs.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const delete_jobs = (callback, id, SESSIONID, setMessage) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJobs/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response, Message } = result;
      const { WorkorderContractJobs } = Response;
      if (Message == "Ok") {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback({});
      }
    })
    .catch(function (error) {
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
    });
};

const set_job = (callback, id, SESSIONID, changedJobs, setMessage, jobs) => {
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
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response, Message } = result;
      const { WorkorderContractJob } = Response;

      if (Message == "Ok") {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback(
          jobs.map((e) => {
            return changedJobs.JOB_NAME == e.JOB_NAME
              ? WorkorderContractJob.data
              : e;
          })
        );
      } else {
        setMessage({ type: "error", text: "error", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
      }
    })
    .catch(function (error) {
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
      console.log(error);
    });
};

const delete_job = (callback, id, SESSIONID, JOB_ID, jobs) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractJob/" +
        id +
        "/" +
        JOB_ID +
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

      if (Message == "Ok") callback(jobs.filter((f) => f.JOB_ID != JOB_ID));
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};
const xmlLoad = async (
  e,
  setErrorText,
  setMessage,
  id,
  SESSIONID,
  errorText,
  refreshPage
) => {
  console.log(e);
  const file = e.target.files[0];

  const xml_text = await file.text();
  const xml = parseXml(xml_text);

  let Jobs = [];
  let Parts = [];
  let Recomendations = [];

  let JobsObj = [];
  let PartsObj = [];
  let RecomendationsObj = [];

  if (xml.getElementsByTagName("parsererror")[0]) {
    setErrorText(
      xml.getElementsByTagName("parsererror")[0].getElementsByTagName("div")[0]
        .innerHTML
    );

    setMessage({ type: "error", text: "error", show: true });
    setTimeout(() => {
      setMessage({});
    }, 2500);
  } else {
    setErrorText("");
    // console.log(xml.getElementsByTagName("jobs")[0]);
    Jobs = Object.values(xml.getElementsByTagName("job"));
    Parts = Object.values(xml.getElementsByTagName("part"));
    Recomendations = Object.values(xml.getElementsByTagName("recommendation"));
    // console.log(xml.getElementsByTagName("job")[0].getAttribute("name"));
    if (Jobs) {
      Jobs.map((e, key) => {
        JobsObj[key] = {};
        Object.values(e.attributes).map((e) => {
          JobsObj[key][e.name] = e.value;
        });
        axios
          .post(
            [
              process.env.NEXT_PUBLIC_URL,
              "/api-v2/Contractors/WorkorderContractJob/",
              id,
              "?SESSIONID=",
              SESSIONID,
            ].join(""),
            {
              JOB_ID: "",
              JOB_NORM_HOUR: JobsObj[key]["sum"],
              JOB_NAME: JobsObj[key]["name"],
              JOB_AMOUNT: JobsObj[key]["amount"],
              JOB_PRICE: JobsObj[key]["price"],
            },
            {
              headers: {
                "Content-type": "application/json",
              },
            }
          )
          .then(() => refreshPage());
      });
    }
    if (Parts) {
      console.log(Parts);
      Parts.map((e, key) => {
        PartsObj[key] = {};
        Object.values(e.attributes).map((e) => {
          PartsObj[key][e.name] = e.value;
        });
        axios
          .post(
            [
              process.env.NEXT_PUBLIC_URL,
              "/api-v2/Contractors/WorkorderContractPart/",
              id,
              "?SESSIONID=",
              SESSIONID,
            ].join(""),
            {
              PART_ID: "",
              PART_CODE: PartsObj[key]["code"],
              PART_BRAND: PartsObj[key]["brand"],
              PART_NAME: PartsObj[key]["name"],
              PART_AMOUNT: PartsObj[key]["amount"],
              PART_PRICE: PartsObj[key]["price"],
            },
            {
              headers: {
                "Content-type": "application/json",
              },
            }
          )
          .then(() => refreshPage());
      });
    }

    if (Recomendations) {
      Recomendations.map((e, key) => {
        RecomendationsObj[key] = {};
        Object.values(e.attributes).map((e) => {
          RecomendationsObj[key][e.name] = e.value;
        });
        axios
          .post(
            [
              process.env.NEXT_PUBLIC_URL,
              "/api-v2/Contractors/WorkorderAdvice/",
              id,
              "?SESSIONID=",
              SESSIONID,
            ].join(""),
            {
              ADVICE_ID: "",
              ADVICE_TEXT: RecomendationsObj[key]["content"],
              ADVICE_FIX_BEFORE: formatDateForPost(
                RecomendationsObj[key]["fixBefore"]
              ),
            },
            {
              headers: {
                "Content-type": "application/json",
              },
            }
          )
          .then(() => refreshPage());
      });
    }
  }
  // console.log(
  //   xml.getElementsByTagName("parsererror")[0].getElementsByTagName("div")[0]
  //     .innerHTML
  // );
  // console.log(xml.documentElement.nodeName);
  // console.log("parseXml", parseXml(xml_text));
  // console.log(xmlObject.getElementsByTagName("parsererror"));

  // console.log(xmlObject.getElementsByTagName("jobs")[0].childNodes);

  // xmlObject.getElementsByTagName("jobs")[0].children.map((e, key) => {
  //   console.log(e.attributes);
  // });
  // xmlObject.getElementsByTagName("parts")[0].children.map((e, key) => {
  //   console.log(e.attributes);
  // });
  // xmlObject
  //   .getElementsByTagName("recommendations")[0]
  //   .children.map((e, key) => {
  //     console.log(e.attributes);
  //   });
  // console.log(xmlObject.getElementsByTagName("jobs")[0].children);
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
      You can load{" "}
      <CustomLink
        href="https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkorderFile/167380/data.xml?SESSIONID=mW51KTrnMCQdyfeNWO3WTztjL00zJxrDQfDK7laTOZ8kxGpeu2jhGC8hekNzRWVh"
        target="_blank"
        download="template.xml"
      >
        template
      </CustomLink>
    </Popover.Content>
  </Popover>
);

const JobsSection = (props) => {
  const { SESSIONID, refresh, refreshPage, status } = props;
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [temp_jobs, setTempJobs] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);
  const [message, setMessage] = useState({});
  let tempArr = jobs;
  let jobsSum = {};

  const debouncedSearchTerm = useDebounce(temp_jobs, 500);

  useEffect(() => {
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
            setJobs,
            router.query.id,
            SESSIONID,
            changedJobs,
            setMessage,
            jobs
          );
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_jobs(setJobs, router.query.id, SESSIONID, setMessage);
  }, [router, refresh]);

  return (
    <>
      {message.show ? <MessageToast {...message} /> : <></>}
      <Section className="text-center mb-1 relative">
        <FlexBlock justify="flex-end" className="mb-1">
          <FlexBlock>
            {errorText ? (
              <Alert variant="danger " className="p-1 mb-2 mr-1">
                {errorText}
              </Alert>
            ) : (
              <></>
            )}

            <label className="btn btn-secondary mr-1">
              Load from file
              <input
                id="xmlFile"
                type="file"
                class="form-control-file"
                style={{ display: "none" }}
                onChange={(e) => {
                  xmlLoad(
                    e,
                    setErrorText,
                    setMessage,
                    router.query.id,
                    SESSIONID,
                    errorText,
                    refreshPage
                  );
                  e.target.value = null;
                }}
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

        <FlexBlock className="text-left w500" justify="space-between">
          Jobs
          {status != 2 ? (
            <Block
              className="text-left btn btn-link"
              onClick={() => {
                delete_jobs(
                  console.log,
                  router.query.id,
                  SESSIONID,
                  setMessage
                );
              }}
            >
              Удалить все
            </Block>
          ) : (
            <></>
          )}
        </FlexBlock>
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
              <>
                <tr key={key}>
                  {jobs_struct.map((struct) => {
                    if (!jobsSum[struct.slug]) jobsSum[struct.slug] = 0;
                    jobsSum[struct.slug] =
                      jobsSum[struct.slug] + Number(job[struct.slug]);

                    if (struct.type != "hidden")
                      return (
                        <td scope="col">
                          {status != 2 ? (
                            <input
                              value={job[struct.slug]}
                              className="form-control"
                              placehorder="repair order"
                              onChange={(e) => {
                                tempArr[key][struct.slug] = e.target.value;

                                setTempJobs([...tempArr]);
                                setChangedStringId(key);
                              }}
                            />
                          ) : (
                            <FlexBlock
                              style={{
                                width: 198,
                                float: "right",
                                paddingLeft: 10,
                              }}
                            >
                              {job[struct.slug]}
                            </FlexBlock>
                          )}
                        </td>
                      );
                  })}
                </tr>
                {status != 2 ? (
                  <tr>
                    <td className="strTr">
                      <Button
                        size="sm"
                        variant="danger"
                        title={"Delete " + job["JOB_NAME"]}
                        className="deleteNewString"
                        onClick={() => {
                          console.log("er");
                          delete_job(
                            setJobs,
                            router.query.id,
                            SESSIONID,
                            job["JOB_ID"],
                            jobs
                          );
                          // setAddNewStringFlag(1);
                          // addNew(jobs, setJobs, jobs_struct);
                        }}
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
              </>
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

        {status != 2 ? (
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
        ) : (
          <></>
        )}
      </Section>
    </>
  );
};

export default JobsSection;
