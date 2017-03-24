/// <reference path="../../typings/globals/jquery/index.d.ts" />
import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';

import {ImgNames} from './ImgNames';

declare var $:JQueryStatic;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  private _maxPhotoCount = 115;
  //private _imageGallery: any;
  private _imageGalleryStore: JQuery;
  private _imageGalleryWrapper: any;
  private _imageLastInedex: number = 1;

  ngAfterViewInit():void {
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = "js/main.js";
    $("body").append(script);

    //var $imageGallery = $("#photo-gallery");
    //this._imageGallery = $imageGallery.clone();
    this._imageGalleryStore = $("#photo-gallery__store");
    this._imageGalleryWrapper = $("#photo-gallery__wrapper");

    this.addImgToGallery(15);
  }

  portfolio_showMoreWorks_BtnClicked(): boolean {
    if (this._imageLastInedex == this._maxPhotoCount) window.open('https://www.flickr.com/photos/147560593@N07/', '_blank');

    this.addImgToGallery(5);

    return false;
  }

  addImgToGallery(imgCount: number): void {
    var isLastImg:boolean = false;

    if (this._imageLastInedex == this._maxPhotoCount) return;

    this.changeImageWrapperState('loading');

    setTimeout(() => {
      for (var index = 1; index  <= imgCount; index++) {

        if (this._imageLastInedex == this._maxPhotoCount)
        {
          isLastImg = true;
          break;
        }

        this._imageLastInedex += 1;

        this._imageGalleryStore = this._imageGalleryStore.append(`<img alt="" src="img/portfolio/` + ImgNames[this._imageLastInedex] + `"
           data-image="img/portfolio/big/` + ImgNames[this._imageLastInedex] + `"
           data-description="Image 1 Description"/>`);
      }

      var $gallery = $("#photo-gallery").replaceWith($('<div id="photo-gallery"></div>').append(this._imageGalleryStore.clone().html()));

      this.initeUnitgallery($gallery);

      this.changeImageWrapperState('loaded');

      if (isLastImg) $("#gallery-more-btn-wrapper a").html("Еще фотографии на <b>flickr.com</b>");
    }, 1000);
  }

  changeImageWrapperState(state: string) {
    if (state == "loading") {
      this._imageGalleryWrapper.addClass('gallery-loading');
      this._imageGalleryWrapper.height(this._imageGalleryWrapper.find('#photo-gallery').height());
    }
    else if (state == "loaded") {
      var timerId = null;
      timerId = setInterval(() => {
        if (this._imageGalleryWrapper.find('#photo-gallery').height() - this._imageGalleryWrapper.height() > 70 )
        {
          this._imageGalleryWrapper.height(this._imageGalleryWrapper.find('#photo-gallery').height());
          clearInterval(timerId);

          this._imageGalleryWrapper.removeClass('gallery-loading');
        }
      }, 500);
    }
  }

  initeUnitgallery($gallery: any): any {
    return (<any>$gallery).unitegallery({
      tiles_space_between_cols: 10,

      tile_enable_border: true,
      tile_border_width:6,
      tile_border_color: "#f7ba4d"
    });
  }

}
