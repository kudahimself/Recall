// @vitest-environment jsdom
import { memo, useContext } from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CurrencyContext, CurrencyPicker, CurrencyProvider, Price, useCurrency } from './Currency.jsx';

afterEach(cleanup);

const prices = () => screen.getAllByText(/\d\.\d\d [A-Z]{3}/).map(el => el.textContent.replace(/\s+/g, ' '));

describe('without a provider', () => {
  test('useCurrency gives the context\'s default: GBP, and a setter that does nothing', () => {
    const { result } = renderHook(() => useCurrency());
    expect(result.current.currency).toBe('GBP');
    expect(typeof result.current.setCurrency).toBe('function');
    expect(() => result.current.setCurrency('EUR')).not.toThrow();
  });

  test('a price shows its amount with two decimals, in GBP', () => {
    const { container } = render(<Price amount={8} />);
    expect(container.innerHTML).toBe('<span class="price">8.00 GBP</span>');
  });
});

describe('inside a CurrencyProvider', () => {
  test('a price shows the provider\'s currency, and one outside it keeps the default', () => {
    render(
      <>
        <Price amount={8} />
        <CurrencyProvider initial="EUR"><Price amount={12.5} /></CurrencyProvider>
      </>,
    );
    expect(prices()).toEqual(['8.00 GBP', '12.50 EUR']);
  });

  test('starts in GBP when it is given no initial currency', () => {
    render(<CurrencyProvider><Price amount={3} /></CurrencyProvider>);
    expect(prices()).toEqual(['3.00 GBP']);
  });

  test('the picker switches every price below the provider, however deep, and no other', () => {
    /** Components in between that pass no currency down. */
    const Shelf = () => <section><Row /></section>;
    const Row = () => <p><Price amount={6} /> <Price amount={20} /></p>;
    render(
      <>
        <CurrencyProvider>
          <CurrencyPicker />
          <Shelf />
        </CurrencyProvider>
        <CurrencyProvider initial="EUR"><Price amount={1} /></CurrencyProvider>
      </>,
    );
    expect(screen.getAllByRole('button').map(b => b.textContent)).toEqual(['Use GBP', 'Use EUR', 'Use USD']);
    expect(screen.getByRole('button', { name: 'Use GBP' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Use USD' }));
    expect(prices()).toEqual(['6.00 USD', '20.00 USD', '1.00 EUR']);
    expect(screen.getByRole('button', { name: 'Use USD' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Use GBP' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('provides the same object until the currency changes, so readers re-render only then', () => {
    const seen = [];
    // memo: the probe re-renders only when the context it reads changes.
    const Probe = memo(function Probe() {
      seen.push(useCurrency());
      return null;
    });
    const Page = ({ visits }) => (
      <CurrencyProvider initial="EUR"><Probe /><p>{visits} visits</p></CurrencyProvider>
    );
    const { rerender } = render(<Page visits={1} />);
    rerender(<Page visits={2} />);
    expect(screen.getByText('2 visits')).toBeInTheDocument();
    expect(seen).toHaveLength(1);
    expect(seen[0].currency).toBe('EUR');
    act(() => seen[0].setCurrency('USD'));
    expect(seen).toHaveLength(2);
    expect(seen[1].currency).toBe('USD');
  });

  test('provides its value through the exported CurrencyContext', () => {
    const wrapper = ({ children }) => <CurrencyProvider initial="USD">{children}</CurrencyProvider>;
    const { result } = renderHook(() => [useContext(CurrencyContext), useCurrency()], { wrapper });
    const [direct, viaHook] = result.current;
    expect(direct.currency).toBe('USD');
    expect(viaHook).toBe(direct);
  });
});
