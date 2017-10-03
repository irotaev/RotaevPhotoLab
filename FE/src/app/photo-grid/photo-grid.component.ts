import {Component, ElementRef, OnInit} from '@angular/core';
import {ImgNames} from "../ImgNames";
import {imgNamesSvadba} from '../imgNamesSvadba';
import {Photo} from "./Photo";
import {Canvas} from "./Canva";

@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss']
})
export class PhotoGridComponent implements OnInit {

  public readonly imgNames: Array<string> = ImgNames;
  public readonly imgNamesSvadba: Array<string> = imgNamesSvadba;
  public canvas: Canvas;

  private _lastInsertedPhotoIndex = 0;

  constructor(private _elementRef: ElementRef) {
  }

  ngOnInit() {
    this.canvas = new Canvas(this._elementRef.nativeElement.querySelector('.wrapper').clientWidth);

    this.imgNames.slice(0, 10).forEach((name) => {
      var photo = new Photo(0, 0, name);
      this.loadImg(photo, (_photo: Photo) => {
        this.canvas.addPhoto(_photo);
      });
    });
    this._lastInsertedPhotoIndex = 9;

    // let lastImgIndex = 9;
    // setInterval(() => {
    //   lastImgIndex++;
    //   var photo = new Photo(0, 0, this.imgNames[lastImgIndex]);
    //   this.loadImg(photo, (_photo: Photo) => {
    //     this.canvas.addPhoto(_photo);
    //   });
    // }, 500);

    // let photoFactory = new PhotoFactory(this.canvas.photos, this._elementRef.nativeElement.querySelector('.wrapper').clientWidth);
    // this.canvas = photoFactory.RefreshPhotos();
  }

  private loadImg(photo: Photo, callback: (photo: Photo) => void) {
    let img = new Image();
    img.onload = () => {

      photo.width = 300;
      photo.height = img.height * 300/img.width

      callback(photo);
    };
    img.src = window.location.origin + "/img/portfolio/" + photo.src;
  }

  public moreBtnClick() {
    this.imgNames.slice(this._lastInsertedPhotoIndex, this._lastInsertedPhotoIndex + 5).forEach((name) => {
      var photo = new Photo(0, 0, name);
      this.loadImg(photo, (_photo: Photo) => {
        this.canvas.addPhoto(_photo);
      });
    });
    this._lastInsertedPhotoIndex += 5;

    return false;
  }
}
