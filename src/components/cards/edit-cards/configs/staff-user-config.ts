import { CardConfig } from "../../shared/types";

export const staffUserEditConfig: CardConfig = {
  title: "editStaffUser",
  type: "staff-user",
  sections: [
    {
      id: "basic",
      title: "basicInfo",
      fields: [
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
    },
    {
      id: "qualifications",
      title: "qualifications",
      fields: [
        {
          name: "qualifiedProducts",
          label: "qualifications",
          type: "multiselect",
          gridWidth: 12,
          options: [] // Will be populated dynamically
        }
      ]
    }
  ],
};