export const jobs_struct = [
  {
    title: "Jobs name",
    width: "60%",
    slug: "JOB_NAME",
    type: "string",
    hide: true,
  },
  {
    title: "Norm hours",
    slug: "JOB_NORM_HOUR",
    type: "number",
  },
  {
    title: "Amount",
    slug: "JOB_AMOUNT",
    type: "number",
  },
  {
    title: "Price",
    slug: "JOB_PRICE",
    type: "number",
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
    style: { width: 155 },
  },
  {
    title: "brand",
    hide: true,
    slug: "PART_BRAND",
  },
  {
    title: "Product name",
    hide: true,
    slug: "PART_NAME",
    style: { width: 400 },
  },
  {
    title: "Price",
    style: { width: 80 },
    slug: "PART_PRICE",
  },
  {
    title: "Amount",
    style: { width: 80 },
    slug: "PART_AMOUNT",
  },
  {
    title: "Id",
    slug: "PART_ID",
    type: "hidden",
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
  },
  {
    title: "Fix before",
    slug: "ADVICE_FIX_BEFORE",
    type: "date",
    style: { width: 132 },
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
