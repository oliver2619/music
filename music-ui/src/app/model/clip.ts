export abstract class Clip {
    name = '';
    start = 0;
    length = 0;
}

export class AudioClip extends Clip {
    sample = '';
    sampleOffset = 0;
    alignOffset = 0;
}
