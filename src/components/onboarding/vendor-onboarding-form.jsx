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

function ErrorMessage({ name, errors }) {
  return errors[name] ? (
    <p className="text-red-500 text-sm mt-1">
      {errors[name].message}
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

  const { handleSubmit, control, useFormState: { errors } } = methods;
  
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

  const BusinessInfoStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Business Name
        </label>
        <Controller
          name="businessName"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                className="w-full p-2 rounded border bg-background-glass"
              />
              <ErrorMessage name="businessName" errors={errors} />
            </>
          )}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Business Type
        </label>
        <Controller
          name="vendorType"
          control={control}
          render={({ field }) => (
            <>
              <select
                {...field}
                className="w-full p-2 rounded border bg-background-glass"
              >
                <option value="tours">Tours</option>
                <option value="lessons">Lessons</option>
                <option value="rentals">Rentals</option>
                <option value="tickets">Tickets</option>
              </select>
              <ErrorMessage name="vendorType" errors={errors} />
            </>
          )}
        />
      </div>
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="email"
                  className="w-full p-2 rounded border bg-background-glass"
                />
                <ErrorMessage name="email" errors={errors} />
              </>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="tel"
                  className="w-full p-2 rounded border bg-background-glass"
                />
                <ErrorMessage name="phone" errors={errors} />
              </>
            )}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Website
        </label>
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="url"
                className="w-full p-2 rounded border bg-background-glass"
              />
              <ErrorMessage name="website" errors={errors} />
            </>
          )}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Logo URL
        </label>
        <Controller
          name="logoUrl"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                type="url"
                className="w-full p-2 rounded border bg-background-glass"
              />
              <ErrorMessage name="logoUrl" errors={errors} />
            </>
          )}
        />
      </div>
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
      <div>
        <label className="block text-sm font-medium mb-1">
          Street Address
        </label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                className="w-full p-2 rounded border bg-background-glass"
              />
              <ErrorMessage name="address" errors={errors} />
            </>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            City
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  className="w-full p-2 rounded border bg-background-glass"
                />
                <ErrorMessage name="city" errors={errors} />
              </>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            State
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  className="w-full p-2 rounded border bg-background-glass"
                />
                <ErrorMessage name="state" errors={errors} />
              </>
            )}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Postal Code
        </label>
        <Controller
          name="postalCode"
          control={control}
          render={({ field }) => (
            <>
              <input
                {...field}
                className="w-full p-2 rounded border bg-background-glass"
              />
              <ErrorMessage name="postalCode" errors={errors} />
            </>
          )}
        />
      </div>
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