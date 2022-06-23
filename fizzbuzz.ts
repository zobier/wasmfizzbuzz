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
        (i32.sub
          (local.get $len)
          (i32.const 1))))
    (block
      (loop
        (br_if 1
          (i32.ge_u
            (local.get $start)
            (local.get $end)))
        (local.set $tmp
          (i32.load8_u
            (local.get $start)))
        (i32.store8
          (local.get $start)
          (i32.load8_u
            (local.get $end)))
        (i32.store8
          (local.get $end)
          (local.get $tmp))
        (local.set $start
          (i32.add
            (local.get $start)
            (i32.const 1)))
        (local.set $end
          (i32.sub
            (local.get $end)
            (i32.const 1)))
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
      (i32.store8
        (i32.add
          (local.get $chrptr)
          (local.get $i))
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
        (call $ui64toa
          (local.get $num)
          (local.get $chrptr))))
    (i32.store8
      (local.get $chrptr)
      (i32.const 10))
    (i32.add
      (local.get $chrptr)
      (i32.const 1)))
  (func $print_word
    (param $word i32)
    (param $newline i32)
    (param $chrptr i32)
    (result i32)
    (i32.store
      (local.get $chrptr)
      (local.get $word))
    (local.set $chrptr
      (i32.add
        (local.get $chrptr)
        (i32.const 4)))
    (if
      (local.get $newline)
      (then
        (i32.store8
          (local.get $chrptr)
          (i32.const 10))
        (local.set $chrptr
          (i32.add
            (local.get $chrptr)
            (i32.const 1)))))
    (local.get $chrptr))
  (func
    (export "fizzBuzz")
    (param $i i64)
    (param $copy_from i32)
    (param $copy_len i32)
    (param $generate_bytes i32)
    (result i32 i64)
    (local $chrptr i32)
    (call $mem_copy
      (local.get $copy_from)
      (i32.const 0)
      (local.get $copy_len))
    (local.set $chrptr
      (local.get $copy_len))
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
        (call $print_word
          (i32.const 2054842694) ;; Fizz
          (i32.const 1)
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 4))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_word
          (i32.const 2054845762) ;; Buzz
          (i32.const 1)
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_word
          (i32.const 2054842694) ;; Fizz
          (i32.const 1)
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
        (call $print_word
          (i32.const 2054842694) ;; Fizz
          (i32.const 1)
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_word
          (i32.const 2054845762) ;; Buzz
          (i32.const 1)
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_num
          (i64.add
            (local.get $i)
            (i64.const 11))
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_word
          (i32.const 2054842694) ;; Fizz
          (i32.const 1)
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
        (call $print_word
          (i32.const 2054842694) ;; Fizz
          (i32.const 0)
          (local.get $chrptr)))
      (local.set $chrptr
        (call $print_word
          (i32.const 2054845762) ;; Buzz
          (i32.const 1)
          (local.get $chrptr)))
      (local.set $i
        (i64.add
          (local.get $i)
          (i64.const 15)))
      (br_if 0
        (i32.lt_u
          (local.get $chrptr)
          (local.get $generate_bytes))))
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
    initial: 1,
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
