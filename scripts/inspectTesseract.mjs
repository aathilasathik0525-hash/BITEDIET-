import * as Tesseract from 'tesseract.js';
console.log('createWorker', typeof Tesseract.createWorker);
console.log('recognize', typeof Tesseract.recognize);
console.log('default', typeof Tesseract.default);
console.log('keys', Object.keys(Tesseract).sort());
try {
  const worker = Tesseract.createWorker();
  console.log('worker type', typeof worker);
  console.log('worker proto keys', Object.getOwnPropertyNames(Object.getPrototypeOf(worker)).sort());
  console.log('worker own keys', Object.keys(worker).sort());
  console.log('has load', typeof worker.load);
  console.log('has initialize', typeof worker.initialize);
  console.log('has recognize', typeof worker.recognize);
  console.log('has setParameters', typeof worker.setParameters);
  console.log('worker toString', worker.toString());
} catch (err) {
  console.error('worker error', err);
}
