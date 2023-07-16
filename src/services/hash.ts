import pako from "pako";
import base64 from "base64-js";
import pgp from "./pgp";

async function getChecksum(bytes: Uint8Array) {
  const sha1 = await crypto.subtle.digest("SHA-1", bytes);
  return new Uint8Array(sha1);
}

async function isChecksumOk(checksum: Uint8Array, data: Uint8Array) {
  const actualChecksum = await getChecksum(data);
  return checksum.join() === actualChecksum.join();
}

/* Encoding:

Header (not part of base64):

1 byte  - type/version (Uint8 as hex string) - even for version, odd for version with pass
4 byte - checksum (Uint32 as hex string)

General info:

4 bytes - Unicode timestamp without milliseconds (Uint32)
1 byte  - title length (Uint8)
X bytes - title bytes (utf8 encoded)

For each file:

1 byte  - file name length (Uint8)
X bytes - file name bytes (utf8 encoded)
1 byte  - file mime length (Uint8)
X bytes - file mime bytes (utf8 encoded)
4 bytes - file content length (Uint32)
X bytes - file content bytes (raw bytes)

Checksum:

20 bytes - SHA-1 hash of general info and files data

*/

const VERSION = 1;

const TIMESTAMP_SIZE = 4;
const TITLE_LENGTH_SIZE = 1;
const NAME_LENGTH_SIZE = 1;
const MIME_LENGTH_SIZE = 1;
const DATA_LENGTH_SIZE = 4;
const CHECKSUM_SIZE = 20;

async function encode(title: string, files: File[], password?: string) {
  if (files.length === 0) {
    return null;
  }

  const headerByte = (VERSION - 1) * 2 + (password ? 1 : 0);
  const headerHex = headerByte.toString(16).padStart(2, "0");

  const timestampBytes = new Uint32Array([Math.floor(Date.now() / 1000)]);
  const titleBytes = new TextEncoder().encode(title);

  const filesBytes = [];

  for (const file of files) {
    filesBytes.push({
      name: new TextEncoder().encode(file.name),
      mime: new TextEncoder().encode(file.type),
      data: new Uint8Array(await file.arrayBuffer()),
    });
  }

  const totalSize =
    timestampBytes.byteLength +
    TITLE_LENGTH_SIZE +
    titleBytes.byteLength +
    filesBytes.reduce(
      (len, bytes) =>
        len +
        NAME_LENGTH_SIZE +
        bytes.name.byteLength +
        MIME_LENGTH_SIZE +
        bytes.mime.byteLength +
        DATA_LENGTH_SIZE +
        bytes.data.byteLength,
      0
    );

  const encoded = new Uint8Array(totalSize);

  let offset = 0;

  encoded.set(new Uint8Array(timestampBytes.buffer), offset);
  offset += timestampBytes.byteLength;

  encoded[offset] = titleBytes.byteLength;
  offset += TITLE_LENGTH_SIZE;

  encoded.set(titleBytes, offset);
  offset += titleBytes.byteLength;

  for (const bytes of filesBytes) {
    encoded[offset] = bytes.name.byteLength;
    offset += NAME_LENGTH_SIZE;

    encoded.set(bytes.name, offset);
    offset += bytes.name.byteLength;

    encoded[offset] = bytes.mime.byteLength;
    offset += MIME_LENGTH_SIZE;

    encoded.set(bytes.mime, offset);
    offset += bytes.mime.byteLength;

    encoded.set(
      new Uint8Array(new Uint32Array([bytes.data.byteLength]).buffer),
      offset
    );
    offset += DATA_LENGTH_SIZE;

    encoded.set(bytes.data, offset);
    offset += bytes.data.byteLength;
  }

  const bytes = password
    ? pako.deflateRaw(await pgp.encrypt(encoded, password))
    : pako.deflateRaw(encoded);

  const checksum = await getChecksum(bytes);

  const withChecksum = new Uint8Array(bytes.byteLength + checksum.byteLength);
  withChecksum.set(bytes);
  withChecksum.set(checksum, bytes.byteLength);

  const asBase64 = base64.fromByteArray(withChecksum);

  return `${headerHex}${asBase64}`;
}

async function decode(
  hash: string,
  pass?: string
): Promise<{ date: Date; title: string; files: File[] }> {
  const base64str = hash.slice(2);

  const bytesWithChecksum = base64.toByteArray(base64str);

  const checksum = bytesWithChecksum.slice(-CHECKSUM_SIZE);
  const compressedBytes = bytesWithChecksum.slice(0, -CHECKSUM_SIZE);

  if (!(await isChecksumOk(checksum, compressedBytes))) {
    throw new Error("Wrong checksum");
  }

  const bytes = pass
    ? await pgp.decrypt(pako.inflateRaw(compressedBytes), pass)
    : pako.inflateRaw(compressedBytes);

  if (bytes === null) {
    throw new Error("Wrong password");
  }

  let pointer = 0;

  const timestamp = new Uint32Array(
    bytes.slice(pointer, pointer + TIMESTAMP_SIZE).buffer
  )[0];
  const date = new Date(timestamp * 1000);
  pointer += TIMESTAMP_SIZE;

  const titleLength = bytes[pointer];
  pointer += TITLE_LENGTH_SIZE;

  const title = new TextDecoder().decode(
    bytes.slice(pointer, pointer + titleLength)
  );
  pointer += titleLength;

  const files: File[] = [];

  while (pointer < bytes.byteLength) {
    const nameLength = bytes[pointer];
    pointer += NAME_LENGTH_SIZE;

    const fileName = new TextDecoder().decode(
      bytes.slice(pointer, pointer + nameLength)
    );
    pointer += nameLength;

    const mimeLength = bytes[pointer];
    pointer += MIME_LENGTH_SIZE;

    const mime = new TextDecoder().decode(
      bytes.slice(pointer, pointer + mimeLength)
    );
    pointer += mimeLength;

    const dataLength = new Uint32Array(
      bytes.slice(pointer, pointer + DATA_LENGTH_SIZE).buffer
    )[0];
    pointer += DATA_LENGTH_SIZE;

    const data = bytes.slice(pointer, pointer + dataLength);
    pointer += dataLength;

    files.push(
      new File([data], fileName, { type: mime, lastModified: date.getTime() })
    );
  }

  return { date, title, files };
}

export default { encode, decode };
