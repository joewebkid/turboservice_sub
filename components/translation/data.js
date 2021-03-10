const en = (a = {}) => {
  return {
    stat_30: "Statistics for 30 days",
    total_repair_orders_done: "Total repair orders done",
    serviced_vehicles: "Serviced vehicles",
    average_norm_hours: "Average norm hours",
    average_vehicle_repair_time: "Average vehicle repair time",
    repair_orders: "Repair orders",
    from: "FROM",
    to: "TO",
    status: "Status",
    contractor_order: "Contractor order #",
    repair_order: "Repair order #",
    jobs_started: "Jobs started",
    jobs_done: "Jobs done",
    vehicle: "Vehicle",
    vin: "VIN",
    plate: "Plate#",
    edit: "Edit",
    repair_orders_list: "Repair orders list",
    repair_order_for_tlt_reques: `Repair order for TLT request # ${a.repair_request_order_id} (repair order # ${a.repair_order_id}) from ${a.date}`,
    registration: "Registration:",
    tlt_contact: "TLT contact:",
    manufacture_year: "Manufacture year:",
    plate: "Plate #",
    garage: "GARAGE #:",
    repair_request: "Repair request",
    start_jobs: "Start Jobs",
    cancel_start: "Cancel Start",
    repair_order_done: "Repair order done",
    contractor_repair_order: "Contractor repair order #",
    milage: "Milage",
    order_type: "Order type",
    start_jobs: "Start jobs",
    estimated_time_end_of_jobs: "Estimated time end of jobs",
    jobs_done: "Jobs done",
    jobs: "Jobs",
    load_From_file: "Load list from file",
    you_can_load_template: "You can load template",
    delete_all: "Delete all",
    jobs_name: "Jobs name:",
    norm_hours: "Norm hours",
    amount: "Amount",
    price: "Price",
    sum: "Sum",
    spare_parts_and_materials: "Spare parts and materials",
    product_code: "Product code:",
    brand: "Brand",
    product_name: "Product name:",
    total: "Total",
    vat: "VAT",
    grand_total: "Grand Total:",
    recommendation: "Recommendation",
    fix_before: "Fix before",
    attached_files: "Attached files",
    upload_file: "Upload file",
    logout: "Logout",
    tlt_Repair_orders: "TLT Repair orders",
    login: "Login",
    restore: "Restore",
    to_sign: "To sign in form",
    session_expired: "Your session time is expired",
    restore_password: "Restore password",
    restore_password_to: "Restore password",
    attention: "Attention",
    contact_support: "Contact support",
    sure_cancel_start: "Warning. Are you sure cancel start repair order?",
    sure_finish_order: "Are you sure you want to finish this order?",
    please_select: "Please select",
    wheels_tightening_required: "Wheels tightening required",
    wheels_tightening_error:
      "Select the type of wheels tightening, before finishing order",

    login_placeholder: "Login *",
    password: "Password",
    all: "ALL",
    from: "FROM",
    to: "TO",
    clear: "Clear",
    show: "Show",
    total_records: "Total records:",
    contactor: "Contractor",
    contactor_warranty: "Contractor warranty",
    new: "NEW",
    done: "DONE",
    in_progress: "IN PROGRESS",
    load_from_file: "Load from file",
    you_can_load_template:
      'You can automate and simplify the entry of work, spare parts, materials and recommendations into the work order. Set up your software to export repair orders in files according to the XML template. So you can register repair order in this system by pressing one button "Load from file".',
    download_template: "Download a sample XML file.",

    delete_all_confirm: "Are you sure want to delete all records?",
    please_fill_all: "Please fill in all required fields.",
    please_add_job: "Please add at least one job.",
    sure_finish_order_wheel_tight_no: `Attention! The option of wheels tightening  was set to "Not required". If you want to change this value, then click on the "Cancel" button, select the required wheels tightening option and again select «Repair order done». If everything is correct, then click on the button "OK".`,

    NEW: "NEW",
    "IN PROGRESS": "IN PROGRESS",
    DONE: "DONE",

    not_valid_data:
      "The changes you made will not be saved, please fill in all the required fields",

    sure_delete_record: "Are you sure want to delete record?",

    VEHICLE_LAST_TO1: "Last TO",
  };
};

const ru = (a = {}) => {
  return {
    stat_30: "Статистика за 30 дней",
    total_repair_orders_done: "Всего выполнено заказ-нарядов",
    serviced_vehicles: "Обслужено транспортных средств",
    average_norm_hours: "Среднее кол. нормочасов",
    average_vehicle_repair_time: "Среднее время ремонта",
    repair_orders: "Заказ-наряды",
    from: "ОТ",
    to: "ДО",
    status: "Статус",
    contractor_order: "№ заказ-наряда подрядчика",
    repair_order: "№ заказ-наряда TLT",
    jobs_started: "Работы начаты",
    jobs_done: "Работы выполнены",
    vehicle: "Транспортное средство",
    vin: "VIN",
    plate: "Гос.№",
    edit: "Редактировать",
    repair_orders_list: "Список заказ-нарядов",
    repair_order_for_tlt_reques: `Заказ-наряд по заявке TLT №${a.repair_request_order_id} (заказ-наряд № ${a.repair_order_id}) от ${a.date}`,
    registration: "Первая регистрация:",
    tlt_contact: "Контактное лицо ТЛТ:",
    manufacture_year: "Год производства:",
    plate: "Гос.№",
    garage: "Гаражный №",
    repair_request: "Заявка на ремонт",
    cancel_start: "Отменить начало работ",
    repair_order_done: "Выполнен",
    contractor_repair_order: "№ заказ-наряда подрядчика",
    milage: "Пробег",
    order_type: "Тип заказ-наряда",
    start_jobs: "Начало работ",
    estimated_time_end_of_jobs: "Планируемое время окончания",
    jobs_done: "Работы выполнены",
    jobs: "Работы",
    load_From_file: "Загрузить список из файла",
    you_can_load_template: "Образец - шаблон для загрузки",
    delete_all: "Удалить все ",
    jobs_name: "Название работы",
    norm_hours: "Нормочасы",
    amount: "Количество",
    price: "Цена",
    sum: "Сумма",
    spare_parts_and_materials: "Запчасти и материалы",
    product_code: "Код товара",
    brand: "Производитель",
    product_name: "Название товара",
    total: "Итого",
    vat: "НДС",
    grand_total: "Всего",
    recommendation: "Рекомендации",
    fix_before: "Устранить до",
    attached_files: "Прикрепленные файлы",
    upload_file: "Загрузить файл",
    logout: "Выйти",
    tlt_Repair_orders: "TLT заказ-наряды",
    login: "Войти",
    restore: "Восстановить",
    to_sign: "К форме входа",
    session_expired: "Ваша сессия истекла",
    restore_password: "Восстановить пароль",
    restore_password_to: "Восстановить пароль",
    attention: "Внимание",
    contact_support: "Служба поддержки",
    sure_cancel_start:
      "Внимание. Вы уверены, что хотите отменить начало работ?",
    sure_finish_order: "Вы уверены, что хотите завершить этот заказ?",
    please_select: "Не выбрано",
    wheels_tightening_required: "Требуется протяжка колес",
    wheels_tightening_error:
      "Выберите тип протяжка колес, прежде чем завершить заказ",

    login_placeholder: "Логин *",
    password: "Пароль",
    all: "ВСЕ",
    from: "ОТ",
    to: "ДО",
    clear: "Очистить",
    show: "Показать",
    total_records: "Всего записей:",
    contactor: "Субподрядчик",
    contactor_warranty: "Гарантия субподрядчика",
    new: "НОВЫЙ",
    done: "ГОТОВ",
    in_progress: "В РАБОТЕ",
    load_from_file: "Загрузить из файла",
    you_can_load_template: `Вы можете автоматизировать и упростить внесение работ, запчастей, материалов и рекомендаций в заказ-наряд. Для этого настройте в своей учетной системе выгрузку заказ-наряда в XML файл согласно образцу. Тогда Вы сможете загружать весь список нажатием одной кнопки "Загрузить из файла". `,
    download_template: "Скачать образец XML файла.",

    delete_all_confirm: "Вы уверены, что хотите удалить все записи?",
    please_fill_all: "Пожалуйста, заполните все обязательные поля.",
    please_add_job: "Пожалуйста, добавьте хотя бы одну работу.",
    sure_finish_order_wheel_tight_no: `Внимание! Выбран вариант протяжки колес "Не требуется". Если Вы хотите изменить это значение, то нажмите на кнопку "Отмена", выберите требуемый вариант протяжки и снова установите отметку о выполнении заказ-наряда. Если же всё корректно, то нажмите на кнопку "Ок".`,

    NEW: "НОВЫЙ",
    "IN PROGRESS": "В РАБОТЕ",
    DONE: "ГОТОВ",
    not_valid_data:
      "Внесенные изменения не сохранятся, пожалуйста, заполните все обязательные поля",

    sure_delete_record: "Вы уверены, что хотите удалить запись?",

    VEHICLE_LAST_TO1: "Последнее проведенное ТО1",
  };
};

const et = (a = {}) => {
  return {
    stat_30: "30 päeva statistika",
    total_repair_orders_done: "Kokku teostatud töökäskusid",
    serviced_vehicles: "Teenindatud transpordivahendeid",
    average_norm_hours: "Keskimine normtundide arv",
    average_vehicle_repair_time: "Keskmine remondi aeg",
    repair_orders: "Töökäsud",
    from: "Alates",
    to: "Kuni",
    status: "Staatus",
    contractor_order: "Töövõtja töökäsu nr",
    repair_order: "TLT töökäsu nr",
    jobs_started: "Tööd alustatud",
    jobs_done: "Töid teostatud",
    vehicle: "Transpordivahend",
    vin: "VIN",
    plate: "Reg.nr",
    edit: "Redigeeri",
    repair_orders_list: "Töökäskude loetelu",
    repair_order_for_tlt_reques: `Töökäsk TLT tellimuse nr  ${a.repair_request_order_id} alusel (töökäsk nr ${a.repair_order_id}) ,${a.date}`,
    registration: "Esmane registreerimine:",
    tlt_contact: "TLT kontaktisik",
    manufacture_year: "Väljalaskeaasta:",
    plate: "Reg.nr",
    garage: "Gar.nr",
    repair_request: "Remonditellimus",
    start_jobs: "Tööd alustatud",
    cancel_start: "Tühista tööde algus",
    repair_order_done: "Teostatud",
    contractor_repair_order: "Töövõtja töökäsu nr",
    milage: "Läbisõit",
    order_type: "Töökäsu tüüp",
    start_jobs: "Alusta tööd",
    estimated_time_end_of_jobs: "Planeeritud lõpetamise aeg",
    jobs_done: "Tööd lõpetatud",
    jobs: "Tööd",
    load_From_file: "Lae alla loetelu failist",
    you_can_load_template: "Allalaadimise faili näidis",
    delete_all: "Kustuta kõik",
    jobs_name: "Töö nimetus",
    norm_hours: "Normtunnid",
    amount: "Kogus",
    price: "Hind",
    sum: "Summa",
    spare_parts_and_materials: "Varuosad ja materjalid",
    product_code: "Kauba kood",
    brand: "Tootja",
    product_name: "Kauba nimetus",
    total: "Kokku",
    vat: "KM",
    grand_total: "Kokku km-ga",
    recommendation: "Soovitused",
    fix_before: "Kõrvaldada kuni",
    attached_files: "Lisatud manused",
    upload_file: "Lae üles fail",
    logout: "Logi välja",
    tlt_Repair_orders: "TLT remondi töökäsud",
    login: "Logi sisse",
    restore: "Taasta",
    to_sign: "Tagasi avalehele",
    session_expired: "Teie seansi aeg on lõppenud",
    restore_password: "Parooli taastamine",
    restore_password_to: "Taasta parool",
    attention: "Hoiatus",
    contact_support: "Tugi",
    sure_cancel_start: "Kas tühistada töökäsu tööde algusaeg?",
    sure_finish_order: "Kas lõpetada töökäsk?",
    please_select: "Palun vali",
    wheels_tightening_required: "Rataste pingutamine",
    wheels_tightening_error:
      "Enne töökäsu lõpetamist määra rataste pingutamise vajadus.",

    login_placeholder: "Kasutajatunnus *",
    password: "Parool",
    all: "Kõik",
    from: "Alates",
    to: "Kuni",
    clear: "Tühista",
    show: "Näita",
    total_records: "Kokku kirjeid",
    contactor: "Alltöövõtja",
    contactor_warranty: "Garantii vahele on lülitatud alltöövõtja",
    new: "Uus",
    done: "Teostatud",
    in_progress: "Töös",
    load_from_file: "Lae failist",
    you_can_load_template:
      "Saate automatiseerida ja lihtsustada tööde, varuosade, materjalide ja soovituste sisestamist eksportides töökäsu andmed XML formaadis vastavalt näidisele.",
    download_template: "Lae alla XML faili näidis.",

    delete_all_confirm: "Kas soovite kustutada kõik kirjed jäädavalt?",
    please_fill_all: "Palun täitke kõik kohustuslikud väljad.",
    please_add_job: "Palun lisa vähemalt üks töö.",
    sure_finish_order_wheel_tight_no: `Tähelepanu! Rataste pingutamise skeemi määramisel valitud "Mitte nõutav". Kui soovite seda väärtust muuta, siis vajutage "Tühista", valige nõutav variant ja vajutage uuesti nuppule "Teostatud". Juhul kui valik on korrektne, vajutage "OK"`,

    NEW: "UUS",
    "IN PROGRESS": "TÖÖS",
    DONE: "TEOSTATUD",
    not_valid_data:
      "Tehtud muudatusi ei salvestata, siis palun täitke kõik nõutud väljad",

    sure_delete_record: "Kas soovite kustutada kirje jäädavalt?",

    VEHICLE_LAST_TO1: "Last TO",
  };
};

const tMap = (l = "en", a) => {
  switch (l) {
    case "en":
      return en(a);
      break;
    case "et":
      return et(a);
      break;
    case "ru":
      return ru(a);
      break;

    default:
      return en(a);
      break;
  }
};

export const language = (l = "et") => {
  const from_store =
    typeof window !== "undefined" ? localStorage.getItem("lang") : "en";
  const language = from_store ? from_store : l;
  return language;
};

export const t = (slug, a = {}, l = "et") => {
  const lang = language(l);

  return tMap(lang, a)[slug] || slug;
};
