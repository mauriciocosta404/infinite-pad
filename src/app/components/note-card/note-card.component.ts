import { Component, Input, OnInit } from '@angular/core';

interface NoteProp{
  title: string,
  name: string,
  frequency: number,
  path: string,
}

@Component({
  selector: 'app-note-card',
  imports: [],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
  export class NoteCardComponent implements OnInit { 
  @Input() note!: NoteProp;
  audio!: HTMLAudioElement;
  isPlaying = false;

  static currentAudio: HTMLAudioElement | null = null;

  ngOnInit(): void {
  }

  onClickHandle({ path }: NoteProp): void {
    this.isPlaying = !this.isPlaying;

    if(this.isPlaying) return this.playSound(path);
    this.pauseSound(path);  
  }

  private playSound(path: string){
    if (NoteCardComponent.currentAudio) NoteCardComponent.currentAudio.pause();

    if (!this.audio) this.audio = new Audio(path);  
    this.audio.loop = true;

    NoteCardComponent.currentAudio = this.audio;

    this.audio.play();
  }

  private pauseSound(path: string){
    if (!this.audio) return;
    this.audio.pause();
    
    this.audio.currentTime = 0;
  }
}
