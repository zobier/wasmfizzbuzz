import wabt from "wabt";

const PAGES_OF_MEMORY = 1;

wabt().then(async ({ parseWat }) => {
  const module = await WebAssembly.compile(
    parseWat(
      "inline",
      `;;wasm
(module
  (import "env" "memory"
    (memory 1))
  (import "env" "dump"
    (func $dump
      (param i32)))
  (func $reverse
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
  (func $uitoa
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
        (call $uitoa
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
    (local $i i64)
    (local $chrptr i32)
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
      (if
        (i32.gt_u
          (i32.add
            (local.get $chrptr)
            (i32.const 207))
          (i32.const ${65536 * PAGES_OF_MEMORY}))
        (then
          (call $dump
            (local.get $chrptr))
          (local.set $chrptr
            (i32.const 0))))
      (br 0))))`,
      {
        multi_value: true,
      }
    ).toBinary({
      write_debug_names: true,
    }).buffer
  );
  const memory = new WebAssembly.Memory({
    initial: PAGES_OF_MEMORY,
  });
  const instance = await WebAssembly.instantiate(module, {
    env: {
      memory,
      dump: (length: number) =>
        process.stdout.write(new Uint8Array(memory.buffer, 0, length)),
    },
  });
  (instance.exports.fizzBuzz as Function)();
});
