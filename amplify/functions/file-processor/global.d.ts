// amplify/functions/file-processor/global.d.ts
declare global {
  const Buffer: {
    from(data: Uint8Array): Buffer;
  };
}

export {};