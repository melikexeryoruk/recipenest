import { formatFraction } from "./formatFraction";

export const scaleMeasure = (measure: string, scaleFactor: number): string => {
  if (!measure) return measure;

  // Regular expressions to match different number formats
  const fractionRegex = /(\d+)\/(\d+)/g;
  const decimalRegex = /\d+\.?\d*/g;
  const mixedFractionRegex = /(\d+)\s+(\d+)\/(\d+)/g;

  let scaledMeasure = measure;

  // Handle mixed fractions (e.g., "1 1/2 cups")
  scaledMeasure = scaledMeasure.replace(
    mixedFractionRegex,
    (whole, num, den) => {
      const wholeNum = parseInt(whole);
      const fraction = parseInt(num) / parseInt(den);
      const total = wholeNum + fraction;
      const scaled = total * scaleFactor;

      // Convert back to mixed fraction if reasonable
      const scaledWhole = Math.floor(scaled);
      const scaledFraction = scaled - scaledWhole;

      if (scaledFraction === 0) {
        return scaledWhole.toString();
      } else if (scaledWhole === 0) {
        return formatFraction(scaledFraction);
      } else {
        return `${scaledWhole} ${formatFraction(scaledFraction)}`;
      }
    }
  );
  // Handle simple fractions (e.g., "1/2 cup")
  scaledMeasure = scaledMeasure.replace(fractionRegex, (match, num, den) => {
    if (
      scaledMeasure.includes(`${match.split(" ")[0]} ${match.split(" ")[1]}`)
    ) {
      return match; // Skip if it was part of a mixed fraction
    }
    const fraction = parseInt(num) / parseInt(den);
    const scaled = fraction * scaleFactor;
    return formatFraction(scaled);
  });

  // Handle decimal numbers (e.g., "2.5 cups", "250 grams")
  scaledMeasure = scaledMeasure.replace(decimalRegex, (match) => {
    const num = parseFloat(match);
    const scaled = num * scaleFactor;

    // Round to reasonable precision
    if (scaled < 1) {
      return formatFraction(scaled);
    } else if (scaled % 1 === 0) {
      return scaled.toString();
    } else {
      return scaled.toFixed(1).replace(/\.0$/, "");
    }
  });

  return scaledMeasure;
};
