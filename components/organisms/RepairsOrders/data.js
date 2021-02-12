export const headers = [
  // {
  //   title: "TLT REQUEST #",
  //   type: "text",
  //   slug: "REQUEST_NUMBER",
  //   filter: "RequestNumber",
  // },2. Появилось поле CONTRACTOR_WORKORDER в журнале заказ-нарядов (номер или название в учетной системе подрядчика), ставить в таблице вторым, назвать "Our order #", параметр для поиска ContractorWorkorder.
  // {
  //   title: "TLT REQUEST #",
  //   type: "text",
  //   slug: "REQUEST_NUMBER",
  //   filter: "RequestNumber",
  // },
  {
    title: "Contractor order #",
    // title: "Our order #",
    type: "text",
    slug: "CONTRACTOR_WORKORDER",
    // filter: "ContractorWorkorder",
    filter: "ContractorWorkorderContains",
    t: "contractor_order",
  },
  {
    title: "Repair order #",
    type: "text",
    slug: "WORKORDER_NUMBER",
    // filter: "RepairOrderNumber",
    filter: "RepairOrderNumberContains",
    t: "repair_order",
  },
  // {
  //   title: "Request date",
  //   type: "date",
  //   slug: "REQUEST_DATE",
  //   filterTo: "RequestDateTo",
  //   filterFrom: "RequestDateFrom",
  // },
  {
    title: "Jobs started",
    type: "date",
    slug: "JOB_STARTED_DATE",
    filterTo: "JobStartedTo",
    filterFrom: "JobStartedFrom",
    t: "jobs_started",
  },
  {
    title: "Jobs done",
    type: "date",
    slug: "JOBS_DONE_DATE",
    filterTo: "JobDoneTo",
    filterFrom: "JobDoneFrom",
    t: "jobs_done",
  },
  // {
  //   title: "Expected issue",
  //   type: "date",
  //   slug: "EXPECTED_ISSUE_DATE",
  //   // filterTo: "JobStartedTo1",
  //   // filterFrom: "JobStartedFrom1",
  // },
  {
    title: "Vehicle",
    type: "text",
    slug: "VEHICLE",
    style: { minWidth: 150 },
    filter: "VehicleContains",
    t: "vehicle",
  },
  {
    title: "VIN",
    type: "text",
    slug: "VIN",
    // filter: "VIN",
    filter: "VINContains",
    t: "vin",
  },
  {
    title: "Plate#",
    type: "text",
    slug: "PLATE_NUMBER",
    // filter: "Plate",
    filter: "PlateContains",
    t: "plate",
  },
  // {
  //   title: "Status",
  //   type: "select",
  //   slug: "ORDER_STATUS_NAME",
  //   filter: "OrderStatusID",
  // },
];

export const entity_sizes = [10, 25, 50, 100];

export const status_map = [
  { title: "New" },
  { title: "New" },
  { title: "In progress" },
];
// RequestNumber,
// RepairOrderNumber,
// RequestDateFrom,
// RequestDateTo,
// JobStartedFrom,
// JobStartedTo,
// VehicleContains,
// VIN, Plate,
// OrderTypeID,
// OrderStatusID[].

// REQUEST_NUMBER	Идентификатор, номер заявки
// WORKORDER_NUMBER	Номер заказ-наряда
// REQUEST_DATE	Дата последнего изменения заявки
// JOB_STARTED_DATE	Дата начала работ
// EXPECTED_ISSUE_DATE	Дата предполагаемого окончания работ
// JOBS_DONE_DATE	Дата завершения работ
// VEHICLE	Марка и модель ТС
// VIN	Идентификационный номер ТС
// PLATE_NUMBER	Регистрационный знак ТС
// GARAGE_NUMBER	Гаражный номер ТС
// ORDER_TYPE_ID	Идентификатор типа заказ-наряда
// ORDER_TYPE_NAME	Название типа заказ-наряда
// ORDER_STATUS_ID	Идентификатор статуса заказ-наряда
// ORDER_STATUS_NAME	Название статуса заказ-наряда
// REQUEST_TEXT	Текст заявки (может быть многострочным)
