<script setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue';

import { ElButton, ElColorPicker, ElSlider } from 'element-plus';

// const props = defineProps({
//   imageUrl: {
//     type: String,
//     required: true,
//   },
// });
// 父组件传入的系统名称
const imageUrl = defineModel('imageUrl');
const imgWidth = defineModel('width');
const imgHeight = defineModel('height');
const emit = defineEmits(['onExit']);

const canvasContainer = ref(null);
const toolbarCon = ref(null);
const drawCanvas = ref(null);
const shapeCanvas = ref(null);
const drawContext = ref(null);
const shapeContext = ref(null);
const drawing = ref(false);
const currentColor = ref('#E81E1E');
const currentLineWidth = ref(2);
const currentTool = ref('brush');
const eraserSize = ref(20);
const history = reactive({
  undoStack: [],
  redoStack: [],
});
const shapes = ref([]);
const textShapes = ref([]); // 用于保存文本形状
const activeShape = ref(null);
const textContent = ref('');
const textArea = ref(null);
const textStyle = reactive({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0)',
  resize: 'none',
  width: '200px',
  height: '100px',
  zIndex: 10,
  display: 'none',
});
const rotation = ref(0);
const zoomFactor = ref(1); // 当前缩放比例

const clearAllCanvases = () => {
  drawContext.value.clearRect(
    0,
    0,
    drawCanvas.value.width,
    drawCanvas.value.height,
  );
  shapeContext.value.clearRect(
    0,
    0,
    shapeCanvas.value.width,
    shapeCanvas.value.height,
  );
};

const saveState = () => {
  try {
    const state = {
      shapes: shapes.value.map((shape) => ({ ...shape })),
      textShapes: textShapes.value.map((text) => ({ ...text })),
      rotation: rotation.value,
    };
    history.undoStack.push(state);
    history.redoStack = [];
  } catch (error) {
    console.error('Cannot save canvas state:', error);
  }
};

const handleClick = (event) => {
  console.log(event, 'event==');
  const { offsetX, offsetY } = event;

  if (currentTool.value === 'text') {
    if (textContent.value.trim() === '') {
      textStyle.left = `${offsetX}px`;
      textStyle.top = `${offsetY}px`;
    }
    textStyle.display = 'block';
    setTimeout(() => {
      textArea.value.focus();
    }, 200);
  } else {
    startDrawing(event);
  }
};

const startDrawing = (event) => {
  drawing.value = true;
  const { offsetX, offsetY } = event;
  console.log(currentTool.value, 'currentTool==');
  if (currentTool.value === 'brush') {
    drawContext.value.lineWidth = currentLineWidth.value;
    drawContext.value.strokeStyle = currentColor.value;
    drawContext.value.beginPath();
    drawContext.value.moveTo(offsetX, offsetY);
  } else if (['arrow', 'circle', 'rectangle'].includes(currentTool.value)) {
    const shape = {
      type: currentTool.value,
      color: currentColor.value,
      lineWidth: currentLineWidth.value,
      startX: offsetX,
      startY: offsetY,
      width: 0,
      height: 0,
    };
    shapes.value.push(shape);
    activeShape.value = shape;
  }
};

const draw = (event) => {
  if (!drawing.value) return;

  const { offsetX, offsetY } = event;
  if (currentTool.value === 'brush') {
    drawContext.value.lineTo(offsetX, offsetY);
    drawContext.value.stroke();
  } else if (currentTool.value === 'eraser') {
    const x = offsetX - eraserSize.value / 2;
    const y = offsetY - eraserSize.value / 2;
    drawContext.value.clearRect(x, y, eraserSize.value, eraserSize.value);
  } else if (
    ['arrow', 'circle', 'rectangle'].includes(currentTool.value) &&
    activeShape.value
  ) {
    activeShape.value.width = offsetX - activeShape.value.startX;
    activeShape.value.height = offsetY - activeShape.value.startY;
    redrawShapeCanvas();
  }
};

const stopDrawing = () => {
  if (drawing.value) {
    if (currentTool.value === 'brush') {
      drawContext.value.closePath();
    }
    saveState();
    drawing.value = false;
    activeShape.value = null;
  }
};

const clearCanvas = () => {
  drawContext.value.clearRect(
    0,
    0,
    drawCanvas.value.width,
    drawCanvas.value.height,
  );
  shapeContext.value.clearRect(
    0,
    0,
    shapeCanvas.value.width,
    shapeCanvas.value.height,
  );
  shapes.value = [];
  textShapes.value = [];
  saveState();
};

const selectTool = (tool) => {
  currentTool.value = tool;
  if (tool === 'eraser') {
    updateEraserCursor();
  } else {
    shapeCanvas.value.style.cursor = tool === 'brush' ? 'crosshair' : 'default';
  }
};

const updateEraserCursor = () => {
  const cursorUrl = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${eraserSize.value}" height="${eraserSize.value}" viewBox="0 0 ${eraserSize.value} ${eraserSize.value}"><rect x="0" y="0" width="${eraserSize.value}" height="${eraserSize.value}" stroke="rgba(0, 0, 0, 0.5)" stroke-width="1" fill="rgba(255, 255, 255, 0.3)" /></svg>`;
  shapeCanvas.value.style.cursor = `url('${cursorUrl}') ${eraserSize.value / 2} ${eraserSize.value / 2}, auto`;
};

const redrawShapeCanvas = () => {
  shapeContext.value.clearRect(
    0,
    0,
    shapeCanvas.value.width,
    shapeCanvas.value.height,
  );
  shapes.value.forEach((shape) => {
    drawShape(shape);
  });
  textShapes.value.forEach((text) => {
    drawShape(text);
  });
};

const drawShape = (shape) => {
  shapeContext.value.beginPath();
  shapeContext.value.strokeStyle = shape.color;
  shapeContext.value.lineWidth = shape.lineWidth;

  switch (shape.type) {
    case 'arrow': {
      const headLength = 10; // 箭头头部长度
      const headAngle = Math.PI / 6; // 30度角，控制箭头尖锐度
      const angle = Math.atan2(shape.height, shape.width);
      const endX = shape.startX + shape.width;
      const endY = shape.startY + shape.height;
      // 计算箭头头部基座位置（杆的结束点）
      const shaftEndX = endX - headLength * Math.cos(angle);
      const shaftEndY = endY - headLength * Math.sin(angle);
      // 计算箭头两侧点的位置
      const leftX = endX - headLength * Math.cos(angle + headAngle);
      const leftY = endY - headLength * Math.sin(angle + headAngle);
      const rightX = endX - headLength * Math.cos(angle - headAngle);
      const rightY = endY - headLength * Math.sin(angle - headAngle);
      // 开始绘制路径
      shapeContext.value.beginPath();
      // 1. 绘制箭杆（从起点到头部基座）
      shapeContext.value.moveTo(shape.startX, shape.startY);
      shapeContext.value.lineTo(shaftEndX, shaftEndY);

      // 2. 绘制箭头头部（从基座到右侧点再到尖端）
      shapeContext.value.moveTo(shaftEndX, shaftEndY);
      shapeContext.value.lineTo(rightX, rightY);
      shapeContext.value.lineTo(endX, endY);
      shapeContext.value.lineTo(leftX, leftY);
      shapeContext.value.lineTo(shaftEndX, shaftEndY);

      // 3. 填充箭头（可选）
      shapeContext.value.fillStyle = shape.color;
      shapeContext.value.fill();

      // 4. 描边
      shapeContext.value.stroke();
      break;
    }
    case 'circle': {
      shapeContext.value.arc(
        shape.startX,
        shape.startY,
        Math.hypot(shape.width, shape.height),
        0,
        2 * Math.PI,
      );

      break;
    }
    case 'rectangle': {
      shapeContext.value.rect(
        shape.startX,
        shape.startY,
        shape.width,
        shape.height,
      );

      break;
    }
    case 'text': {
      shapeContext.value.fillStyle = shape.color;
      shapeContext.value.font = '16px Arial';
      shapeContext.value.textAlign = 'left';
      shapeContext.value.textBaseline = 'top';
      shapeContext.value.fillText(shape.content, shape.startX, shape.startY);

      break;
    }
    // No default
  }

  shapeContext.value.stroke();
};

const finishTextEditing = () => {
  if (textContent.value.trim() === '') return;
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = textArea.value;
  const shape = {
    type: 'text',
    content: textContent.value,
    color: currentColor.value,
    startX: offsetLeft + 10,
    startY: offsetTop + 10,
    width: offsetWidth,
    height: offsetHeight,
  };
  textShapes.value.push(shape);
  redrawShapeCanvas();
  textContent.value = '';
  textStyle.display = 'none';
};

const updateTextContent = () => {
  // Optional: Handle text content updates here if needed
};

const resizeCanvas = () => {
  if (drawCanvas.value) {
    // 设置canvas的CSS尺寸
    drawCanvas.value.style.width = imgWidth.value + 'px';
    drawCanvas.value.style.height = imgHeight.value + 'px';

    // 设置canvas的像素尺寸（避免模糊）
    drawCanvas.value.width = imgWidth.value;
    drawCanvas.value.height = imgHeight.value;
  }
  if (shapeCanvas.value) {
    // 设置canvas的CSS尺寸
    shapeCanvas.value.style.width = imgWidth.value + 'px';
    shapeCanvas.value.style.height = imgHeight.value + 'px';

    // 设置canvas的像素尺寸（避免模糊）
    shapeCanvas.value.width = imgWidth.value;
    shapeCanvas.value.height = imgHeight.value;
  }
};

onMounted(() => {
  resizeCanvas();
  drawContext.value = drawCanvas.value.getContext('2d');
  shapeContext.value = shapeCanvas.value.getContext('2d');

  drawContext.value.fillStyle = 'rgba(0, 0, 0, 0)'; // 完全透明
  drawContext.value.fillRect(0, 0, imgWidth.value, imgHeight.value);

  shapeContext.value.fillStyle = 'rgba(0, 0, 0, 0)'; // 完全透明
  shapeContext.value.fillRect(0, 0, imgWidth.value, imgHeight.value);
  saveState();
});

watch(() => eraserSize.value, updateEraserCursor);
</script>

<template>
  <div>
    <div class="toolbar flex" ref="toolbarCon">
      <el-color-picker v-model="currentColor" />
      <el-slider
        v-model="currentLineWidth"
        :min="1"
        :max="10"
        style="width: 400px; margin: 0 20px"
      />
      <el-button
        :class="{ active: currentTool === 'brush' }"
        @click="selectTool('brush')"
      >
        画笔
      </el-button>
      <el-button
        :class="{ active: currentTool === 'rectangle' }"
        @click="selectTool('rectangle')"
      >
        长方形
      </el-button>
      <el-button
        :class="{ active: currentTool === 'circle' }"
        @click="selectTool('circle')"
      >
        圆形
      </el-button>
      <el-button
        :class="{ active: currentTool === 'arrow' }"
        @click="selectTool('arrow')"
      >
        箭头
      </el-button>
      <el-button
        :class="{ active: currentTool === 'text' }"
        @click="selectTool('text')"
      >
        文本
      </el-button>
      <el-button @click="clearCanvas">清除</el-button>
      <el-button @click="emit('onExit')">退出</el-button>
    </div>
    <div class="canvas-container" ref="canvasContainer">
      <canvas ref="drawCanvas" style="position: absolute"></canvas>
      <canvas
        ref="shapeCanvas"
        @mousedown="handleClick"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseout="stopDrawing"
        style="position: absolute; border: 0 solid #000"
      ></canvas>
      <textarea
        v-if="currentTool === 'text'"
        v-model="textContent"
        :style="[
          textStyle,
          { color: currentColor, border: `1px dashed ${currentColor}` },
        ]"
        @blur="finishTextEditing"
        @input="updateTextContent"
        ref="textArea"
        class="text-editor"
        placeholder="请输入文本"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  padding: 5px 20px;
}

.canvas-container {
  position: relative;
  height: 100%;
}

canvas {
  cursor: default;
}

.text-editor {
  display: none;
}

.el-button.active {
  background-color: #409eff;
  color: white;
}

.text-editor {
  display: block;
  position: absolute;
  border: 2px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 14px;
  padding: 10px;
  resize: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: border-color 0.3s ease;
  width: 200px;
  height: 100px;
  top: 0;
  left: 0;
}

.text-editor:focus {
  border-color: #409eff;
  outline: none;
}

.text-editor::placeholder {
  color: #888;
  font-style: italic;
}
</style>
