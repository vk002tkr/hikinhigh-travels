"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "AED"
  | "INR"
  | "CAD"
  | "AUD"
  | "SGD"
  | "JPY";

type Currency = {
  code: CurrencyCode;
  symbol: string;
  country: string;
  locale: string;
};

export const currencies: Currency[] = [
  {
    code: "USD",
    symbol: "$",
    country: "United States",
    locale: "en-US",
  },
  {
    code: "EUR",
    symbol: "€",
    country: "Eurozone",
    locale: "de-DE",
  },
  {
    code: "GBP",
    symbol: "£",
    country: "United Kingdom",
    locale: "en-GB",
  },
  {
    code: "AED",
    symbol: "د.إ",
    country: "United Arab Emirates",
    locale: "en-AE",
  },
  {
    code: "INR",
    symbol: "₹",
    country: "India",
    locale: "en-IN",
  },
  {
    code: "CAD",
    symbol: "$",
    country: "Canada",
    locale: "en-CA",
  },
  {
    code: "AUD",
    symbol: "$",
    country: "Australia",
    locale: "en-AU",
  },
  {
    code: "SGD",
    symbol: "$",
    country: "Singapore",
    locale: "en-SG",
  },
  {
    code: "JPY",
    symbol: "¥",
    country: "Japan",
    locale: "ja-JP",
  },
];

const countryToCurrency: Record<string, CurrencyCode> = {
  US: "USD",

  GB: "GBP",

  IE: "EUR",
  FR: "EUR",
  DE: "EUR",
  ES: "EUR",
  IT: "EUR",
  PT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  SI: "EUR",
  SK: "EUR",
  EE: "EUR",
  LV: "EUR",
  LT: "EUR",
  CY: "EUR",
  MT: "EUR",

  AE: "AED",

  IN: "INR",

  CA: "CAD",

  AU: "AUD",

  SG: "SGD",

  JP: "JPY",
};

const fallbackRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.74,
  AED: 3.6725,
  INR: 96.25,
  CAD: 1.39,
  AUD: 1.51,
  SGD: 1.29,
  JPY: 148.5,
};

type CurrencyContextValue = {
  currency: CurrencyCode;
  selectedCurrency: Currency;
  currencies: Currency[];
  rates: Record<CurrencyCode, number>;
  loading: boolean;
  detectingCurrency: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  convert: (amountInUsd: number) => number;
  formatPrice: (amountInUsd: number) => string;
};

const CurrencyContext =
  createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] =
    useState<CurrencyCode>("USD");

  const [rates, setRates] =
    useState<Record<CurrencyCode, number>>(
      fallbackRates
    );

  const [loading, setLoading] = useState(true);

  const [detectingCurrency, setDetectingCurrency] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const initialiseCurrency = async () => {
      const savedCurrency =
        window.localStorage.getItem(
          "hikinhigh-currency"
        ) as CurrencyCode | null;

      if (
        savedCurrency &&
        currencies.some(
          (item) => item.code === savedCurrency
        )
      ) {
        if (!cancelled) {
          setCurrencyState(savedCurrency);
          setDetectingCurrency(false);
        }
      } else {
        try {
          const response = await fetch(
            "https://ipapi.co/json/",
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              "Unable to detect location"
            );
          }

          const data = (await response.json()) as {
            country_code?: string;
          };

          const detected =
            data.country_code
              ? countryToCurrency[
                  data.country_code.toUpperCase()
                ]
              : undefined;

          if (!cancelled && detected) {
            setCurrencyState(detected);

            window.localStorage.setItem(
              "hikinhigh-currency",
              detected
            );
          }
        } catch {
          if (!cancelled) {
            setCurrencyState("USD");
          }
        } finally {
          if (!cancelled) {
            setDetectingCurrency(false);
          }
        }
      }
    };

    initialiseCurrency();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadRates = async () => {
      try {
        const response = await fetch(
          "https://open.er-api.com/v6/latest/USD",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load exchange rates");
        }

        const data = (await response.json()) as {
          rates?: Record<string, number>;
        };

        if (!data.rates) {
          throw new Error("Exchange rates unavailable");
        }

        const nextRates: Record<
          CurrencyCode,
          number
        > = {
          ...fallbackRates,
        };

        currencies.forEach((item) => {
          const liveRate = data.rates?.[item.code];

          if (
            typeof liveRate === "number" &&
            Number.isFinite(liveRate)
          ) {
            nextRates[item.code] = liveRate;
          }
        });

        if (!cancelled) {
          setRates(nextRates);
        }
      } catch {
        if (!cancelled) {
          setRates(fallbackRates);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRates();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedCurrency = useMemo(
    () =>
      currencies.find(
        (item) => item.code === currency
      ) ?? currencies[0],
    [currency]
  );

  const changeCurrency = (
    nextCurrency: CurrencyCode
  ) => {
    setCurrencyState(nextCurrency);

    window.localStorage.setItem(
      "hikinhigh-currency",
      nextCurrency
    );
  };

  const convert = (amountInUsd: number) => {
    const rate = rates[currency] ?? 1;

    return amountInUsd * rate;
  };

  const formatPrice = (amountInUsd: number) => {
    const converted = convert(amountInUsd);

    return new Intl.NumberFormat(
      selectedCurrency.locale,
      {
        style: "currency",
        currency: selectedCurrency.code,
        maximumFractionDigits:
          selectedCurrency.code === "JPY" ? 0 : 0,
        minimumFractionDigits: 0,
      }
    ).format(converted);
  };

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      selectedCurrency,
      currencies,
      rates,
      loading,
      detectingCurrency,
      setCurrency: changeCurrency,
      convert,
      formatPrice,
    }),
    [
      currency,
      selectedCurrency,
      rates,
      loading,
      detectingCurrency,
    ]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      "useCurrency must be used inside CurrencyProvider"
    );
  }

  return context;
}