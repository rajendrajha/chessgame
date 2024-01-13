//[x,y]
const blocks = 64;
const chessContainer = document.querySelector(".chess-container");
let block = "white";
let c = 8;
let orgPiece;
let turn = "white";
let isWhiteChecked = false;
let isBlackChecked = false;
let safeMoves = [];
let audio;

for (let j = 0; j < blocks ** (1 / 2); j++) {
  let row = document.createElement("div");
  row.classList.add("row");
  for (let i = 0; i < blocks ** (1 / 2); i++) {
    let ele = document.createElement("div");
    ele.classList.add(`${block == "white" ? "whiteCube" : "darkCube"}`);
    ele.classList.add("cube");
    ele.setAttribute("x", 8 - i);
    ele.setAttribute("y", j + 1);

    if (block == "white" && i != 7) {
      block = "dark";
    } else if (block == "white" && i == 7) {
      block = "white";
    } else if (block == "white" && i == 0) {
      ele.innerText = j + 1;
    } else if (block == "dark" && i == 7) {
      block = "dark";
    } else if (block == "dark" && i != 7) {
      block = "white";
    }

    // if (i == 0) {
    //   ele.innerText = j + 1;
    // }
    // if (j == 7) {
    //   ele.innerHTML = c;
    //   c--;
    // }
    row.appendChild(ele);
  }
  chessContainer.appendChild(row);
}

let cubes = document.querySelectorAll(".cube");

cubes.forEach((e) => {
  let x = e.getAttribute("x");
  let y = e.getAttribute("y");

  if (y == 1) {
    if (x == 1 || x == 8) {
      e.innerHTML +=
        '<img src="images/white_rook.png" piece="whiteRook" type="white" class="img" />';
    } else if (x == 2 || x == 7) {
      e.innerHTML +=
        '<img src="images/white_knight.png" piece="whiteKnight" type="white" class="img" />';
    } else if (x == 3 || x == 6) {
      e.innerHTML +=
        '<img src="images/white_bishop.png" piece="whiteBishop" type="white" class="img" />';
    } else if (x == 4) {
      e.innerHTML +=
        '<img src="images/white_queen.png" piece="whiteQueen" type="white" class="img" />';
    } else if (x == 5) {
      e.innerHTML +=
        '<img src="images/white_king.png" piece="whiteKing" type="white" class="img" />';
    }
  }

  if (y == 2) {
    e.innerHTML +=
      '<img src="images/white_pawn.png" piece="whitePawn" type="white" class="img" />';
  }

  if (y == 8) {
    if (x == 1 || x == 8) {
      e.innerHTML +=
        '<img src="images/black_rook.png" piece="blackRook" type="black" class="img" />';
    } else if (x == 2 || x == 7) {
      e.innerHTML +=
        '<img src="images/black_knight.png" piece="blackKnight" type="black" class="img" />';
    } else if (x == 3 || x == 6) {
      e.innerHTML +=
        '<img src="images/black_bishop.png" piece="blackBishop" type="black" class="img" />';
    } else if (x == 4) {
      e.innerHTML +=
        '<img src="images/black_queen.png" piece="blackQueen" type="black" class="img" />';
    } else if (x == 5) {
      e.innerHTML +=
        '<img src="images/black_king.png" piece="blackKing" type="black" class="img" />';
    }
  }

  if (y == 7) {
    e.innerHTML +=
      '<img src="images/black_pawn.png" piece="blackPawn" type="black" class="img" />';
  }
});


function getCoords(e, isImg) {
  if (!isImg) {
    return [parseInt(e.getAttribute("x")), parseInt(e.getAttribute("y"))];
  } else {
    return [
      parseInt(e.parentNode.getAttribute("x")),
      parseInt(e.parentNode.getAttribute("y")),
    ];
  }
}

function getCubeAt(coordinates) {
  let cube = Array.from(cubes).filter((cube) => {
    return (
      parseInt(cube.getAttribute("x")) == coordinates[0] &&
      parseInt(cube.getAttribute("y")) == coordinates[1]
    );
  });

  return cube;
}
function getPieceAt(coordinates) {
  let piece = null;
  let cube = Array.from(cubes).find((cube) => {
    return (
      parseInt(cube.getAttribute("x")) == coordinates[0] &&
      parseInt(cube.getAttribute("y")) == coordinates[1]
    );
  });

  if (cube && cube.children.length > 0) {
    piece = cube.children[0];
  }

  return piece;
}

function highlightSquares(coordinates) {
  let cube = getCubeAt(coordinates);
  if (cube[0]) {
    cube[0].classList.add("highlighted");
  }
}

function clearAllHighlights() {
  cubes.forEach((e) => {
    e.classList.remove("highlighted");
  });
}

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (
    e.target.classList.contains("cube") ||
    e.target.classList.contains("img")
  ) {
    e.target.classList.add("redHighlight");
    clearAllHighlights();
  }
});

function clearAllRedHighlights() {
  cubes.forEach((e) => {
    e.classList.remove("redHighlight");
  });
  document.querySelectorAll("img").forEach((e) => {
    e.classList.remove("redHighlight");
  });
}

function getPawnMoves(
  coords,
  pieceType,
  getMovesWithBug,
  getOnlyAttackingMoves
) {
  let moves = [];
  let x = coords[0];
  let y = coords[1];
  if (pieceType == "black") {
    if (y == 7) {
      if (getPieceAt([x, y - 1]) == null) {
        moves.push([x, y - 1]);
        if (getPieceAt([x, y - 2]) == null) {
          moves.push([x, y - 2]);
        }
      }
    } else if (y < 7) {
      moves.push([x, y - 1]);
    }
  } else if (pieceType == "white") {
    if (y == 2) {
      if (getPieceAt([x, y + 1]) == null) {
        moves.push([x, y + 1]);
        if (getPieceAt([x, y + 2]) == null) {
          moves.push([x, y + 2]);
        }
      }
    } else if (y > 2) {
      moves.push([x, y + 1]);
    }
  }

  let filteredMoves = moves;

  let attackingMoves;
  if (pieceType == "black") {
    attackingMoves = [
      [x - 1, y - 1],
      [x + 1, y - 1],
    ];
  } else if (pieceType == "white") {
    attackingMoves = [
      [x + 1, y + 1],
      [x - 1, y + 1],
    ];
  }
  if (getMovesWithBug) {
    attackingMoves = Array.from(attackingMoves).filter((val) => {
      return isMoveValid([val[0], val[1]]);
    });
    let movesWithBug = [...moves, ...attackingMoves];
    return movesWithBug;
  } else if (getOnlyAttackingMoves) {
    attackingMoves = Array.from(attackingMoves).filter((val) => {
      return isMoveValid([val[0], val[1]]);
    });
    return attackingMoves;
  }
  let filteredAttackingMoves = Array.from(attackingMoves).filter((val) => {
    return (
      getPieceAt([val[0], val[1]]) != null &&
      getPieceAt([val[0], val[1]]).getAttribute("piece").slice(0, 5) !=
        pieceType
    );
  });
  filteredMoves = filteredMoves.concat(filteredAttackingMoves);
  filteredMoves = Array.from(filteredMoves).filter((val) => {
    return isMoveValid([val[0], val[1]]);
  });
  return filteredMoves;
  //PawnCompleted
}

function isMoveValid(coord) {
  if (coord[0] > 0 && coord[0] <= 8) {
    if (coord[1] > 0 && coord[1] <= 8) {
      return true;
    }
    return false;
  }
  return false;
}

function getKnightMoves(coords, pieceType, getMovesWithBug) {
  let moves = [
    [coords[0] - 1, coords[1] - 2],
    [coords[0] + 1, coords[1] + 2],
    [coords[0] - 2, coords[1] - 1],
    [coords[0] + 2, coords[1] + 1],
    [coords[0] - 2, coords[1] + 1],
    [coords[0] + 1, coords[1] - 2],
    [coords[0] - 1, coords[1] + 2],
    [coords[0] + 2, coords[1] - 1],
  ];
  let filteredMoves = Array.from(moves).filter((val) => {
    return isMoveValid([val[0], val[1]]);
  });
  if (getMovesWithBug) {
    return filteredMoves;
  }
  filteredMoves = Array.from(filteredMoves).filter((val) => {
    return (
      getPieceAt([val[0], val[1]]) == null ||
      getPieceAt([val[0], val[1]]).getAttribute("piece").slice(0, 5) !=
        pieceType
    );
  });
  filteredMoves = Array.from(filteredMoves).filter((val) => {
    return isMoveValid([val[0], val[1]]);
  });
  return filteredMoves;

  //KnightCompleted
}

function getBishopMoves(
  coords,
  pieceType,
  getMovesWithBug,
  getAllDiagonalForKing
) {
  let moves = [];
  for (let i = 1; i <= Math.min(coords[0], 8 - coords[1]); i++) {
    let targetCoords = [coords[0] - i, coords[1] + i];
    if (
      !processDiagonalMove(
        moves,
        targetCoords,
        pieceType,
        getMovesWithBug,
        getAllDiagonalForKing
      )
    )
      break;
  }

  for (let i = 1; i <= Math.min(8 - coords[0], 8 - coords[1]); i++) {
    let targetCoords = [coords[0] + i, coords[1] + i];
    if (
      !processDiagonalMove(
        moves,
        targetCoords,
        pieceType,
        getMovesWithBug,
        getAllDiagonalForKing
      )
    )
      break;
  }

  for (let i = 1; i <= Math.min(coords[0], coords[1]); i++) {
    let targetCoords = [coords[0] - i, coords[1] - i];
    if (
      !processDiagonalMove(
        moves,
        targetCoords,
        pieceType,
        getMovesWithBug,
        getAllDiagonalForKing
      )
    )
      break;
  }

  for (let i = 1; i <= Math.min(8 - coords[0], coords[1]); i++) {
    let targetCoords = [coords[0] + i, coords[1] - i];
    if (
      !processDiagonalMove(
        moves,
        targetCoords,
        pieceType,
        getMovesWithBug,
        getAllDiagonalForKing
      )
    )
      break;
  }
  moves = Array.from(moves).filter((val) => {
    return isMoveValid([val[0], val[1]]);
  });
  return moves;
  //BishopCompleted
}

function getRookMoves(coords, pieceType, getMovesWithBug) {
  let moves = [];

  for (let i = coords[0] - 1; i >= 0; i--) {
    let targetCoords = [i, coords[1]];
    if (!processMove(moves, targetCoords, pieceType, getMovesWithBug)) break;
  }

  for (let i = coords[0] + 1; i <= 8; i++) {
    let targetCoords = [i, coords[1]];
    if (!processMove(moves, targetCoords, pieceType, getMovesWithBug)) break;
  }

  for (let i = coords[1] - 1; i >= 0; i--) {
    let targetCoords = [coords[0], i];
    if (!processMove(moves, targetCoords, pieceType, getMovesWithBug)) break;
  }

  for (let i = coords[1] + 1; i <= 8; i++) {
    let targetCoords = [coords[0], i];
    if (!processMove(moves, targetCoords, pieceType, getMovesWithBug)) break;
  }

  moves = Array.from(moves).filter((val) => {
    return isMoveValid([val[0], val[1]]);
  });
  return moves;
  //RookCompleted
}

function getQueenMoves(coords, pieceType, getMovesWithBug, getKingKill) {
  let moves;
  if (getMovesWithBug) {
    moves = [
      ...getRookMoves(coords, pieceType, getMovesWithBug),
      ...getBishopMoves(coords, pieceType, getMovesWithBug),
    ];
    moves = Array.from(moves).filter((val) => {
      return isMoveValid([val[0], val[1]]);
    });
    return moves;
  } else if (getKingKill) {
    moves = [
      ...getRookMoves(coords, pieceType, getMovesWithBug),
      ...getBishopMoves(coords, pieceType, getMovesWithBug, getKingKill),
    ];
    moves = Array.from(moves).filter((val) => {
      return isMoveValid([val[0], val[1]]);
    });
    return moves;
  } else {
    moves = [
      ...getRookMoves(coords, pieceType),
      ...getBishopMoves(coords, pieceType),
    ];
    moves = Array.from(moves).filter((val) => {
      return isMoveValid([val[0], val[1]]);
    });
    return moves;
  }
  //QueenCompleted
}

function getKingMoves(coords, pieceType, getMovesWithBug) {
  let x = coords[0];
  let y = coords[1];
  let moves = [
    [x, y + 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
    [x - 1, y + 1],
    [x - 1, y],
    [x - 1, y - 1],
  ];
  let filteredMoves = Array.from(moves).filter((val) => {
    return isMoveValid([val[0], val[1]]);
  });
  if (getMovesWithBug) {
    filteredMoves = Array.from(filteredMoves).filter((val) => {
      return isMoveValid([val[0], val[1]]);
    });
    return filteredMoves;
  }
  filteredMoves = Array.from(moves).filter((val) => {
    return (
      getPieceAt([val[0], val[1]]) == null ||
      getPieceAt([val[0], val[1]]).getAttribute("piece").slice(0, 5) !=
        pieceType
    );
  });
  filteredMoves = Array.from(filteredMoves).filter((val) => {
    return isMoveValid([val[0], val[1]]);
  });
  // console.log(filteredMoves)
  filteredMoves = Array.from(filteredMoves).filter((val) => {
    // console.log([val[0], val[1]])
    return CheckKingMoves([val[0], val[1]], pieceType);
  });
  // console.log(filteredMoves)
  return filteredMoves;
}

function processMove(
  moves,
  targetCoords,
  pieceType,
  getMovesWithBug,
  getKingKill
) {
  let pieceAtTarget = getPieceAt(targetCoords);
  if (getMovesWithBug) {
    if (pieceAtTarget == null) {
      moves.push(targetCoords);
      return true;
    } else {
      if (pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType) {
        moves.push(targetCoords);
      } else {
        moves.push(targetCoords);
      }
      return false;
    }
  } else if (getKingKill) {
    if (pieceAtTarget == null) {
      moves.push(targetCoords);
      return true;
    } else {
      if (
        pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType &&
        pieceAtTarget
          .getAttribute("piece")
          .slice(5, pieceAtTarget.getAttribute("piece").length) == "King"
      ) {
        moves.push(targetCoords);
        return true;
      } else if (pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType) {
        moves.push(targetCoords);
        return false;
      } else if (pieceAtTarget.getAttribute("piece").slice(0, 5) == pieceType) {
        moves.push(targetCoords);
        return false;
      }
    }
  } else {
    if (pieceAtTarget == null) {
      moves.push(targetCoords);
      return true;
    } else {
      if (pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType) {
        moves.push(targetCoords);
      }
      return false;
    }
  }
}

function processDiagonalMove(
  moves,
  targetCoords,
  pieceType,
  getMovesWithBug,
  getAllDiagonalForKing
) {
  let pieceAtTarget = getPieceAt(targetCoords);
  if (getMovesWithBug) {
    if (pieceAtTarget == null) {
      moves.push(targetCoords);
      return true;
    } else {
      if (pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType) {
        moves.push(targetCoords);
      } else {
        moves.push(targetCoords);
      }
      return false;
    }
  } else if (getAllDiagonalForKing) {
    if (pieceAtTarget == null) {
      moves.push(targetCoords);
      return true;
    } else if (
      pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType &&
      pieceAtTarget
        .getAttribute("piece")
        .slice(5, pieceAtTarget.getAttribute("piece").length) == "King"
    ) {
      moves.push(targetCoords);
      return true;
    } else if (pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType) {
      moves.push(targetCoords);
      return false;
    } else if (pieceAtTarget.getAttribute("piece").slice(0, 5) == pieceType) {
      moves.push(targetCoords);
      return false;
    }
  } else {
    if (pieceAtTarget == null) {
      moves.push(targetCoords);
      return true;
    } else {
      if (pieceAtTarget.getAttribute("piece").slice(0, 5) != pieceType) {
        moves.push(targetCoords);
      }
      return false;
    }
  }
}

function isPieceProtected(piece) {
  let p = [];
  let pieces = Array.from(cubes).filter((val) => {
    return val.children[0]
      ? val.children[0].getAttribute("type") === piece.getAttribute("type")
      : false;
  });
  let moves = [];
  pieces.forEach((e) => {
    let pieceS = e.children[0]
      .getAttribute("piece")
      .slice(5, e.children[0].getAttribute("piece").length);
    let pieceType = e.children[0].getAttribute("type");

    if (pieceS == "Pawn") {
      moves = [...moves, ...getPawnMoves(getCoords(e), pieceType, true)];
    } else if (pieceS == "Rook") {
      moves = moves.concat(getRookMoves(getCoords(e), pieceType, true));
    } else if (pieceS == "Knight") {
      moves = [...moves, ...getKnightMoves(getCoords(e), pieceType, true)];
    } else if (pieceS == "Bishop") {
      moves = moves.concat(getBishopMoves(getCoords(e), pieceType, true));
    } else if (pieceS == "King") {
      moves = moves.concat(getKingMoves(getCoords(e), pieceType, true));
    } else if (pieceS == "Queen") {
      moves = moves.concat(getQueenMoves(getCoords(e), pieceType, true));
    }
  });
  let isProtected = false;
  for (let j = 0; j < moves.length; j++) {
    if (parseInt(piece.parentNode.getAttribute("x")) == moves[j][0]) {
      if (parseInt(piece.parentNode.getAttribute("y")) == moves[j][1]) {
        isProtected = true;
        return true;
      }
    }
  }
  if (!isProtected) {
    return false;
  }
}

function checkForChecks(pieceT) {
  let pieceType = pieceT;
  let kingType = pieceType == "white" ? "black" : "white";
  let king = document.querySelector(`[piece="${kingType}King"]`);
  let pieces = Array.from(cubes).filter((val) => {
    return val.children[0]
      ? val.children[0].getAttribute("type") == pieceType
      : false;
  });
  let moves = [];
  pieces.forEach((e) => {
    let pieceS = e.children[0]
      .getAttribute("piece")
      .slice(5, e.children[0].getAttribute("piece").length);
    let pieceType = e.children[0].getAttribute("type");

    if (pieceS == "Pawn") {
      moves = [...moves, ...getPawnMoves(getCoords(e), pieceType, false, true)];
    } else if (pieceS == "Rook") {
      moves = moves.concat(getRookMoves(getCoords(e), pieceType, false, true));
    } else if (pieceS == "Knight") {
      moves = [...moves, ...getKnightMoves(getCoords(e), pieceType)];
    } else if (pieceS == "Bishop") {
      moves = moves.concat(
        getBishopMoves(getCoords(e), pieceType, false, true)
      );
    } else if (pieceS == "King") {
      moves = moves.concat(getKingMoves(getCoords(e), pieceType));
    } else if (pieceS == "Queen") {
      moves = moves.concat(getQueenMoves(getCoords(e), pieceType, false, true));
    }
  });

  for (let j = 0; j < moves.length; j++) {
    if (parseInt(king.parentNode.getAttribute("x")) == moves[j][0]) {
      if (parseInt(king.parentNode.getAttribute("y")) == moves[j][1]) {
        return {
          status: "check",
        };
      }
    }
  }
}

function checkForAttackingPiece(pieceT) {
  let pieceType = pieceT;
  let kingType = pieceType == "white" ? "black" : "white";
  let king = document.querySelector(`[piece="${kingType}King"]`);
  let moves = [];
  let pieces = Array.from(cubes).filter((val) => {
    if (val.children[0]) {
      return val.children[0].getAttribute("type") == pieceType;
    }
  });
  pieces.forEach((e) => {
    let move = [];
    let pieceName = e.children[0]
      .getAttribute("piece")
      .slice(5, e.children[0].getAttribute("piece").length);
    if (pieceName == "Pawn") {
      move = getPawnMoves(getCoords(e), pieceType, false, true);
    } else if (pieceName == "Rook") {
      move = getRookMoves(getCoords(e), pieceType, false, true);
    } else if (pieceName == "Knight") {
      move = getKnightMoves(getCoords(e), pieceType);
    } else if (pieceName == "Bishop") {
      move = getBishopMoves(getCoords(e), pieceType, false, true);
    } else if (pieceName == "King") {
      move = getKingMoves(getCoords(e), pieceType);
    } else if (pieceName == "Queen") {
      move = getQueenMoves(getCoords(e), pieceType, false, true);
    }
    moves.push({
      pieceName: pieceName,
      piece: e.children[0],
      moves: move,
      pieceType: pieceType,
      coords: getCoords(e.children[0], true),
    });
  });
  let attackingPieces = [];
  for (let j = 0; j < moves.length; j++) {
    for (let i = 0; i < moves[j].moves.length; i++) {
      if (moves[j].moves[i][0] == getCoords(king, true)[0]) {
        if (moves[j].moves[i][1] == getCoords(king, true)[1]) {
          attackingPieces.push(moves[j]);
        }
      }
    }
  }
  return attackingPieces;
}

function CheckKingMoves(coords, kingType) {
  let kingT = kingType;
  let pieceType = kingT == "white" ? "black" : "white";
  let pieces = Array.from(cubes).filter((val) => {
    return val.children[0]
      ? val.children[0].getAttribute("type") == pieceType
      : false;
  });
  let moves = [];
  pieces.forEach((e) => {
    let pieceS = e.children[0]
      .getAttribute("piece")
      .slice(5, e.children[0].getAttribute("piece").length);
    let pieceType = e.children[0].getAttribute("type");

    if (pieceS == "Pawn") {
      moves = [...moves, ...getPawnMoves(getCoords(e), pieceType, false, true)];
    } else if (pieceS == "Rook") {
      moves = moves.concat(getRookMoves(getCoords(e), pieceType, false, true));
    } else if (pieceS == "Knight") {
      moves = [...moves, ...getKnightMoves(getCoords(e), pieceType, true)];
    } else if (pieceS == "Bishop") {
      moves = moves.concat(
        getBishopMoves(getCoords(e), pieceType, false, true)
      );
    } else if (pieceS == "King") {
      moves = moves.concat(getKingMoves(getCoords(e), pieceType, true));
    } else if (pieceS == "Queen") {
      moves = moves.concat(getQueenMoves(getCoords(e), pieceType, false, true));
    }
  });

  let isValid = true;
  for (let j = 0; j < moves.length; j++) {
    if (moves[j][0] == coords[0]) {
      if (moves[j][1] == coords[1]) {
        isValid = false;
        return false;
      }
    }
  }
  return isValid;
}

function getCubesBetween(attackerCoordinates, kingCoordinates) {
  let cubesBetween = [];

  // Check if the attacker and king are in a straight line (horizontal, vertical, or diagonal)
  if (
    attackerCoordinates[0] === kingCoordinates[0] ||
    attackerCoordinates[1] === kingCoordinates[1] ||
    Math.abs(attackerCoordinates[0] - kingCoordinates[0]) ===
      Math.abs(attackerCoordinates[1] - kingCoordinates[1])
  ) {
    // Determine the direction of movement (horizontal, vertical, diagonal)
    let deltaX = Math.sign(kingCoordinates[0] - attackerCoordinates[0]);
    let deltaY = Math.sign(kingCoordinates[1] - attackerCoordinates[1]);

    // Calculate coordinates of cubes between attacker and king
    let currentCube = [
      attackerCoordinates[0] + deltaX,
      attackerCoordinates[1] + deltaY,
    ];

    while (
      currentCube[0] !== kingCoordinates[0] ||
      currentCube[1] !== kingCoordinates[1]
    ) {
      cubesBetween.push([...currentCube]);
      currentCube[0] += deltaX;
      currentCube[1] += deltaY;
    }
  }

  return cubesBetween;
}

function canBeSavedOrNot() {
  let p = [];
  let pieces = Array.from(cubes).forEach((e) => {
    if (e.children[0]) {
      if (e.children[0].getAttribute("type") == turn) {
        p.push(e.children[0]);
      }
    }
  });
  let condition = false;
  p.forEach((e) => {
    let pieceN = e
      .getAttribute("piece")
      .slice(5, e.getAttribute("piece").length);
    if (pieceN == "Pawn") {
      let moves = getPawnMoves(getCoords(e, true), turn);
      for (let i = 0; i < moves.length; i++) {
        if (
          safeMoves.some(
            (safeMove) => JSON.stringify(safeMove) === JSON.stringify(moves[i])
          )
        ) {
          condition = true;
          return true;
        }
      }
    } else if (pieceN == "Knight") {
      let moves = getKnightMoves(getCoords(e, true), turn);
      for (let i = 0; i < moves.length; i++) {
        if (
          safeMoves.some(
            (safeMove) => JSON.stringify(safeMove) === JSON.stringify(moves[i])
          )
        ) {
          condition = true;
          return true;
        }
      }
    } else if (pieceN == "Bishop") {
      let moves = getBishopMoves(getCoords(e, true), turn);
      for (let i = 0; i < moves.length; i++) {
        if (
          safeMoves.some(
            (safeMove) => JSON.stringify(safeMove) === JSON.stringify(moves[i])
          )
        ) {
          condition = true;
          return true;
        }
      }
    } else if (pieceN == "Rook") {
      let moves = getRookMoves(getCoords(e, true), turn);
      for (let i = 0; i < moves.length; i++) {
        if (
          safeMoves.some(
            (safeMove) => JSON.stringify(safeMove) === JSON.stringify(moves[i])
          )
        ) {
          condition = true;
          return true;
        }
      }
    } else if (pieceN == "Queen") {
      let moves = getQueenMoves(getCoords(e, true), turn);
      for (let i = 0; i < moves.length; i++) {
        if (
          safeMoves.some(
            (safeMove) => JSON.stringify(safeMove) === JSON.stringify(moves[i])
          )
        ) {
          condition = true;
          return true;
        }
      }
    }
  });
  if (!condition) {
    return false;
  } else {
    return true;
  }
}

function checkForCheckMate(turni) {
  let turn = turni;
  let oTurn = turn == "white" ? "black" : "white";

  if (checkForChecks(oTurn)) {
    if (checkForChecks(oTurn).status == "check") {
      let KingMoves = getKingMoves(
        getCoords(document.querySelector(`[piece="${turn}King"]`), true),
        turn
      );
      document
        .querySelector(`[piece="${turn}King"]`)
        .parentNode.classList.add("red");
      let kingCoords = getCoords(
        document.querySelector(`[piece="${turn}King"]`),
        true
      );
      let attackers = checkForAttackingPiece(oTurn);
      if (attackers.length == 1) {
        let pieceName = attackers[0].pieceName;
        let attacker_coords = attackers[0].coords;
        let attacker = attackers[0].piece;
        if (turn == "white") {
          isWhiteChecked = true;
          safeMoves = [];
          safeMoves.push(...getCubesBetween(attacker_coords, kingCoords));
          safeMoves.push(attacker_coords);
          if (!canBeSavedOrNot() && KingMoves.length == 0) {
            alert("checkmate");
          }
        } else if (turn == "black") {
          safeMoves = [];
          safeMoves.push(...getCubesBetween(attacker_coords, kingCoords));
          safeMoves.push(attacker_coords);
          isBlackChecked = true;
          if (!canBeSavedOrNot() && KingMoves.length == 0) {
            setTimeout(() => {
              let audio = new Audio("audios/checkmate.webm");
              audio.play();
            }, 1000);
            setTimeout(() => {
              alert(`${oTurn} wins the game!`);
              window.location.reload();
             
            }, 2000);
          }
        }
      } else if (attackers.length > 1) {
        if (KingMoves.length >= 1) {
          return;
        } else {
          alert("checkmate");
        }
      }
    }
  }
}

function isPinned(piece, king) {
  let pieceName = piece
    .getAttribute("piece")
    .slice(5, piece.getAttribute("piece").length);
  let kingPiece = king;
  let parentNode = piece.parentNode;

  orgPiece = piece;
  console.log(orgPiece);
  console.log(kingPiece);
  piece.parentNode.innerHTML = "";
  checkForCheckMate(piece.getAttribute("piece").slice(0, 5));
  if (piece.getAttribute("piece").slice(0, 5) == "black") {
    if (!isBlackChecked) {
      console.log("not pinned");
      parentNode.appendChild(orgPiece);
    } else if (isBlackChecked) {
      console.log("pinned");
      parentNode.appendChild(orgPiece);
      clearAllHighlights();
      let audio = new Audio("audios/illegal.mp3");
      audio.play();
      if (pieceName != "Knight") {
        if (pieceName == "Pawn") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getPawnMoves(
            getCoords(piece, true),
            "black",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("white");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);
          setTimeout(() => {
            clearAllHighlights();
          }, 1);
          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              highlightSquares(attackingCoords);
            }, 2);
            orgPiece = piece;
          }
        } else if (pieceName == "Bishop") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getBishopMoves(
            getCoords(piece, true),
            "black",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("white");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);

          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              let cubesBetweenBishopAndAttacker = getCubesBetween(
                attackingCoords,
                getCoords(piece, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndAttacker.length; i++) {
                highlightSquares(cubesBetweenBishopAndAttacker[i]);
              }
              let cubesBetweenBishopAndKing = getCubesBetween(
                getCoords(piece, true),
                getCoords(king, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndKing.length; i++) {
                highlightSquares(cubesBetweenBishopAndKing[i]);
              }

              highlightSquares([attackingCoords[0], attackingCoords[1]]);
            }, 2);
            orgPiece = piece;
          }
        } else if (pieceName == "Rook") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getRookMoves(
            getCoords(piece, true),
            "black",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("white");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);

          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              let cubesBetweenBishopAndAttacker = getCubesBetween(
                attackingCoords,
                getCoords(piece, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndAttacker.length; i++) {
                highlightSquares(cubesBetweenBishopAndAttacker[i]);
              }
              let cubesBetweenBishopAndKing = getCubesBetween(
                getCoords(piece, true),
                getCoords(king, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndKing.length; i++) {
                highlightSquares(cubesBetweenBishopAndKing[i]);
              }

              highlightSquares([attackingCoords[0], attackingCoords[1]]);
            }, 2);
            orgPiece = piece;
          }
        } else if (pieceName == "Queen") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getQueenMoves(
            getCoords(piece, true),
            "black",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("white");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);

          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              let cubesBetweenQueenAndAttacker = getCubesBetween(
                attackingCoords,
                getCoords(piece, true)
              );
              console.log(cubesBetweenQueenAndAttacker);
              for (let i = 0; i < cubesBetweenQueenAndAttacker.length; i++) {
                highlightSquares(cubesBetweenQueenAndAttacker[i]);
              }
              let cubesBetweenQueenAndKing = getCubesBetween(
                getCoords(piece, true),
                getCoords(king, true)
              );
              console.log(cubesBetweenQueenAndKing);
              for (let i = 0; i < cubesBetweenQueenAndKing.length; i++) {
                highlightSquares(cubesBetweenQueenAndKing[i]);
              }

              highlightSquares([attackingCoords[0], attackingCoords[1]]);
            }, 2);
            orgPiece = piece;
          }
        }
      } else if (pieceName == "Knight") {
        setTimeout(() => {
          clearAllHighlights();
        }, 1);
      }
      isBlackChecked = false;
    }
  } else if (piece.getAttribute("piece").slice(0, 5) == "white") {
    if (!isWhiteChecked) {
      console.log("not pinned");
      parentNode.appendChild(orgPiece);
    } else if (isWhiteChecked) {
      console.log("pinned");
      parentNode.appendChild(orgPiece);
      clearAllHighlights();
      let audio = new Audio("audios/illegal.mp3");
      audio.play();
      if (pieceName != "Knight") {
        if (pieceName == "Pawn") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getPawnMoves(
            getCoords(piece, true),
            "white",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("black");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);

          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              highlightSquares([attackingCoords[0], attackingCoords[1]]);
            }, 2);
            orgPiece = piece;
          }
        } else if (pieceName == "Bishop") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getBishopMoves(
            getCoords(piece, true),
            "white",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("black");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);

          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              let cubesBetweenBishopAndAttacker = getCubesBetween(
                attackingCoords,
                getCoords(piece, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndAttacker.length; i++) {
                highlightSquares(cubesBetweenBishopAndAttacker[i]);
              }
              let cubesBetweenBishopAndKing = getCubesBetween(
                getCoords(piece, true),
                getCoords(king, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndKing.length; i++) {
                highlightSquares(cubesBetweenBishopAndKing[i]);
              }

              highlightSquares([attackingCoords[0], attackingCoords[1]]);
            }, 2);
            orgPiece = piece;
          }
        } else if (pieceName == "Rook") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getRookMoves(
            getCoords(piece, true),
            "white",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("black");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);

          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              let cubesBetweenBishopAndAttacker = getCubesBetween(
                attackingCoords,
                getCoords(piece, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndAttacker.length; i++) {
                highlightSquares(cubesBetweenBishopAndAttacker[i]);
              }
              let cubesBetweenBishopAndKing = getCubesBetween(
                getCoords(piece, true),
                getCoords(king, true)
              );
              for (let i = 0; i < cubesBetweenBishopAndKing.length; i++) {
                highlightSquares(cubesBetweenBishopAndKing[i]);
              }

              highlightSquares([attackingCoords[0], attackingCoords[1]]);
            }, 2);
            orgPiece = piece;
          }
        } else if (pieceName == "Queen") {
          parentNode = piece.parentNode;
          orgPiece = piece;
          let moves = getQueenMoves(
            getCoords(piece, true),
            "white",
            false,
            true
          );
          piece.parentNode.innerHTML = "";
          let attackingPiece = checkForAttackingPiece("black");
          let attackingCoords = attackingPiece[0].coords;
          parentNode.appendChild(orgPiece);

          if (
            moves.some((subarray) =>
              subarray.every((value, index) => value === attackingCoords[index])
            )
          ) {
            setTimeout(() => {
              clearAllHighlights();
            }, 1);
            setTimeout(() => {
              let cubesBetweenQueenAndAttacker = getCubesBetween(
                attackingCoords,
                getCoords(piece, true)
              );
              console.log(cubesBetweenQueenAndAttacker);
              for (let i = 0; i < cubesBetweenQueenAndAttacker.length; i++) {
                highlightSquares(cubesBetweenQueenAndAttacker[i]);
              }
              let cubesBetweenQueenAndKing = getCubesBetween(
                getCoords(piece, true),
                getCoords(king, true)
              );
              console.log(cubesBetweenQueenAndKing);
              for (let i = 0; i < cubesBetweenQueenAndKing.length; i++) {
                highlightSquares(cubesBetweenQueenAndKing[i]);
              }

              highlightSquares([attackingCoords[0], attackingCoords[1]]);
            }, 2);
            orgPiece = piece;
          }
        }
      } else if (pieceName == "Knight") {
        setTimeout(() => {
          clearAllHighlights();
        }, 1);
      }

      isWhiteChecked = false;
    }
  }
}

// You can now call this function with a piece and king's coordinates to check if the piece is pinned.
cubes.forEach((e) => {
  e.addEventListener("click", () => {
    clearAllRedHighlights();
    if (e.classList.contains("highlighted")) {
      if (isBlackChecked) {
        isBlackChecked = false;
        cubes.forEach((e) => {
          e.classList.remove("red");
        });
      } else if (isWhiteChecked) {
        isWhiteChecked = false;
        cubes.forEach((e) => {
          e.classList.remove("red");
        });
      }
      let html = orgPiece.innerHTML;
      if (e.innerHTML == "") {
        e.innerHTML = html;
        setTimeout(() => {
          if (!isBlackChecked && !isWhiteChecked) {
            audio = new Audio("audios/move.mp3");
            audio.play();
          }
        }, 10);
      } else if (e.innerHTML) {
        e.innerHTML = html;
        setTimeout(() => {
          if (!isBlackChecked && !isWhiteChecked) {
            audio = new Audio("audios/capture.mp3");
            audio.play();
          }
        }, 10);
      }
      orgPiece.innerHTML = "";
      requestAnimationFrame(() => {
        clearAllHighlights();
      });

      turn = turn == "white" ? "black" : "white";
      checkForCheckMate(turn);
      if (isBlackChecked || isWhiteChecked) {
        audio = new Audio("audios/check.mp3");
        audio.play();
      }
      let coords = getCoords(e);
      let piece = getPieceAt(coords);
      let pieceName = piece
        .getAttribute("piece")
        .slice(5, piece.getAttribute("piece").length);
      if (pieceName == "Pawn") {
        if (coords[1] == 1 || coords[1] == 8) {
          piece.src = `images/${piece
            .getAttribute("piece")
            .slice(0, 5)}_queen.png`;
          piece.setAttribute(
            "piece",
            `${piece.getAttribute("type").toLowerCase()}Queen`
          );
        }
      }
    }
    clearAllHighlights();
    orgPiece = null;
    let coordinates = getCoords(e);
    let piece = getPieceAt(coordinates);
    let king;
    if (piece != null) {
      if (!isBlackChecked) {
        if (turn == "black") {
          if (piece.getAttribute("piece").slice(0, 5) == "black") {
            king = document.querySelector('[piece="blackKing"]');
            if (
              piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length)
            ) {
              let p = piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length);

              if (p == "Pawn") {
                let moves = getPawnMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Knight") {
                let moves = getKnightMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Bishop") {
                let moves = getBishopMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Rook") {
                let moves = getRookMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Queen") {
                let moves = getQueenMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "King") {
                let moves = getKingMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              }
            }
          }
        }
      } else {
        if (turn == "black") {
          if (piece.getAttribute("piece").slice(0, 5) == "black") {
            king = document.querySelector('[piece="blackKing"]');

            if (
              piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length)
            ) {
              let p = piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length);

              if (p == "Pawn") {
                let moves = getPawnMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);
                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Knight") {
                let moves = getKnightMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);
                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Bishop") {
                let moves = getBishopMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Rook") {
                let moves = getRookMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Queen") {
                let moves = getQueenMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "King") {
                let moves = getKingMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              }
            }
          }
        }
      }
      if (!isWhiteChecked) {
        if (turn == "white") {
          if (piece.getAttribute("piece").slice(0, 5) == "white") {
            king = document.querySelector('[piece="whiteKing"]');

            if (
              piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length)
            ) {
              let p = piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length);

              if (p == "Pawn") {
                let moves = getPawnMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Knight") {
                let moves = getKnightMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Bishop") {
                let moves = getBishopMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Rook") {
                let moves = getRookMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "Queen") {
                let moves = getQueenMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              } else if (p == "King") {
                let moves = getKingMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              }
            }
          }
        }
      } else {
        if (turn == "white") {
          if (piece.getAttribute("piece").slice(0, 5) == "white") {
            king = document.querySelector('[piece="whiteKing"]');

            if (
              piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length)
            ) {
              let p = piece
                .getAttribute("piece")
                .slice(5, piece.getAttribute("piece").length);

              if (p == "Pawn") {
                let moves = getPawnMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Knight") {
                let moves = getKnightMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Bishop") {
                let moves = getBishopMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Rook") {
                let moves = getRookMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "Queen") {
                let moves = getQueenMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                isPinned(piece, king);

                for (let i = 0; i < moves.length; i++) {
                  if (
                    safeMoves.some(
                      (safeMove) =>
                        JSON.stringify(safeMove) === JSON.stringify(moves[i])
                    )
                  ) {
                    highlightSquares(moves[i]);
                    orgPiece = e;
                  }
                }
              } else if (p == "King") {
                let moves = getKingMoves(
                  coordinates,
                  piece.getAttribute("piece").slice(0, 5)
                );
                for (let i = 0; i < moves.length; i++) {
                  highlightSquares(moves[i]);
                  orgPiece = e;
                }
              }
            }
          }
        }
      }
    }
  });
});

