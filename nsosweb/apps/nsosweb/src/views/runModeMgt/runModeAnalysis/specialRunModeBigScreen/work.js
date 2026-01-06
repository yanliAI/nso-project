// work.js
class PDFWorkerManager {
  static worker = null;

  static create() {
    if (!this.worker && typeof window !== 'undefined' && 'Worker' in window) {
      try {
        // 优先使用本地 Worker，失败则降级到 CDN
        this.worker = new Worker(
          new URL('pdfjs-dist/legacy/build/pdf.worker.min.js', import.meta.url),
          { type: 'module' }
        );
      } catch (e) {
        console.warn('本地 Worker 创建失败，使用 CDN Worker:', e);
        // 3.11.174 版本 CDN 地址
        window.pdfjsWorker = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js';
      }
    }
    return this.worker;
  }

  static destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export default PDFWorkerManager;
