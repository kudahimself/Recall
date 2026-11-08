/**
 * Currency: the shop's chosen currency, shared through a context.
 * Reference solution.
 */
import { createContext, useContext, useMemo, useState } from 'react';

/** The currencies the picker offers, in order. */
export const CURRENCIES = ['GBP', 'EUR', 'USD'];

export const CurrencyContext = createContext({ currency: 'GBP', setCurrency: () => {} });

export function CurrencyProvider({ initial = 'GBP', children }) {
  const [currency, setCurrency] = useState(initial);
  // A new object only when the currency changes, so readers skip other re-renders.
  const shared = useMemo(() => ({ currency, setCurrency }), [currency]);
  return <CurrencyContext value={shared}>{children}</CurrencyContext>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function Price({ amount }) {
  const { currency } = useCurrency();
  return <span className="price">{amount.toFixed(2)} {currency}</span>;
}

export function CurrencyPicker() {
  const { currency, setCurrency } = useCurrency();
  return (
    <>
      {CURRENCIES.map(c => (
        <button key={c} aria-pressed={c === currency} onClick={() => setCurrency(c)}>Use {c}</button>
      ))}
    </>
  );
}
