import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  ms: any = '0' + 0;
  sec: any = '0' + 0;
  min: any = '0' + 0;
  hr: any = '0' + 0;
  startTimer: any;
  running = true;
  loading: boolean = false;

  constructor() { }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  getLoading(): boolean {
    return this.loading;
  }

  start(): void{
      this.startTimer = setInterval(() => {
        if(this.loading){
          this.ms++;
          this.ms = this.ms < 10 ? '0' + this.ms : this.ms;

          if(this.ms === 100){
            this.sec++;
            this.sec = this.sec < 10 ? '0' + this.sec : this.sec;
            this.ms = '0' + 0;
          }

          if(this.sec === 60){
            this.min++;
            this.min = this.min < 10 ? '0' + this.min : this.min;
            this.sec = '0' + 0;
          }

          if(this.min === 60){
            this.hr++;
            this.hr = this.hr < 10 ? '0' + this.hr : this.hr;
            this.min = '0' + 0;
         }
        }
      }, 100)
  }
  stop(): void{
    clearInterval(this.startTimer);
    this.hr = this.min = this.sec = this.ms = '0' + 0;
  }
}
