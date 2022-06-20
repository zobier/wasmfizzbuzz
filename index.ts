import module from "./fizzbuzz";

module.then(({ exports: { fizzBuzz } }) => fizzBuzz());
