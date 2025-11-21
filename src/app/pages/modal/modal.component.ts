import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone : false
})
export class ModalComponent implements OnInit {
  photo: any;
  type!: string;
  constructor(
    private modalCtrl: ModalController    
  ) {}

  ngOnInit() {           
    if (this.type === 'blob') {
      const imageUrl = URL.createObjectURL(this.photo);
      const imageElement: any = document.getElementById('myImage');
      if (imageElement) {
        imageElement.src = imageUrl;
      }
    }
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }  
}