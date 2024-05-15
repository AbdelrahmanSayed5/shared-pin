import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/sharedServices/file.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  @Input() src!: string;
  @Input() name!:string;
  @Input() user!:boolean;
  @Input() index!:number;
  @Input() owner!:boolean;
  @Output() clickedindex_rename:EventEmitter<any>=new EventEmitter();
  @Output() clickedindex_share:EventEmitter<any>=new EventEmitter();
  @Output() clickindex_open:EventEmitter<any>=new EventEmitter();
  openmodal:boolean=false;
  @Output() clickedindex_remove:EventEmitter<any>=new EventEmitter();
  constructor(private fileservice:FileService) { }
  ngOnInit(): void {

  }
  openrenamemodal(){
    console.log("i am hereeeeeeeeeeee")
    this.openmodal=true;

  }
  handleranamedocument(){
    console.log(this.index)
    this.clickedindex_rename.emit(this.index)
  }
  handleremovefile(){
    this.clickedindex_remove.emit(true)
    if(this.owner==true){
      console.log(this.index)
      this.fileservice.deleteFile(this.fileservice.filesOwnedByUser[this.index].id).subscribe((data)=>{
        console.log("asdadasd")
        this.clickedindex_remove.emit(false)
        
          
          this.fileservice.filesOwnedByUser.splice(this.index,1);
        
      })
    }
    else{
      console.log(this.index)
      this.fileservice.deleteFile(this.fileservice.filesSharedWithUser[this.index].id).subscribe((data)=>{
        console.log("asdadasd")
        this.clickedindex_remove.emit(false)
        
          
          this.fileservice.filesSharedWithUser.splice(this.index,1);
        
      })
    }

   

  }
  handleShare(){
    this.clickedindex_share.emit(this.index)

  }
  handleopenfile(){
    this.clickindex_open.emit(this.index)
  }
}
