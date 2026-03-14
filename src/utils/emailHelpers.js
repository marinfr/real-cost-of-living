/**
 * Generate a mailto link for "city not found" scenario
 */
export function generateCityNotFoundMailto(userInput) {
  const email = process.env.REACT_APP_EMAIL_ADDRESS || 'support@example.com';
  const subject = encodeURIComponent('City Suggestion for Real Cost of Living Calculator');
  const body = encodeURIComponent(
    `Hello,\n\nI'd like to suggest adding the following city to the Real Cost of Living Calculator:\n\n${userInput}\n\nThank you!`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

/**
 * Generate a mailto link for "report inconsistency" scenario
 */
export function generateReportInconsistencyMailto(cityName, categoryName) {
  const email = process.env.REACT_APP_EMAIL_ADDRESS || 'support@example.com';
  const subject = encodeURIComponent(
    `Report Inconsistency: ${categoryName} in ${cityName}`
  );
  const body = encodeURIComponent(
    `Hello,\n\nI found an inconsistency or inaccuracy in the Real Cost of Living Calculator:\n\nCity: ${cityName}\nCategory: ${categoryName}\n\nPlease describe the issue:\n\n`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
