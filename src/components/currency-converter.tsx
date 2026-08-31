'use client';

import { useRef, useState, type ChangeEvent } from 'react';

type ForeignCurrency = 'USD' | 'EUR' | 'MLC';
type Currency = ForeignCurrency | 'CUP';

type CurrencyConverterProps = {
  rates: {
    usd: number;
    eur: number;
    mlc: number;
  };
};

const currencies: Currency[] = ['USD', 'EUR', 'MLC', 'CUP'];

const currencyNames: Record<Currency, string> = {
  USD: 'Dólar estadounidense',
  EUR: 'Euro',
  MLC: 'Moneda libremente convertible',
  CUP: 'Peso cubano',
};

const numberFormatter = new Intl.NumberFormat('es-CU', {
  maximumFractionDigits: 2,
});

const rateFormatter = new Intl.NumberFormat('es-CU', {
  maximumFractionDigits: 4,
});

function parseAmount(value: string) {
  const normalizedValue = value.trim().replace(',', '.');

  if (!normalizedValue) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null;
}

export function CurrencyConverter({ rates }: CurrencyConverterProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState('1');
  const [sourceCurrency, setSourceCurrency] = useState<Currency>('USD');
  const [targetCurrency, setTargetCurrency] = useState<Currency>('CUP');

  const ratesByCurrency: Record<Currency, number> = {
    USD: rates.usd,
    EUR: rates.eur,
    MLC: rates.mlc,
    CUP: 1,
  };
  const parsedAmount = parseAmount(amount);
  const convertedAmount =
    parsedAmount === null
      ? null
      : (parsedAmount * ratesByCurrency[sourceCurrency]) /
        ratesByCurrency[targetCurrency];
  const conversionRate =
    ratesByCurrency[sourceCurrency] / ratesByCurrency[targetCurrency];

  const openDialog = () => {
    dialogRef.current?.showModal();
    requestAnimationFrame(() => amountInputRef.current?.select());
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleSourceCurrencyChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const nextCurrency = event.target.value as Currency;

    setSourceCurrency(nextCurrency);
    setTargetCurrency((currentCurrency) => {
      if (nextCurrency !== 'CUP') {
        return 'CUP';
      }

      return currentCurrency === 'CUP' ? 'USD' : currentCurrency;
    });
  };

  const handleTargetCurrencyChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const nextCurrency = event.target.value as Currency;

    setTargetCurrency(nextCurrency);
    setSourceCurrency((currentCurrency) => {
      if (nextCurrency !== 'CUP') {
        return 'CUP';
      }

      return currentCurrency === 'CUP' ? 'USD' : currentCurrency;
    });
  };

  const swapCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2" />
        </svg>
        Convertir monedas
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="currency-converter-title"
        aria-describedby="currency-converter-description"
        onClose={() => triggerRef.current?.focus()}
        className="inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center overflow-y-auto bg-transparent p-4 text-gray-800 backdrop:bg-slate-950/55 open:flex"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={closeDialog}
          className="fixed inset-0 cursor-default"
        />
        <div className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-medium text-blue-100">
                  Calculadora TRMI
                </p>
                <h2
                  id="currency-converter-title"
                  className="text-2xl font-bold"
                >
                  Convertidor de monedas
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Cerrar convertidor"
                className="rounded-full p-2 text-blue-100 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <p
              id="currency-converter-description"
              className="mt-2 text-sm text-blue-100"
            >
              Convierte entre CUP y USD, EUR o MLC con las tasas actuales.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <label
                htmlFor="currency-converter-amount"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Cantidad de origen
              </label>
              <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  ref={amountInputRef}
                  id="currency-converter-amount"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                  autoComplete="off"
                  aria-invalid={parsedAmount === null}
                  aria-describedby={
                    parsedAmount === null
                      ? 'currency-converter-amount-error'
                      : undefined
                  }
                  className="min-w-0 flex-1 px-4 py-3 text-xl font-semibold outline-none"
                />
                <label htmlFor="currency-converter-source" className="sr-only">
                  Moneda de origen
                </label>
                <select
                  id="currency-converter-source"
                  value={sourceCurrency}
                  onChange={handleSourceCurrencyChange}
                  className="border-l border-gray-200 bg-gray-50 px-3 font-semibold text-gray-700 outline-none"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              {parsedAmount === null ? (
                <p
                  id="currency-converter-amount-error"
                  className="mt-2 text-sm text-red-600"
                >
                  Introduce una cantidad válida mayor o igual a cero.
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  {currencyNames[sourceCurrency]}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <button
                type="button"
                onClick={swapCurrencies}
                aria-label="Intercambiar monedas"
                className="rounded-full border border-blue-200 bg-blue-50 p-2.5 text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="m7 7 3-3 3 3M10 4v12m7 1-3 3-3-3m3 3V8" />
                </svg>
              </button>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div>
              <label
                htmlFor="currency-converter-target"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Convertir a
              </label>
              <div className="rounded-xl border border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <output
                    htmlFor="currency-converter-amount currency-converter-source currency-converter-target"
                    aria-live="polite"
                    aria-atomic="true"
                    className="min-w-0 text-3xl font-bold text-gray-800"
                  >
                    {convertedAmount === null
                      ? '--'
                      : numberFormatter.format(convertedAmount)}
                  </output>
                  <select
                    id="currency-converter-target"
                    value={targetCurrency}
                    onChange={handleTargetCurrencyChange}
                    className="rounded-lg border border-blue-200 bg-white px-3 py-2 font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {currencyNames[targetCurrency]}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
              1 {sourceCurrency} = {rateFormatter.format(conversionRate)}{' '}
              {targetCurrency}
            </div>

            <p className="text-center text-xs italic text-gray-500">
              Resultado referencial. El valor real puede variar en cada
              transacción.
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
