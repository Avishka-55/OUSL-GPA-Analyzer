import { useRef, useState } from "react";

export default function Dropzone({ label, hint, accept, onFile }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  function pick() {
    inputRef.current?.click();
  }

  return (
    <>
      <div
        id="dropzone"
        className={drag ? "dragover" : ""}
        style={{ marginTop: 24 }}
        onClick={pick}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
      >
        <div className="dz-icon">📄</div>
        <div className="dz-label">{label}</div>
        <div className="dz-hint">{hint}</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </>
  );
}