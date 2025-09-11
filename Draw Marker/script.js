document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const toolButtons = document.querySelectorAll(".tool-button");
  const colorPicker = document.getElementById("color-picker");
  const lineWidthInput = document.getElementById("line-width");
  const lineWidthValueSpan = document.getElementById("line-width-value");
  const clearCanvasBtn = document.getElementById("clear-canvas");
  const saveImageBtn = document.getElementById("save-image");

  let isDrawing = false;
  let currentTool = "pen";
  let currentColor = "#000000";
  let currentWidth = 5;
  let lastX = 0;
  let lastY = 0;
  let startX = 0;
  let startY = 0;
  let snapshot = null;
  canvas.width = 800;
  canvas.height = 600;

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
  }
  function drawRectangle(e) {
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    ctx.stroke();
  }
  function drawCircle(e) {
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    const radius = Math.sqrt(
      Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)
    );
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  function drawLine(e) {
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    [startX, startY] = [e.offsetX, e.offsetY];

    if (
      currentTool === "rectangle" ||
      currentTool === "circle" ||
      currentTool === "line"
    ) {
      snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  });
  canvas.addEventListener('mousemove', (e) =>{
    if(!isDrawing) return;
    if(currentTool === 'pen' || currentTool === 'eraser'){
        draw(e);
    } else if(currentTool === 'rectangle'){
        drawRectangle(e);
    } else if(currentTool === 'circle') {
        drawCircle(e);
    } else if(currentTool === 'line'){
        drawLine(e);
    }
  });
  canvas.addEventListener('mouseout', () =>{
    isDrawing = false;
    snapshot = null;
  });
  canvas.addEventListener('touchstart', (e) =>{
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    canvas.dispatchEvent(new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY,
    }));
  }, {passive: false});
  canvas.addEventListener('touchmove', (e) =>{
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        offsetX: offsetX,
        offsetY: offsetY,
        buttons: 1
    }));
  }, {passive: false});
  canvas.addEventListener('touchend', () =>{
    canvas.dispatchEvent(new MouseEvent('mouseup'));
  });
  toolButtons.forEach(button =>{
    button.addEventListener('click', () =>{
        toolButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentTool = button.dataset.tool;

        if(currentTool = 'eraser'){
            ctx.strokeStyle = '#ffffff';
        } else{
            ctx.strokeStyle = currentColor;
        }
    });
  });
  colorPicker.addEventListener('input', (e) =>{
    currentColor = e.target.value;
    if(currentTool !== 'eraser'){
        ctx.strokeStyle = currentColor;
    }
  });
  lineWidthInput.addEventListener('input', (e) =>{
    currentWidth = e.target.value;
    ctx.lineWidth = currentWidth;
    lineWidthValueSpan.textContent = `${currentWidth}px`;
  });
  clearCanvasBtn.addEventListener('click', () =>{
    ctx.clearRect(0,0,canvas.width, canvas.height);
  });
  saveImageBtn.addEventListener('click', () =>{
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'meu-desenho.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
