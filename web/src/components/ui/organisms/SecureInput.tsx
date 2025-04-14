import React, { useState, useEffect, forwardRef, useRef } from 'react';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
}

/**
 * Componente de input seguro que evita preenchimento automático
 * 
 * Este componente utiliza várias técnicas para evitar que o navegador
 * preencha automaticamente os campos, incluindo:
 * - Nome aleatório para o campo
 * - autoComplete="new-password" ou "off"
 * - autocorrect, autocapitalize e spellcheck desligados
 * - Um input "honeypot" invisível para confundir o preenchimento automático
 */
export const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  (
    {
      type = 'text',
      label,
      helperText,
      error,
      fullWidth = true,
      containerClassName = '',
      className = '',
      ...props
    },
    ref
  ) => {
    // Gerar nome aleatório para o campo para evitar preenchimento automático
    const [randomName] = useState(() => 
      `field_${Math.random().toString(36).substring(2, 10)}`
    );
    
    // Input real com referência
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Aplicar a ref encaminhada ao input real
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    // Configurar atributos especiais com base no tipo
    const getAutoCompleteAttribute = () => {
      if (type === 'password') return 'new-password';
      if (type === 'email') return 'email-' + randomName;
      return 'off';
    };

    // Classes CSS para o container
    const containerClasses = `
      ${fullWidth ? 'w-full' : ''}
      ${containerClassName}
    `;

    // Classes CSS para o input
    const inputClasses = `
      w-full px-3 py-2 border 
      ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'} 
      rounded-md shadow-sm 
      focus:outline-none focus:ring-blue-500 focus:border-blue-500 
      ${error ? 'focus:ring-red-500 focus:border-red-500' : ''} 
      bg-white dark:bg-gray-800 
      text-gray-900 dark:text-white
      ${className}
    `;

    return (
      <div className={containerClasses}>
        {/* Label do campo se fornecida */}
        {label && (
          <label 
            htmlFor={props.id || randomName}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Campo invisível "honeypot" para confundir o preenchimento automático */}
          <div 
            aria-hidden="true" 
            style={{ 
              position: 'absolute', 
              overflow: 'hidden', 
              height: 0, 
              width: 0, 
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(100%)',
            }}
          >
            <input
              type={type === 'password' ? 'password' : 'text'}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          
          {/* Campo real de input */}
          <input
            ref={inputRef}
            type={type}
            id={props.id || randomName}
            name={props.name || randomName}
            className={inputClasses}
            autoComplete={getAutoCompleteAttribute()}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-lpignore="true" // Ignora preenchimento do LastPass
            data-form-type={type === 'password' ? 'password' : 'other'} // Dica para gerenciadores de senha
            {...props}
          />
        </div>
        
        {/* Mensagem de ajuda ou erro */}
        {(helperText || error) && (
          <p 
            className={`mt-1 text-xs ${
              error 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

SecureInput.displayName = 'SecureInput';