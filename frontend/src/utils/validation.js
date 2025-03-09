export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export const registrationValidationRules = {
  name: {
    required: true,
    minLength: 2,
    message: 'Name must be at least 2 characters long'
  },
  email: {
    required: true,
    pattern: EMAIL_REGEX,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters long'
  },
  age: {
    required: true,
    validate: (value) => {
      const age = Number(value);
      if (isNaN(age)) return 'Age must be a number';
      if (age < 1) return 'Age must be greater than 0';
      if (age > 120) return 'Age must be less than 120';
      return '';
    }
  },
  dateOfBirth: {
    required: true,
    message: 'Date of Birth is required'
  },
  gender: {
    required: true,
    message: 'Please select a gender'
  }
};


export const loginValidationRules = {
  email: {
    required: true,
    pattern: EMAIL_REGEX,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    message: 'Password is required'
  }
};


export const userEditValidationRules = {
  name: {
    required: true,
    minLength: 2,
    message: 'Name must be at least 2 characters long'
  },
  email: {
    required: true,
    pattern: EMAIL_REGEX,
    message: 'Please enter a valid email address'
  },
  age: {
    required: true,
    validate: (value) => {
      const age = Number(value);
      if (isNaN(age)) return 'Age must be a number';
      if (age < 1) return 'Age must be greater than 0';
      if (age > 120) return 'Age must be less than 120';
      return '';
    }
  },
  dateOfBirth: {
    required: true,
    message: 'Date of Birth is required'
  },
  gender: {
    required: true,
    message: 'Please select a gender'
  }
}; 