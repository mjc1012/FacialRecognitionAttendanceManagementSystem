export interface FaceRecognitionStatus{
  id?: number,
  isRecognized: boolean,
  faceToRecognizeId: number,
  predictedPersonId: number
}
