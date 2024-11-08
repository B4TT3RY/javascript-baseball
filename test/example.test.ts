import { getRandomNumber } from "..";

test("getRandomNumber() 가 세자리인지?", () => {
  expect(getRandomNumber()).toHaveLength(3);
});
