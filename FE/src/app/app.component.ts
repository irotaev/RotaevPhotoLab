import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import {ImgNames} from './ImgNames';
import {ImgGallery} from "./imgGallery";
import {imgNamesSvadba} from './imgNamesSvadba';

declare var $:JQueryStatic;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  private get SEND_CONTACT_URL(): string {return 'contact/send'; }

  private _maxPhotoCount = 116;
  //private _imageGallery: any;
  private _imageGalleryStore: JQuery;
  private _imageGalleryWrapper: any;
  private _imageLastInedex: number = 0;

  private _imgsLeftToLoad: number = 0;

  public imgNamesMain = ImgNames;
  public imgNamesSvadba = imgNamesSvadba;

  ngAfterViewInit():void {
    var script = <any>document.createElement( "script" );
    script.type = "text/javascript";
    script.src = "js/main.js";
    $("body").append(script);

    //var $imageGallery = $("#photo-gallery");
    //this._imageGallery = $imageGallery.clone();

    var imgGalleryMain = new  ImgGallery(ImgNames, $(".portfolio-area .photo-gallery__store"), $(".portfolio-area .photo-gallery__wrapper"));
    imgGalleryMain.addImgToGallery(15);

    var imgGalleryWedding = new  ImgGallery(ImgNames, $(".svadba-photo .photo-gallery__store"), $(".svadba-photo .photo-gallery__wrapper"));
    imgGalleryWedding.addImgToGallery(15);
  }

  // portfolio_showMoreWorks_BtnClicked(): boolean {
  //   if (this._imageLastInedex == this._maxPhotoCount) window.open('https://www.flickr.com/photos/147560593@N07/', '_blank');
  //
  //   this.addImgToGallery(5);
  //
  //   return false;
  // }

  addImgToGallery(imgCount: number): void {
    var isLastImg:boolean = false;

    if (this._imageLastInedex == this._maxPhotoCount) return;

    this.changeImageWrapperState('loading');

    setTimeout(() => {

      this._imgsLeftToLoad = imgCount;

      for (var index = 1; index  <= imgCount; index++) {
        this._imageLastInedex += 1;

        var $img = $(`<img alt="" src="img/portfolio/` + ImgNames[this._imageLastInedex] + `"
           data-image="img/portfolio/big/` + ImgNames[this._imageLastInedex] + `"
           data-description="Image 1 Description"/>`);

        $img.load(() => {
          this.imgLoad();
        });

        this._imageGalleryStore = this._imageGalleryStore.append($img);

        if (this._imageLastInedex == this._maxPhotoCount)
        {
          this._imgsLeftToLoad -= imgCount - index;
          isLastImg = true;
          break;
        }
      }

      var $gallery = $("#photo-gallery").replaceWith($('<div id="photo-gallery"></div>').append(this._imageGalleryStore.clone().html()));

      this.initeUnitgallery($gallery);

      if (isLastImg) $("#gallery-more-btn-wrapper a").html("Еще фотографии на <b>flickr.com</b>");
    }, 1000);
  }

  imgLoad(): void {
    this._imgsLeftToLoad--;

    if (this._imgsLeftToLoad == 0) this.changeImageWrapperState('loaded');
  }

  changeImageWrapperState(state: string) {
    if (state == "loading") {
      this._imageGalleryWrapper.addClass('gallery-loading');
      this._imageGalleryWrapper.height(this._imageGalleryWrapper.find('#photo-gallery').height());
    }
    else if (state == "loaded") {
      var timerId = null;

      timerId = setInterval(() => {
        this._imageGalleryWrapper.height(this._imageGalleryWrapper.find('#photo-gallery').height());

        if (this._imageGalleryWrapper.find('#photo-gallery').height() - this._imageGalleryWrapper.height() < 20 )
        {
          clearInterval(timerId);

          this._imageGalleryWrapper.removeClass('gallery-loading');
        }
      }, 1000);
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


  enrollToPhotoSet(event, photoSetId: string) {
    var message: string = null;

    if (photoSetId == 'tfp') {
      message = 'Хочу записаться на TFP съемку';
    }
    else if (photoSetId == 'photoset-gold') {
      message = 'Хочу записаться на Фотосет Gold съемку';
    }
    else if (photoSetId == 'photoset-normal') {
      message = 'Хочу записаться на Фотосет съемку';
    }

    $("#contact").find("textarea#form-message").html(message);
  }

  sendRequestToMe(event) {
    var target = event.target || event.srcElement || event.currentTarget;

    var name = $(target).find("input[name='name']").val();
    var contact = $(target).find("input[name='contact']").val();
    var email = $(target).find("input[name='email']").val();
    var phone = $(target).find("input[name='phone']").val();

    if (!name) { alert("Заполните, пожалуйста, свое Имя"); return; }
    if (!contact && !email && !phone) { alert("Заполните, пожалуйста, свой email или телефон"); return; }

    var message: string;
    if ($(target).find("textarea[name='message']").length) {
      message = $(target).find("textarea[name='message']").val();

      if (!message) { alert("Заполните, пожалуйста, сообщение. Вы можете просто указать \"Фотосессия\""); return; }
    }

    var data: any = {name: name};
    if (phone && email)
    {
      data.phone = phone;
      data.email = email;
    }
    else
      data.contact = contact;

    if (message) data.message = message;

    //#region Отправка формы на сервер
    $.ajax({
      url: this.SEND_CONTACT_URL,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      method: 'POST'
    })
      .done((data) => {
      console.log(data);
      })
      .fail((xhr) => {
        alert('Во время отправки сообщения произошла ошибка. Пожалуйста, отправьте сообщение еще раз или позвоните мне. Извиняюсь за неудобства');

        $('.form-blocker').css({'display': 'block'}).fadeOut("slow");
      });
    //#endregion


    $('.form-blocker').css({'display': 'block'}).fadeTo( "slow" , 1);
  }

}
