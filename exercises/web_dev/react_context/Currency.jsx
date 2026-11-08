/**
 * Currency: the shop's chosen currency, shared through a context, so a price
 * anywhere below the provider shows it without a currency prop passed down.
 *
 * Fill in the context, its provider, its hook and the two components so the
 * tests in Currency.test.jsx pass.
 * Run them from this folder with: npm test
 * Callers use CurrencyProvider and useCurrency; only this file touches the context.
 */
import { createContext, useContext, useMemo, useState } from 'react';

/** The currencies the picker offers, in order. */
export const CURRENCIES = ['GBP', 'EUR', 'USD'];

/**
 * TODO: create the context, made once here at module level.
 * Its default, used when there is no provider above, is
 * { currency: "GBP", setCurrency: a function that does nothing }.
 */
export const CurrencyContext = null;

/**
 * Keeps the currency in state, starting at `initial` ("GBP" when not given), and
 * provides { currency, setCurrency } to everything nested inside it.
 * The object it provides stays the same object until the currency changes,
 * so the components that read it re-render only then.
 */
export function CurrencyProvider({ initial = 'GBP', children }) {
  // TODO
  return null;
}

/** The nearest provider's { currency, setCurrency }, or the context's default. */
export function useCurrency() {
  // TODO
}

/**
 * <span class="price">8.00 GBP</span>: the amount with two decimals and the currency.
 */
export function Price({ amount }) {
  // TODO
  return null;
}

/**
 * One <button> per currency, "Use EUR", that switches the provider's currency;
 * the button of the current one has aria-pressed="true", the others "false".
 */
export function CurrencyPicker() {
  // TODO
  return null;
}
