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
        },
        {
          name: "productDescription",
          label: "productDescription",
          type: "textarea",
          rows: 3,
          fullWidth: true,
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
          fullWidth: true,
        },
        {
          name: "productPrice",
          label: "productPrice",
          type: "price",
          required: true,
          validation: {
            min: 0,
          },
          fullWidth: true,
        },
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
          name: "productDuration",
          label: "duration",
          type: "duration",
          gridWidth: 6,
        },
        {
          name: "productRequirements",
          label: "requirements",
          type: "textarea",
          rows: 3,
          fullWidth: true,
        },
        {
          name: "productWaiver",
          label: "waiver",
          type: "textarea",
          rows: 3,
          fullWidth: true,
        },
        {
          name: "address",
          label: "address",
          type: "address",
          required: true,
          fullWidth: true,
        },
      ],
    },
  ],
};
