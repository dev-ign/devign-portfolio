export const formatInvestmentRange = (range?: [number, number]) =>
  range
    ? `$${range[0].toLocaleString()}–$${range[1].toLocaleString()}`
    : 'Custom scope required';
