document.addEventListener("DOMContentLoaded", () => {
  const itemCountSpan = document.getElementById("item-count");
  const ipsCountSpan = document.getElementById("ips-count");
  const produceButton = document.getElementById("produce-button");
  const upgradesListDiv = document.getElementById("upgrades-list");
  const saveGameBtn = document.getElementById("save-game");
  const loadGameBtn = document.getElementById("load-game");
  const resetGameBtn = document.getElementById("reset-game");
  const messageBox = document.getElementById("message-box");
  const messageText = document.getElementById("message-text");
  const closeMessageBtn = document.getElementById("close-message");

  let items = 0;
  let clickProduction = 1;
  let automatedProductionPerSecond = 0;
  const upgrades = [
    {
      id: "worker",
      name: "Trabalhador",
      baseCost: 10,
      costMultiplier: 1.15,
      ipsGain: 1,
      level: 0,
    },
    {
      id: "machine",
      name: "Máquina de Produção",
      baseCost: 100,
      costMultiplier: 1.2,
      ipsGain: 10,
      level: 0,
    },
    {
      id: "factory",
      name: "Fábrica Automatizada",
      baseCost: 1000,
      costMultiplier: 1.25,
      ipsGain: 100,
      level: 0,
    },
    {
      id: "super_click",
      name: "Clique Potente",
      baseCost: 50,
      costMultiplier: 1.5,
      clickGain: 1,
      level: 0,
    },
  ];
  function updateDisplay() {
    itemCountSpan.textContent = Math.floor(items);
    ipsCountSpan.textContent = automatedProductionPerSecond.toFixed(1);
    upgradeUpgradeButtons();
  }
  function produceItems() {
    items += clickProduction;
    updateDisplay();
  }
  function getUpgradeCost(upgrade) {
    return Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level)
    );
  }
  function calculateTotalIPS() {
    let totalIPS = 0;
    upgrades.forEach((upgrade) => {
      if (upgrade.ipsGain) {
        totalIPS += upgrade.ipsGain * upgrade.level;
      }
    });
    automatedProductionPerSecond = totalIPS;
  }
  function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find((up) => up.id === upgradeId);
    if (!upgrade) {
      showMessage("Erro: Melhoria não encontrada!");
      return;
    }
    const cost = getUpgradeCost(upgrade);
    if (items >= cost) {
      items -= cost;
      upgrade.level++;
      if (upgrade.clickGain) {
        clickProduction += upgrade.clickGain;
      } else {
        calculateTotalIPS();
      }
      updateDisplay();
      renderUpgrades();
      showMessage(`${upgrade.name} comprado! Nível: ${upgrade.level}`);
    } else {
      showMessage(
        `Itens insuficientes! Você precisa de ${cost} itens para comprar ${upgrade.name}.`
      );
    }
  }
  function renderUpgrades() {
    upgradesListDiv.innerHTML = "";
    upgrades.forEach((upgrade) => {
      const upgradeDiv = document.createElement("div");
      upgradeDiv.classList.add("upgrade-item");
      const cost = getUpgradeCost(upgrade);
      const effectText = upgrade.ipsGain
        ? `+${upgrade.ipsGain} IPS`
        : `+${upgrade.clickGain} por clique`;
      upgradeDiv.innerHTML = `
      <h3>${upgrade.name} (Nível: ${upgrade.level})</h3>
      <p>Custo:<span class="cost">${cost}</span>itens</p>
      <p>Efeito: <span class="effect">${effectText}</span></p>
      <button class="upgrade-button action-button" data-upgrade-id="${upgrade.id}">Comprar</button>`;
      upgradesListDiv.appendChild(upgradeDiv);
    });
    upgradeUpgradeButtons();
  }
  function upgradeUpgradeButtons() {
    document.querySelectorAll(".upgrade-button").forEach((button) => {
      const upgradeId = button.dataset.upgradeId;
      const upgrade = upgrades.find((up) => up.id === upgradeId);
      const cost = getUpgradeCost(upgrade);
      button.disabled = items < cost;
    });
  }
  function gameLoop() {
    items += automatedProductionPerSecond / 10;
    updateDisplay();
  }
  function showMessage(msg) {
    messageText.textContent = msg;
    messageBox.style.display = "flex";
  }
  function hideMessage() {
    messageBox.style.display = "none";
  }
  function saveGame() {
    const gameState = {
      items: items,
      clickProduction: clickProduction,
      upgrades: upgrades.map((up) => ({ id: up.id, level: up.level })),
    };
    localStorage.setItem("incrementalGameSave", JSON.stringify(gameState));
    showMessage("Jogo salvo com sucesso!");
  }
  function loadGame() {
    const savedState = localStorage.getItem("incrementalGameSave");
    if (savedState) {
      const gameState = JSON.parse(savedState);
      items = gameState.items;
      clickProduction = gameState.clickProduction;

      upgrades.forEach((upgrade) => {
        const savedUpgrade = gameState.upgrades.find(
          (up) => up.id === upgrade.id
        );
        if (savedUpgrade) {
          upgrade.level = savedUpgrade.level;
        } else {
          upgrade.level = 0;
        }
      });
      calculateTotalIPS();
      updateDisplay();
      renderUpgrades();
      showMessage("Jogo carregado com sucesso!");
    } else{
        showMessage("Nenhum jogo salvo encontrado.");
    }
  }
  function resetGame() {
    if (confirm("Tem certeza que deseja reiniciar o jogo? O progresso será perdido!")) {
        items = 0;
        clickProduction = 1;
        automatedProductionPerSecond = 0;
        upgrades.forEach(upgrade =>{
            upgrade.level = 0;
        });
        localStorage.removeItem("incrementalGameSave");
        updateDisplay();
        renderUpgrades();
        showMessage("Jogo reiniciado!");
    }
  }
  produceButton.addEventListener("click", produceItems);

    upgradesListDiv.addEventListener("click", (e) => { 
    if (e.target.classList.contains("upgrade-button")) {
        const upgradeId = e.target.dataset.upgradeId;
        buyUpgrade(upgradeId);
    }
    })
    saveGameBtn.addEventListener("click", saveGame);
    loadGameBtn.addEventListener("click", loadGame);
    resetGameBtn.addEventListener("click", resetGame);
    closeMessageBtn.addEventListener("click", hideMessage);
    renderUpgrades();
    calculateTotalIPS();
    updateDisplay();
    setInterval(gameLoop, 100); 
});
