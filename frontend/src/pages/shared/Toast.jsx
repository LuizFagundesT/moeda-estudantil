import { useState, useCallback, useEffect, useRef } from "react";

const toastStyles = `
  @keyframes kn-toast-in {
    from { opacity: 0; transform: translateX(110%); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes kn-toast-out {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(110%); }
  }

  .kn-toast-container {
    position: fixed;
    top: 82px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .kn-toast {
    pointer-events: all;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 300px;
    max-width: 380px;
    padding: 14px 16px;
    border-radius: 14px;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.45);
    box-shadow:
      0 8px 32px rgba(0,0,0,0.12),
      0 1px 0 rgba(255,255,255,0.6) inset;
    animation: kn-toast-in 0.28s cubic-bezier(0.22,1,0.36,1) forwards;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .kn-toast.leaving {
    animation: kn-toast-out 0.22s ease forwards;
  }

  .kn-toast.success {
    background: rgba(220,248,232,0.82);
    border-color: rgba(34,197,94,0.28);
  }

  .kn-toast.error {
    background: rgba(255,225,225,0.84);
    border-color: rgba(239,68,68,0.28);
  }

  .kn-toast.info {
    background: rgba(220,232,248,0.84);
    border-color: rgba(83,74,183,0.28);
  }

  .kn-toast-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
    font-size: 12px;
    font-weight: 900;
  }

  .kn-toast.success .kn-toast-icon {
    background: #22c55e;
    color: #fff;
  }

  .kn-toast.error .kn-toast-icon {
    background: #ef4444;
    color: #fff;
  }

  .kn-toast.info .kn-toast-icon {
    background: #534AB7;
    color: #fff;
  }

  .kn-toast-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .kn-toast-title {
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .kn-toast.success .kn-toast-title { color: #166534; }
  .kn-toast.error   .kn-toast-title { color: #991b1b; }
  .kn-toast.info    .kn-toast-title { color: #26215C; }

  .kn-toast-msg {
    font-family: 'Play', sans-serif;
    font-size: 12px;
    line-height: 1.5;
  }

  .kn-toast.success .kn-toast-msg { color: rgba(22,101,52,0.75); }
  .kn-toast.error   .kn-toast-msg { color: rgba(153,27,27,0.75); }
  .kn-toast.info    .kn-toast-msg { color: rgba(38,33,92,0.65);  }

  .kn-toast-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    font-size: 14px;
    line-height: 1;
    opacity: 0.4;
    transition: opacity 0.15s;
    flex-shrink: 0;
    margin-top: -1px;
  }

  .kn-toast-close:hover { opacity: 0.85; }

  .kn-toast.success .kn-toast-close { color: #166534; }
  .kn-toast.error   .kn-toast-close { color: #991b1b; }
  .kn-toast.info    .kn-toast-close { color: #26215C; }

  .kn-toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    border-radius: 0 0 14px 14px;
    transition: width linear;
  }

  .kn-toast.success .kn-toast-progress { background: #22c55e; }
  .kn-toast.error   .kn-toast-progress { background: #ef4444; }
  .kn-toast.info    .kn-toast-progress { background: #534AB7; }

  @media (max-width: 480px) {
    .kn-toast-container {
      right: 12px;
      left: 12px;
    }
    .kn-toast {
      min-width: unset;
      max-width: unset;
      width: 100%;
    }
  }
`;

const ICONS = {
  success: "✓",
  error: "✕",
  info: "i",
};

const TITLES = {
  success: "Sucesso",
  error: "Erro",
  info: "Aviso",
};

const DURATION = 4000;

let _addToast = null;

/** Chame de qualquer lugar: toast.success("msg") etc. */
export const toast = {
  success: (msg, title) => _addToast?.({ type: "success", msg, title }),
  error:   (msg, title) => _addToast?.({ type: "error",   msg, title }),
  info:    (msg, title) => _addToast?.({ type: "info",    msg, title }),
};

function ToastItem({ id, type, msg, title, onRemove }) {
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);

  function dismiss() {
    setLeaving(true);
    setTimeout(() => onRemove(id), 220);
  }

  useEffect(() => {
    const timer = setTimeout(dismiss, DURATION);

    function tick() {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={`kn-toast ${type}${leaving ? " leaving" : ""}`}
      onClick={dismiss}
      role="alert"
    >
      <div className="kn-toast-icon">{ICONS[type]}</div>

      <div className="kn-toast-body">
        <span className="kn-toast-title">{title || TITLES[type]}</span>
        {msg && <span className="kn-toast-msg">{msg}</span>}
      </div>

      <button className="kn-toast-close" onClick={(e) => { e.stopPropagation(); dismiss(); }}>
        ✕
      </button>

      <div
        className="kn-toast-progress"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

let nextId = 1;

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, msg, title }) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, msg, title }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  return (
    <>
      <style>{toastStyles}</style>
      <div className="kn-toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onRemove={removeToast} />
        ))}
      </div>
    </>
  );
}