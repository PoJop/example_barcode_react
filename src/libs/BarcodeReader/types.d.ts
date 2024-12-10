type EnumBarcodeErrorType = typeof import("./index").EnumBarcodeError;

type BarcodeError = EnumBarcodeErrorType[keyof EnumBarcodeErrorType];
type DetectedBarcode = import("barcode-detector/pure").DetectedBarcode;

type ErrorEntity = {
  type: BarcodeError;
  message: string;
};

type BarcodeReader = import("./index").BarcodeReader;
