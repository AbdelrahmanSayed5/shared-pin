  import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
  import { Client, Message } from '@stomp/stompjs';
  import * as SockJS from 'sockjs-client';
  import { FileService } from '../sharedServices/file.service';
  interface CRDTChar {
    id: string;
    value: string;
  }
  @Component({
    selector: 'app-texteditor2',
    templateUrl: './texteditor2.component.html',
    styleUrls: ['./texteditor2.component.css']
  })
  export class Texteditor2Component implements OnInit{
    @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
    previousValue: string = '';
    cursors: { [userId: string]: number } = {};
    stompClient!: Client;
    isConnected: boolean = false;
    cursorPos = { x: 0, y: 0 };
    currentUser = 'currentUser';
    fileData!:string;
    document: CRDTChar[] = [];
    constructor(private filerService:FileService) { }

    ngOnInit() {
      this.fileData=this.filerService.fileData;
      console.log(this.fileData);
      this.connectWebSocket();
    }

    connectWebSocket() {
      let encodedUri = encodeURIComponent(`Bearer ${localStorage.getItem('token')}`||"");
      console.log(encodedUri);
      const socket = new SockJS(`http://48.216.240.107:8080/colabedit?token=${encodedUri}`);
      this.stompClient = new Client({
        webSocketFactory: () => socket
      });

      const documentId = '1'; // Replace with the actual document ID
      this.stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        this.isConnected = true;
        
        this.stompClient.subscribe('/topic/colabedit/' + documentId, (message: Message) => {
          this.handleIncomingMessage(message.body);
        });
      };

      this.stompClient.onWebSocketClose = () => {
        console.log('Disconnected');
        this.isConnected = false;
      };

      this.stompClient.activate();
    }

    onInput(event: any): void {
      if (!this.isConnected) {
        console.error('WebSocket is not connected');
        return;
      }
    
      const currentValue = this.editor.nativeElement.innerText; // Use innerText to avoid HTML structure issues
      const selection = window.getSelection();
      const selectionStart = this.getCursorOffset(this.editor.nativeElement);
      console.log("currentValue: " + currentValue);
      console.log("previousValue: " + this.previousValue);
    
      if (currentValue.length > this.previousValue.length) {
        // Character added
        console.log('Current value:', currentValue);
        const addedChar = currentValue.charAt(selectionStart - 1);
        const charId = this.generateUniqueId();
        console.log('Added char:', addedChar + ' at position ' + selectionStart + ' with ID ' + charId);
        this.sendInsertChar('1', selectionStart - 1, addedChar, 'currentUser');
      } else if (currentValue.length < this.previousValue.length) {
        // Character removed
        const removedChar = this.previousValue.charAt(selectionStart);
        const charId = this.generateUniqueId(); // In a real scenario, use the actual ID of the character being removed
        this.sendRemoveChar('1', selectionStart, removedChar, 'currentUser');
      }
    
      // Update previous value
      this.previousValue = currentValue;
      this.updateCursorPosition();
    }
    
    getCursorOffset(editor: HTMLElement): number {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return 0;
      }
      
      const range = selection.getRangeAt(0).cloneRange();
      range.setStart(editor, 0);
      return range.toString().length;
    }

    onKeydown(event: any): void {
      if (!this.isConnected) {
        console.error('WebSocket is not connected');
        return;
      }

      const selection = window.getSelection();
      const selectionStart = selection ? selection.focusOffset : 0;
      const userId = "current user"; // Replace with actual user ID
      this.cursors[userId] = selectionStart;
      this.sendCursorUpdate('1', userId, selectionStart);
      
      setTimeout(() => this.updateCursorPosition(), 0);
      
    }

   
  handleIncomingMessage(message: string): void {
    const jsonMessage = JSON.parse(message);

    if (jsonMessage.operation === 'insertChar') {
      console.log('Insert char:', jsonMessage);
      this.insertChar(jsonMessage.insertedChar.position, jsonMessage.insertedChar.char, jsonMessage.userId);
    } else if (jsonMessage.operation === 'removeChar') {
      console.log('Remove char:', jsonMessage);
      this.removeChar(jsonMessage.removedChar.position, jsonMessage.removedChar.char, jsonMessage.userId);
    } else if (jsonMessage.operation === 'updateCursor') {
      console.log('Update cursor:', jsonMessage);
      this.cursors[jsonMessage.userId] = jsonMessage.position;
      this.updateCursorPosition();
    }
  }
    insertChar(position: number, char: string, userId: string): void {
      this.document.splice(position, 0, { id: this.generateUniqueId(), value: char });
      this.renderDocument();
    }
  
    removeChar(position: number, char: string, userId: string): void {
      this.document = this.document.filter((item, index) => index !== position);
      this.renderDocument();
    }
  
    renderDocument(): void {
      this.editor.nativeElement.innerText = this.document.map(char => char.value).join('');
    }
    sendInsertChar(documentId: string, position: number, char: string, userId: string): void {
      const jsonToSend = {
        operation: 'insertChar',
        userId: userId,
        insertedChar: { 
          position: position,
          char: char,
        },
      };
      this.stompClient.publish({
        destination: '/app/colabedit/' + documentId,
        body: JSON.stringify(jsonToSend),
      });
    }

    sendRemoveChar(documentId: string, position: number, char: string, userId: string): void {
      const jsonToSend = {
        operation: 'removeChar',
        userId: userId,
        removedChar: {
          position: position,
          char: char,
        },
      };
      this.stompClient.publish({
        destination: '/app/colabedit/' + documentId,
        body: JSON.stringify(jsonToSend),
      });
    }

    sendCursorUpdate(documentId: string, userId: string, position: number): void {
      const jsonToSend = {
        operation: 'updateCursor',
        userId: userId,
        position: position,
      };
      this.stompClient.publish({
        destination: '/app/colabedit/' + documentId,
        body: JSON.stringify(jsonToSend),
      });
    }

    generateUniqueId(): string {
      return 'id-' + Math.random().toString(36).substr(2, 9);
    }

    updateCursorPosition() {
      const position = this.getCursorPosition(this.editor.nativeElement);
      this.cursorPos = position;
    }

    applyStyle(style: string): void {
      console.log(`${style} button clicked`);
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.appendChild(range.extractContents());

        if (style === 'bold') {
          if (span.style.fontWeight === 'bold') {
            span.style.fontWeight = 'normal';
            console.log('Bold removed');
          } else {
            span.style.fontWeight = 'bold';
            console.log('Bold applied');
          }
        } else if (style === 'italic') {
          if (span.style.fontStyle === 'italic') {
            span.style.fontStyle = 'normal';
            console.log('Italic removed');
          } else {
            span.style.fontStyle = 'italic';
            console.log('Italic applied');
          }
        } else if (style === 'underline') {
          if (span.style.textDecoration === 'underline') {
            span.style.textDecoration = 'none';
            console.log('Underline removed');
          } else {
            span.style.textDecoration = 'underline';
            console.log('Underline applied');
          }
        }

        range.insertNode(span);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        console.log(`No selection found to apply ${style}`);
      }
    }

    getCursorPosition(editor: HTMLElement): { x: number, y: number } {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return { x: 0, y: 0 };
      }
      
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);
    
      // Create a temporary span at the cursor position to get its exact position
      const span = document.createElement('span');
      span.style.position = 'absolute';
      span.style.visibility = 'hidden';
      span.appendChild(document.createTextNode('\u200b')); // Zero-width space character
      range.insertNode(span);
      const spanRect = span.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
    
      const cursorPositionX = spanRect.left - editorRect.left+20;
      const cursorPositionY = spanRect.top - editorRect.top+20;
    
      // Clean up by removing the temporary span
      span.parentNode?.removeChild(span);
    
      return { x: cursorPositionX, y: cursorPositionY };
    }
  }
