import { CardConfig } from "../../shared/types";

export const productConfig: CardConfig = {
  title: "editProduct",
  type: "product",
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
          name: "productType",
          label: "productType",
          type: "select",
          required: true,
          options: [
            { value: "tours", label: "Tours" },
            { value: "lessons", label: "Lessons" },
            { value: "rentals", label: "Rentals" },
            { value: "tickets", label: "Tickets" },
          ],
          gridWidth: 6,
        },
        {
          name: "productPrice",
          label: "productPrice",
          type: "price",
          gridWidth: 6,
          validation: {
            pattern: '^\\d+(\\.\\d{0,2})?$',
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
          name: "productDescription",
          label: "productDescription",
          type: "textarea",
          rows: 3,
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
          name: "productImageURL",
          label: "imageUrl",
          type: "image",
          fullWidth: true,
          validation: {
            pattern: "^https?:\\/\\/.*\\.(png|jpg|jpeg|gif|svg)$",
            message: "Invalid image URL",
          },
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        }
      ],
    },
    {
      id: "details",
      title: "details",
      fields: [
        {
          name: "productDate",
          label: "date",
          type: "date",
          gridWidth: 6,
          prefilled: true,
        }, 
        {
          name: "productStartTime",
          label: "startTime",
          type: "time",
          gridWidth: 6,
          prefilled: true,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "productDuration",
          label: "duration",
          type: "duration",
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "productRequirements",
          label: "requirements",
          type: "requirements",
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "productWaiver",
          label: "waiver",
          type: "textarea",
          rows: 2,
          gridWidth: 12,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "address",
          label: "address",
          type: "address",
          required: true,
          gridWidth: 12,
        },
      ],
    },
  ],
};
