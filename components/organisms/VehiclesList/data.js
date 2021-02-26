export const headers = [
  //   VEHICLE_ID	Идентификатор
  // VEHICLE	Марка и модель ТС
  // VIN	Идентификационный номер ТС
  // PLATE_NUMBER	Регистрационный знак ТС
  // VEHICLE_CATEGORY_ID	Идентификатор категории ТС
  // VEHICLE_CATEGORY_NAME	Категория ТС
  // VEHICLE_REGISTRATION_DATE	Дата регистрации ТС
  // VEHICLE_LAST_REPAIR_DATE	Дата последнего ремонта ТС
  // VEHICLE_MILEAGE	Пробег ТС
  // VEHICLE_LAST_TO1	Последнее проведенное ТО1
  // VIN, Plate, VehicleContains, VehicleCategoryID, VehicleRegistrationDateFrom, VehicleRegistrationDateTo, VehicleLastRepairDateFrom, VehicleLastRepairDateTo, LastTO1Contains
  // {
  //   title: "VEHICLE ID #",
  //   type: "text",
  //   slug: "VEHICLE_ID",
  //   filter: false,
  //   t: "VEHICLE_ID",
  // },
  {
    title: "VIN",
    type: "text",
    slug: "VIN",
    filter: "VIN",
    t: "VIN",
  },
  {
    title: "PLATE NUMBER",
    type: "text",
    slug: "PLATE_NUMBER",
    filter: "PLATE_NUMBER",
    t: "PLATE_NUMBER",
  },
  {
    title: "Vehicle",
    type: "text",
    slug: "VEHICLE",
    filter: "VehicleContains",
    t: "VEHICLE",
  },
  {
    title: "VEHICLE REGISTRATION DATE",
    type: "date",
    slug: "VEHICLE_REGISTRATION_DATE",
    filterTo: "VehicleRegistrationDateTo",
    filterFrom: "VehicleRegistrationDateFrom",
    t: "VEHICLE_REGISTRATION_DATE",
  },
  {
    title: "VEHICLE LAST REPAIR DATE",
    type: "date",
    slug: "VEHICLE_LAST_REPAIR_DATE",
    filterTo: "VehicleLastRepairDateTo",
    filterFrom: "VehicleLastRepairDateFrom",
    t: "VEHICLE_LAST_REPAIR_DATE",
  },
  {
    title: "VEHICLE LAST TO1",
    type: "text",
    slug: "VEHICLE_LAST_TO1",
    filter: "LastTO1Contains",
    // style: { minWidth: 150 },
    t: "VEHICLE_LAST_TO1",
  },
];

export const entity_sizes = [1, 3, 10, 25, 50, 100];
