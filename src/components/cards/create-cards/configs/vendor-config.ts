import { CardConfig } from "../../shared/types";

export const vendorConfig: CardConfig = {
  title: 'createVendor',
  type: 'vendor',
  sections: [
    {
      id: 'header',
      title: 'basicInfo',
      fields: [
        {
          name: 'businessName',
          label: 'businessName',
          type: 'text',
          required: true,
          fullWidth: true
        },
        {
          name: 'description',
          label: 'description',
          type: 'textarea',
          rows: 3,
          required: true,
          fullWidth: true
        },
        {
          name: 'vendorType',
          label: 'vendorType',
          type: 'select',
          required: true,
          options: [
            { value: 'tours', label: 'Tours' },
            { value: 'lessons', label: 'Lessons' },
            { value: 'rentals', label: 'Rentals' },
            { value: 'tickets', label: 'Tickets' }
          ],
          fullWidth: true
        }
      ]
    },
    {
      id: 'contact',
      title: 'contact',
      fields: [
        {
          name: 'email',
          label: 'email',
          type: 'email',
          required: true,
          fullWidth: true,
          validation: {
            pattern: '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$',
            message: 'Invalid email address'
          }
        },
        {
          name: 'phone',
          label: 'phone',
          type: 'tel',
          required: true,
          fullWidth: true,
          validation: {
            pattern: '^\\+?[1-9]\\d{1,14}$',
            message: 'Invalid phone number'
          }
        },
        {
          name: 'website',
          label: 'website',
          type: 'url',
          fullWidth: true,
          validation: {
            pattern: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\/\\w\\-\\.~:/?#\\[\\]@!\\$&\'\\(\\)\\*\\+,;=]*$',
            message: 'Invalid URL'
          }
        },
        {
          name: 'logoUrl',
          label: 'logoUrl',
          type: 'image',
          fullWidth: true,
          validation: {
            pattern: '^https?:\\/\\/.*\\.(png|jpg|jpeg|gif|svg)$',
            message: 'Invalid image URL'
          }
        }
      ]
    },
    {
      id: 'location',
      title: 'location',
      fields: [
        {
          name: 'address',
          label: 'address',
          type: 'address',
          required: true,
          fullWidth: true
        }
      ]
    }
  ]
};