import { CardConfig } from "../../shared/types";

export const vendorConfig: CardConfig = {
    title: 'editVendor',
    type: 'vendor',
    sections: [
      {
        id: 'header',
        title: '',
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
            fullWidth: true
          },
          {
            name: 'vendorType',
            label: 'vendorType',
            type: 'select',
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
            fullWidth: true
          },
          {
            name: 'phone',
            label: 'phone',
            type: 'tel',
            required: true,
            fullWidth: true
          },
          {
            name: 'website',
            label: 'website',
            type: 'url',
            fullWidth: true
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
    ],
    
  };