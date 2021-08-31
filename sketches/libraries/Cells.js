class Cells {

  constructor(cols = 10, rows = 10, cW = 25, cH = 25) {
    this.cols = cols;
    this.rows = rows;
    this.cW = cW;
    this.cH = cH;
    this.width = this.cols * this.cW;
    this.height = this.rows * this.cH;
  }

  populateCells = function (
    genExtraLarge = false,
    extraLargeChance = 25,
    extraLargeMultiplier = 5
  ) {
    // extra large multiple
    let eM = 1;
    let newCells = [];
    let newExtraLargeCells = [];
    let extraLargeHit;

    for (var c = 0; c < this.cols; c++) {
      for (var r = 0; r < this.rows; r++) {
        let newCell = {
          row: r,
          col: c,
          x: c * this.cW,
          y: r * this.cH,
          w: this.cW,
          h: this.cH,
          used: false,
        };

        // extra large multiple
        extraLargeHit = Math.ceil(Math.random() * extraLargeChance);
        eM = Math.ceil(Math.random() * extraLargeMultiplier);
        newCells.push(newCell);

        if (
          genExtraLarge
          && extraLargeHit === extraLargeChance
          && newCell.x + newCell.w + (this.cW * eM) < this.width
          && newCell.y + newCell.h + (this.cH * eM) < this.height
        ) {
          let extraLargeCell = {
            row: r,
            col: c,
            x: c * this.cW,
            y: r * this.cH,
            w: newCell.w + (this.cW * eM),
            h: newCell.h + (this.cH * eM),
            used: false,
          };
          newExtraLargeCells.push(extraLargeCell);
        }
      }
    }

    // check for large cells that overlap others down the line
    for (var i = 0; i < newExtraLargeCells.length; i++) {
      for (var e = i + 1; e < newExtraLargeCells.length; e++) {
        if (this.intersection(newExtraLargeCells[i], newExtraLargeCells[e])) {
          newExtraLargeCells[e].used = true;
        }
      }
    }

    // filter out overlapping
    _.remove(newExtraLargeCells, function (o) { return o.used; });

    // check for normal cells that are overlapped by the large cells
    for (var i = 0; i < newCells.length; i++) {
      for (var e = 0; e < newExtraLargeCells.length; e++) {
        if (this.intersection(newCells[i], newExtraLargeCells[e])) {
          newCells[i].used = true;
        }
      }
    }

    // filter out overlapping
    _.remove(newCells, function (o) { return o.used; });

    return [newCells, newExtraLargeCells];
  };

  // https://editor.p5js.org/eric/sketches/HkW2DRKnl
  intersection = function (rect1, rect2) {
    let x1 = rect2.x;
    let y1 = rect2.y;
    let x2 = x1 + rect2.w;
    let y2 = y1 + rect2.h;
    if (rect1.x > x1) { x1 = rect1.x; }

    if (rect1.y > y1) { y1 = rect1.y; }

    if (rect1.x + rect1.w < x2) { x2 = rect1.x + rect1.w; }

    if (rect1.y + rect1.h < y2) { y2 = rect1.y + rect1.h; }

    return (x2 <= x1 || y2 <= y1) ? false : { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  };

};