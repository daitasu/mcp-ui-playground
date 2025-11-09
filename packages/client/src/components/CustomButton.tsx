import React, { useState } from "react";

interface CustomButtonProps {
  label?: string;
  onPress?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(({ label = "Button", onPress }, ref) => {
  const [count, setCount] = useState(0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onPress) {
      onPress();
    }

    setCount((prev) => prev + 1);
  };

  return (
    <button
      ref={ref}
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
});
CustomButton.displayName = "CustomButton";
