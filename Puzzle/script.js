document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    puzzle: document.getElementById("puzzle-board"),
    shuffleButton: document.getElementById("snuffle-button"),
    resetButton: document.getElementById("reset-button"),
    winModal: document.getElementById("win-modal"),
    closeModalButton: document.getElementById("close-modal"),
  };

  const config = {
    imagePath: "./img/icon.jpg",
    gridSize: 3,
    boardSize: 500,
  };

  const { puzzle: puzzleBoard, winModal } = elements; // Corrigido aqui
  const { gridSize, boardSize, imagePath } = config;
  const totalTiles = gridSize * gridSize;
  const tileSize = boardSize / gridSize;
  let tiles = [];
  let emptyTileIndex = totalTiles - 1;

  Object.assign(puzzleBoard.style, {
    display: "grid",
    width: `${boardSize}px`,
    height: `${boardSize}px`,
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`, // Corrigido typo
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    gap: "0",
  });

  const getPosition = (index) => ({
    row: Math.floor(index / gridSize),
    col: index % gridSize,
    bgX: -(index % gridSize) * tileSize,
    bgY: -Math.floor(index / gridSize) * tileSize,
  });

  const createTile = (index) => {
    const tile = document.createElement("div");
    const { bgX, bgY } = getPosition(index);

    tile.className = "puzzle-tile";
    tile.dataset.position = index; // posição original
    tile.dataset.currentPosition = index; // posição atual

    Object.assign(tile.style, {
      width: `${tileSize}px`,
      height: `${tileSize}px`,
      backgroundImage: `url(${imagePath})`,
      backgroundPosition: `${bgX}px ${bgY}px`,
      backgroundSize: `${boardSize}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0",
    });

    if (index === emptyTileIndex) {
      tile.classList.add("empty");
      tile.style.backgroundImage = "none";
    }

    tile.addEventListener("click", handleTileClick); // Corrigido nome
    return tile;
  };

  function handleTileClick(e) {
    const clickedTile = e.target;
    if (clickedTile.classList.contains("empty")) return;

    const clickedIndex = +clickedTile.dataset.currentPosition;
    const { row: clickedRow, col: clickedCol } = getPosition(clickedIndex);
    const { row: emptyRow, col: emptyCol } = getPosition(emptyTileIndex);

    const isAdjacent =
      (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) || // Corrigido emptyCol
      (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    if (isAdjacent) {
      swapTiles(clickedIndex, emptyTileIndex);
      if (checkWin()) showWinModal();
    }
  }

  function swapTiles(index1, index2) {
    const tile1 = tiles.find((t) => +t.dataset.currentPosition === index1);
    const tile2 = tiles.find((t) => +t.dataset.currentPosition === index2);
    if (!tile1 || !tile2) return;

    // Troca visual com CSS order
    const tempOrder = tile1.style.order || tile1.dataset.position;
    tile1.style.order = tile2.style.order || tile2.dataset.position;
    tile2.style.order = tempOrder;

    // Atualiza posição atual
    tile1.dataset.currentPosition = index2;
    tile2.dataset.currentPosition = index1;

    emptyTileIndex = index1;
  }

  function initializePuzzle() {
    puzzleBoard.innerHTML = "";
    tiles = Array.from({ length: totalTiles }, (_, i) => {
      const tile = createTile(i);
      tile.style.order = i; // Ordem inicial
      puzzleBoard.appendChild(tile);
      return tile;
    });
    shufflePuzzle();
  }

  function shufflePuzzle() {
    // Gera uma permutação aleatória
    let positions = Array.from({ length: totalTiles }, (_, i) => i);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Garante que o vazio esteja no final (para ser movido)
    const emptyIndex = positions.indexOf(totalTiles - 1);
    if (emptyIndex !== totalTiles - 1) {
      [positions[emptyIndex], positions[totalTiles - 1]] = [
        positions[totalTiles - 1],
        positions[emptyIndex],
      ];
    }

    // Aplica as novas posições
    tiles.forEach((tile, originalIndex) => {
      const newPos = positions[originalIndex];
      tile.style.order = newPos;
      tile.dataset.currentPosition = newPos;

      if (newPos === totalTiles - 1) {
        tile.classList.add("empty");
        tile.style.backgroundImage = "none";
        emptyTileIndex = newPos;
      } else {
        tile.classList.remove("empty");
        const { bgX, bgY } = getPosition(originalIndex);
        tile.style.backgroundImage = `url(${imagePath})`;
        tile.style.backgroundPosition = `${bgX}px ${bgY}px`;
      }
    });
  }

  const checkWin = () => {
    for (let i = 0; i < totalTiles; i++) {
      const tile = tiles.find(t => +t.dataset.currentPosition === i);
      if (!tile || +tile.dataset.position !== i) {
        return false;
      }
    }
    return true;
  };

  const showWinModal = () => (winModal.style.display = "flex");
  const hideWinModal = () => {
    winModal.style.display = "none";
    resetGame();
  };

  function resetGame() {
    puzzleBoard.innerHTML = "";
    tiles = Array.from({ length: totalTiles }, (_, i) => {
      const tile = createTile(i);
      tile.style.order = i;
      puzzleBoard.appendChild(tile);
      return tile;
    });
    emptyTileIndex = totalTiles - 1;
  }

  elements.shuffleButton.addEventListener("click", shufflePuzzle);
  elements.resetButton.addEventListener("click", resetGame);
  elements.closeModalButton.addEventListener("click", hideWinModal);

  initializePuzzle();
});