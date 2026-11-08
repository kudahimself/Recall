# Currency

Topic: Context (createContext, useContext) (Web Dev, React).
Time: about 20 minutes.

## Task

Share the shop's chosen currency through a context in `Currency.jsx`, so a price anywhere below the provider shows it without a currency prop passed down to it.
Keep the context, its provider and its hook in this one file, so callers use `CurrencyProvider` and `useCurrency` and never touch the context object.

- `CurrencyContext` is made once, at module level, with `createContext`.
  Its default, which a component gets when there is no provider above it, is `{ currency: "GBP", setCurrency }` with a `setCurrency` that does nothing.
- `CurrencyProvider({ initial, children })` keeps the currency in state, starting at `initial` (`"GBP"` when it is not given), and provides `{ currency, setCurrency }` to everything nested inside it.
  The object it provides stays the same object until the currency changes, so the components that read it re-render only then.
- `useCurrency()` gives back the nearest provider's value, or the default.
- `Price({ amount })` shows `<span class="price">8.00 GBP</span>`: the amount with two decimals, then the currency.
- `CurrencyPicker()` shows one `<button>` per entry of `CURRENCIES`, `Use EUR`, that switches the provider's currency.
  The current currency's button has `aria-pressed="true"` and the others `"false"`.

## Examples

```jsx
<Price amount={8} />                       // 8.00 GBP: no provider, so the default

<CurrencyProvider initial="EUR">
  <Price amount={12.5} />                  // 12.50 EUR
  <CurrencyPicker />                       // Use GBP, Use EUR, Use USD
</CurrencyProvider>
// after Use USD: 12.50 USD, and prices outside this provider keep their currency
```

The tests render prices several components below the provider, and two providers side by side.
One of them re-renders the provider's parent and counts how often a `memo` component that reads the context renders, which stays at one while the value object is kept with `useMemo`; a `value={{ currency, setCurrency }}` written inline makes a new object on every render.

## Run the tests

Install the packages once, from the repository root: `cd exercises/web_dev && npm ci`.
Then:

```bash
cd exercises/web_dev/react_context
npm test
```

Every test fails until you fill in the file.
When they all pass, tick the exercise done in Recall under Progress, Topics.
