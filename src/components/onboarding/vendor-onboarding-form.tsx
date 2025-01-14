import { useState } from 'react';
import { useForm, FormProvider, useFormState, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const vendorSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  description: z.string().min(1, 'Description is required'),
  vendorType: z.enum(['tours', 'lessons', 'rentals', 'tickets']),
  website: z.string().url('Invalid URL').optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(5, 'Invalid postal code'),
  logoUrl: z.string().url('Invalid URL').optional()
});

function ErrorMessage({ name, errors = {} }) {
  const error = errors?.[name];
  return error ? (
    <p className="text-red-500 text-sm mt-1">
      {error.message}
    </p>
  ) : null;
}

function SubmitButton({ control }) {
  const { isSubmitting } = useFormState({ control });
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
    >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export default function VendorOnboardingForm() {
  const [step, setStep] = useState(1);
  const defaultValues = {
    businessName: '',
    description: '',
    vendorType: 'tours',
    website: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    logoUrl: ''
  };
  
  const methods = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues,
    mode: 'onChange'
  });

  const { handleSubmit, control, useFormState = {} } = methods;
  const { errors = {} } = useFormState;
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/v1/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create vendor');
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const FormInput = ({ 
    name, 
    label, 
    type = 'text', 
    className = "w-full p-2 rounded border bg-background-glass",
    options = [] 
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {options.length > 0 ? (
              <select 
                {...field} 
                className={className}
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...field}
                type={type}
                className={className}
              />
            )}
            <ErrorMessage name={name} errors={errors} />
          </>
        )}
      />
    </div>
  );

  const BusinessInfoStep = () => (
    <div className="space-y-4">
      <FormInput 
        name="businessName" 
        label="Business Name" 
      />
      <FormInput 
        name="vendorType" 
        label="Business Type" 
        type="select"
        options={[
          { value: 'tours', label: 'Tours' },
          { value: 'lessons', label: 'Lessons' },
          { value: 'rentals', label: 'Rentals' },
          { value: 'tickets', label: 'Tickets' }
        ]} 
      />
      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <>
              <textarea
                {...field}
                rows={4}
                className="w-full p-2 rounded border bg-background-glass"
              />
              <ErrorMessage name="description" errors={errors} />
            </>
          )}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Next
        </button>
      </div>
    </div>
  );

  const ContactInfoStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput 
          name="email" 
          label="Email" 
          type="email" 
        />
        <FormInput 
          name="phone" 
          label="Phone" 
          type="tel" 
        />
      </div>
      <FormInput 
        name="website" 
        label="Website" 
        type="url"
      />
      <FormInput 
        name="logoUrl" 
        label="Logo URL" 
        type="url"
      />
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Next
        </button>
      </div>
    </div>
  );

  const LocationInfoStep = () => (
    <div className="space-y-4">
      <FormInput 
        name="address" 
        label="Street Address" 
      />
      <div className="grid grid-cols-2 gap-4">
        <FormInput 
          name="city" 
          label="City" 
        />
        <FormInput 
          name="state" 
          label="State" 
        />
      </div>
      <FormInput 
        name="postalCode" 
        label="Postal Code" 
      />
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back
        </button>
        <SubmitButton control={control} />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background-glass backdrop-blur-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && <BusinessInfoStep />}
          {step === 2 && <ContactInfoStep />}
          {step === 3 && <LocationInfoStep />}
        </form>
      </FormProvider>
    </div>
  );
}