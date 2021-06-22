// By Noxmain

/*
relation              in code  logic
a is b                "a=b"    a = b
a is same as b        "asb"    a - b = 0
a is right next to b  "arb"    a - b = 1
a is left next to b   "alb"    a - b = -1
a is next to b        "anb"    |a - b| = 1
*/

function clone(o) {
  if (o === undefined || typeof o !== 'object') {return o;}
  let tmp = Object.create(o);
  for (let key in o) {tmp[key] = clone(o[key]);}
  return tmp;
}

function isin(a, b) {
  return (b.indexOf(a) >= 0);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function Puzzle() {
  this.solution = [];
  this.conditions = [];
  this.categories = [];

  this.conditions_string = function() {

  };
  this.solution_string = function() {

  };

  this.generate = function() {

  };
  this.generate();
}
