/*
@title: Platformer_Game
@author: Adya
@tags: []
@addedOn: 2024-31-07
*/

const player = "p";
const platform = "x";
const path = "y";
const goal = "g";
const enemy = "e";
const powerUp = "u";
const coin = "c";
const spike = "s";
const movingPlatform = "m";

setLegend(
  [player, bitmap`
................
................
................
.......0........
.....00.000.....
....0.....00....
....0.0.0..0....
....0......0....
....0......0....
....00....0.....
......00000.....
......0...0.....
....000...000...
................
................
................`],
  [platform, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [path, bitmap`
DDDDDDDDDDDDDDDD
D0000DDD000DDDDD
D00DDDDDD000DDDD
D0DDDDDDDDD000DD
DD0DDD0DDD00000D
DDD0D000DDD0000D
D0DDD000DDD0000D
D0DDDDD0D0D0000D
D0DD0DDD00D0000D
D0DD0DDD0DD0000D
D00DDDDDD0D0000D
D000DDDDD0D0000D
D000DDDDD0D0000D
D000000DDDDDD00D
D00000000D000DDD
DDDDDDDDDDDDDDDD`],
  [goal, bitmap`
................
................
................
....444444......
...44....44.....
...4......4.....
...4.......4....
...4.......4....
...4.......4....
...44......4....
....4......4....
....44....44....
.....444444.....
................
................
................`],
  [enemy, bitmap`
................
................
................
....111111......
...11....11.....
...1......1.....
...1.......1....
...1.......1....
...1.......1....
...11......1....
....1......1....
....11....11....
.....111111.....
................
................
................`],
  [powerUp, bitmap`
................
................
................
....222222......
...22....22.....
...2......2.....
...2.......2....
...2.......2....
...2.......2....
...22......2....
....2......2....
....22....22....
.....222222.....
................
................
................`],
  [coin, bitmap`
................
................
................
.....6666.......
....66FF66......
....6F66666.....
....6F66666.....
....6666666.....
....6F66666.....
....666666......
......666.......
................
................
................
................
................`],
  [spike, bitmap`
................
................
........3.......
.......333......
......33333.....
.....3333333....
................
................
................
................`],
  [movingPlatform, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`]
);

let level = 0;

const levels = [
  map`
p..c...............
..y..xp............
..y..xyp........s..
..y..xyyp......ss.g
..y..xyp......sss..
..y..xyp.....ssss..
..y..xyyp...sssss..
..y..xyyp..ssssss..
xxxyyxyyppssssssss.`,
  map`
p...............
..y.............
..y..xyp........
..y..xyp.....u..
..y..xyyp....g.
..y..xyp.......
..y..xyp......s
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyp..u....
..y..xyp.......
ssyss..sss.sss..
xxxxxxxxxxxxxxxx`,
  map`
p...............
..y.............
..y..xyp........
..y..xypp....u..
..y..xyyp....g.
..y..xyp.......
..y..xyp.......
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyp..m....
..y..xyp.......
..y.............
xxxxxxxxxxxxxxxx`,
  map`
p...............
..yss...........
..y..xyp.....u.
..y..xypp...ss.
..y..xyyp...sg.
..y..xyp....s.s
..y..xyp.....ss
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyyp......
..y..xyypsss...
..y..xyp.sms...
..y..xyp.sss...
ssyss..s...s.ss.
xxxxxxxxxxxxxxxx`,
  map`
p...............
..yss.......ss..
..yssxyp.....ss
..ys.xyp......g
..yssxyp...s...
..y..xyp...ssss
..y.sxyp.......
..y..xyp.......
..yssxyp.......
..y.sxyp.......
..y.sxypp......
..y.sxypp......
..y.sxypp......
..ys............
..ys............
ppysssss.ss.ss.s
xxxxxxxxxxxxxxxx`
];

const currentLevel = levels[level];
setMap(currentLevel);

setSolids([player, platform, path, movingPlatform]);

setPushables({
  [player]: []
});

onInput("w", () => {
  getFirst(player).y -= 1; // Jump
});

onInput("a", () => {
  getFirst(player).x -= 1; // Move left
});

onInput("d", () => {
  getFirst(player).x += 1; // Move right
});

setInterval(() => {
  const p = getFirst(player);
  if (p && !getTile(p.x, p.y + 1).some(t => t.type === platform || t.type === movingPlatform)) {
    p.y += 1; // Apply gravity
  }
}, 100);

afterInput(() => {
  const p = getFirst(player);
  if (p && getTile(p.x, p.y).some(t => t.type === goal)) {
    level += 1;
    const currentLevel = levels[level];
    if (currentLevel !== undefined) setMap(currentLevel);
  }
});

// Power-Up Effects
afterInput(() => {
  const p = getFirst(player);
  if (p && getTile(p.x, p.y).some(t => t.type === powerUp)) {
    // Example: Speed Boost
    p.speed = 2;
    setTimeout(() => {
      p.speed = 1;
    }, 5000); // Speed boost lasts for 5 seconds
  }
});

// Collecting Coins
let score = 0;
afterInput(() => {
  const p = getFirst(player);
  if (p && getTile(p.x, p.y).some(t => t.type === coin)) {
    score += 10;
    // Remove all coins from the tile
    getTile(p.x, p.y).forEach(t => {
      if (t.type === coin) t.remove();
    });
  }
});

// Enemy Movement
setInterval(() => {
  getAll(enemy).forEach(e => {
    e.x += 1;
    if (e.x >= 15) e.x = 0; // Loop enemy movement
  });
}, 500);

// Spike Trap
afterInput(() => {
  const p = getFirst(player);
  if (p && getTile(p.x, p.y).some(t => t.type === spike)) {
    // Example: Reduce player's health or trigger game over
    setMap(currentLevel);
  }
});

// Moving Platforms
setInterval(() => {
  getAll(movingPlatform).forEach(mp => {
    mp.x += 1;
    if (mp.x >= 15) mp.x = 0; // Loop moving platform movement
  });
}, 1000);