/* Local, classical GrabCut segmentation. No AI model or remote service. */
let engine;
async function loadEngine() {
  if (engine) return engine;
  engine = (async () => {
    importScripts('/vendor/opencv/opencv.js');
    let cv = self.cv;
    if (cv instanceof Promise) cv = await cv;
    else if (!cv.Mat) await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('OpenCV yuklanishi uzoq davom etdi. Qayta urinib ko‘ring.')), 20000);
      const previous = cv.onRuntimeInitialized;
      cv.onRuntimeInitialized = () => { if (previous) previous(); clearTimeout(timer); resolve(); };
    });
    if (!cv.Mat || !cv.grabCut) throw Error('OpenCV GrabCut yuklanmadi.');
    // Old Emscripten modules have a `then` method: never resolve them directly.
    return {cv};
  })();
  try { return await engine; } catch (error) { engine = null; throw error; }
}
self.onmessage = async ({data: input}) => {
  const resources = [];
  try {
    const {cv} = await loadEngine();
    if (input.type === 'init') { self.postMessage({id: input.id, ready: true}); return; }
    const {width, height, rectangle, detail} = input;
    if (!rectangle || rectangle.width < 8 || rectangle.height < 8) throw Error('Kiyim atrofida ramka belgilang.');
    const keep = mat => { resources.push(mat); return mat; };
    const rgba = keep(new cv.Mat(height, width, cv.CV_8UC4)); rgba.data.set(new Uint8ClampedArray(input.pixels));
    const scale = Math.min(1, detail / Math.max(width, height));
    const w = Math.max(16, Math.round(width * scale)), h = Math.max(16, Math.round(height * scale));
    const resized = keep(new cv.Mat()), rgb = keep(new cv.Mat());
    cv.resize(rgba, resized, new cv.Size(w, h), 0, 0, cv.INTER_AREA);
    cv.cvtColor(resized, rgb, cv.COLOR_RGBA2RGB);
    const labels = keep(new cv.Mat(h, w, cv.CV_8UC1, new cv.Scalar(cv.GC_BGD)));
    const x0 = Math.max(0, Math.floor(rectangle.x * scale)), y0 = Math.max(0, Math.floor(rectangle.y * scale));
    const x1 = Math.min(w, Math.ceil((rectangle.x + rectangle.width) * scale)), y1 = Math.min(h, Math.ceil((rectangle.y + rectangle.height) * scale));
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) labels.data[y * w + x] = cv.GC_PR_FGD;
    // Map every explicit stroke, including narrow strokes, into the working mask.
    const seeds = new Uint8Array(input.seeds), seedMap = new Uint8Array(w * h);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const seed = seeds[y * width + x];
      if (seed) seedMap[Math.min(h - 1, Math.floor(y * scale)) * w + Math.min(w - 1, Math.floor(x * scale))] = seed;
    }
    let bg = 0, fg = 0;
    for (let i = 0; i < labels.data.length; i++) {
      if (seedMap[i]) labels.data[i] = seedMap[i] === 1 ? cv.GC_FGD : cv.GC_BGD;
      if (labels.data[i] === cv.GC_BGD) bg++; else fg++;
    }
    if (!bg || !fg) throw Error('Kiyim va fon uchun alohida joy belgilang. Ramkani surat chetidan ichkarida chizing.');
    const bgModel = keep(new cv.Mat()), fgModel = keep(new cv.Mat());
    cv.setRNGSeed(42);
    cv.grabCut(rgb, labels, new cv.Rect(), bgModel, fgModel, 4, cv.GC_INIT_WITH_MASK);
    const small = keep(new cv.Mat(h, w, cv.CV_8UC1));
    for (let i = 0; i < small.data.length; i++) small.data[i] = labels.data[i] === cv.GC_FGD || labels.data[i] === cv.GC_PR_FGD ? 255 : 0;
    const large = keep(new cv.Mat()); cv.resize(small, large, new cv.Size(width, height), 0, 0, cv.INTER_LINEAR);
    const alpha = new Uint8Array(large.data);
    // Hard user decisions survive downsampling and the final interpolation.
    for (let i = 0; i < alpha.length; i++) if (seeds[i]) alpha[i] = seeds[i] === 1 ? 255 : 0;
    let visible = 0; for (const a of alpha) if (a > 127) visible++;
    if (!visible) throw Error('Kiyim ajralmadi. Uning ichiga yashil saqlash belgisi chizing va qayta hisoblang.');
    self.postMessage({id: input.id, alpha: alpha.buffer, coverage: visible / alpha.length}, [alpha.buffer]);
  } catch (error) {
    self.postMessage({id: input.id, error: typeof error === 'number' ? 'Ajratish bajarilmadi. Yashil kiyim va qizil fon belgilarini qo‘shib urinib ko‘ring.' : error.message || 'Ajratish bajarilmadi.'});
  } finally {
    for (const resource of resources.reverse()) resource.delete();
  }
};
