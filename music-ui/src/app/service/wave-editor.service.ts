import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { waveEditorActions } from '../action/wave-editor.action';

@Injectable({
  providedIn: 'root',
})
export class WaveEditorService {

  private readonly store = inject(Store);

  appendSilence() {

  }

  applyEffect() {
    // TODO call backend
    this.store.dispatch(waveEditorActions.setFxEnabled({ enabled: false }));
    this.store.dispatch(waveEditorActions.setModified({ isModified: true, canUndo: true, canRedo: false }));
  }

  applyPitch() {
    // TODO call backend
    this.store.dispatch(waveEditorActions.setPitch({ pitch: 0, speed: 0 }));
    this.store.dispatch(waveEditorActions.setModified({ isModified: true, canUndo: true, canRedo: false }));
  }

  closeSelected() {
    // TODO call backend to free resources
    // TODO stop in backend!
    this.store.dispatch(waveEditorActions.closeSelected());
  }

  convert(data: { samplerate: number, stereo: boolean }) {
    // TODO call backend and replace real filename
    this.store.dispatch(waveEditorActions.convert({ samplerate: data.samplerate, stereo: data.stereo }));
    this.store.dispatch(waveEditorActions.setModified({ isModified: true, canUndo: true, canRedo: false }));
  }

  copy() {

  }

  cut() {

  }

  delete() {

  }

  fadeIn() {

  }

  fadeOut() {

  }

  flip() {

  }

  insertSilence() {

  }

  new(data: { name: string, samplerate: number, stereo: boolean, length: number }) {
    // TODO call backend and replace real filename
    this.store.dispatch(waveEditorActions.new({ filename: data.name, samplerate: data.samplerate, stereo: data.stereo, length: data.length }));
  }

  normalize() {

  }

  normalizeEach() {

  }

  play(fromSample: number) {
    // TODO call backend
    this.store.dispatch(waveEditorActions.play());
  }

  paste() {

  }

  record() {
    // TODO call backend
    this.store.dispatch(waveEditorActions.record());
  }

  redo() {
    // TODO call backend and update flags from backend
    this.store.dispatch(waveEditorActions.setModified({ isModified: true, canUndo: true, canRedo: false }));
  }

  revert() {

  }

  saveSelected() {
    // TODO call backend
    this.store.dispatch(waveEditorActions.saveSelected());
  }

  select(filename: string) {
    // TODO stop in backend!
    this.store.dispatch(waveEditorActions.selectFile({ filename }));
  }

  setFx(name: string) {
    // TODO call backend and init parameter defaults
    const parameters: Readonly<Record<string, string | boolean | number>> = {
      Volume: 1,
      Pan: 0,
    };
    this.store.dispatch(waveEditorActions.setFx({ fxName: name, parameters }));
  }

  setFxParams(fxName: string, parameters: Readonly<Record<string, string | boolean | number>>) {
    // TODO call backend
    this.store.dispatch(waveEditorActions.setFx({ fxName, parameters }));
  }

  setFxEnabled(enabled: boolean) {
    // TODO call backend
    this.store.dispatch(waveEditorActions.setFxEnabled({ enabled }));
  }

  setLoop(loop: ({ start: number, end: number }) | undefined) {
    // TODO call backend
    this.store.dispatch(waveEditorActions.setLoop({ enabled: loop != undefined }));
  }

  setPitch(pitch: number, speed: number) {
    // TODO call backend
    this.store.dispatch(waveEditorActions.setPitch({ pitch, speed }));
  }

  setSilence() {
  }

  stop() {
    // TODO call backend
    // TODO if recording -> modify sample
    this.store.dispatch(waveEditorActions.stop());
  }

  swap() {

  }

  trim() {

  }

  undo() {
    // TODO call backend and update flags from backend
    this.store.dispatch(waveEditorActions.setModified({ isModified: true, canUndo: false, canRedo: true }));
  }
}
