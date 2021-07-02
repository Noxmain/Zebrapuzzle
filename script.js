// By Noxmain

Array.prototype.shuffle = function() {
  for (let i = this.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};

Array.prototype.contains = function(item) {
  return (this.indexOf(item) >= 0);
};

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

function Category(c, g) {
  this.content = c;
  this.grammar = g; // Die Person, die grammar[0], grammar[1].
  this.limit = function(n) {
    if (n > this.content.length) {n = this.content.length;}
    let limited = [];
    while (limited.length < n) {
      let r = Math.floor(Math.random() * this.content.length);
      if (!limited.contains(this.content[r])) {limited.push(this.content[r]);}
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
  new Category(["Hunde", "Katzen", "Hamster", "Meerschweinchen", "Wellensittiche", "Fische", "Mäuse", "Krebse", "Kaninchen", "Schildkröten"], ["% hat", "hat %"]),
  new Category(["Bäckerei", "Tischlerei", "Druckerei", "Schneiderei", "Fleischerei", "Konditorei", "Fahrradwerkstatt", "Autowerkstatt", "Bibliothek", "Goldschmiede"], ["in einer % arbeitet", "arbeitet in einer %"]),
  new Category(["Rock", "Blues", "Pop", "Indie", "Rap", "Metal", "Electronic", "Klassik", "Punk", "Jazz"], ["% hört", "hört %"]),
  new Category(["Kriminalromane", "Fantasyromane", "Geschichtsromane", "Lyrik", "Dramen", "Ratgeber", "Sachbücher", "Biografien", "Märchen", "Comics"], ["% liest", "liest %"]),
];

function Puzzle() {
  this.solution = [];
  this.conditions = [];
  this.question = "";

  this.generate = function() {
    let oo = [0, 2, 3].shuffle();
    oo.insert(oo.indexOf(0) + Math.round(Math.random()), 1);
    oo.insert(oo.indexOf(3) + Math.round(Math.random()), 4);
    let o = function(x) {return oo.indexOf(x);};

    let cats = [];
    while (cats.length < 5) {
      let r = Math.floor(Math.random() * categories.length);
      if (!cats.contains(categories[r])) {cats.push(categories[r]);}
    }
    cats = cats.map(function(x) {return x.limit(5);});

    this.solution = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.solution[i][j] = cats[i].content[j];
      }
    }

    let context = function(a1, a2, r, b1, b2) {
      let swap = (Math.random() < 0.5);
      if (r == "=") {
        if (swap) {return "Die Person, die " + cats[a1].grammatical(o(a2), 0) + ", wohnt im " + (o(b1) + 1) + ". Haus.";}
        else {return "Im " + (o(b1) + 1) + ". Haus wohnt die Person, die " + cats[a1].grammatical(o(a2), 0) + ".";}
      } else if (r == "s") {
        if (swap) {return "Die Person, die " + cats[a1].grammatical(o(a2), 0) + ", " + cats[b1].grammatical(o(b2), 1) + ".";}
        else {return "Die Person, die " + cats[b1].grammatical(o(b2), 0) + ", " + cats[a1].grammatical(o(a2), 1) + ".";}
      } else if (r == "r") {
        if (swap) {return "Die Person, die " + cats[a1].grammatical(o(a2), 0) + ", wohnt rechts neben der Person, die " + cats[b1].grammatical(o(b2), 0) + ".";}
        else {return "Die Person, die " + cats[b1].grammatical(o(b2), 0) + ", wohnt links neben der Person, die " + cats[a1].grammatical(o(a2), 0) + ".";}
      } else if (r == "l") {
        if (swap) {return "Die Person, die " + cats[a1].grammatical(o(a2), 0) + ", wohnt links neben der Person, die " + cats[b1].grammatical(o(b2), 0) + ".";}
        else {return "Die Person, die " + cats[b1].grammatical(o(b2), 0) + ", wohnt rechts neben der Person, die " + cats[a1].grammatical(o(a2), 0) + ".";}
      } else if (r == "n") {
        if (swap) {return "Die Person, die " + cats[a1].grammatical(o(a2), 0) + ", wohnt neben der Person, die " + cats[b1].grammatical(o(b2), 0) + ".";}
        else {return "Die Person, die " + cats[b1].grammatical(o(b2), 0) + ", wohnt neben der Person, die " + cats[a1].grammatical(o(a2), 0) + ".";}
      }
    };
    let t = function(x) {
      if (["A", "B", "C", "D", "E"].contains(x)) {return ["A", "B", "C", "D", "E"].indexOf(x);}
      if (["1", "2", "3", "4", "5"].contains(x)) {return ["1", "2", "3", "4", "5"].indexOf(x);}
    };

    this.conditions = [];
    this.conditions.push(context(t("B"), t("3"), "s", t("A"), t("3")));
    this.conditions.push(context(t("B"), t("5"), "s", t("E"), t("5")));
    this.conditions.push(context(t("B"), t("2"), "s", t("C"), t("2")));
    this.conditions.push(context(t("A"), t("4"), ((o(t("4")) < o(t("5"))) ? "l" : "r"), t("A"), t("5")));
    this.conditions.push(context(t("A"), t("4"), "s", t("C"), t("4")));
    this.conditions.push(context(t("D"), t("3"), "s", t("E"), t("3")));
    this.conditions.push(context(t("C"), t("3"), "=", t("3")));
    this.conditions.push(context(t("A"), t("1"), "s", t("D"), t("1")));
    this.conditions.push(context(t("D"), t("2"), "n", t("E"), t("1")));
    this.conditions.push(context(t("D"), t("5"), "s", t("C"), t("5")));
    this.conditions.push(context(t("B"), t("1"), "=", t("1")));
    this.conditions.push(context(t("E"), t("2"), ((o(t("1")) < o(t("2"))) ? "r" : "l"), t("D"), t("1")));
    this.conditions.push(context(t("B"), t("4"), "s", t("D"), t("4")));
    this.conditions.push(context(t("B"), t("1"), ((o(t("1")) < o(t("2"))) ? "l" : "r"), t("A"), t("2")));
    this.conditions.push(context(t("D"), t("2"), ((o(t("1")) < o(t("2"))) ? "r" : "l"), t("C"), t("1")));
    this.conditions.shuffle();
    this.question = "Welche Person " + cats[t("E")].grammatical(o(t("4")), 1) + "?";
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
