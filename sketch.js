let video;
let greenRatio = 0;

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.hide();
  // 使用 HSB 颜色模式，范围设定为360, 100, 100
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(220);
  
  // 保持视频的原始比例显示在上半部分
  let videoAspect = video.width / video.height;
  let newHeight = height / 2;
  let newWidth = newHeight * videoAspect;
  let offsetX = (width - newWidth) / 2;
  image(video, offsetX, 0, newWidth, newHeight);
  
  // 分析视频像素，检测鲜艳的草绿色
  video.loadPixels();
  let greenCount = 0;
  let totalPixels = video.width * video.height;
  
  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let index = (x + y * video.width) * 4;
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      
      let c = color(r, g, b);
      let h = hue(c);
      let s = saturation(c);
      let br = brightness(c);
      
      // 调整阈值，检测鲜艳的草绿色
      if (h > 80 && h < 140 && s > 50 && br > 50) {
        greenCount++;
      }
    }
  }
  
  greenRatio = greenCount / totalPixels;
  fill(0);
  textSize(16);
  text("草绿色占比：" + nf(greenRatio, 0, 2), 10, 20);
  
  // 根据绿色占比在下半部分绘制花朵
  // 绿色越多，花朵数量越多（最少5朵，最多50朵）
  let flowerCount = floor(map(greenRatio, 0, 0.8, 0, 30));
  let t = millis() / 1000;
  drawFlowers(flowerCount, 0, height / 2, width, height / 2, t);
}

// 绘制单个花朵
function drawFlower(x, y, size, t) {
  push();
  translate(x, y);
  // 可选：使用噪声生成旋转角度，使花朵稍有动态变化
  let rotation = noise(x * 0.1, t) * TWO_PI;
  rotate(rotation);
  
  // 绘制花瓣：这里绘制6个花瓣
  let petals = 6;
  let angleStep = TWO_PI / petals;
  for (let i = 0; i < petals; i++) {
    push();
    rotate(i * angleStep);
    // 花瓣采用粉红色
    fill(330, 60, 100);
    noStroke();
    // 以花朵中心向右偏移 size 处绘制椭圆作为花瓣
    ellipse(size, 0, size, size * 0.6);
    pop();
  }
  // 绘制花心，使用黄色
  fill(60, 80, 100);
  noStroke();
  ellipse(0, 0, size * 0.8, size * 0.8);
  pop();
}

// 在指定区域内绘制多个花朵
function drawFlowers(count, offsetX, offsetY, w, h, t) {
  for (let i = 0; i < count; i++) {
    let x = random(w);
    let y = random(h * 0.2, h);  // 控制花朵在区域内的分布
    let flowerSize = random(10, 30);
    drawFlower(x + offsetX, y + offsetY, flowerSize, t);
  }
}
