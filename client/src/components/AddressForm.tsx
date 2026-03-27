import { useState } from 'react';
import { Address } from '../types';
import { cn } from '../lib/utils';

interface AddressFormProps {
  initialData?: Partial<Address>;
  onSubmit: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
  submitLabel: string;
}

export const AddressForm = ({
  initialData = {} as Partial<Address>,
  onSubmit,
  onCancel,
  submitLabel,
}: AddressFormProps) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip: initialData?.zip || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    const zipRegex = /^\d{5,6}$/;
    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
    } else if (!zipRegex.test(formData.zip)) {
      newErrors.zip = 'ZIP must be 5-6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const inputClass = (field: string) =>
    cn(
      'w-full bg-stone-50 dark:bg-stone-800 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors dark:text-white',
      errors[field]
        ? 'border-red-300 focus:border-red-500'
        : 'border-stone-200 dark:border-stone-700 focus:border-stone-900 dark:focus:border-white'
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            data-testid="input-firstname"
            className={inputClass('firstName')}
          />
          {errors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.firstName}</p>}
        </div>
        <div className="space-y-1">
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            data-testid="input-lastname"
            className={inputClass('lastName')}
          />
          {errors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          data-testid="input-email"
          className={inputClass('email')}
        />
        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <input
          name="address"
          type="text"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleChange}
          data-testid="input-address"
          className={inputClass('address')}
        />
        {errors.address && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1 col-span-1">
          <input
            name="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            data-testid="input-city"
            className={inputClass('city')}
          />
          {errors.city && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.city}</p>}
        </div>
        <div className="space-y-1 col-span-1">
          <input
            name="state"
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            data-testid="input-state"
            className={inputClass('state')}
          />
          {errors.state && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.state}</p>}
        </div>
        <div className="space-y-1 col-span-1">
          <input
            name="zip"
            type="text"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={handleChange}
            data-testid="input-zip"
            className={inputClass('zip')}
          />
          {errors.zip && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.zip}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 py-4 rounded-full font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="button-submit-address"
          className="flex-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-4 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition-all"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
