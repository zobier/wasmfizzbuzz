import wabt from "wabt";

export default wabt().then(async ({ parseWat }) => {
  const module = await WebAssembly.compile(
    parseWat(
      "inline",
      `;;wasm
(module
  (import "env" "memory"
    (memory 1))
  (func $mem_copy
    (param $from i32)
    (param $to i32)
    (param $len i32)
    (local $i i32)
    (local.set $i
      (i32.const 0))
    (loop $copy
      (i32.store
        (i32.add
          (local.get $to)
          (i32.mul
            (local.get $i)
            (i32.const 4)))
        (i32.load
          (i32.add
            (local.get $from)
            (i32.mul
              (local.get $i)
              (i32.const 4)))))
      (br_if $copy
        (i32.lt_u
          (local.tee $i
            (i32.add
              (local.get $i)
              (i32.const 1)))
          (local.get $len)))))
  (func $reverse
    (export "reverse")
    (param $start i32)
    (param $len i32)
    (local $end i32)
    (local $tmp i32)
    (local.set $end
      (i32.add
        (local.get $start)
        (i32.mul
          (i32.sub
            (local.get $len)
            (i32.const 1))
          (i32.const 4))))
    (block
      (loop
        (br_if 1
          (i32.ge_u
            (local.get $start)
            (local.get $end)))
        (local.set $tmp
          (i32.load
            (local.get $start)))
        (i32.store
          (local.get $start)
          (i32.load
            (local.get $end)))
        (i32.store
          (local.get $end)
          (local.get $tmp))
        (local.set $start
          (i32.add
            (local.get $start)
            (i32.const 4)))
        (local.set $end
          (i32.sub
            (local.get $end)
            (i32.const 4)))
        (br 0))))
  (func $ui64toa
    (export "ui64toa")
    (param $num i64)
    (param $chrptr i32)
    (result i32)
    (local $i i32)
    (local $rem i32)
    (loop
      (local.set $rem
        (i32.wrap_i64
          (i64.rem_u
            (local.get $num)
            (i64.const 10))))
      (i32.store
        (i32.add
          (local.get $chrptr)
          (i32.mul
            (local.get $i)
            (i32.const 4)))
        (i32.add
          (local.get $rem)
          (i32.const 48)))
      (local.set $i
        (i32.add
          (local.get $i)
          (i32.const 1)))
      (local.set $num
        (i64.div_u
          (local.get $num)
          (i64.const 10)))
      (br_if 0
        (i64.gt_u
          (local.get $num)
          (i64.const 0))))
      (call $reverse
        (local.get $chrptr)
        (local.get $i))
      (local.get $i))
  (func $print_num
    (param $num i64)
    (param $chrptr i32)
    (result i32)
    (local.set $chrptr
      (i32.add
        (local.get $chrptr)
        (i32.mul
          (call $ui64toa
            (local.get $num)
            (local.get $chrptr))
          (i32.const 4))))
    (i32.store
      (local.get $chrptr)
      (i32.const 10))
    (i32.add
      (local.get $chrptr)
      (i32.const 4)))
  (func $print_fizz
    (param $chrptr i32)
    (result i32)
    (i32.store
      (local.get $chrptr)
      (i32.const 70))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 4))
      (i32.const 105))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 8))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 12))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 16))
      (i32.const 10))
    (i32.add
      (local.get $chrptr)
      (i32.const 20)))
  (func $print_buzz
    (param $chrptr i32)
    (result i32)
    (i32.store
      (local.get $chrptr)
      (i32.const 66))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 4))
      (i32.const 117))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 8))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 12))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 16))
      (i32.const 10))
    (i32.add
      (local.get $chrptr)
      (i32.const 20)))
  (func $print_fizzbuzz
    (param $chrptr i32)
    (result i32)
    (i32.store
      (local.get $chrptr)
      (i32.const 70))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 4))
      (i32.const 105))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 8))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 12))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 16))
      (i32.const 66))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 20))
      (i32.const 117))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 24))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 28))
      (i32.const 122))
    (i32.store
      (i32.add
        (local.get $chrptr)
        (i32.const 32))
      (i32.const 10))
    (i32.add
      (local.get $chrptr)
      (i32.const 36)))
  (func
    (export "fizzBuzz")
    (param $i i64)
    (param $copy_from i32)
    (param $copy_len i32)
    (param $generate_words i32)
    (result i32 i64)
    (local $chrptr i32)
    (local $end i32)
    (if
      (i32.ge_u
        (local.get $copy_len)
        (i32.const 0))
      (then
        (call $mem_copy
          (local.get $copy_from)
          (i32.const 0)
          (local.get $copy_len))))
    (local.set $chrptr
      (i32.mul
        (local.get $copy_len)
        (i32.const 4)))
    (local.set $end
      (i32.mul
        (local.get $generate_words)
        (i32.const 4)))
    (loop
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 1))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 2))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_fizz
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 4))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_buzz
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_fizz
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 7))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 8))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_fizz
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_buzz
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 11))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_fizz
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 13))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 14))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_fizzbuzz
          (local.get $chrptr)))
      (local.set $i
        (i64.add
          (local.get $i)
          (i64.const 15)))
      (br_if 0
        (i32.lt_u
          (local.get $chrptr)
          (local.get $end))))
    (local.get $chrptr)
    (local.get $i)))`,
      {
        multi_value: true,
      }
    ).toBinary({
      write_debug_names: true,
    }).buffer
  );
  const memory = new WebAssembly.Memory({
    initial: 2,
  });
  const { exports } = await WebAssembly.instantiate(module, {
    env: {
      memory,
    },
  });

  return {
    exports,
    memory,
  };
}) as Promise<{
  exports: {
    fizzBuzz: (
      start: bigint,
      copyFrom: number,
      copyLen: number,
      generateBytes: number
    ) => [number, bigint];
    reverse: (start: number, len: number) => void;
    ui64toa: (num: BigInt, charptr: number) => number;
  };
  memory: WebAssembly.Memory;
}>;
