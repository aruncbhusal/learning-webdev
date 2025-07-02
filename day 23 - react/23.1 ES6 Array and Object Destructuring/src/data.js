const animals = [
  { name: "cat", sound: "meow", meow: { day: 5, night: 7 } },
  { name: "dog", sound: "woof" },
];

function useAnimal(animal) {
  return [
    animal.name,
    function makeSound() {
      console.log(animal.sound);
    },
  ];
}

export default animals;
export { useAnimal };
