import React, { useState } from 'react';
import { Address } from '../types';
import { cn } from '../lib/utils';

interface AddressFormProps {
  initialData?: Partial<Address>;
  onSubmit: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
  submitLabel: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({ 
  initialData = {} as Partial<Address>, 
  onSubmit, 
  onCancel,
  submitLabel 
}) => {
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
            className={cn(
              "w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
              errors.firstName ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"
            )}
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
            className={cn(
              "w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
              errors.lastName ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"
            )}
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
          className={cn(
            "w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
            errors.email ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"
          )}
        />
        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <input
          name="address"
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className={cn(
            "w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
            errors.address ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"
          )}
        />
        {errors.address && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <input
            name="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={cn(
              "w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
              errors.city ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"
            )}
          />
          {errors.city && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.city}</p>}
        </div>
        <div className="space-y-1">
          <input
            name="state"
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className={cn(
              "w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
              errors.state ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"
            )}
          />
          {errors.state && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.state}</p>}
        </div>
        <div className="space-y-1">
          <input
            name="zip"
            type="text"
            placeholder="ZIP"
            value={formData.zip}
            onChange={handleChange}
            className={cn(
              "w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors",
              errors.zip ? "border-red-300 focus:border-red-500" : "border-stone-200 focus:border-stone-900"
            )}
          />
          {errors.zip && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{errors.zip}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-stone-200 text-stone-600 py-4 rounded-full font-bold hover:bg-stone-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-stone-900 text-white py-4 rounded-full font-bold hover:bg-stone-800 transition-all"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
