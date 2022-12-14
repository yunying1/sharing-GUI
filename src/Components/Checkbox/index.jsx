import { useState } from "react";
import "./index.css";

function Checkbox({ defaultChecked = false, onClick = () => {} }) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const onClickHandle = () => {
    setIsChecked(!isChecked);
    onClick(!isChecked);
  };

  return (
    <div
      className={`checkbox ${isChecked ? "checked" : ""}`}
      onClick={onClickHandle}
    >
      {isChecked && (
        <svg
          width="10"
          height="8"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.92124 6C3.02307 6 3.11854 5.98369 3.20764 5.95105C3.29674 5.9179 3.37947 5.86184 3.45585 5.7829L7.78998 1.30263C7.92999 1.15789 8 0.980263 8 0.769736C8 0.55921 7.92363 0.375 7.77088 0.217105C7.63087 0.0723681 7.45267 0 7.23628 0C7.01989 0 6.84169 0.0723681 6.70167 0.217105L2.92124 4.125L1.26014 2.4079C1.12013 2.26316 0.94829 2.19079 0.74463 2.19079C0.54097 2.19079 0.362769 2.26974 0.210024 2.42763C0.070008 2.57237 0 2.75658 0 2.98026C0 3.20395 0.070008 3.38816 0.210024 3.53289L2.38663 5.7829C2.46301 5.86184 2.54574 5.9179 2.63485 5.95105C2.72395 5.98369 2.81941 6 2.92124 6Z"
            fill="white"
          />
        </svg>
      )}
    </div>
  );
}

export default Checkbox;
