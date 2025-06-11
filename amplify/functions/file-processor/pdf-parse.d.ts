// amplify/functions/file-processor/pdf-parse.d.ts
declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
  }
  
  function pdfParse(buffer: Buffer | Uint8Array): Promise<PDFData>;
  export = pdfParse;
}