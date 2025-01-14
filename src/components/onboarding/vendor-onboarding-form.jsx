import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schema
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

// Form state component
const FormState = ({ control }) => {
  const { errors, isSubmitting } = useFormState({ control });
  console.log("Button pressed. Errors: " + errors + " isSubmitting: " + isSubmitting )
  return null; // This component just manages state
};

// Step 1 component
const BusinessInfoStep = ({ register, errors, onNext }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">
        Business Name
      </label>
      <input
        {...register('businessName')}
        className="w-full p-2 rounded border bg-background-glass"
      />
      {errors.businessName && (
        <p className="text-red-500 text-sm mt-1">
          {errors.businessName.message}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Business Type
      </label>
      <select
        {...register('vendorType')}
        className="w-full p-2 rounded border bg-background-glass"
      >
        <option value="tours">Tours</option>
        <option value="lessons">Lessons</option>
        <option value="rentals">Rentals</option>
        <option value="tickets">Tickets</option>
      </select>
      {errors.vendorType && (
        <p className="text-red-500 text-sm mt-1">
          {errors.vendorType.message}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Description
      </label>
      <textarea
        {...register('description')}
        rows={4}
        className="w-full p-2 rounded border bg-background-glass"
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">
          {errors.description.message}
        </p>
      )}
    </div>

    <div className="flex justify-end">
      <button
        type="button"
        onClick={onNext}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Next
      </button>
    </div>
  </div>
);

// Step 2 component
const ContactInfoStep = ({ register, errors, onBack, onNext }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full p-2 rounded border bg-background-glass"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Phone
        </label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full p-2 rounded border bg-background-glass"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Website
      </label>
      <input
        {...register('website')}
        type="url"
        className="w-full p-2 rounded border bg-background-glass"
      />
      {errors.website && (
        <p className="text-red-500 text-sm mt-1">
          {errors.website.message}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Logo URL
      </label>
      <input
        {...register('logoUrl')}
        type="url"
        className="w-full p-2 rounded border bg-background-glass"
      />
      {errors.logoUrl && (
        <p className="text-red-500 text-sm mt-1">
          {errors.logoUrl.message}
        </p>
      )}
    </div>

    <div className="flex justify-between">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Next
      </button>
    </div>
  </div>
);

// Step 3 component
const LocationInfoStep = ({ register, errors, isSubmitting, onBack }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">
        Street Address
      </label>
      <input
        {...register('address')}
        className="w-full p-2 rounded border bg-background-glass"
      />
      {errors.address && (
        <p className="text-red-500 text-sm mt-1">
          {errors.address.message}
        </p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          City
        </label>
        <input
          {...register('city')}
          className="w-full p-2 rounded border bg-background-glass"
        />
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">
            {errors.city.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          State
        </label>
        <input
          {...register('state')}
          className="w-full p-2 rounded border bg-background-glass"
        />
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">
            {errors.state.message}
          </p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Postal Code
      </label>
      <input
        {...register('postalCode')}
        className="w-full p-2 rounded border bg-background-glass"
      />
      {errors.postalCode && (
        <p className="text-red-500 text-sm mt-1">
          {errors.postalCode.message}
        </p>
      )}
    </div>

    <div className="flex justify-between">
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  </div>
);

// Main form component
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
  
  const { register, handleSubmit, control } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues,
    mode: 'onChange'
  });
  
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
      
      // Handle success
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background-glass backdrop-blur-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormState control={control} />
        
        {step === 1 && (
          <BusinessInfoStep 
            register={register} 
            onNext={() => setStep(2)} 
          />
        )}

        {step === 2 && (
          <ContactInfoStep 
            register={register}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <LocationInfoStep 
            register={register}
            onBack={() => setStep(2)}
          />
        )}
      </form>
    </div>
  );
}