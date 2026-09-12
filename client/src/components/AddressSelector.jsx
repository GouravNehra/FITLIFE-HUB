import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const emptyAddress = {
  label: 'Home', line1: '', line2: '', city: '', state: '', zip: '', country: '', phone: '',
};

export default function AddressSelector({ addresses = [], selectedAddressId, onSelect, onSaveAddress }) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.label || !form.line1 || !form.city || !form.zip) {
      setError('Enter a label, address, city, and PIN code.');
      return;
    }

    setSaving(true);
    try {
      await onSaveAddress({ ...form, id: `${Date.now()}` });
      setForm(emptyAddress);
      setAdding(false);
    } catch (err) {
      setError(err.message || 'Could not save address.');
    } finally {
      setSaving(false);
    }
  };

  if (!addresses.length) {
    return (
      <div className="bg-stone-800 rounded-lg p-3">
        <p className="text-xs text-stone-400 mb-2">No saved addresses</p>
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-white underline hover:text-stone-300 transition-colors"
            aria-label="Add a shipping address"
          >
            Add a shipping address →
          </button>
        ) : (
          <AddressForm
            form={form}
            error={error}
            saving={saving}
            onChange={updateField}
            onSubmit={saveAddress}
            onCancel={() => setAdding(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-stone-400 tracking-wide uppercase mb-2">Ship to</p>

      <AnimatePresence>
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedAddressId;
          return (
            <motion.button
              key={addr.id}
              type="button"
              onClick={() => onSelect(addr)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              aria-pressed={isSelected}
              aria-label={`Select address: ${addr.label}, ${addr.line1}, ${addr.city}`}
              className={`w-full text-left rounded-lg p-3 border transition-all duration-200
                ${isSelected
                  ? 'bg-white text-stone-900 border-white'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                }`}
            >
              <div className={`text-xs font-medium mb-0.5 ${isSelected ? 'text-stone-900' : 'text-white'}`}>
                {addr.label}
                {isSelected && <span className="ml-2 text-stone-500">✓</span>}
              </div>
              <div className={`text-xs ${isSelected ? 'text-stone-600' : 'text-stone-400'}`}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
              </div>
              <div className={`text-xs ${isSelected ? 'text-stone-500' : 'text-stone-500'}`}>
                {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      <button
        onClick={() => navigate('/profile')}
        className="text-xs text-stone-400 hover:text-stone-200 transition-colors underline mt-1"
        aria-label="Manage addresses on profile page"
      >
        Manage addresses →
      </button>
      <button
        onClick={() => { setAdding(true); setError(''); }}
        className="block text-xs text-stone-400 hover:text-stone-200 transition-colors underline"
      >
        Add another address
      </button>
      {adding && (
        <AddressForm
          form={form}
          error={error}
          saving={saving}
          onChange={updateField}
          onSubmit={saveAddress}
          onCancel={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function AddressForm({ form, error, saving, onChange, onSubmit, onCancel }) {
  const fields = [
    ['label', 'Label', 'Home'],
    ['line1', 'Address line 1', 'House number and street'],
    ['line2', 'Address line 2', 'Apartment, landmark (optional)'],
    ['city', 'City', 'City'],
    ['state', 'State', 'State'],
    ['zip', 'PIN code', 'PIN code'],
    ['country', 'Country', 'Country'],
    ['phone', 'Phone', 'Phone (optional)'],
  ];

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-2">
      {fields.map(([name, label, placeholder]) => (
        <label key={name} className="block">
          <span className="sr-only">{label}</span>
          <input
            name={name}
            value={form[name]}
            onChange={onChange}
            placeholder={placeholder}
            required={['label', 'line1', 'city', 'zip'].includes(name)}
            className="w-full rounded-md border border-stone-700 bg-stone-900 px-2.5 py-2 text-xs text-white placeholder:text-stone-500 focus:border-white focus:outline-none"
          />
        </label>
      ))}
      {error && <p className="text-xs text-red-300" role="alert">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving} className="rounded-full bg-white px-3 py-2 text-xs text-stone-900 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save address'}
        </button>
        <button type="button" onClick={onCancel} className="text-xs text-stone-400 underline">
          Cancel
        </button>
      </div>
    </form>
  );
}
