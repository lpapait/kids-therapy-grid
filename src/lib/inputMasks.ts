
export const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const validateCPF = (cpf: string) => {
  const digits = cpf.replace(/\D/g, '');
  
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  
  return true;
};

export const validatePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

export const validateCEP = (cep: string) => {
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8;
};
