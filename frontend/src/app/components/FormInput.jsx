import { forwardRef } from 'react'

const FormInput = forwardRef(function FormInput(
  { label, id, icon: Icon, rightElement, error, touched, className = '', ...props },
  ref
) {
  const hasError = touched && error
  const isValid = touched && !error && props.value

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-gray-500 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center bg-white border rounded-xl transition-colors duration-150 ${
          hasError
            ? 'border-red-400 focus-within:border-red-400'
            : isValid
            ? 'border-emerald-400'
            : 'border-gray-200 focus-within:border-rose-400'
        }`}
      >
        {Icon && (
          <Icon
            className="absolute left-3.5 text-gray-400 text-base pointer-events-none shrink-0"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-err` : undefined}
          className={`flex-1 py-3.5 text-sm text-gray-900 bg-transparent placeholder-gray-400 focus:outline-none ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center">{rightElement}</div>
        )}
      </div>
      {hasError && (
        <p id={`${id}-err`} className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

export default FormInput
