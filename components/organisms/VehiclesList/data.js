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
    filter: "VINContains",
    t: "VIN",
  },
  {
    title: "PLATE NUMBER",
    type: "text",
    slug: "PLATE_NUMBER",
    filter: "PlateContains",
    t: "plate",
  },
  {
    title: "Vehicle",
    type: "text",
    slug: "VEHICLE",
    filter: "VehicleContains",
    t: "vehicle",
  },
  {
    title: "Category",
    type: "select",
    style: { width: 70 },
    slug: "VEHICLE_CATEGORY_NAME",
    filter: "VehicleCategoryID",
    // filter: "VehicleCategoryNameContains",
    t: "Category",
  },
  {
    title: "VEHICLE REGISTRATION DATE",
    type: "date",
    slug: "VEHICLE_REGISTRATION_DATE",
    filterTo: "VehicleRegistrationDateTo",
    filterFrom: "VehicleRegistrationDateFrom",
    t: "Vehicle reg. date",
  },
  {
    title: "VEHICLE LAST REPAIR DATE",
    type: "date",
    slug: "VEHICLE_LAST_REPAIR_DATE",
    filterTo: "VehicleLastRepairDateTo",
    filterFrom: "VehicleLastRepairDateFrom",
    // t: "VEHICLE_LAST_REPAIR_DATE",
    t: "Vehicle last repair date",
  },
  {
    title: "VEHICLE LAST TO1",
    type: "select",
    slug: "VEHICLE_LAST_TO1",
    filter: "LastTO1Contains",
    style: { width: 200 },
    t: "VEHICLE_LAST_TO1",
  },
];

export const entity_sizes = [1, 3, 10, 25, 50, 100];
