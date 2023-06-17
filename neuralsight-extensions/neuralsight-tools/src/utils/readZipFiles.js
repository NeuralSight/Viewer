import {
  BlobReader,
  ZipReader,
  ZipWriter,
} from 'https://deno.land/x/zipjs/index.js';
import { isFileTypeOkay } from './isFileOkay';

export function readZipFiles() {
  return {
    getEntries(file, options) {
      return new ZipReader(new BlobReader(file)).getEntries(options);
    },
    async getURL(entry, options) {
      return URL.createObjectURL(
        await entry.getData(new BlobWriter(), options)
      );
    },
  };
}
