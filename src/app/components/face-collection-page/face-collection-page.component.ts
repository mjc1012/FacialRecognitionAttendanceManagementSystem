import { Component, OnInit } from '@angular/core';
import * as faceapi from 'face-api.js';
import { FaceExpression } from 'src/app/models/faceexpression';
import { FaceExpressionService } from 'src/app/services/face-expression.service';
import { FaceToTrainService } from 'src/app/services/face-to-train.service';
import { FaceToTrain } from 'src/app/models/facetotrain';
import { environment } from 'src/environments/environment';
import { Person } from 'src/app/models/person';
import { UserStoreService } from 'src/app/services/user-store.service';
import { AuthService } from 'src/app/services/auth.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-face-collection-page',
  templateUrl: './face-collection-page.component.html',
  styleUrls: ['./face-collection-page.component.css']
})
export class FaceCollectionPageComponent implements OnInit {

    constructor(private faceExpressionService: FaceExpressionService, private faceToTrainService: FaceToTrainService, private authService: AuthService, private userStoreService: UserStoreService, private personService: PersonService) { }

    video: any;
    canvas: any;
    ctx: any;
    roi: any;
    expressionMessage: string = "";
    cameraMessage: string = "";
    cameraWarning: string = "";
    countDownMessage: string = "";
    dataUrl: any;
    faceExpressionImageFile: string = ""
    numOfSavedFaces: number = 0
    previousText: string = ''
    isPaused: boolean = false;
    faceDetected: boolean = false;
    isQuestionFormDisplayed: boolean = false;
    isExpressionDisplayed: boolean = false;
    missingExpressionsId!: number[];
    savedFacesOfPersonNum!: number;
    currentExpression!: FaceExpression;
    faceToTrain!: FaceToTrain;
    facesToTrain: FaceToTrain[] = [];
    utterance = new SpeechSynthesisUtterance()
    faceExpressions!: FaceExpression[]
    faceExpressionImageBaseUrl: string =environment.FaceRecongtionAPIBaseUrl+'FaceExpression/';
    faceToTrainImageBaseUrl: string =environment.FaceRecongtionAPIBaseUrl+'FaceDataset/';
    currentPerson: Person = {};
    deleteFace!: FaceToTrain;
    public idNumber: string = ""

    async ngOnInit() {

      this.userStoreService.getIdNumberFromStore().subscribe(val=>{
        const idNumberFromToken = this.authService.getIdNumberFromToken()
        this.idNumber = val || idNumberFromToken;
      })

      this.personService.getPerson(this.idNumber).subscribe({
        next:(data) =>{
          if(data.status){
            this.currentPerson = data.value

            this.getMissingExpression();
          }else{
            this.currentPerson = {}
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      })

      this.video = document.getElementById("video");
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");

      this.getFaceExpressions();


      const main = async () => {
        if(!this.isPaused) {
          const prediction = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })).withFaceLandmarks()
          this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
          if(prediction.length > 1){
              this.cameraWarning = "Please only 1 person face the camera"
              this.playText("Please only 1 person face the camera")
              this.cameraMessage = ''
              this.drawBoxForDetectedFaces(prediction)
          }
          else if(prediction.length == 1){

            this.cameraWarning = ''
              this.drawBoxForDetectedFaces(prediction)
              this.drawBoxForFacePlacement(prediction)
          }
          else{
            this.cameraMessage = ''
            this.cameraWarning = ''
              this.faceDetected = false;
          }
        }
      }

      this.countDown();
      this.setupCamera();
      await Promise.all([
        await faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
        await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models')
      ]).then(
        this.video.addEventListener("loadeddata", async () => {
          setInterval(main, 100);
        })
      )

    }

    getMissingExpression(){
      this.faceToTrainService.getMissingExpression(this.currentPerson).subscribe({
        next:(data) =>{
          if(data.status){
            this.isExpressionDisplayed = true
            this.currentExpression = data.value
            this.faceExpressionImageFile = this.currentExpression.imageFile;
            console.log(this.currentExpression.name)
            this.expressionMessage = "Please follow this expression: " + this.currentExpression.name;
          }else{
            this.isExpressionDisplayed = false
            this.expressionMessage = "Face Collection Complete"
          }

          this.getFacesToTrain();
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      })
    }

    getFacesToTrain(){
      this.faceToTrainService.getFacesByPersonId(this.currentPerson).subscribe({
        next:(data) =>{
          if(data.status){
            this.facesToTrain = data.value
            this.numOfSavedFaces = data.value.length
          }else{
            this.facesToTrain = []
            this.numOfSavedFaces = 0
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      })
    }


    getFaceExpressions(){
      this.faceExpressionService.getAll().subscribe({
        next:(data) =>{
          if(data.status){
            this.faceExpressions = data.value
          }else{
            this.faceExpressions = []
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    getFaceToDelete(face: FaceToTrain){
      this.deleteFace = face
    }

    onDeleteFace(id: number){
      this.faceToTrainService.delete(id).subscribe({
        next:(data) =>{
          if(data.status){
            this.getFacesToTrain();
            this.getMissingExpression();
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      })
    }

    playText(text: any) {
      if (speechSynthesis.paused && speechSynthesis.speaking) {
          return speechSynthesis.resume()
      }
      if (speechSynthesis.speaking) return
      if (text == this.previousText) return
      this.previousText = text
      this.utterance.text = text
      this.utterance.rate = 1
      speechSynthesis.speak(this.utterance)
    }

    setupCamera(){
      navigator.mediaDevices.getUserMedia({
          video: {width: this.canvas.width, height: this.canvas.height},
          audio: false,
      })
      .then((stream) => {
        this.video.srcObject = stream;
      })
    }

    saveFace(){
      this.faceToTrainService.add(this.faceToTrain).subscribe({
        next:(data) =>{
          if(data.status){
            this.getFacesToTrain();
            this.getMissingExpression();
          }
          this.isQuestionFormDisplayed = false
          this.isPaused = false
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      })
    }

    startVideoAgain(){
        this.isQuestionFormDisplayed = false
        this.isPaused = false
    }


    async countDown () {
      let seconds = 3
      let counter = seconds
      setInterval(() =>{
        if(this.faceDetected  &&   !this.isPaused){
          this.playText("Please stay still")
          if(this.previousText == "Please stay still" && !speechSynthesis.speaking){
            this.countDownMessage = "Please stay still for "+counter+" seconds";
            counter--;
            if (counter < 0) {
              counter = seconds;
              this.countDownMessage = "";
                this.extractFaceFromBox(this.video, this.roi)
                this.isPaused = true;
                this.isQuestionFormDisplayed = true;
            }
          }
        }
        else{
            this.countDownMessage = ''
            counter = seconds;
        }
      }, 1000);
    }

    async extractFaceFromBox (inputImage: any, box: any) {
      const regionsToExtract = [
          new faceapi.Rect( box.x, box.y , box.width , box.height)
      ]

      let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract)

      if(faceImages.length == 0){
          console.log('Face not found')
      }
      else
      {
          faceImages.forEach(cnv =>{
            this.dataUrl = cnv.toDataURL();
            this.faceToTrain = {
              base64String:  cnv.toDataURL().replace('data:', '').replace(/^.+,/, ''),
              faceExpressionId: this.currentExpression.id!,
              personId: this.currentPerson.id!
            }


          })
      }
    }

    drawBox(lineWidth:  any, color:  any, x:  any, y:  any, width:  any, height:  any){
      this.ctx.beginPath();
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = color;
      this.ctx.rect(x, y, width, height);
      this.ctx.stroke();
    }

    drawBoxForDetectedFaces(prediction: any){
      prediction.forEach((pred: any) => {
        this.drawBox("4", "blue", pred.detection.box.x, pred.detection.box.y, pred.detection.box.width, pred.detection.box.height)
      })
    }

    drawBoxForFacePlacement (prediction: any){
      prediction.forEach((pred: any) => {
        const spaceBetweenBoxAndVideo = 150;

        if(pred.detection.box.x > spaceBetweenBoxAndVideo && pred.detection.box.y > spaceBetweenBoxAndVideo && pred.detection.box.width + pred.detection.box.x < this.canvas.width - spaceBetweenBoxAndVideo &&
          pred.detection.box.height + pred.detection.box.y < this.canvas.height - spaceBetweenBoxAndVideo){
            if(pred.landmarks.positions[44].x - pred.landmarks.positions[37].x < 120){
              this.cameraMessage = 'Please move closer to the camera'
              this.playText('Please move closer to the camera')
              this.drawBox("4", "orange", spaceBetweenBoxAndVideo, spaceBetweenBoxAndVideo, this.canvas.width - (spaceBetweenBoxAndVideo * 2), this.canvas.height - (spaceBetweenBoxAndVideo * 2));
              this.faceDetected = false;
            }
            else{
                this.roi = pred.detection.box;
                this.cameraMessage = ''
                this.drawBox("4", "green", spaceBetweenBoxAndVideo, spaceBetweenBoxAndVideo, this.canvas.width - (spaceBetweenBoxAndVideo * 2), this.canvas.height - (spaceBetweenBoxAndVideo * 2));
                this.faceDetected = true;
            }
        }
        else{
          this.cameraMessage = 'Please put your face inside the box'
            this.playText('Please put your face inside the box')
            this.drawBox("4", "red", spaceBetweenBoxAndVideo, spaceBetweenBoxAndVideo, this.canvas.width - (spaceBetweenBoxAndVideo * 2), this.canvas.height - (spaceBetweenBoxAndVideo * 2));
            this.faceDetected = false;
        }
      })
    }


}
