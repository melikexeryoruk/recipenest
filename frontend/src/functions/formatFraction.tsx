export const formatFraction = (decimal: number): string => {
  if (decimal === 0) return "0";

  const commonFractions: { [key: string]: string } = {
    "0.125": "1/8",
    "0.25": "1/4",
    "0.33": "1/3",
    "0.333": "1/3",
    "0.5": "1/2",
    "0.67": "2/3",
    "0.667": "2/3",
    "0.75": "3/4",
  };

  const rounded = Math.round(decimal * 1000) / 1000;
  const fractionKey = rounded.toString();

  if (commonFractions[fractionKey]) {
    return commonFractions[fractionKey];
  }

  // For other decimals, return as decimal if >= 1, or try to create a simple fraction
  if (decimal >= 1) {
    return decimal % 1 === 0
      ? decimal.toString()
      : decimal.toFixed(1).replace(/\.0$/, "");
  }

  // Try to create a simple fraction for small decimals
  for (let denominator = 2; denominator <= 16; denominator++) {
    const numerator = Math.round(decimal * denominator);
    if (Math.abs(numerator / denominator - decimal) < 0.01) {
      return `${numerator}/${denominator}`;
    }
  }

  return decimal.toFixed(2).replace(/\.?0+$/, "");
};
