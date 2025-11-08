export const formatCurrency = (value, locale = 'es-AR') => {
  if (value === undefined || value === null) {
    return '$ 0,00';
  }

  const number =
    typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));

  if (Number.isNaN(number)) {
    return '$ 0,00';
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `$ ${formatter.format(number)}`;
  } catch (_) {
    return `$ ${number.toFixed(2)}`;
  }
};

export const formatPercent = (value) => {
  if (value === undefined || value === null) {
    return '0%';
  }

  const number =
    typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));

  if (Number.isNaN(number)) {
    return '0%';
  }

  return `${number.toFixed(2)}%`;
};