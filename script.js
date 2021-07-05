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

Array.prototype.choice = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.choice_mutiple = function(number) {
  let choice_list = [];
  while (choice_list.length < number) {
    let r = this.choice();
    if (!choice_list.contains(r)) {choice_list.push(r);}
  }
  return choice_list;
};

function Category(c, g) {
  this.content = c;
  this.grammar = g;
  this.limit = function(n) {
    if (n > this.content.length) {n = this.content.length;}
    return new Category(this.content.choice_mutiple(n), this.grammar);
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

const conditionsets = [
  {conditions: ["B1=1", "C3=3", "A1sA4", "B1lA2", "C1lD2", "D1lE2", "E1lD2", "B2sC2", "A3sB3", "D3sE3", "A4sC4", "B4sD4", "A4lA5", "B5sE5", "C5sD5"], question: "E4"}
];

/*
  Häuser-Aufbau
  Buchstabe = Kategorie
  Zahl = Haus
  A1  A2  A3  A4  A5
  B1  B2  B3  B4  B5
  C1  C2  C3  C4  C5
  D1  D2  D3  D4  D5
  E1  E2  E3  E4  E5
*/

/*
  Bedingungs-Verhältnisse
  a=b: a ist im b. Haus
  asb: a ist im gleichen Haus wie b (s = same)
  anb: a ist im Haus neben dem Haus von b (n = next)
  alb: a ist im Haus links neben dem Haus von b (l = left)
  arb: a ist im Haus rechts neben dem Haus von b (r = right)
*/

function Puzzle() {
  this.solution = [];
  this.conditions = [];
  this.question = "";

  this.generate = function() {
    let cats = categories.choice_mutiple(5);
    cats = cats.map(function(x) {return x.limit(5);});

    this.solution = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.solution[i][j] = cats[i].content[j];
      }
    }

    let toIndex = function(x) {
      if (["A", "B", "C", "D", "E"].contains(x)) {return ["A", "B", "C", "D", "E"].indexOf(x);}
      if (["1", "2", "3", "4", "5"].contains(x)) {return ["1", "2", "3", "4", "5"].indexOf(x);}
    };
    let context = function(x) {
      let swap = (Math.random() < 0.5);
      if (x[2] == "=") {
        if (swap) {return "Die Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ", wohnt im " + (toIndex(x[3]) + 1) + ". Haus.";}
        else {return "Im " + (toIndex(x[3]) + 1) + ". Haus wohnt die Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ".";}
      } else if (x[2] == "s") {
        if (swap) {return "Die Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ", " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 1) + ".";}
        else {return "Die Person, die " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 0) + ", " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 1) + ".";}
      } else if (x[2] == "n") {
        if (swap) {return "Die Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ", wohnt neben der Person, die " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 0) + ".";}
        else {return "Die Person, die " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 0) + ", wohnt neben der Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ".";}
      } else if (x[2] == "l") {
        if (swap) {return "Die Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ", wohnt links neben der Person, die " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 0) + ".";}
        else {return "Die Person, die " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 0) + ", wohnt rechts neben der Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ".";}
      } else if (x[2] == "r") {
        if (swap) {return "Die Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ", wohnt rechts neben der Person, die " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 0) + ".";}
        else {return "Die Person, die " + cats[toIndex(x[3])].grammatical(toIndex(x[4]), 0) + ", wohnt links neben der Person, die " + cats[toIndex(x[0])].grammatical(toIndex(x[1]), 0) + ".";}
      }
    };

    let conditionset = conditionsets.choice();
    this.conditions = conditionset.conditions.map(context);
    this.question = "Welche Person " + cats[toIndex(conditionset.question[0])].grammatical(toIndex(conditionset.question[1]), 1) + "?";
    this.conditions.shuffle();
  };
  this.generate();
}

let puzzle = new Puzzle();
function new_puzzle() {
  puzzle.generate();

  document.getElementById("conditions_list").innerHTML = puzzle.conditions.map(function(x) {return "<li>" + x + "</li>";}).join("");
  document.getElementById("question").innerHTML = puzzle.question;
  document.getElementById("solution_table").innerHTML = puzzle.solution.map(function(x) {return "<tr>" + x.map(function(y) {return "<td>" + y + "</td>";}).join("") + "</tr>";}).join("");
}
