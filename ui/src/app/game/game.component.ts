import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {fromEvent} from "rxjs/internal/observable/fromEvent";
import {pairwise, switchMap, takeUntil} from "rxjs/operators";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  @Input() public width = 600;
  @Input() public height = 600;

  private isOnline: boolean = false;
  private userName: string = '';
  private password: string = 'Ryba';
  private cx: CanvasRenderingContext2D;

  private SOCKENT_ENDPOINT: string = environment.apiEndpoint + '/socket';
  private READ_CHAT_ENDPOINT: string = '/app/message';
  private WRITE_CHAT_ENDPOINT: string = '/puns/message';
  private READ_STROKE_ENDPOINT: string = '/app/stroke';
  private WRITE_STROKE_ENDPOINT: string = '/puns/stroke';

  private stompClient = null;
  private canvasColour: string = '#000';
  private canvasSize: number = 3;
  private strokes: Stroke[] = [];
  private messages: Message[] = [];
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

    this.cx.lineWidth = this.canvasSize;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = this.canvasColour;

    this.captureEvents(canvasEl);
  }

  ngOnDestroy(): void {
    this.isOnline = false;
    this.disconnect();
  }

  login(): void {
    this.isOnline = true;
    this.message.userName = this.userName;
    this.connect();
  }

  sendMessage() {
    this.stompClient.send(
      this.WRITE_CHAT_ENDPOINT, {},
      JSON.stringify(this.message)
    );

    console.log(this.message);
  }

  private connect(): void {
    const socket = new SockJS(this.SOCKENT_ENDPOINT);
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.messages = [];
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe(_this.READ_CHAT_ENDPOINT, function (chatMessage) {
        _this.pushChatMessage(JSON.parse(chatMessage.body));
      });
       _this.stompClient.subscribe(_this.READ_STROKE_ENDPOINT, function (strokes) {
        _this.pushStrokes(JSON.parse(strokes.body));
      });
    });
  }

  private disconnect(): void {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  private pushChatMessage(message: Message): void {
    this.messages.push(message);
  }

  private pushStrokes(stroke: Stroke): void {
    this.strokes.push(stroke);
    this.drawOnCanvas(stroke.colour, stroke.size, stroke.prevPoint, stroke.currentPoint);
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


        const stroke: Stroke = {
          colour: this.canvasColour,
          size: this.canvasSize,
          prevPoint: prevPos,
          currentPoint: currentPos
        };
        this.strokes.push(stroke);

        this.stompClient.send(
          this.WRITE_STROKE_ENDPOINT, {},
          JSON.stringify(stroke)
        );

        this.drawOnCanvas(this.canvasColour, this.canvasSize, prevPos, currentPos);
      });
  }

  private drawOnCanvas(colour: string, size: number, prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) {
      return;
    }

    this.cx.strokeStyle = colour;
    this.cx.lineWidth = size;
    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();


      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000';
    }
  }
}

export interface Message {
  date: string;
  userName: string;
  content: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  colour: string;
  size: number;
  prevPoint: Point;
  currentPoint: Point;
}
