import assert from "node:assert";
import test from "node:test";
import module from "./fizzbuzz";

const readString = (buffer: ArrayBuffer, start: number, length: number) =>
  new TextDecoder().decode(new Uint8Array(buffer, start, length));

const writeString = (buffer: ArrayBuffer, start: number, string: string) =>
  new Uint8Array(buffer).set(new TextEncoder().encode(string), start);

const reverseString = (string: string) => string.split("").reverse().join("");

const MAX_I64 = BigInt("18446744073709551615");

test("reverse", async () => {
  const {
    exports: { reverse },
    memory,
  } = await module;
  const string = "hello";
  writeString(memory.buffer, 0, string);
  reverse(0, string.length);
  const result = readString(memory.buffer, 0, string.length);
  assert.equal(reverseString(string), result);
});

test("ui64toa", async () => {
  const {
    exports: { ui64toa },
    memory,
  } = await module;
  let number = BigInt(0);
  while (number < MAX_I64) {
    const length = ui64toa(number, 0);
    const result = readString(memory.buffer, 0, length);
    assert.strictEqual(result, number.toString());
    number += BigInt(Math.floor(length ** length ** 0.8));
  }
});
