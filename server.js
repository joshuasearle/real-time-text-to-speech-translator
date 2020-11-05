// Default imports
const http = require("http");
const path = require("path");
const fs = require("fs").promises;
const util = require("util");

// Dependency imoports
const express = require("express");
const socket = require("socket.io");
const textToSpeech = require("@google-cloud/text-to-speech");
const { response } = require("express");
const { Translate } = require("@google-cloud/translate").v2;

// Setup
const app = express();
const server = http.Server(app);
const io = socket(server);
const ttsClient = new textToSpeech.TextToSpeechClient();
const translate = new Translate({ projectID: "project" });
const writeFile = util.promisify(fs.writeFile);

const port = 8080;

// Static assets for angular
app.use("/", express.static(path.join(__dirname, "dist/Week12")));
app.use("/audio-files", express.static(path.join(__dirname, "audio-files")));

// Setup socket.io
io.on("connection", (socket) => {
  console.log("New connection made from client with ID=", socket.id);

  socket.on("translateMessage", async ({ message, langCode, countryCode }) => {
    console.log(message, langCode, countryCode);
    try {
      const translated = (await translate.translate(message, langCode))[0];
      const fullCode = `${langCode}-${countryCode}`;
      const fileName = await downloadFile(translated, fullCode);
      io.sockets.emit("newAudioFile", {
        message: message,
        translated: translated,
        langCode: langCode,
        fileName: fileName,
      });
    } catch (e) {
      console.log(e);
    }
  });
});

const downloadFile = async (text, langCode) => {
  const request = {
    input: { text: text },
    voice: { languageCode: langCode, ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };
  const response = (await ttsClient.synthesizeSpeech(request))[0];
  const fileName = createFileName(text);
  await fs.writeFile(fileName, response.audioContent);

  return fileName;
};

const createFileName = (message) => {
  return (
    "audio-files/" +
    Math.floor(Math.random() * 1000) +
    message.substring(0, 5) +
    ".mp3"
  );
};

// Util date function
const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleString();
};

// Run server
server.listen(port, () => {
  console.log("Listening on port " + port);
});
