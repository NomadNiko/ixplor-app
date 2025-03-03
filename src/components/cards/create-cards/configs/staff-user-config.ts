import { CardConfig } from "../../shared/types";

export const staffUserConfig: CardConfig = {
  title: "createStaffUser",
  type: "staff-user",
  sections: [
    {
      id: "basic",
      title: "basicInfo",
      fields: [
        {
          name: "vendorId",
          label: "vendor",
          type: "vendorSelect",
          required: true,
          gridWidth: 12,
        },
        {
          name: "name",
          label: "staffName",
          type: "text",
          required: true,
          gridWidth: 12,
        },
        {
          name: "email",
          label: "email",
          type: "email",
          gridWidth: 6,
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message: "Invalid email address"
          }
        },
        {
          name: "phone",
          label: "phone",
          type: "tel",
          gridWidth: 6,
          validation: {
            pattern: "^\\+?[1-9]\\d{1,14}$",
            message: "Invalid phone number"
          }
        }
      ],
    }
  ],
};