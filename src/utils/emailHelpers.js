/**
 * Generate a mailto link for "city not found" scenario
 */
export function generateCityNotFoundMailto(userInput) {
  const email = 'markrubyist@gmail.com';
  const subject = encodeURIComponent('[City Request]');
  const body = encodeURIComponent(
    `Hello,\n\nI'd like to request adding the following city:\n\n${userInput}\n\nThank you!`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

/**
 * Generate a mailto link for "report inaccuracy" scenario
 */
export function generateReportInconsistencyMailto(cityName, categoryName) {
  const email = 'markrubyist@gmail.com';
  const subject = encodeURIComponent(
    `[Report Inaccuracy][${cityName}]: ${categoryName}`
  );
  const body = encodeURIComponent(
    `Hello,\n\nI found an inaccuracy:\n\nCity: ${cityName}\nCategory: ${categoryName}\n\nPlease describe the issue:\n\n`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
