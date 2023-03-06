import { Component } from '@angular/core';
import { FaceRecognitionService } from 'src/app/services/face-recognition.service';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css']
})
export class TrainModelComponent {
  constructor(private faceRecognitionService: FaceRecognitionService){}

  OnTrainModel(){
    this.faceRecognitionService.trainModel().subscribe({
      next:(data) =>{
        if(data.status){
        }
        console.log(data.message)
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

}
