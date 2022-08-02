import { blocks } from "./blocks";

var randomOne = Math.floor(Math.random() * 54);
var randomTwo = Math.floor(Math.random() * 54);
var randomThree = Math.floor(Math.random() * 54);
var randomFour = Math.floor(Math.random() * 54);
var randomFive = Math.floor(Math.random() * 54);
var randomSix = Math.floor(Math.random() * 54);

var currentdate: any = new Date();
var oneJan: any = new Date(currentdate.getFullYear(),0,1);
var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);

var month = currentdate.getMonth();


export const UserInfo = {
  language: "english",
  weekly: {
    week: result,
    score: 0
  },
  monthly: {
    month: month,
    score: 0
  },
  overall: 0,
  isSaved: false,
  today: {
    date: (new Date()).toLocaleDateString('en-GB'),
    score: 0
  },
  score: 0,
  delete: 3,
  add: 3,
  undo: 1,
  moves: 3,
  sounds: true,
  firstObject: blocks[randomOne],
  secondObject: blocks[randomTwo],
  thirdObject: blocks[randomThree],
  nextFirst: blocks[randomFour],
  nextSecond: blocks[randomFive],
  nextThird: blocks[randomSix],
  playground: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  lastSnapshot: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
}
