import { Readable } from "node:stream";
import module from "./fizzbuzz";

module.then(({ exports: { fizzBuzz }, memory }) => {
  let next = BigInt(0);
  let previousEnd = 0;
  let bytesGenerated = 0;
  new Readable({
    read(size: number): void {
      const copyLen = (bytesGenerated - previousEnd) / 4;
      [bytesGenerated, next] = fizzBuzz(next, previousEnd, copyLen, size);
      previousEnd = size * 4;
      this.push(new Uint8Array(new Uint32Array(memory.buffer, 0, size)));
    },
  }).pipe(process.stdout);
});
