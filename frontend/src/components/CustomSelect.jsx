import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select option', 
  icon: Icon, 
  error,
  className = '',
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && <label className="block text-sm font-medium text-dark-300 mb-1.5">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`input-field flex items-center justify-between gap-2 text-left relative ${Icon ? 'pl-11' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon className="w-4 h-4 absolute left-4 text-dark-500" />}
          <span className={`truncate ${!selectedOption ? 'text-dark-500' : 'text-dark-100'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-dark-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute z-50 w-full mt-2 glass-card py-2 max-h-64 overflow-y-auto shadow-2xl"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-dark-500 italic">No options available</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
                    String(value) === String(option.value)
                      ? 'bg-primary-500/20 text-primary-400 font-medium'
                      : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700/50'
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && <p className="text-red-400 text-[11px] mt-1.5 ml-1">{error}</p>}
    </div>
  );
};

export default CustomSelect;
