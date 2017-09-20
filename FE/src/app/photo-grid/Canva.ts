import {Photo} from "./Photo";

import _ from "lodash";

export class Canvas {
    public baseColumnWidth: number = 300;
    public minImgGap: number = 20;

    public readonly photos: Array<Photo> = [];

    private _baseColumnCount: number = 0;
    private _columnGap: number = 0;
    private _lastRowHeights: Array<number> = [];

    constructor(public width: number, public height: number = 0) {
        this.refresh();
    }

    public addPhoto(photo: Photo): void {
        this.photos.push(photo);

        this.insertPhoto(photo);
    }

    private refresh() {
        this._baseColumnCount = this.getColumnCount();
        this._columnGap = this.getColumnGap();

        for(var i = 0; i < this._baseColumnCount; i++) {
            this._lastRowHeights.push(0);
        }
    }

    private getColumnCount(): number {
        return Math.floor(this.width / this.baseColumnWidth);
    }

    private getColumnGap(): number {
        return (this.width - this._baseColumnCount*this.baseColumnWidth)/(this._baseColumnCount-1);
    }

    private insertPhoto(photo: Photo): Photo {
        var minIndex = this.getMinHeightColumnIndex();
        var prevColumnCount = minIndex+1-1;

        photo.x = (prevColumnCount)*this.baseColumnWidth + prevColumnCount*this._columnGap;
        photo.y = this._lastRowHeights[minIndex] + this._columnGap;

        this._lastRowHeights[minIndex] = photo.y + photo.height;

        var maxIndex = this.getMaxHeightColumnIndex();
        var maxHeight = this._lastRowHeights[maxIndex] + 100;
        if (maxHeight > this.height) this.height = maxHeight;

        return photo;
    }

    private getMinHeightColumnIndex(): number {
        var maxHeight = Math.min.apply(Math, this._lastRowHeights);

        return this._lastRowHeights.indexOf(maxHeight);
    }

    private getMaxHeightColumnIndex(): number {
        var maxHeight = Math.max.apply(Math, this._lastRowHeights);

        return this._lastRowHeights.indexOf(maxHeight);
    }
}

class CanvasField {
    public width: number = 0;
    public height: number = 0;
    public x: number = 0;
    public y: number = 0;
}
