import { useState, useCallback } from "react";

function useFormValidator() {
  const [validated, setValidated] = useState(false);

  const validateForm = useCallback((event: React.FormEvent<HTMLFormElement>): HTMLFormElement | null => {
    event.preventDefault();
    event.stopPropagation();
      
    const form = event.currentTarget;

    setValidated(true);
    // TODO: Replace with custom validation functionality, setting custom error key names, i.e 'username', 'password'
    if(form.checkValidity()) {
      return form;
    }

    return null;

  }, []);

  return {
    validated,
    validateForm,
    setValidated
  }
}

export default useFormValidator;
