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
  isPlaying = false;

  ngOnInit(): void {
  }

  playOrPauseSound(note: NoteProp): void {
    this.isPlaying 
  }

  public playSound(path: string){
    const audio = new Audio(path);
    audio.play();
  }

  public pauseSound(path: string){
    const audio = new Audio(path);
    audio.pause();
  }
}
