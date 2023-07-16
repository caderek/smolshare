import * as openpgp from "openpgp/lightweight";

console.log(openpgp);

async function encrypt(bytes: Uint8Array, password: string) {
  const message = await openpgp.createMessage({ binary: bytes });

  const encrypted = await openpgp.encrypt({
    message,
    passwords: [password],
    format: "binary",
  });

  return encrypted as Uint8Array;
}

async function decrypt(bytes: Uint8Array, password: string) {
  const message = await openpgp.readMessage({
    binaryMessage: bytes,
  });

  try {
    const decrypted = await openpgp.decrypt({
      message,
      passwords: [password],
      format: "binary",
    });

    return decrypted.data as Uint8Array;
  } catch (e) {
    return null;
  }
}

export default { encrypt, decrypt };
