import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

const upload = document.getElementById("upload");
const convertBtn = document.getElementById("convert");
const download = document.getElementById("download");

convertBtn.addEventListener("click", async () => {
  if (!upload.files.length) return alert("Upload file dulu!");

  convertBtn.innerText = "Loading FFmpeg...";
  await ffmpeg.load();

  const file = upload.files[0];
  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

  convertBtn.innerText = "Converting...";
  await ffmpeg.run("-i", "input.mp4", "-q:a", "0", "-map", "a", "output.mp3");

  const data = ffmpeg.FS("readFile", "output.mp3");

  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "audio/mp3" })
  );

  download.href = url;
  download.download = "converted.mp3";
  download.style.display = "block";
  download.innerText = "Download MP3";

  convertBtn.innerText = "Convert Lagi";
});
