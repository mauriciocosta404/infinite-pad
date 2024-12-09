import { Component } from '@angular/core';
import { NoteCardComponent } from "../../app/components/note-card/note-card.component";

@Component({
  selector: 'app-ambient-pad',
  imports: [NoteCardComponent],
  templateUrl: './ambient-pad.component.html',
  styleUrl: './ambient-pad.component.scss'
})
export class AmbientPadComponent {
  notes = [
    { title: 'C', name: 'dó', frequency: 261.63, path:'/assets/pad/fundations/C.mp3' },
    { title: 'C#', name: 'dó sustenido', frequency: 0, path:'/assets/pad/fundations/Db.mp3' },
    { title: 'D', name: 'ré' , frequency: 293.66, path:'/assets/pad/fundations/D.mp3' },
    { title: 'D#', name:'ré sustenido' , frequency: 0, path:'/assets/pad/fundations/Eb.mp3' },
    { title: 'E', name: 'mi', frequency: 329.63, path:'/assets/pad/fundations/E.mp3' },
    { title: 'F', name:'fa' , frequency: 349.23, path:'/assets/pad/fundations/F.mp3' },
    { title: 'F#', name:'fa sustenido' , frequency: 0, path:'/assets/pad/fundations/Gb.mp3' },
    { title: 'G', name:'sol' , frequency: 392.00, path:'/assets/pad/fundations/G.mp3' },
    { title: 'G#', name:'sol sustenido' , frequency: 0, path:'/assets/pad/fundations/Ab.mp3' },
    { title: 'A', name:'lá' , frequency: 440.00, path:'/assets/pad/fundations/A.mp3' },
    { title: 'A#', name:'lá sustenido' , frequency: 0, path:'/assets/pad/fundations/Bb.mp3' },
    { title: 'B', name:'sí' , frequency: 493.88, path:'/assets/pad/fundations/B.mp3' },
  ]
}
