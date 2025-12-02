export class QuerySaveEvent {

    private _isAborted = false;

    get isAborted(): boolean {
        return this._isAborted;
    }

    abort() {
        this._isAborted = true;
    }
}