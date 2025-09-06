const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird
const bird = {
  x: 60,
  y: 300,
  width: 34,
  height: 24,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};
