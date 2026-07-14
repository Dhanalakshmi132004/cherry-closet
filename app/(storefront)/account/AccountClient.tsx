'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { User, MapPin, Trash2, Plus, X, Loader2, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

// Schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const addressSchema = z.object({
  line1: z.string().min(5, 'Street address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'ZIP/Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;

interface AccountClientProps {
  user: any; // Prisma user with addresses
}

export default function AccountClient({ user }: AccountClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [addressSuccess, setAddressSuccess] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
    },
  });

  // Address Form
  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
    formState: { errors: addressErrors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsSavingProfile(true);
    setProfileSuccess(false);
    setProfileError('');

    try {
      const response = await fetch('/api/account/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setProfileSuccess(true);
      router.refresh();
    } catch (err: any) {
      setProfileError(err.message || 'An error occurred.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onAddressSubmit = async (values: AddressFormValues) => {
    setIsSavingAddress(true);
    setAddressSuccess(false);
    setAddressError('');

    try {
      const response = await fetch('/api/account/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add address.');
      }

      setAddressSuccess(true);
      resetAddressForm();
      setShowAddAddress(false);
      router.refresh();
    } catch (err: any) {
      setAddressError(err.message || 'An error occurred.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const onDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch('/api/account/address', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete address.');
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete address.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-sand pb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-charcoal">Account Settings</h1>
          <p className="text-brand-muted text-xs font-sans mt-1">
            Manage your personal data, credentials, and shipping addresses.
          </p>
        </div>
        <Link
          href="/account/orders"
          className="h-[36px] px-4 inline-flex items-center justify-center bg-brand-charcoal hover:bg-brand-charcoal/90 text-brand-cream text-xs font-semibold rounded-btn transition-colors shrink-0"
        >
          <ShoppingBag size={14} className="mr-1.5" /> Order History
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <aside className="md:col-span-3 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-brand-sand pb-4 md:pb-0 md:pr-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "flex-1 md:w-full px-4 py-2.5 rounded-lg text-left text-xs font-semibold font-sans flex items-center gap-2 transition-all",
              activeTab === 'profile'
                ? "bg-brand-terracotta text-brand-cream"
                : "bg-white text-brand-muted border border-brand-sand hover:border-brand-muted"
            )}
          >
            <User size={14} /> Profile Details
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={cn(
              "flex-1 md:w-full px-4 py-2.5 rounded-lg text-left text-xs font-semibold font-sans flex items-center gap-2 transition-all",
              activeTab === 'addresses'
                ? "bg-brand-terracotta text-brand-cream"
                : "bg-white text-brand-muted border border-brand-sand hover:border-brand-muted"
            )}
          >
            <MapPin size={14} /> Saved Addresses
          </button>
        </aside>

        {/* Form Area */}
        <main className="md:col-span-9">
          
          {/* PROFILE DETAIL FORM */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-6">
              <h2 className="font-serif text-lg text-brand-charcoal border-b border-brand-sand pb-2">
                Personal Information
              </h2>

              {profileSuccess && (
                <div className="p-3.5 bg-brand-success/10 border border-brand-success/20 rounded-card flex items-center gap-2.5 text-brand-success text-xs font-medium">
                  <CheckCircle size={16} /> Name updated successfully!
                </div>
              )}

              {profileError && (
                <div className="p-3.5 bg-brand-error/10 border border-brand-error/20 rounded-card flex items-center gap-2.5 text-brand-error text-xs font-medium">
                  <AlertCircle size={16} /> {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="email" className="text-xs font-semibold text-brand-charcoal block mb-1">
                    Email Address (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    id="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 bg-brand-cream border border-brand-sand rounded-btn text-sm text-brand-muted cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="text-xs font-semibold text-brand-charcoal block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...registerProfile('name')}
                    className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                  />
                  {profileErrors.name && (
                    <p className="text-xs text-brand-error mt-1">{profileErrors.name.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="h-[38px] px-6 inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-xs font-semibold rounded-btn transition-colors"
                >
                  {isSavingProfile ? <Loader2 size={12} className="animate-spin mr-1.5" /> : null}
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* ADDRESSES MANAGEMENT */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              
              {/* Header inside Addresses */}
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-lg text-brand-charcoal">Shipping Directory</h2>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="h-[32px] px-3.5 inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-xs font-semibold rounded-btn transition-colors"
                  >
                    <Plus size={14} className="mr-1" /> Add Address
                  </button>
                )}
              </div>

              {/* Add New Address Form Modal/Card */}
              {showAddAddress && (
                <div className="bg-brand-cream/50 border border-brand-sand rounded-card p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-brand-sand pb-2">
                    <h3 className="font-serif text-sm font-semibold text-brand-charcoal">New Shipping Profile</h3>
                    <button
                      onClick={() => {
                        setShowAddAddress(false);
                        resetAddressForm();
                      }}
                      className="p-1 text-brand-muted hover:text-brand-charcoal transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                      <div className="sm:col-span-6">
                        <label htmlFor="line1" className="text-xs font-semibold text-brand-charcoal block mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="line1"
                          {...registerAddress('line1')}
                          className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                        />
                        {addressErrors.line1 && (
                          <p className="text-xs text-brand-error mt-1">{addressErrors.line1.message}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="line2" className="text-xs font-semibold text-brand-charcoal block mb-1">
                          Apartment, unit, suite (optional)
                        </label>
                        <input
                          type="text"
                          id="line2"
                          {...registerAddress('line2')}
                          className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="city" className="text-xs font-semibold text-brand-charcoal block mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          {...registerAddress('city')}
                          className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                        />
                        {addressErrors.city && (
                          <p className="text-xs text-brand-error mt-1">{addressErrors.city.message}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="state" className="text-xs font-semibold text-brand-charcoal block mb-1">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          {...registerAddress('state')}
                          className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                        />
                        {addressErrors.state && (
                          <p className="text-xs text-brand-error mt-1">{addressErrors.state.message}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="postalCode" className="text-xs font-semibold text-brand-charcoal block mb-1">
                          ZIP / Postal Code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          {...registerAddress('postalCode')}
                          className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                        />
                        {addressErrors.postalCode && (
                          <p className="text-xs text-brand-error mt-1">{addressErrors.postalCode.message}</p>
                        )}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="country" className="text-xs font-semibold text-brand-charcoal block mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          {...registerAddress('country')}
                          className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                        />
                        {addressErrors.country && (
                          <p className="text-xs text-brand-error mt-1">{addressErrors.country.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAddress(false);
                          resetAddressForm();
                        }}
                        className="h-[34px] px-4 inline-flex items-center justify-center border border-brand-sand hover:border-brand-muted text-brand-charcoal text-xs font-semibold rounded-btn transition-colors bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingAddress}
                        className="h-[34px] px-4 inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-xs font-semibold rounded-btn transition-colors"
                      >
                        {isSavingAddress ? <Loader2 size={12} className="animate-spin mr-1.5" /> : null}
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Address List */}
              {user.addresses.length === 0 ? (
                <div className="text-center py-12 bg-white border border-brand-sand rounded-card text-brand-muted text-xs">
                  No saved addresses found. Add an address to speed up checkout.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr: any) => (
                    <div
                      key={addr.id}
                      className="bg-white border border-brand-sand rounded-card p-4 flex justify-between items-start shadow-subtle"
                    >
                      <div className="space-y-1 font-sans text-xs text-brand-muted leading-relaxed">
                        <strong className="text-brand-charcoal block font-semibold">Shipping Destination</strong>
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p>{addr.country}</p>
                      </div>
                      <button
                        onClick={() => onDeleteAddress(addr.id)}
                        className="p-1 text-brand-muted hover:text-brand-error transition-colors"
                        aria-label="Delete address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
