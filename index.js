"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomNumber = getRandomNumber;
exports.inputValidate = inputValidate;
exports.compareAnswer = compareAnswer;
exports.getStrike = getStrike;
exports.getBall = getBall;
var readline = require("node:readline/promises");
var process_1 = require("process");
var rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
startGame();
function startGame() {
    return __awaiter(this, void 0, void 0, function () {
        var result, randomNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rl.question("게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n")];
                case 1:
                    result = _a.sent();
                    if (result === "1") {
                        randomNumber = getRandomNumber();
                        console.log("\n컴퓨터가 숫자를 뽑았습니다.\n");
                        // console.log(`정답: ${randomNumber}`);
                        inputAnswer(randomNumber);
                    }
                    else if (result === "9") {
                        endGame();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getRandomNumber() {
    var numberSet = new Set();
    while (numberSet.size < 3) {
        var randomNumber = Math.floor(Math.random() * 9) + 1;
        numberSet.add(randomNumber);
    }
    var returnRandomNumber = Array.from(numberSet).join("");
    return returnRandomNumber;
}
function inputAnswer(randomNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var answer, isStrike;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rl.question("숫자를 입력해주세요: ")];
                case 1:
                    answer = _a.sent();
                    if (answer === "2") {
                        endGame();
                    }
                    if (!inputValidate(answer)) {
                        console.log("잘못된 값을 입력했습니다.");
                        return [2 /*return*/, inputAnswer(randomNumber)];
                    }
                    isStrike = compareAnswer(randomNumber, answer);
                    if (isStrike) {
                        console.log("\n3개의 숫자를 모두 맞히셨습니다.");
                        console.log("-------게임 종료-------\n");
                        startGame();
                    }
                    else {
                        inputAnswer(randomNumber);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function inputValidate(input) {
    if (isNaN(Number(input)))
        return false;
    if (input.length !== 3)
        return false;
    var inputSet = new Set(__spreadArray([], __read(input), false));
    if (inputSet.size !== 3)
        return false;
    return true;
}
function compareAnswer(randomNumber, answer) {
    var strike = getStrike(randomNumber, answer);
    var ball = getBall(randomNumber, answer);
    if (strike === 0 && ball > 0) {
        console.log("".concat(ball, "\uBCFC"));
    }
    else if (strike > 0 && ball === 0) {
        console.log("".concat(strike, "\uC2A4\uD2B8\uB77C\uC774\uD06C"));
    }
    else if (strike > 0 && ball > 0) {
        console.log("".concat(ball, "\uBCFC ").concat(strike, "\uC2A4\uD2B8\uB77C\uC774\uD06C"));
    }
    else {
        console.log("낫싱");
    }
    return strike === 3;
}
function getStrike(randomNumber, answer) {
    var strike = __spreadArray([], __read(randomNumber), false).map(function (element, index) {
        if (answer[index] === element)
            return element;
    })
        .filter(function (element) { return element !== undefined; }).length;
    return strike;
}
function getBall(randomNumber, answer) {
    var ball = __spreadArray([], __read(answer), false).map(function (element, index) {
        if (randomNumber[index] !== element && randomNumber.includes(element))
            return element;
    })
        .filter(function (element) { return element !== undefined; }).length;
    return ball;
}
function endGame() {
    console.log("\n애플리케이션이 종료되었습니다.");
    process.exit();
}
