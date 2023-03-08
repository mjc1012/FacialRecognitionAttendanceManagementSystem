import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as faceapi from 'face-api.js';
import { AttendanceLog } from 'src/app/models/attendancelog';
import { FaceToRecognize } from 'src/app/models/facetorecognize';
import { Person } from 'src/app/models/person';
import { AttendanceLogService } from 'src/app/services/attendance-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { FaceRecognitionStatusService } from 'src/app/services/face-recognition-status.service';
import { FaceRecognitionService } from 'src/app/services/face-recognition.service';
import { FaceToRecognizeService } from 'src/app/services/face-to-recognize.service';

@Component({
  selector: 'app-face-recognition-page',
  templateUrl: './face-recognition-page.component.html',
  styleUrls: ['./face-recognition-page.component.css']
})
export class FaceRecognitionPageComponent implements OnInit {

  constructor(private faceToRecognizeService: FaceToRecognizeService, private faceRecognitionService: FaceRecognitionService, private faceRecognitionStatusService: FaceRecognitionStatusService,
    private attendanceLogService: AttendanceLogService, private authService: AuthService) { }

  video: any;
  canvas: any;
  ctx: any;

  faceCanvas: any;
  faceCtx: any;
  roi: any;
  cameraMessage: string = "";
    cameraWarning: string = "";
    countDownMessage: string = "";
  predictedPerson: Person ={};
  faceToRecognize: FaceToRecognize = {
    loggedTime: ""
  };
  snapshotFaceBase64String: string = ""
  snapshotFaceDataUrl: string = "";
  previousText: string = ''
  isPaused: boolean = false;
  faceDetected: boolean = false;
  isQuestionFormDisplayed: boolean = false;
  isLoginFormDisplayed: boolean = false;
  wrongPredictionNum: number = 0;
  wrongPredictionIsRecent = false;
  employeeIdNumber: any;
  password: any;
  utterance = new SpeechSynthesisUtterance()

 async ngOnInit() {
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.faceCanvas = document.getElementById("faceCanvas");

    this.faceCtx = this.faceCanvas.getContext("2d");

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

  wrongPrediction(){
    this.snapshotFaceBase64String = ""
    this.savePrediction(false)
    this.wrongPredictionIsRecent = true
    this.wrongPredictionNum += 1;
    if(this.wrongPredictionNum < 2){
      this.cameraWarning = "Please try again"
      this.playText("Please try again")
      this.isPaused = false;
      this.isQuestionFormDisplayed = false;
    }
    else{
      this.isPaused = true;
      this.isQuestionFormDisplayed = false;
      this.isLoginFormDisplayed = true;
    }
    this.predictedPerson = {}
  }

  onAttendance(attendanceForm: NgForm){
    this.authService.authenticateForAttendance(attendanceForm.value).subscribe({
      next:(data) =>{
        if(data.status){
          const attendancelog = {
            timeLog: this.formatDate(new Date()),
            employeeIdNumber: data.value.employeeIdNumber,
          }
          console.log(attendancelog)
          this.onAddLog(attendancelog)
        }
        console.log(data.message)
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }


  savePrediction(isRecognized: boolean){
    const faceRecognitionStatus = {
      isRecognized: isRecognized,
      faceToRecognizeId: this.faceToRecognize.id!,
      predictedPersonId: this.predictedPerson.id!
    }

    this.faceRecognitionStatusService.add(faceRecognitionStatus).subscribe({
      next:(data) =>{
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

  saveFace(faceToRecognize: FaceToRecognize){
    this.faceToRecognizeService.add(faceToRecognize).subscribe({
      next:(data) =>{
        if(data.status){
          this.faceToRecognize = data.value
          this.predictPerson();
        }else{
          this.faceToRecognize = {
            loggedTime: ""
          }
        }
        console.log(data.message)
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }

  predictPerson(){
    this.faceRecognitionService.recognizeFace(this.faceToRecognize).subscribe({
      next:(data) =>{
        if(data.status){
          this.predictedPerson = data.value
        }else{
          this.predictedPerson = {
            firstName: "",
            lastName: "",
            validIdNumber: ""
          }
        }
        console.log(data.message)
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }
  async countDown () {
    let seconds = 3
    let counter = seconds
    setInterval(() =>{
      if(this.faceDetected && !speechSynthesis.speaking  && !this.isPaused && !this.wrongPredictionIsRecent){
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
      else if(this.isQuestionFormDisplayed && !speechSynthesis.speaking &&  this.isPaused){
        if(typeof this.predictedPerson.lastName !== 'undefined'){
          this.playText("Are you " + this.predictedPerson.firstName + " " + this.predictedPerson.lastName + "?")
          if(this.previousText == "Are you " + this.predictedPerson.firstName + " " + this.predictedPerson.lastName + "?" && !speechSynthesis.speaking){
            this.countDownMessage = "Form will be gone in  "+counter+" seconds";
            counter--;
            if (counter < 0) {
              counter = seconds;
              this.countDownMessage = "";
              this.savePrediction(true)

              const attendancelog = {
                timeLog: this.formatDate(new Date()),
                base64String: this.snapshotFaceBase64String,
                employeeIdNumber: this.predictedPerson.validIdNumber!,
              }
              this.onAddLog(attendancelog)
            }
          }
        }
      }
      else{
        this.countDownMessage = ''
          counter = seconds;
          this.wrongPredictionIsRecent = false
      }
    }, 1000);
  }

  public onAddLog(attendancelog: AttendanceLog): void {
    this.attendanceLogService.add(attendancelog).subscribe({
      next:(data) =>{
        if(data.status){
          console.log(data.value)
          this.playText("Good morning" + data.value.employeeName)
        }
        else{
        this.playText(data.message)
        }
        this.wrongPredictionNum = 0;
        this.isPaused = false;
        this.isQuestionFormDisplayed = false;
        this.isLoginFormDisplayed = false;
      },
      error:(e)=>{
        console.log(e);
      }
    });
    this.snapshotFaceBase64String = ""
    this.predictedPerson = {}
  }

  onCancelForm(){
    this.wrongPredictionNum = 0;
        this.isPaused = false;
        this.isQuestionFormDisplayed = false;
        this.isLoginFormDisplayed = false;
        this.snapshotFaceBase64String = ""
        this.predictedPerson = {}
  }

  async extractFaceFromBox (inputImage: any, box: any) {
    const regionsToExtract = [
        new faceapi.Rect( box.x, box.y , box.width , box.height)
    ]

    let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract)

    if(faceImages.length == 0){
      this.cameraWarning = 'Face not found'
      this.playText('Face not found')
    }
    else
    {
        faceImages.forEach(cnv =>{
          this.snapshotFaceDataUrl = cnv.toDataURL();
        })

      this.faceCtx.drawImage(inputImage, 0, 0, this.faceCanvas.width, this.faceCanvas.width)

      this.snapshotFaceBase64String = this.faceCanvas.toDataURL().replace('data:', '').replace(/^.+,/, '')
      console.log(this.snapshotFaceDataUrl)
      const faceToRecognize = {
        base64String:  this.snapshotFaceBase64String,
        loggedTime: this.formatDate(new Date())
      }

    this.saveFace(faceToRecognize)
    }
  }

padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
formatDate(date: Date) {
  return (
    [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      this.padTo2Digits(date.getHours()),
      this.padTo2Digits(date.getMinutes()),
      this.padTo2Digits(date.getSeconds()),
    ].join(':')
  );
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
