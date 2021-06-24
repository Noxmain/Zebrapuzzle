// By Noxmain

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

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

function Category(c, g) {
  this.content = c;
  this.grammar = g; // Die Person, die ..., wohnt neben der Person, die ....
  this.limit = function(n) {
    if (n > this.content.length) {n = this.content.length;}
    let limited = [];
    while (limited.length < n) {
      let r = Math.floor(Math.random() * this.content.length);
      if (!isin(this.content[r], limited)) {limited.push(this.content[r]);}
    }
    return new Category(limited, this.grammar);
  };
  this.grammatical = function(i, m) {
    return this.grammar[m].replace("%", this.content[i]);
  };
}

const categories = [
  new Category(["rot", "violett", "blau", "grün", "gelb", "braun", "türkis", "weiß", "grau", "schwarz"], ["im %en Haus wohnt", "wohnt im %en Haus"]),
  new Category(["Peter", "Marie", "Paul", "Anna", "Tim", "Emma", "Linus", "Mia", "Till", "Luisa"], ["% heißt", "heißt %"]),
  new Category(["Pizza", "Pasta", "Kartoffeln", "Reis", "Curry", "Obst", "Gemüse", "Burger", "Brot", "Kuchen"], ["% isst", "isst %"]),
  new Category(["Mineralwasser", "Apfelsaft", "Orangensaft", "Milch", "Tee", "Limonade", "Kakao", "Bier", "Wein", "Sprudelwasser"], ["% trinkt", "trinkt %"]),
  new Category(["Hunde", "Katzen", "Hamster", "Meerschweinchen", "Wellensittiche", "Fische", "Mäuse", "Krebse", "Kanninchen", "Schildkröten"], ["% hat", "hat %"]),
  new Category(["Bäckerei", "Tischlerei", "Druckerei", "Schneiderei", "Fleischerei", "Konditorei", "Fahrradwerkstatt", "Autowerkstatt", "Bibliothek", "Goldschmiede"], ["in einer % arbeitet", "arbeitet in einer %"]),
];

function Puzzle() {
  this.solution = [];
  this.conditions = [];
  this.question = "";

  this.generate = function() {
    let oo = shuffle([0, 2, 3]);
    oo.insert(oo.indexOf(0) + 1, 1);
    oo.insert(oo.indexOf(3) + 1, 4);
    let o = function(x) {return oo.indexOf(x);};

    let c = [];
    while (c.length < 5) {
      let r = Math.floor(Math.random() * categories.length);
      if (!isin(categories[r], c)) {c.push(categories[r]);}
    }
    c = c.map(function(x) {return x.limit(5);});

    this.solution = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.solution[i][j] = c[i].content[j];
      }
    }

    let context = function(a1, a2, r, b1, b2) {
      if (r == "=") {return "Die Person, die " + c[a1].grammatical(o(a2), 0) + ", wohnt im " + (o(b1) + 1) + ". Haus.";}
      else if (r == "s") {return "Die Person, die " + c[a1].grammatical(o(a2), 0) + ", " + c[b1].grammatical(o(b2), 1) + ".";}
      else if (r == "r") {return "Die Person, die " + c[a1].grammatical(o(a2), 0) + ", wohnt rechts neben der Person, die " + c[b1].grammatical(o(b2), 0) + ".";}
      else if (r == "l") {return "Die Person, die " + c[a1].grammatical(o(a2), 0) + ", wohnt links neben der Person, die " + c[b1].grammatical(o(b2), 0) + ".";}
      else if (r == "n") {return "Die Person, die " + c[a1].grammatical(o(a2), 0) + ", wohnt neben der Person, die " + c[b1].grammatical(o(b2), 0) + ".";}
    };
    let t = function(x) {
      if (isin(x, ["A", "B", "C", "D", "E"])) {return ["A", "B", "C", "D", "E"].indexOf(x);}
      if (isin(x, ["1", "2", "3", "4", "5"])) {return ["1", "2", "3", "4", "5"].indexOf(x);}
    };

    this.conditions = [];
    this.conditions.push(context(t("B"), t("3"), "s", t("A"), t("3")));
    this.conditions.push(context(t("B"), t("5"), "s", t("E"), t("5")));
    this.conditions.push(context(t("B"), t("2"), "s", t("C"), t("2")));
    this.conditions.push(context(t("A"), t("4"), "l", t("A"), t("5")));
    this.conditions.push(context(t("A"), t("4"), "s", t("C"), t("4")));
    this.conditions.push(context(t("D"), t("3"), "s", t("E"), t("3")));
    this.conditions.push(context(t("C"), t("3"), "=", t("3")));
    this.conditions.push(context(t("A"), t("1"), "s", t("D"), t("1")));
    this.conditions.push(context(t("D"), t("2"), "n", t("E"), t("1")));
    this.conditions.push(context(t("D"), t("5"), "s", t("C"), t("5")));
    this.conditions.push(context(t("B"), t("1"), "=", t("1")));
    this.conditions.push(context(t("E"), t("2"), "n", t("D"), t("1")));
    this.conditions.push(context(t("B"), t("4"), "s", t("D"), t("4")));
    this.conditions.push(context(t("B"), t("1"), "n", t("A"), t("2")));
    this.conditions.push(context(t("D"), t("2"), "n", t("C"), t("1")));
    this.conditions = shuffle(this.conditions);
    this.question = "Welche Person " + c[t("E")].grammatical(o(t("4")), 1) + "?";
  };
  this.generate();
}

let puzzle = new Puzzle();
function new_puzzle() {
  puzzle.generate();

  for (let i = 0; i < puzzle.conditions.length; i++) {
    document.getElementById("c" + (i + 1)).innerHTML = puzzle.conditions[i];
  }
  document.getElementById("q").innerHTML = puzzle.question;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      document.getElementById("s" + (i * 5 + j + 1)).innerHTML = puzzle.solution[i][j];
    }
  }
}
