import { blocks } from "./blocks";

var randomOne = Math.floor(Math.random() * 54);
var randomTwo = Math.floor(Math.random() * 54);
var randomThree = Math.floor(Math.random() * 54);
var randomFour = Math.floor(Math.random() * 54);
var randomFive = Math.floor(Math.random() * 54);
var randomSix = Math.floor(Math.random() * 54);




export const UserInfo = {
  weekly: 0,
  monthly: 0,
  overall: 0,
  isSaved: false,
  score: 0,
  delete: 3,
  add: 3,
  undo: 1,
  moves: 3,
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
