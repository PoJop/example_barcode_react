import { useEffect, useRef, useState } from "react";
import { BarcodeReader } from "./libs/BarcodeReader";

type Props = {
  callback: (barcode: string) => void;
  close: () => void;
};

export function Barcode({ callback, close }: Props) {
  const barcodeRef = useRef<BarcodeReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [error, setError] = useState<ErrorEntity | null>(null);
  const [multipleBarcodes, setMultipleBarcodes] = useState<
    DetectedBarcode[] | null
  >(null);

  useEffect(() => {
    if (!videoRef.current) return;

    barcodeRef.current = new BarcodeReader(videoRef.current);
    handler();

    return () => {
      barcodeRef.current?.destroy();
      barcodeRef.current = null;
    };
  }, []);

  const handler = async () => {
    setError(null);
    if (!barcodeRef.current) return;

    const res = await barcodeRef.current.start();

    if (barcodeRef.current.getIsError(res)) {
      return setError(res);
    }

    if (res.barcodes.length > 1) {
      setMultipleBarcodes(res.barcodes);
    }

    handleSelect(res.barcodes[0]);
  };

  const handleSelect = (barcode: DetectedBarcode) => {
    callback(barcode.rawValue);
    close();
  };

  return (
    <aside className="fixed top-0 left-0 z-50 w-full h-full bg-white">
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />

        {error && (
          <div className="absolute top-0 left-0 grid w-full h-full gap-4">
            <div>{error.message}</div>
            <button type="button" onClick={handler}>
              Try again!
            </button>
            <button type="button" onClick={close}>
              No
            </button>
          </div>
        )}
        {!!multipleBarcodes?.length && (
          <div className="absolute top-0 left-0 w-full h-full">
            <ul className="grid gap-4">
              {multipleBarcodes.map((elem, idx) => (
                <li key={idx}>
                  <button type="button" onClick={() => handleSelect(elem)}>
                    {elem.rawValue}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
