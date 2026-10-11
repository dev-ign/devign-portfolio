import React from 'react';

interface NavigationMenuToggleProps {
  open: boolean;
  onClick: () => void;
  controls: string;
  openLabel: string;
  closeLabel: string;
  lineClassName: string;
  className?: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

const NavigationMenuToggle: React.FC<NavigationMenuToggleProps> = ({
  open, onClick, controls, openLabel, closeLabel, lineClassName, className = '', buttonRef,
}) => (
  <button
    ref={buttonRef}
    type="button"
    aria-label={open ? closeLabel : openLabel}
    aria-expanded={open}
    aria-controls={controls}
    onClick={onClick}
    className={`group grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${className}`}
  >
    <span aria-hidden="true" className="relative block h-[17px] w-5">
      <span className={`absolute left-0 top-0 h-[3px] w-5 rounded-full transition-transform duration-300 ease-out ${lineClassName} ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
      <span className={`absolute left-0 top-[7px] h-[3px] w-5 rounded-full transition-[opacity,transform] duration-200 ${lineClassName} ${open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'}`} />
      <span className={`absolute bottom-0 left-0 h-[3px] w-5 rounded-full transition-transform duration-300 ease-out ${lineClassName} ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
    </span>
  </button>
);

export default NavigationMenuToggle;
