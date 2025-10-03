export const validation = {
  isEmail: (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  isPhone: (phone: string) =>
      /^\d{3}-\d{3,4}-\d{4}$/.test(phone),

  isStrongPassword: (password: string) =>
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password),

  isNumber: (value: string) => /^\d+$/.test(value),

  isUrl: (url: string) =>
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url),
};
