export const USER_ROLES: Array<string> = [
  "ADMIN",
  "SERVICE_EMPLOYEE",
  "DISTRIBUTOR",
  "GAE",
  "GJE",
  "GCM",
  "CONSUMER",
  "EMBED",
  "QC",
];

export const MOTOR_TYPE = {
  surface: "Surface",
  submersible: "Submersible",
};

export const MOTOR_CATEGORY = {
  ac: "AC",
  dc: "DC",
};

export const MOTOR_HP = [1, 2, 3, 5, 7.5, 10, 12.5, 15, 20];

export const MOTOR_PURPOSE = {
  irrigation: "IRRIGATION",
  drinking: "DRINKING",
};

export const RMS_UPDATE_QUERY = {
  customer: "Customer",
  device: "Device",
  security: "Security",
  imei: "Imei",
  distributor: "Distributor",
};

export const DISTRIBUTOR_UPDATE_QUERY = {
  personal: "Personal",
  security: "Security",
  business: "Business",
};

export const SERVICE_ENG_UPDATE_QUERY = {
  personal: "Personal",
  distributor: "Distributor",
  security: "Security",
};

export const ADMIN_UPDATE_QUERY = {
  personal: "Personal",
  security: "Security",
};

export const TICKET_PRIORITY = {
  high: {
    value: "HIGH",
    noOfDays: 1,
  },
  medium: {
    value: "MEDIUM",
    noOfDays: 3,
  },
  low: {
    value: "LOW",
    noOfDays: 10,
  },
};

export const SERVICE_TICKET_STATUS = {
  OVERDUE: "Overdue",
  UNASSIGNED: "Unassigned",
  RESOLVED: "Resolved",
  ONGOING: "Ongoing",
};

export const TICKET_CHAT_TYPE = {
  FILE: "File",
  TEXT: "Text",
  INFORMATION: "Information",
};

export const MIME_TYPES_TICKETS = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};
