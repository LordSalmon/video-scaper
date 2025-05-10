import { appendFile } from "node:fs/promises";
import { Glob } from "bun";
import { mkdir } from "node:fs/promises";

const basePath = "./fetched/winnetou_1";
const outFile = "./out/Winnetou_1.ts";
const outPath = "./out";

// https://hfs299.serversicuro.cc/hls/dnzpe3tn3tg4a3gyvdfx5lbuqyss77ehxpq6kjhfthvkkepii2t7yat5byba/seg-14-v1-a1.ts

const before =
  "https://hfs299.serversicuro.cc/hls/dnzpe3tn3tg4a3gyvdfx5lbuqyss77ehxpq6kjhfthvkkepii2t7yat5byba/seg-";
const after = "-v1-a1.ts";

const fetched = true;

if (!fetched) {
  await mkdir(basePath, { recursive: true });

  let count = 1;

  while (count >= 0) {
    try {
      console.log(`Processing ${count}`);
      const res = await fetch(before + count + after);
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength === 0) {
        console.log("Has size of 0");
        count = -1;
        continue;
      }
      await Bun.write(`${basePath}/${count}.ts`, buffer);
      count++;
    } catch (e) {
      console.error(e);
      count = -1;
    }
  }
}

await mkdir(outPath, { recursive: true });
Bun.file(outFile);
const glob = new Glob("*");
const sortedFileNames = Array.from(glob.scanSync(basePath)).sort((a, b) => {
  const numberA = Number(a.split(".")[0]);
  const numberB = Number(b.split(".")[0]);
  return numberA > numberB ? 1 : -1;
});

for (const file of sortedFileNames) {
  console.log(`Processing ${file}`);
  try {
    const buffer = await Bun.file(basePath + "/" + file).arrayBuffer();
    await appendFile(outFile, new Uint8Array(buffer));
  } catch (e) {
    console.error(e);
  }
}
