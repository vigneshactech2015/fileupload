import React,{useState,useRef} from "react";
//cancel
import axios,{CancelToken,isCancel} from "axios";
import {progressBar} from 'react-bootstrap';

const fileUpload=()=>{
  const[uploadPercentage,setUploadPercentage]=useState(0);
  //cancel
  const cancelFileUpload=useRef(null);
  const uploadFile=({target:{files}})=>{
    let data=new FormData();
    data.append("file",files[0]);

    const options={
      onUploadProgress:progressEvent=>{
        const{loaded,total}=progressEvent;

        let percent=Math.floor((loaded*100)/total);

        if(percent<100){
          setUploadPercentage(percent);
        }
      },
      //cancel
      cancelToken:new CancelToken(cancel=>cancelFileUpload.current=cancel)
    }

    axios.post('url',data,options).then(res=>{
      console.log(res) 
      setUploadPercentage(100)
    
      setTimeout(()=>{
        setUploadPercentage(0)
      },1000)

    }).catch(err=>{
      console.log(err)

//cancel
if(isCancel(err)){
  alert(err.message);
}
      setUploadPercentage(0)
    })
  }

  //cancel
  const cancelUpload=()=>{
   if(cancelFileUpload.current){
    cancelFileUpload.current("User has cancelled the file upload.")
   }
  }

  return(
    <div>
    <input type="file" onChange={uploadFile}/>
    <ProgressBar now={uploadPercentage} striped={true} label={`${uploadPercentage}`}/>
    <span onClick={()=>cancelUpload()}>Cancel</span>
    </div>
  )
}
