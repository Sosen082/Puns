import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {LanguageService} from "../core/language.service";
import {AlertService} from "../core/alert.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{

  private SOCKENT_ENDPOINT: string = environment.apiEndpoint + '/socket';
  private READ_CHAT_ENDPOINT: string = '/app/chatMessage';
  private WRITE_CHAT_ENDPOINT: string = '/puns/message';

  // private stompClient: Stomp = null;
  private chatmessages: ChatMessage[] = [];
  private message: ChatMessage = {
    date: '',
    userName: '',
    message: ''
  };

  constructor(
    private languageService: LanguageService,
    private alertService: AlertService
  ) {
    this.languageService.initDefaultLanguage();
  }

  ngOnInit(): void {
    this.connect();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  useLanguage(language: string): void {
    this.languageService.setCurrentLanguage(language);
  }

  alert(): void {
    this.alertService.success("Test");
  }

  alertError(message: string): void {
    this.alertService.error(message);
  }

  sendMessage() {
    // this.stompClient.send(
    //   this.WRITE_CHAT_ENDPOINT, {},
    //   JSON.stringify(this.message)
    // );

    console.log('Sended message: ' + this.message);
  }

  private connect(): void {
    // const socket = new SockJS(this.socketEndpoint);
    // this.stompClient = Stomp.over(socket);
    //
    // const _this = this;
    // this.stompClient.connect({}, function (frame) {
    //   _this.chatmessages = [];
    //   console.log('Connected: ' + frame);
    //
    //   _this.stompClient.subscribe(_this.READ_CHAT_ENDPOINT, function (chatMessage) {
    //     _this.pushChatMessage(JSON.parse(chatMessage.body));
    //   });
    // });
  }

  private disconnect(): void {
    // if (this.stompClient != null) {
    //   this.stompClient.disconnect();
    // }

    console.log('Disconnected!');
  }

  private pushChatMessage(message: ChatMessage): void {
    this.chatmessages.push(message);
  }
}

export interface ChatMessage {
  date: string;
  userName: string;
  message: string;
}
