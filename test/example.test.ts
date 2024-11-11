import { compareAnswer, getBall, getRandomNumber, getStrike, inputValidate } from "..";

describe("getRandomNumber()", () => {
  test("세자리인지?", () => {
    expect(getRandomNumber()).toHaveLength(3);
  });
  test("중복되지 않는 숫자인지?", () => {
    const randomNumber = getRandomNumber();
    const setSize = new Set([...randomNumber]).size;
    expect(setSize).toEqual(3);
  });
  test("0이 존재하지 않는지?", () => {
    expect(getRandomNumber().includes("0")).toBeFalsy();
  });
});

describe("inputValidate()", () => {
  test("영문 입력", () => {
    expect(inputValidate("test")).toBeFalsy();
  });
  test("3자리 이외 숫자 입력 #1", () => {
    expect(inputValidate("123456")).toBeFalsy();
  });
  test("3자리 이외 숫자 입력 #2", () => {
    expect(inputValidate("12")).toBeFalsy();
  });
  test("중복 숫자 입력", () => {
    expect(inputValidate("151")).toBeFalsy();
  });
});

describe('getStrike()', () => {
  test('3스트라이크', () => {
    expect(getStrike('123', '123')).toEqual(3);
  });
  test('2스트라이크', () => {
    expect(getStrike('123', '124')).toEqual(2);
  });
  test('1스트라이크', () => {
    expect(getStrike('123', '145')).toEqual(1);
  });
  test('0스트라이크', () => {
    expect(getStrike('123', '456')).toEqual(0);
  });
})

describe('getBall()', () => {
  test('3볼', () => {
    expect(getBall('123', '312')).toEqual(3);
  });
  test('2볼', () => {
    expect(getBall('123', '214')).toEqual(2);
  });
  test('1볼', () => {
    expect(getBall('123', '451')).toEqual(1);
  });
  test('0볼', () => {
    expect(getBall('123', '456')).toEqual(0);
  });
})

describe('compareAnswer()', () => {
  test('3스트라이크', () => {
    expect(compareAnswer('123', '123')).toBeTruthy()
  });
  test('n스트라이크', () => {
    expect(compareAnswer('123', '124')).toBeFalsy()
  });
  test('n볼', () => {
    expect(compareAnswer('123', '312')).toBeFalsy()
  });
  test('n볼 n스트라이크', () => {
    expect(compareAnswer('123', '132')).toBeFalsy()
  });
  test('낫싱', () => {
    expect(compareAnswer('123', '456')).toBeFalsy()
  });
})