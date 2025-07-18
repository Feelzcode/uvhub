import React from 'react';
import { useCurrencyStore } from '@/store/slices/currencySlice';

const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrency, currencies } = useCurrencyStore();

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value as any);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="currency-select" className="text-sm font-medium text-gray-700">
        Currency:
      </label>
      <select
        id="currency-select"
        value={currentCurrency}
        onChange={handleCurrencyChange}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="NGN">Nigerian Naira (₦)</option>
        <option value="GHS">Ghanaian Cedi (₵)</option>
        <option value="USD">US Dollar ($)</option>
      </select>
    </div>
  );
};

export default CurrencySelector; 