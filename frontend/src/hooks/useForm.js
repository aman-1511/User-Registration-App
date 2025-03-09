import { useState } from 'react';

const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const validateField = (name, value, rules) => {
        if (!rules || !rules[name]) return '';

        const rule = rules[name];
        
        if (rule.required && !value) {
            return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }

        if (rule.minLength && value.length < rule.minLength) {
            return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
            return rule.message || `Invalid ${name}`;
        }

        if (rule.validate) {
            const customError = rule.validate(value);
            if (customError) return customError;
        }

        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e, validationRules) => {
        const { name, value } = e.target;
        const error = validateField(name, value, validationRules);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = (validationRules) => {
        const newErrors = {};
        let isValid = true;

        Object.keys(values).forEach(key => {
            if (validationRules && validationRules[key]) {
                const error = validateField(key, values[key], validationRules);
                if (error) {
                    newErrors[key] = error;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        values,
        errors,
        handleChange,
        handleBlur,
        validateForm,
        resetForm
    };
};

export default useForm; 