import React, { useState } from "react";

interface CustomCounterProps {
  label?: string;
  onPress?: (count: number) => void;
}

export const CustomCounter = React.forwardRef<
  HTMLButtonElement,
  CustomCounterProps
>(({ label = "Button", onPress }, ref) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    if (onPress) {
      onPress(count);
    }

    setCount((prev) => prev + 1);
  };

  const handleAdd = () => {
    setCount((prev) => prev + 1);
  };

  const handleSubtract = () => {
    setCount((prev) => prev - 1);
  };

  return (
    <div>
      <p className="text-20 font-bold"> {label} </p>
      <div className="my-2 flex gap-3">
        <button
          type="button"
          onClick={handleSubtract}
          className="p-2 text-16 w-3 h-3 rounded-8 flex items-center justify-center bg-green-200 hover:opacity-60"
        >
          <span>-</span>
        </button>
        <span className="flex items-center gap-2">{count}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="p-2 text-16 w-3 h-3 rounded-8 flex items-center justify-center bg-green-200 hover:opacity-60"
        >
          <span>+</span>
        </button>
      </div>
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
        送信
      </button>
    </div>
  );
});

CustomCounter.displayName = "CustomCounter";
