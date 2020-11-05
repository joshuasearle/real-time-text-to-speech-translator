import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  message: string = '';
  language: string = '';

  languages: LangObj[] = [
    { language: 'Arabic', langCode: 'ar', countryCode: 'XA' },
    { language: 'Czech', langCode: 'cs', countryCode: 'CZ' },
    { language: 'Danish', langCode: 'da', countryCode: 'DK' },
    { language: 'Dutch', langCode: 'nl', countryCode: 'NL' },
    { language: 'Filipino', langCode: 'fil', countryCode: 'PH' },
    { language: 'Finish', langCode: 'fi', countryCode: 'FI' },
    { language: 'French', langCode: 'fr', countryCode: 'FR' },
    { language: 'Hindi', langCode: 'hi', countryCode: 'IN' },
    { language: 'Portugese', langCode: 'pt', countryCode: 'PT' },
  ];

  socket: SocketIOClient.Socket;
  translatedObjs: any = [];

  constructor() {
    this.socket = io.connect();
  }

  ngOnInit() {
    this.listenForEvents();
  }

  listenForEvents() {
    this.socket.on(
      'newAudioFile',
      ({ fileName, langCode, message, translated }) => {
        console.log(fileName, langCode, message, translated);
        this.translatedObjs.push({ fileName, langCode, message, translated });
      }
    );
  }

  canTranslate() {
    // Need both lang code and message to be able to translate
    return !!this.language && !!this.message;
  }

  translateMessage() {
    // Send message and langCode to server
    const langObj: LangObj = this.languages.find(
      (l) => l.language === this.language
    );
    this.socket.emit('translateMessage', {
      message: this.message,
      langCode: langObj.langCode,
      countryCode: langObj.countryCode,
    });
    this.message = '';
    this.language = '';
  }

  getLanguage(langCode) {
    return this.languages.find((l) => l.langCode === langCode).language;
  }
}

type LangObj = {
  language: string;
  langCode: string;
  countryCode: string;
};
