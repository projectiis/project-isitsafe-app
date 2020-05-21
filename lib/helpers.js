export const generateId = () => {
  // Alphanumeric characters in Unicode are split into three sections (numbers, upper case letters, lower case letters)
  const sections = [
    { start: 48, amount: 10 },
    { start: 65, amount: 26 },
    { start: 97, amount: 26 },
  ];

  let id = '';

  for (let i = 0; i < 20; i++) {
    const selectedSection = Math.floor(Math.random() * 3);

    if (i === 0 || i % 5 !== 0) {
      const randomNumber = Math.floor(
        Math.random() * sections[selectedSection].amount +
          sections[selectedSection].start,
      );

      id += String.fromCharCode(randomNumber);
    } else {
      id += '-';

      const randomNumber = Math.floor(
        Math.random() * sections[selectedSection].amount +
          sections[selectedSection].start,
      );

      id += String.fromCharCode(randomNumber);
    }
  }

  return id;
};
