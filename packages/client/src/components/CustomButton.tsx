import type React from "react";
import { useState } from "react";

interface CustomButtonProps {
  label?: string;
  onCustomPress?: () => void;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  label = "Button",
  onCustomPress,
}) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    if (onCustomPress) {
      onCustomPress();
    }
    setCount((prev) => prev + 1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        px-6 py-3
        text-white font-semibold text-lg
        rounded-8 shadow-lg
        bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-300
      `}
    >
      <span className="flex items-center gap-2">
        {label} + {count}
      </span>
    </button>
  );
};
