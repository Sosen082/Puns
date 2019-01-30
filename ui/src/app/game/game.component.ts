import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {fromEvent} from "rxjs/internal/observable/fromEvent";
import {pairwise, switchMap, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 600;
  @Input() public height = 600;
  @Input('messages') private messages: Message[];

  private isOnline: boolean = false;
  private userName: string = '';
  private password: string = 'Ryba';
  private cx: CanvasRenderingContext2D;

  private SOCKENT_ENDPOINT: string = environment.apiEndpoint + '/socket';
  private READ_CHAT_ENDPOINT: string = '/app/chatMessage';
  private WRITE_CHAT_ENDPOINT: string = '/puns/message';

  // private stompClient: Stomp = null;
  private chatmessages: Message[] = [];
  private message: Message = {
    date: '',
    userName: '',
    content: ''
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  ngOnDestroy(): void {
    this.isOnline = false;
    this.disconnect();
  }

  login(): void {
    console.log("Loign in");
    this.isOnline = true;
    this.message.userName = this.userName;
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  sendMessage() {
    // this.stompClient.send(
    //   this.WRITE_CHAT_ENDPOINT, {},
    //   JSON.stringify(this.message)
    // );

    console.log(this.message);
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

  private pushChatMessage(message: Message): void {
    this.chatmessages.push(message);
  }
}

export interface Message {
  date: string;
  userName: string;
  content: string;
}
