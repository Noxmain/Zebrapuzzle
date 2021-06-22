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
  this.grammatical = function(i) {
    return this.grammar.replace("%", this.content[i]);
  };
}

const categories = [
  new Category(["rot", "violett", "blau", "grün", "gelb", "braun", "türkis", "weiß", "grau", "schwarz"], "im %en Haus wohnt"),
  new Category(["Peter", "Marie", "Paul", "Anna", "Tim", "Emma", "Linus", "Mia", "Till", "Luisa"], "% heißt"),
  new Category(["Pizza", "Pasta", "Kartoffeln", "Reis", "Curry", "Obst", "Gemüse", "Burger", "Brot", "Kuchen"], "% isst"),
  new Category(["Mineralwasser", "Apfelsaft", "Orangensaft", "Milch", "Tee", "Limonade", "Kakao", "Bier", "Wein", "Sprudelwasser"], "% trinkt"),
  new Category(["Hunde", "Katzen", "Hamster", "Meerschweinchen", "Wellensittiche", "Fische", "Mäuse", "Krebse", "Kanninchen", "Schildkröten"], "% hat"),
  new Category(["Bäckerei", "Tischlerei", "Druckerei", "Schneiderei", "Fleischerei", "Konditorei", "Fahrradwerkstatt", "Autowerkstatt", "Bibliothek", "Goldschmiede"], "in einer % arbeitet"),
];

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
