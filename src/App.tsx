import { useState } from "react";
import { Barcode } from "./Barcode";

export default function App() {
  const [open, setOpen] = useState(false);

  if (open) {
    return <Barcode callback={alert} close={() => setOpen(false)} />;
  }

  return (
    <button type="button" onClick={() => setOpen(true)}>
      Start
    </button>
  );
}
