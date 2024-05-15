import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  filesOwnedByUser: {src:string,name:string,user:boolean,ownerId:Number,content:string,id:number}[]=[];
  filesSharedWithUser: {src:string,name:string,user:boolean,ownerId:Number,content:string,id:number}[]=[];
  apiUrl = environment.apiUrl;
  fileData:string="";
  list:{id:number,name:string,content:string,owner_id:number}[]=[];
  owned:boolean=true;
  loading:boolean=false;
  documentID_open!:number;
  constructor(private http:HttpClient) {
   
   }
  getFilesOwnedByUser(){
    // i want to just send get request to get all the files
    return this.http.get<any>(`${this.apiUrl}/documents/owned`,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
}
  createFile(data:any){
    this.loading=true;
    let response=this.http.post<any>(`${this.apiUrl}/documents/`,data,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
    return response;
  }
  renameFile(data:any,id:number){
    return this.http.put<any>(`${this.apiUrl}/documents/${id}`,data,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
  }
  deleteFile(id:number){

    return this.http.delete<any>(`${this.apiUrl}/documents/${id}`,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
  }
  shareFile(data:any){
    return this.http.post<any>(`${this.apiUrl}/documents/share-document`,data,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
  }
  OpenFile(index:number){
    if(this.owned){
      return this.http.get<any>(`${this.apiUrl}/documents/${this.filesOwnedByUser[index].id}`,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
    }
    else{
      return this.http.get<any>(`${this.apiUrl}/documents/${this.filesSharedWithUser[index].id}`,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
    }
    
  }
  getsharedfiles(){
    return this.http.get<any>(`${this.apiUrl}/documents/shared`,{headers:{Authorization:`bearer ${localStorage.getItem("token")}`}});
  }

}
