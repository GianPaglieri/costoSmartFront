import { useCallback, useState } from 'react';

/**
 * Hook reutilizable para manejar formularios simples con validaciones declarativas.
 * @param {Object} initialValues - Valores iniciales del formulario.
 * @param {Object.<string, Function>} validators - Mapa de validadores por campo.
 */
const useEntityForm = (initialValues, validators = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const getFieldProps = useCallback(
    (field, { parse } = {}) => ({
      value: values[field] ?? '',
      onChange: (eventOrValue) => {
        const rawValue =
          eventOrValue && eventOrValue.target !== undefined
            ? eventOrValue.target.value
            : eventOrValue;
        const nextValue = parse ? parse(rawValue) : rawValue;
        setFieldValue(field, nextValue);
      },
      error: Boolean(errors[field]),
      helperText: errors[field] || '',
    }),
    [values, errors, setFieldValue]
  );

  const resetForm = useCallback((nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
  }, [initialValues]);

  const validate = useCallback(
    (nextValues) => {
      const target = nextValues || values;
      const nextErrors = {};
      let isValid = true;

      Object.entries(validators).forEach(([field, validator]) => {
        if (typeof validator === 'function') {
          const message = validator(target[field], target);
          if (message) {
            isValid = false;
            nextErrors[field] = message;
          }
        }
      });

      setErrors(nextErrors);
      return { isValid, errors: nextErrors };
    },
    [validators, values]
  );

  return {
    values,
    errors,
    setValues,
    setFieldValue,
    getFieldProps,
    resetForm,
    validate,
  };
};

export default useEntityForm;
