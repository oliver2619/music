import { ErrorHandler, inject, Provider } from "@angular/core"
import { Store } from "@ngrx/store";
import { errorActions } from "../action/error.action";

class MusicErrorHandler implements ErrorHandler {

    private readonly store = inject(Store);

    handleError(error: any) {
        console.error(error);
        if (error instanceof Error) {
            this.dispatchError(error.message);
        } else {
            this.dispatchError(String(error));
        }
    }

    private dispatchError(message: string) {
        this.store.dispatch(errorActions.add({ message }));
    }
}

export function provideMusicErrorHandler(): Provider {
    return {
        provide: ErrorHandler,
        useClass: MusicErrorHandler,
    };
}