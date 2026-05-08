const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const size = 20;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < canvas.width; x += size) {
    for (let y = 0; y < canvas.height; y += size) {
      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(x, y, size, size);
    }
  }
}

drawGrid();
