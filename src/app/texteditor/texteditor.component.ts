import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../sharedServices/file.service';

@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.css']
})
export class TexteditorComponent implements OnInit {
  @Input()content!:string;
  isBold: boolean = false;
  isItalic: boolean = false;
  pages:number[]=[1]
  index!: number;
  fileData: string="asdsafasfsaf";
  editorContent: string = '';
 
  constructor(private elementRef: ElementRef,private fileservice:FileService) { }

  ngOnInit(): void {
    this.fileData=this.fileservice.fileData;
    console.log(this.fileData)
  }


  toggleBold() {
    this.isBold = !this.isBold;
    // document.execCommand('bold');
  }

  toggleItalic() {
    this.isItalic = !this.isItalic;
    // document.execCommand('italic');
  }

  onInputChange(content: any) {
    // Handle changes to the content
    // You can implement this method to update your data model or CRDT
  }
  adjustContent() {
    const editor = this.elementRef.nativeElement.querySelector('.editor');
    const totalpages = Math.ceil(editor.scrollHeight / (editor.clientHeight));
    // console.log(totalpages);
    // Remove previous page breaks
    // editor.querySelectorAll('.editor-page').forEach((page: { remove: () => any; }) => page.remove());
    console.log(this.fileData)
    // Add page breaks

    // i want to get the inner html in the editor and then split it into pages

    this.editorContent = editor.innerHTML;
    console.log(this.editorContent)
   this.pages = Array.from({ length: totalpages }, (_, i) => i);
   
  }


}
