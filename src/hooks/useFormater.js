
export const useFormater = () => {

  const formatPhone = (phone) => {
    if (!phone) return null;

    // Remove all non-digit characters except plus at the beginning
    let digits = phone.replace(/\D/g, "");

    // Check if the original had a plus to preserve it
    const hadPlus = phone.trim().startsWith('+');

    // Handle different input formats
    if (digits.startsWith("0")) {
        digits = "261" + digits.substring(1);
    } else if (digits.startsWith("261")) {
        // Already in correct format
        digits = digits;
    } else if (!digits.startsWith("261") && digits.length === 9) {
        // Assume it's a local number without prefix
        digits = "261" + digits;
    } else if (digits.length === 12 && digits.startsWith("261")) {
        // Already in correct format without plus
        digits = digits;
    }

    // Add the plus sign if it was there originally or we're formatting an international number
    const shouldAddPlus = hadPlus || digits.length >= 9;
    const prefix = shouldAddPlus ? "+" : "";

    // Format with spaces for better readability
    if (digits.length === 12 && digits.startsWith("261")) {
        // Format: +261 XX XX XXX XX
        return `${prefix}${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 10)} ${digits.substring(10)}`;
    } else if (digits.length === 9) {
        // Format local numbers differently: XXX XX XXX XX
        return `${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 8)} ${digits.substring(8)}`;
    }

    // Fallback for other formats
    return prefix + digits;
};


  return { formatPhone };
};
