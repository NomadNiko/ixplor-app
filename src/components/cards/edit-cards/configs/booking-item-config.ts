import { CardConfig } from "../../shared/types";

export const bookingItemEditConfig: CardConfig = {
  title: "editBookingItem",
  type: "booking-item",
  sections: [
    {
      id: "basic",
      title: "basicInfo",
      fields: [
        {
          name: "productName",
          label: "productName",
          type: "text",
          required: true,
          fullWidth: true,
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "description",
          label: "description",
          type: "textarea",
          rows: 3,
          required: true,
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "imageUrl",
          label: "imageUrl",
          type: "fileUpload",
          gridWidth: 12,
        },
      ],
    },
    {
      id: "details",
      title: "details",
      fields: [
        {
          name: "price",
          label: "price",
          type: "price",
          required: true,
          gridWidth: 6,
          validation: {
            pattern: "^\\d+(\\.\\d{0,2})?$",
            message: "Please enter valid price",
            min: 0,
            max: 999999.99
          }
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "duration",
          label: "duration",
          type: "duration",
          required: true,
          gridWidth: 6,
          validation: {
            min: 30,
            message: "Duration must be at least 30 minutes"
          }
        }
      ],
    }
  ],
};