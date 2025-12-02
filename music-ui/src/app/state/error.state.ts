export interface ErrorState {
    readonly id: number;
    readonly message: string;
}

export interface ErrorsState {
    readonly errors: readonly ErrorState[];
}