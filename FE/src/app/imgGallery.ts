export class ImgGallery {

    private _maxPhotoCount = 116;
    private _imageLastInedex: number = 0;
    private _imgsLeftToLoad: number = 0;

    constructor (private _imgNames: string[], private _imageGalleryStore: JQuery, private _imageGalleryWrapper: JQuery) {
       this._imageGalleryWrapper.closest('.gallery-section').find('.more-btn-wrapper .more-btn').bind('click', () => {this.portfolio_showMoreWorks_BtnClicked(); return false;});
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

            this._imgsLeftToLoad = imgCount;

            for (var index = 1; index  <= imgCount; index++) {
                this._imageLastInedex += 1;

                var $img = $(`<img alt="" src="img/portfolio/` + this._imgNames[this._imageLastInedex] + `"
           data-image="img/portfolio/big/` + this._imgNames[this._imageLastInedex] + `"
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

            var $gallery = this._imageGalleryWrapper.find("#photo-gallery").replaceWith($('<div id="photo-gallery"></div>').append(this._imageGalleryStore.clone().html()));

            this.initeUnitgallery($gallery);

            if (isLastImg) this._imageGalleryWrapper.find(".more-btn-wrapper a").html("Еще фотографии на <b>flickr.com</b>");
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
}
