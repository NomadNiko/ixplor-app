import { CardConfig } from "../../shared/types";

export const productConfig: CardConfig = {
  title: "createProduct",
  type: "product",
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
          gridWidth: 4,
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
          gridWidth: 2,
        },
        {
          name: "productPrice",
          label: "productPrice",
          type: "price",
          gridWidth: 2,
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
          gridWidth: 4,
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
          gridWidth: 4,
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
          gridWidth: 2,
          prefilled: true,
        },
        {
          name: "productStartTime",
          label: "startTime",
          type: "time",
          gridWidth: 2,
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
          gridWidth: 4,
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
          gridWidth: 4,
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
          gridWidth: 4,
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
          gridWidth: 4,
        },
      ],
    },
  ],
};
