const helloWorld = require('../src/helloworld');

test('Test hello World Program', () => {
  const expectedMessage = "Hello ___";
  const actualMessage = helloWorld();
  expect(actualMessage).toBe(expectedMessage);
});