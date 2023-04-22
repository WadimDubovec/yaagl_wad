import { eq } from "semver";
import { Aria2 } from "./aria2";
import { CommonUpdateProgram } from "./common-update-ui";
import {
  mkdirp,
  resolve,
  humanFileSize,
  setKey,
  getKeyOrDefault,
  fileOrDirExists,
} from "./utils";

const CURRENT_MVK_VERSION = "1.2.2";

export async function* checkAndDownloadMoltenVK(
  aria2: Aria2
): CommonUpdateProgram {
  if (
    (await fileOrDirExists("./moltenvk/libMoltenVK.dylib")) &&
    eq(
      CURRENT_MVK_VERSION,
      await getKeyOrDefault("installed_moltenvk_version", "0.0.0")
    )
  ) {
    return;
  }

  await mkdirp("./moltenvk");
  yield ["setStateText", "DOWNLOADING_ENVIRONMENT"];
  for await (const progress of aria2.doStreamingDownload({
    uri: "https://github.com/3Shain/winecx/releases/download/gi-wine-1.0/libMoltenVK.dylib",
    absDst: resolve("./moltenvk/libMoltenVK.dylib"),
  })) {
    yield [
      "setProgress",
      Number((progress.completedLength * BigInt(100)) / progress.totalLength),
    ];
    yield [
      "setStateText",
      "DOWNLOADING_ENVIRONMENT_SPEED",
      `${humanFileSize(Number(progress.downloadSpeed))}`,
    ];
  }
  setKey("installed_moltenvk_version", CURRENT_MVK_VERSION);
}

const dxvkFiles = ["d3d9.dll", "d3d10core.dll", "d3d11.dll", "dxgi.dll"];
const CURRENT_DXVK_VERSION = "1.10.4-alpha.20230402"; // there is no 1.10.4! I have to make up something greater than 1.10.3

export async function* checkAndDownloadDXVK(aria2: Aria2): CommonUpdateProgram {
  if (
    eq(
      CURRENT_DXVK_VERSION,
      await getKeyOrDefault("installed_dxvk_version", "0.0.0")
    )
  ) {
    return;
  }

  await mkdirp("./dxvk");
  yield ["setStateText", "DOWNLOADING_ENVIRONMENT"];
  for (const file of dxvkFiles) {
    for await (const progress of aria2.doStreamingDownload({
      uri: `https://github.com/3Shain/winecx/releases/download/gi-wine-1.0/${file}`,
      absDst: resolve(`./dxvk/${file}`),
    })) {
      yield [
        "setProgress",
        Number((progress.completedLength * BigInt(100)) / progress.totalLength),
      ];
      yield [
        "setStateText",
        "DOWNLOADING_ENVIRONMENT_SPEED",
        `${humanFileSize(Number(progress.downloadSpeed))}`,
      ];
    }
  }

  setKey("installed_dxvk_version", CURRENT_DXVK_VERSION);
}

const CURRENT_FPSUNLOCK_VERSION = "0.1.2";

export async function* checkAndDownloadFpsUnlocker(
  aria2: Aria2
): CommonUpdateProgram {
  if (
    (await fileOrDirExists("./fpsunlock/genshin-force-fps.exe")) &&
    eq(
      CURRENT_FPSUNLOCK_VERSION,
      await getKeyOrDefault("installed_fps_unlock", "0.0.0")
    )
  ) {
    return;
  }

  await mkdirp("./fpsunlock");
  yield ["setStateText", "DOWNLOADING_ENVIRONMENT"];
  for await (const progress of aria2.doStreamingDownload({
    uri: "https://github.com/y0soro/genshin-force-fps-rs/releases/download/v0.1.2/genshin-force-fps.exe",
    absDst: resolve("./fpsunlock/genshin-force-fps.exe"),
  })) {
    yield [
      "setProgress",
      Number((progress.completedLength * BigInt(100)) / progress.totalLength),
    ];
    yield [
      "setStateText",
      "DOWNLOADING_ENVIRONMENT_SPEED",
      `${humanFileSize(Number(progress.downloadSpeed))}`,
    ];
  }
  setKey("installed_fps_unlock", CURRENT_FPSUNLOCK_VERSION);
}
