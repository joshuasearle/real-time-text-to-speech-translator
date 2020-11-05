const fs = require("fs");
const textToSpeech = require("@google-cloud/text-to-speech");
const { Translate } = require("@google-cloud/translate").v2;
const ttsClient = new textToSpeech.TextToSpeechClient();

const translate = new Translate({ projectID: "project" });
const text = "Hello from FIT2095, how are you doing today?";

const target = "ru";
const main = async () => {
  const [translation] = await translate.translate(text, target);
  console.log(text);
  console.log(translation);
};

main();

// const request = {
//   input: { text: text },
//   voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
//   audioConfig: { audioEncoding: "MP3" },
// };

// ttsClient.synthesizeSpeech(request, (err, res) => {
//   if (err) {
//     console.log("ERROR: ", err);
//     return;
//   }

//   fs.writeFile("ouput.mp3", res.audioContent, "binary", (err) => {
//     if (err) {
//       console.log("ERROR: ", err);
//       return;
//     }

//     console.log("Audio content was written to file.");
//   });
// });
