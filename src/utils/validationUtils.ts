export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
export const postalCodeRegex = /^\d{2}-\d{3}$/;
export const nipRegex = /^\d{10}$/;
export const regonRegex = /^\d{9}$|^\d{14}$/;

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validatePostalCode = (postalCode: string): boolean => {
  return postalCodeRegex.test(postalCode);
};

export const validateNIP = (nip: string): boolean => {
  const cleanNip = nip.replace(/\D/g, "");
  if (!nipRegex.test(cleanNip)) return false;

  // NIP checksum validation
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanNip[i]) * weights[i];
  }

  const checkDigit = sum % 11;
  return checkDigit === parseInt(cleanNip[9]);
};

export const validateREGON = (regon: string): boolean => {
  const cleanRegon = regon.replace(/\D/g, "");
  return regonRegex.test(cleanRegon);
};

export const validateRequired = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

export const formatPostalCode = (postalCode: string): string => {
  const cleaned = postalCode.replace(/\D/g, "");
  if (cleaned.length === 5) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  }
  return postalCode;
};
