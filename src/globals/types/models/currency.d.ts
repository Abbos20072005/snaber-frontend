type CurrencyCode = 'CNY' | 'EUR' | 'RUB' | 'USD' | 'UZS';

interface Currency {
  code: CurrencyCode;
  name: string;
}

type CurrenciesResponse = Currency[];
