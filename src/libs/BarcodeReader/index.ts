export const EnumBarcodeError = Object.freeze({
  UNKNOWN: 0,
  PERMISSION: 1,
  VIDEO: 2,
  ABORT: 3,
});

export class BarcodeReader {
  private stream: MediaStream | null = null;
  private intervalRef: number | null = null;
  private abort: AbortController | null = null;
  videoElem: HTMLVideoElement;
  interval: number;

  constructor(videoElem: HTMLVideoElement, interval: number = 800) {
    if (!(videoElem instanceof HTMLVideoElement))
      throw new Error("videoElement must be HTMLVideoElement");

    this.videoElem = videoElem;
    this.interval = interval;
  }

  private async getStream() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });
    } catch (error) {
      console.error(error);
    }

    return this.stream;
  }

  destroy() {
    this.abort?.abort();
    this.abort = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;

    if (typeof this.intervalRef === "number") {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  }

  private getError(type: BarcodeError, message: string): ErrorEntity {
    return {
      message,
      type,
    };
  }

  getIsError(obj: unknown): obj is ErrorEntity {
    return (
      typeof obj === "object" &&
      obj !== null &&
      !Array.isArray(obj) &&
      "type" in obj &&
      "message" in obj
    );
  }

  async start(): Promise<ErrorEntity | { barcodes: DetectedBarcode[] }> {
    try {
      this.destroy();
      this.abort = new AbortController();

      const barcodeDetector = new (
        await import("barcode-detector/pure")
      ).BarcodeDetector();

      const barcodes = await new Promise<DetectedBarcode[]>(
        (resolve, reject) => {
          (async () => {
            const stream = await this.getStream();
            if (!stream)
              return reject(
                this.getError(
                  EnumBarcodeError.PERMISSION,
                  "No access to camera"
                )
              );

            this.videoElem.addEventListener(
              "error",
              () =>
                reject(
                  this.getError(
                    EnumBarcodeError.VIDEO,
                    "Something went wrong with the video"
                  )
                ),
              { signal: this.abort?.signal }
            );

            this.videoElem.autoplay = true;
            this.videoElem.playsInline = true;
            this.videoElem.srcObject = stream;
            this.videoElem.play();

            this.intervalRef = setInterval(() => {
              if (this.videoElem.paused)
                reject(
                  this.getError(EnumBarcodeError.VIDEO, "The video was stopped")
                );

              barcodeDetector
                .detect(this.videoElem)
                .then((barcodes) => barcodes.length && resolve(barcodes));
            }, this.interval);

            this.abort?.signal?.addEventListener("abort", () => {
              reject(this.getError(EnumBarcodeError.ABORT, "Aborted"));
            });
          })();
        }
      );

      this.destroy();

      return { barcodes };
    } catch (error) {
      this.destroy();
      return this.getIsError(error)
        ? error
        : { message: "Something went wrong", type: EnumBarcodeError.UNKNOWN };
    }
  }
}