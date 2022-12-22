import { useTranslation, Trans } from "react-i18next";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import "./index.css";

function HelpIcon({ className }) {
  const openUrl = (url) => {
    window.electronAPI.emit("open-url", url);
  };
  return (
    <Tippy
      content={
        <div className="auth-token-help">
          <Trans
            i18nKey="ngrok tips" // optional -> fallbacks to defaults if not provided
            components={{
              ngrok_a: (
                <a
                  href="https://ngrok.com/"
                  onClick={(e) => {
                    e.preventDefault();
                    openUrl("https://ngrok.com/");
                  }}
                />
              ),
              token_a: (
                <a
                  href="https://dashboard.ngrok.com/get-started/your-authtoken"
                  onClick={(e) => {
                    e.preventDefault();
                    openUrl(
                      "https://dashboard.ngrok.com/get-started/your-authtoken"
                    );
                  }}
                />
              ),
            }}
          />
        </div>
      }
      theme={"default"}
      maxWidth={360}
      interactive
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16px"
        height="16px"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        className={className}
      >
        <path
          fill="#d1d5db"
          d="M11.95 18q.525 0 .888-.363q.362-.362.362-.887t-.362-.887q-.363-.363-.888-.363t-.888.363q-.362.362-.362.887t.362.887q.363.363.888.363Zm.15-10.3q.7 0 1.125.387q.425.388.425 1.013q0 .425-.287.862q-.288.438-.813.913q-.75.65-1.1 1.25q-.35.6-.35 1.2q0 .35.263.587q.262.238.612.238t.625-.25q.275-.25.35-.625q.075-.425.338-.787q.262-.363.862-.938q.775-.725 1.088-1.325q.312-.6.312-1.325q0-1.275-.962-2.088Q13.625 6 12.1 6q-1.05 0-1.862.4q-.813.4-1.263 1.225q-.175.325-.125.637q.05.313.35.513q.325.2.713.125q.387-.075.637-.425q.275-.375.663-.575q.387-.2.887-.2ZM12 22q-2.05 0-3.875-.788q-1.825-.787-3.187-2.137q-1.363-1.35-2.15-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.15-3.175Q6.3 3.575 8.125 2.787Q9.95 2 12 2q2.1 0 3.925.787q1.825.788 3.175 2.138q1.35 1.35 2.125 3.175Q22 9.925 22 12t-.775 3.9q-.775 1.825-2.125 3.175q-1.35 1.35-3.175 2.137Q14.1 22 12 22Z"
        />
      </svg>
    </Tippy>
  );
}

export default HelpIcon;
