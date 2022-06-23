import { Readable } from "node:stream";
import module from "./fizzbuzz";

module.then(({ exports: { fizzBuzz }, memory }) => {
  let next = BigInt(0);
  let previousSize = 0;
  let bytesGenerated = 0;
  new Readable({
    read(size: number): void {
      [bytesGenerated, next] = fizzBuzz(
        next,
        previousSize,
        bytesGenerated - previousSize,
        size
      );
      previousSize = size;
      this.push(new Uint8Array(memory.buffer, 0, size));
    },
  }).pipe(process.stdout);
});
