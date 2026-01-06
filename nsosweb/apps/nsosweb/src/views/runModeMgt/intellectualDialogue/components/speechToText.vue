<template>
  <div></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['dataFromChild']);

// 响应式数据
const recording = ref(false);
const leftchannel = ref([]);
const rightchannel = ref([]);
const recordingLength = ref(0);
const audioContext = ref(null);
const context = ref(null);
const sampleRate = ref(null);
const volume = ref(null);
const audioInput = ref(null);
const recorder = ref(null);

// 语音相关函数
const success = (e) => {
  // 创建录音机对象
  audioContext.value = window.AudioContext || window.webkitAudioContext;
  context.value = new audioContext.value();
  // we query the context sample rate (varies depending on platforms)
  sampleRate.value = context.value.sampleRate; //输入采样率
  // creates a gain node
  volume.value = context.value.createGain();
  // creates an audio node from the microphone incoming stream
  audioInput.value = context.value.createMediaStreamSource(e);
  // connect the stream to the gain node
  audioInput.value.connect(volume.value);
  const bufferSize = 2048;
  // 创建录音机对象
  recorder.value = context.value.createScriptProcessor(bufferSize, 2, 2);
  recorder.value.onaudioprocess = (e) => {
    if (!recording.value) return;
    const left = e.inputBuffer.getChannelData(0);
    const right = e.inputBuffer.getChannelData(1);
    leftchannel.value.push(new Float32Array(left));
    rightchannel.value.push(new Float32Array(right));
    recordingLength.value += bufferSize;
    // we clone the samples
  };
  // we connect the recorder
  volume.value.connect(recorder.value);
  recorder.value.connect(context.value.destination);
};

const startRecorder = () => {
  //语音转文字
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(success)
      .catch(() => {});
    recording.value = true;
    leftchannel.value = [];
    rightchannel.value = [];
    recordingLength.value = 0;
  } else {
    alert('不支持getUserMedia');
  }
};

const stopRecorder = () => {
  recording.value = false;
  const leftBuffer = mergeBuffers(leftchannel.value, recordingLength.value);
  const rightBuffer = mergeBuffers(rightchannel.value, recordingLength.value);
  // we interleave both channels together
  const interleaved = interleave(leftBuffer, rightBuffer);
  // we create our wav file
  const buffer = new ArrayBuffer(44 + interleaved.length);
  const view = new DataView(buffer);
  sampleRate.value = 11025;
  // RIFF chunk descriptor
  writeUTFBytes(view, 0, 'RIFF');
  view.setUint32(4, 44 + interleaved.length, true);
  writeUTFBytes(view, 8, 'WAVE');
  // FMT sub-chunk
  writeUTFBytes(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  // stereo (2 channels)
  view.setUint16(22, 2, true);
  view.setUint32(24, sampleRate.value, true);
  view.setUint32(28, sampleRate.value * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 8, true);
  // data sub-chunk
  writeUTFBytes(view, 36, 'data');
  view.setUint32(40, interleaved.length, true);
  // write the PCM samples
  let lng = interleaved.length;
  let index = 44;
  const vol = 1;
  for (let i = 0; i < lng; i++) {
    const val = interleaved[i] * (0x7fff * vol);
    view.setInt8(index, parseInt(255 / (65535 / (val + 32768))), true);
    index += 1;
  }
  const blob = new Blob([view], { type: 'audio/mp3' });
  const formData = new FormData();
  formData.append('file', blob, 'file.wav');
  fetch(import.meta.env.VITE_MODEL_URL + '/v1/audio-to-text', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer app-Ah9sxLSr5crHiXHKOb2krzAM',
    },
    body: formData,
  }).then((response) => {
    if (response.statusText == 'OK') {
      response
        .clone()
        .json()
        .then((data) => {
          emit('dataFromChild', data.text);
        });
      return response.json();
    }
    throw new Error('Network response was not ok.');
  });
};

const mergeBuffers = (channelBuffer, recordingLength) => {
  const result = new Float32Array(recordingLength);
  let offset = 0;
  const lng = channelBuffer.length;
  for (let i = 0; i < lng; i++) {
    const buffer = channelBuffer[i];
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
};

const writeUTFBytes = (view, offset, string) => {
  const lng = string.length;
  for (let i = 0; i < lng; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const interleave = (leftChannel, rightChannel) => {
  const length = leftChannel.length * 2;
  const result = new Float32Array(length);

  let inputIndex = 0;
  for (let index = 0; index < length; ) {
    result[index++] = leftChannel[inputIndex];
    result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }

  const compression = 44100 / 11025, //计算压缩率
    newlength = length / compression;
  const result2 = new Float32Array(newlength);
  let index = 0;
  while (index < length) {
    result2[index] = result[index++ * compression];
  }
  return result2;
};

// 暴露方法给父组件
defineExpose({
  startRecorder,
  stopRecorder,
});
</script>

<style scoped></style>
