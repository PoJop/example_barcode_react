# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
// This is necessary because Typescript refuses to import the file unless it has
// an export apparently. 🥲
export {};

declare global {
    /**
     * The possible types of barcode format that can be detected using the
     * Barcode Detection API. This list may change in the future.
     * Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API
     */
    type BarcodeFormat = 'aztec' 
        | 'code_128' 
        | 'code_39' 
        | 'code_93' 
        | 'codabar' 
        | 'data_matrix' 
        | 'ean_13' 
        | 'ean_8' 
        | 'itf' 
        | 'pdf417' 
        | 'qr_code' 
        | 'upc_a' 
        | 'upc_e' 
        | 'unknown';

    /**
     * The return type of the Barcode Detect API `detect` function that
     * describes a barcode that has been recognized by the API.
     */
    interface DetectedBarcode {
        /** 
         * A DOMRectReadOnly, which returns the dimensions of a rectangle
         * representing the extent of a detected barcode, aligned with the
         * image 
         */
        boundingBox: DOMRectReadOnly;
        /**
         * The x and y co-ordinates of the four corner points of the detected
         * barcode relative to the image, starting with the top left and working
         * clockwise. This may not be square due to perspective distortions
         * within the image. 
         */
        cornerPoints: {
            x: number,
            y: number,
        }[4];
        /**
         * The detected barcode format
         */
        format: BarcodeFormat;

        /**
         * A string decoded from the barcode data
         */
        rawValue: string;
    }

    /**
     * Options for describing how a BarcodeDetector should be initialised
     */
    interface BarcodeDetectorOptions {
        /** 
         * Which formats the barcode detector should detect 
         */
        formats: BarcodeFormat[];
    }

    /**
     * The BarcodeDetector interface of the Barcode Detection API allows
     * detection of linear and two dimensional barcodes in images.
     */
    class BarcodeDetector {
        /** 
         * Initialize a Barcode Detector instance 
         */
        constructor(options?: BarcodeDetectorOptions): BarcodeDetector;

        /**
         * Retrieve the formats that are supported by the detector 
         */
        static getSupportedFormats(): Promise<BarcodeFormat[]>;

        /** 
         * Attempt to detect barcodes from an image source  
         */
        public detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>;
    }

    // Also add the class to the window so we can do feature detection
    interface Window {
        BarcodeDetector: BarcodeDetector;
    }
}