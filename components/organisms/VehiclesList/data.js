export const headers = [
  {
    title: "TLT REQUEST #",
    type: "text",
    slug: "REQUEST_NUMBER",
    filter: "RequestNumber",
  },
  {
    title: "Repair order #",
    type: "text",
    slug: "WORKORDER_NUMBER",
    filter: "RepairOrderNumber",
  },
  {
    title: "Request date",
    type: "date",
    slug: "REQUEST_DATE",
    filterTo: "RequestDateTo",
    filterFrom: "RequestDateFrom",
  },
  {
    title: "Jobs started",
    type: "date",
    slug: "JOB_STARTED_DATE",
    filterTo: "JobStartedTo",
    filterFrom: "JobStartedFrom",
  },
  {
    title: "Expected issue",
    type: "date",
    slug: "EXPECTED_ISSUE_DATE",
    filterTo: "JobStartedTo",
    filterFrom: "JobStartedFrom",
  },
  {
    title: "Vehicle",
    type: "text",
    slug: "VEHICLE",
    style: { minWidth: 150 },
    filter: "VehicleContains",
  },
  {
    title: "VIN",
    type: "text",
    slug: "VIN",
    filter: "VIN",
  },
  {
    title: "Plate#",
    type: "text",
    slug: "PLATE_NUMBER",
    filter: "Plate",
  },
  {
    title: "Status",
    type: "select",
    slug: "ORDER_STATUS_NAME",
    filter: "OrderStatusID",
  },
];

export const entity_sizes = [1, 3, 10, 25, 50, 100];
