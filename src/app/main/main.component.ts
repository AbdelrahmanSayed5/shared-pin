import { Component, OnInit,Input } from '@angular/core';
import { FileService } from '../sharedServices/file.service';
import { AuthService } from '../sharedServices/auth.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  files:{src:string,name:string,user:boolean}[]=[];
  @Input() user_files:{src:string,name:string,user:boolean}[]=[];
  name!:string;
  filesOwnedByUser:{src:string,name:string,user:boolean,ownerId:Number,content:string,id:number}[]=[];
  clicked_rename_index!:number;
  permission:string="READ";
  clicked_share_index!:number;
  sharedEmail!:string;
  loginedUser!:boolean;
  ownednyme:boolean=true;
  filessharedwithme:{src:string,name:string,user:boolean,ownerId:Number,content:string,id:number}[]=[];
  button_text:string="Owned by me";
  clicked_rename_index_shared!:number;
  clicked_share_index_shared!:number;
  loading:boolean=false;
  
  constructor(private fileservvice:FileService,private auth:AuthService ,private route:Router) { 
    this.filesOwnedByUser=this.fileservvice.filesOwnedByUser;
    this.files.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png",name:"Blank document",user:false});
    this.files.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/12OqBj7Pj3KYCouuep9Te_Rl5NPF6dn1agWqqKFcZmw8_400_3.png",name:"Essay",user:false});
    this.files.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/1u7gKcl3wof54IEWcIIH_8-_H2N4caeQ1OQ7rWJ51kJM_400_3.png",name:"Report",user:false});
    this.files.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/1OLxGsoZ-q6o9MiMbWpY7FngEKzF94SS6fZXAwo-vorM_400_2.png",name:"Report",user:false});
    this.files.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/1kMUbLsP91Y6sRloqg3XO9lZtH1WwSdEnMj4k3TwXVkY_400_1.png",name:"Report",user:false});
    this.files.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/1sb_ntuvpQ3JpIZr1PZ5kKVneBLc1PPLL2IfGKfCcQaQ_400_1.png",name:"Book report",user:false})
    
  }

  ngOnInit(): void {

    this.filesOwnedByUser=this.fileservvice.filesOwnedByUser;
    this.loading=true;
    this.fileservvice.getFilesOwnedByUser().subscribe((data)=>{
      this.fileservvice.filesOwnedByUser=[];
      this.loading=false;
      for(let i=0;i<data.length;i++){
        this.fileservvice.filesOwnedByUser.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/1kMUbLsP91Y6sRloqg3XO9lZtH1WwSdEnMj4k3TwXVkY_400_1.png",name:data[i].name,user:true,ownerId:data[i].ownerId,content:data[i].content,id:data[i].id})

      }
      this.filesOwnedByUser=this.fileservvice.filesOwnedByUser;
    },(error)=>{
      this.loading=false;
    })
  }
  whichclickedrename(index:number){
    this.name=this.filesOwnedByUser[index].name;
    this.clicked_rename_index=index;
  }
  whichclickedrename_shared(index:number){
    this.name=this.filessharedwithme[index].name;
    this.clicked_rename_index_shared=index;
  }

  whichclickedshare(index:number){
    this.clicked_share_index=index;
  }
  whichclickedshare_shared(index:number){
    this.clicked_share_index_shared=index;
  }
  openthedocument_shared(index:number){
    console.log(index)
    this.fileservvice.OpenFile(index).subscribe((data)=>{
    this.fileservvice.fileData = data.content;
    this.fileservvice.documentID_open=this.filessharedwithme[index].id;
    console.log(data)
    this.route.navigate(["docs"])
})}
  

  handleCreateOnClick(index:number){
    this.loading=true;
    this.fileservvice.createFile({name:this.files[index].name,content:""}).subscribe((data)=>{
      console.log(data)
      this.loading=false
      this.fileservvice.loading=false;
      if(data){
        this.fileservvice.filesOwnedByUser.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/1kMUbLsP91Y6sRloqg3XO9lZtH1WwSdEnMj4k3TwXVkY_400_1.png",name:data.name,user:true,ownerId:data.ownerId,content:"",id:data.id})
      }
     
    },(error)=>{
      console.log(error)
    }
  )
}
handlerename(){
  if(this.ownednyme==true){
    if(this.name==this.filesOwnedByUser[this.clicked_rename_index].name){
      return;
    }
    else{
      this.loading=true;
      console.log(this.filesOwnedByUser[this.clicked_rename_index].id)
      this.fileservvice.renameFile({newName:this.name},this.filesOwnedByUser[this.clicked_rename_index].id).subscribe((data)=>{
        this.loading=false;
        if(data){
          this.filesOwnedByUser[this.clicked_rename_index].name=this.name;
        }
      })
    }
  }
  else{
    console.log("i am hereeeeeeeeeeeeeeee fe rename shared")
    if(this.name==this.filessharedwithme[this.clicked_rename_index_shared].name){
      return;
    }
    else{
      this.loading=false;
      console.log(this.filessharedwithme[this.clicked_rename_index_shared].id)
      this.fileservvice.renameFile({newName:this.name},this.filessharedwithme[this.clicked_rename_index_shared].id).subscribe((data)=>{
        this.loading=true;
        if(data){
          this.filessharedwithme[this.clicked_rename_index_shared].name=this.name;
        }
      })
    }
  }
  console.log("i am hereeeeeeeeeeeeeeee")
 
}

handlechangeinselector_share(event:any){
  this.permission=event.target.value;
  console.log(this.permission)
}

handlershare(){
  if(this.ownednyme==true){
    if(this.permission=="" || this.permission==undefined || this.permission=="Permission Type:" || this.sharedEmail=="" || this.sharedEmail==undefined || this.sharedEmail==""){
      console.log(this.permission)
      console.log(this.sharedEmail)
      console.log("ana fo22222222222222")
      return;
  
    }
    else{
      console.log(this.permission)
      this.permission=this.permission.toUpperCase();
      console.log(this.clicked_share_index)
      this.loading=true;
      this.fileservvice.shareFile({documentId:this.filesOwnedByUser[this.clicked_share_index].id,recipientEmail:this.sharedEmail,permissionType:this.permission}).subscribe((data)=>{
        this.sharedEmail="";
        this.loading=false;
        console.log("iam hereeeeeeeeeeee")
      },(error)=>{
        this.sharedEmail="";
        console.log(error)
      })
    }

  }
  else{
    if(this.permission=="" || this.permission==undefined || this.permission=="Permission Type:" || this.sharedEmail=="" || this.sharedEmail==undefined || this.sharedEmail==""){
      console.log(this.permission)
      console.log(this.sharedEmail)
      console.log("ana fo22222222222222 share with me")
      return;
  
    }
    else{
      console.log(this.permission)
      this.permission=this.permission.toUpperCase();
      console.log(this.clicked_share_index)
      this.loading=true;
      this.fileservvice.shareFile({documentId:this.filessharedwithme[this.clicked_share_index].id,recipientEmail:this.sharedEmail,permissionType:this.permission}).subscribe((data)=>{
        this.sharedEmail="";
        this.loading=false;
        console.log("iam hereeeeeeeeeeee share with me")
      },(error)=>{
        this.sharedEmail="";
        console.log(error)
      })
    }
  }
 
}
openthedocument(index:number){
    this.loading=true;
    this.fileservvice.OpenFile(index).subscribe(data => {
      this.loading=false;
      this.fileservvice.documentID_open=this.filesOwnedByUser[index].id;
    
      // Prepare the navigation extras with the data
      this.fileservvice.fileData = data.content;
      console.log(this.fileservvice.fileData)
      // i want to console.log the file daata here from navifgation extras
      // Navigate to the target component with data
      this.route.navigate(['docs']);
    })
  }

//   console.log(index)
// this.fileservvice.OpenFile(index).subscribe((data)=>{
//   console.log(data)
//   this.route.navigate(["docs"])
// })}
handleownednyme(){
  this.loading=true;
  this.ownednyme=true;
  this.fileservvice.owned=true;
  this.button_text="Owned by me";
  this.loading=false;
}
handlesharedwithme(){
this.ownednyme=false;
this.fileservvice.owned=false;
this.button_text="Shared with me";
this.loading=true;
this.fileservvice.getsharedfiles().subscribe((data)=>{
  this.fileservvice.filesSharedWithUser=[]
  if(data){
    for(let i=0;i<data.length;i++){
    this.fileservvice.filesSharedWithUser.push({src:"https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png",name:data[i].name,user:true,ownerId:data[i].ownerId,content:"",id:data[i].id})
  }
  this.loading=false;
  this.filessharedwithme=this.fileservvice.filesSharedWithUser;
}
})}
removeclicked(event:boolean){
  console.log("remove clicked"+event)
  // i want to make timer here to make the loading true for 2 seconds and return it to false
  this.loading=event;
  if(event){
    setTimeout(()=>{
      this.loading=false;
    },300)
  }


}
}

