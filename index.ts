import { appendFile } from "node:fs/promises";
import { Glob } from "bun";
import { mkdir } from "node:fs/promises";

const basePath = "./fetched/der_oelprinz";
const outFile = "./out/der_Oelprinz.ts";
const outPath = "./out";

const before =
  "https://vod3.cf.dmcdn.net/sec2(L2YyfFG24exDoKLPqzv9ZLd_KE5gjDnZ-Dr2nwPqzm82ZWZdVYnKUpMK69jpCJVK121ICcODQWnPqcO0JixmpETScf7iDKnKuMUDt-YslI4zhVb695w_LzsHJmc6ytHAuYNv-eBqR1VCSH7m0hjx6u4AxpHYaI6JSsdmU_VuPgo)/frag(";
const after = ")/video/412/113/124311214_mp4_h264_aac_hq.ts";

const fetched = false;

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
