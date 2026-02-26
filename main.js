import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();
const upload = document.getElementById("upload");
const convertBtn = document.getElementById("convert");
const download = document.getElementById("download");

convertBtn.addEventListener("click", async () => {
  if (!upload.files.length) {
    alert("Upload file dulu!");
    return;
  }

  convertBtn.innerText = "Loading FFmpeg...";
  
  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }

  const file = upload.files[0];

  convertBtn.innerText = "Converting...";

  await ffmpeg.writeFile("input.mp4", await fetchFile(file));

  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-q:a",
    "0",
    "-map",
    "a",
    "output.mp3",
  ]);

  const data = await ffmpeg.readFile("output.mp3");

  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "audio/mp3" })
  );

  download.href = url;
  download.download = "converted.mp3";
  download.style.display = "block";
  download.innerText = "Download MP3";

  convertBtn.innerText = "Convert Lagi";
});
