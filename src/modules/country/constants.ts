export const getCountryOptions = (countries: CountriesResponse = []) =>
  countries.map((country) => ({
    value: country.code,
    label: country.name
  }));

export const getCountryNameMap = (countries: CountriesResponse = []) =>
  countries.reduce<Record<string, string>>((acc, country) => {
    acc[country.code] = country.name;

    return acc;
  }, {});
