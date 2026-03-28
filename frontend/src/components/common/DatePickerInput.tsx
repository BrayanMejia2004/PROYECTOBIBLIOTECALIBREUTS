import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerInputProps {
  label: string;
  value: string;
  onChange: (date: Date | null) => void;
  error?: string;
  placeholder?: string;
}

export function DatePickerInput({ label, value, onChange, error, placeholder = 'Seleccionar fecha...' }: DatePickerInputProps) {
  const [startDate, setStartDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleChange = (date: Date | null) => {
    setStartDate(date);
    onChange(date);
  };

  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <button
        type="button"
        onClick={onClick}
        ref={ref as React.Ref<HTMLButtonElement>}
        className={`
          w-full px-3 py-2.5 text-left border rounded-xl
          bg-white dark:bg-gray-800 
          text-gray-900 dark:text-gray-100
          transition-all duration-200
          flex items-center justify-between
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#c3d62f] focus:border-[#c3d62f]'
          }
          focus:outline-none
        `}
      >
        <span className={value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <svg 
          className="w-5 h-5 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
    )
  );

  CustomInput.displayName = 'CustomInput';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>
      
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        customInput={<CustomInput />}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={50}
        popperProps={{
          strategy: 'fixed',
        }}
      />

      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}

      <style>{`
        .react-datepicker-wrapper {
          width: 100% !important;
        }
        
        .react-datepicker__input-container {
          width: 100% !important;
        }
        
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #c3d62f !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
        }
        
        .react-datepicker__header {
          background-color: #132F20 !important;
          border-bottom: 1px solid #c3d62f !important;
          border-radius: 12px 12px 0 0 !important;
          padding: 12px 0 !important;
        }
        
        .react-datepicker__current-month {
          color: #c3d62f !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        
        .react-datepicker__day-name {
          color: #c3d62f !important;
          font-weight: 500 !important;
          font-size: 12px !important;
          width: 32px !important;
          line-height: 32px !important;
          margin: 0 !important;
        }
        
        .react-datepicker__day {
          width: 32px !important;
          line-height: 32px !important;
          color: #132F20 !important;
          border-radius: 8px !important;
          margin: 2px !important;
          transition: all 0.2s !important;
        }
        
        .react-datepicker__day:hover {
          background-color: rgba(195, 214, 47, 0.2) !important;
          color: #132F20 !important;
        }
        
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #c3d62f !important;
          color: #132F20 !important;
          font-weight: 600 !important;
        }
        
        .react-datepicker__day--selected:hover,
        .react-datepicker__day--keyboard-selected:hover {
          background-color: #a8b828 !important;
        }
        
        .react-datepicker__day--today {
          border: 2px solid #c3d62f !important;
          border-radius: 8px !important;
        }
        
        .react-datepicker__day--outside-month {
          color: #9ca3af !important;
        }
        
        .react-datepicker__navigation {
          top: 12px !important;
        }
        
        .react-datepicker__navigation-icon::before {
          border-color: #c3d62f !important;
        }
        
        .react-datepicker__navigation:hover *::before {
          border-color: #a8b828 !important;
        }
        
        .react-datepicker__year-header {
          display: flex !important;
          justify-content: center !important;
          gap: 8px !important;
        }
        
        .react-datepicker__current-month,
        .react-datepicker__year-dropdown-header {
          color: #c3d62f !important;
        }
        
        .react-datepicker__year-read-view--down-arrow {
          border-color: #c3d62f !important;
        }
        
        .react-datepicker__year-dropdown {
          background-color: white !important;
          border: 1px solid #c3d62f !important;
          border-radius: 8px !important;
          top: 50px !important;
        }
        
        .react-datepicker__year-option {
          color: #132F20 !important;
          padding: 8px 16px !important;
        }
        
        .react-datepicker__year-option:hover {
          background-color: rgba(195, 214, 47, 0.2) !important;
        }
        
        .react-datepicker__year-option--selected {
          background-color: #c3d62f !important;
          color: #132F20 !important;
        }
        
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .react-datepicker {
            background-color: #1a2e24 !important;
            border-color: #c3d62f !important;
          }
          
          .react-datepicker__header {
            background-color: #0a1f15 !important;
          }
          
          .react-datepicker__current-month,
          .react-datepicker__year-read-view--down-arrow {
            color: #c3d62f !important;
            border-color: #c3d62f !important;
          }
          
          .react-datepicker__day {
            color: #e8ebe9 !important;
          }
          
          .react-datepicker__day:hover {
            background-color: rgba(195, 214, 47, 0.2) !important;
          }
          
          .react-datepicker__day--selected {
            color: #0a1f15 !important;
          }
          
          .react-datepicker__year-dropdown {
            background-color: #1a2e24 !important;
          }
          
          .react-datepicker__year-option {
            color: #e8ebe9 !important;
          }
          
          .react-datepicker__day-name {
            color: #c3d62f !important;
          }
        }
      `}</style>
    </div>
  );
}
