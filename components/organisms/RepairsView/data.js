export const jobs_struct = [
  {
    title: "Jobs name",
    width: "100%",
    slug: "JOB_NAME",
    type: "string",
    xmlName: "name",
    hide: true,
    required: 1,
    t: "jobs_name",
    type_cab: false,
  },
  {
    title: "Norm hours",
    slug: "JOB_NORM_HOUR",
    type: "number",
    style: { width: 90 },
    xmlName: "norm_hour",
    default: "1.00",
    required: 1,
    t: "norm_hours",
    type_cab: "orders",
  },
  {
    title: "Amount",
    slug: "JOB_AMOUNT",
    type: "number",
    style: { width: 80 },
    xmlName: "amount",
    default: "1.00",
    required: 1,
    t: "amount",
    type_cab: false,
  },
  {
    title: "Price",
    slug: "JOB_PRICE",
    type: "number",
    style: { width: 80 },
    xmlName: "price",
    default: "0.00",
    required: 1,
    t: "price",
    type_cab: "orders",
  },
  {
    title: "Id",
    slug: "JOB_ID",
    type: "hidden",
  },
];
// JOB_ID
// JOB_NAME
// JOB_NORM_HOUR
// JOB_AMOUNT
// JOB_PRICE

// JOB_AMOUNT: "1.0000";
// JOB_ID: 8215;
// JOB_NAME: "Validaatorite hooldus";
// JOB_NORM_HOUR: "1.0000";
// JOB_PRICE: ".0000";
// REQUEST_NUMBER: "47968";
export const materials = [
  {
    title: "Product code",
    hide: true,
    slug: "PART_CODE",
    style: { minWidth: 155, width: "100%" },
    type: "string",
    required: 1,
    t: "product_code",
    type_cab: false,
  },
  {
    title: "brand",
    hide: true,
    style: { minWidth: 200, width: "100%" },
    slug: "PART_BRAND",
    required: 1,
    t: "brand",
    type_cab: false,
  },
  {
    title: "Product name",
    hide: true,
    slug: "PART_NAME",
    style: { minWidth: 480, width: "100%" },
    type: "string",
    required: 1,
    t: "product_name",
    type_cab: false,
  },
  {
    title: "Amount",
    style: { width: 80 },
    slug: "PART_AMOUNT",
    type: "number",
    default: "1.00",
    required: 1,
    t: "amount",
    type_cab: false,
  },
  {
    title: "Price",
    style: { width: 80 },
    slug: "PART_PRICE",
    type: "number",
    default: "0.00",
    required: 1,
    t: "price",
    type_cab: "orders",
  },
  {
    title: "Id",
    slug: "PART_ID",
    type: "hidden",
    type_cab: "orders",
  },
];
// PART_ID
// PART_CODE
// PART_BRAND
// PART_NAME
// PART_AMOUNT
// PART_PRICE

// Product code	brand	Product name	Amount	Price	Summ
export const recomendation = [
  {
    title: "Recommendation",
    slug: "ADVICE_TEXT",
    type: "text",
    // style: { width: "88%" },
    required: 1,
    t: "recommendation",
  },
  {
    title: "Fix before",
    slug: "ADVICE_FIX_BEFORE",
    type: "date",
    style: { width: 132 },
    t: "fix_before",
  },
  {
    title: "Id",
    slug: "ADVICE_ID",
    type: "hidden",
  },
];
// Recommendation	Fix before
// ADVICE_TEXT
// ADVICE_FIX_BEFORE
