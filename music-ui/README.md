# Music

## ui

### Settings
* save / reset?

### Electron
* install

### other
* shortcuts for each modal layer, show shortcut in title (when electron)
* spin button & slider: db mode reset and min / max / default not working correctly
* select: onfocus -> open dropdown, mousewheel -> change selection
* bug: waveeditor length beats rounds incorrect value
* bug: waveeditor press enter does some weired stuff
* input number spin buttons

### wave editor

#### Features
* load (when electron)
* save as (when electron)

#### Bugs
* editor canvas draw wave
* editor canvas draw grid and units
* editor canvas zoom in/out => maintain center visible
* editor canvas select / zoom -> scroll to ensure end visible

### Mixer
* Track icons
* move drag & drop
* scrollbar nicer?
* effect

--- history

## Global

* insert-fx, send-fx

## wave editor (55)
* undo / redo (9) !
* cut, copy, paste, delete
* select all / clear selection
* save / saveAs / load / new (9) !
* pitch / speed transform (9)
* fade in/out, silence: linear / sweep in / sweep out (9)
* insert silence / append silence
* revert
* flip stereo
* normalize
* normalize channels
* apply fx
* convert sample rates (3)
* paste with converted format(3)
* volume line (9) ?
* play, stop, record
* toggle loop
* convert to mono
* convert to stereo
* footer: position, left, right, channels
* 2 marker (1 align in song, 2 align: declare to be x beats -> apply pitch according to 2 align points, wave is stretched according to two align points and mix bpm) (save 1st align point in clip file, clip alignment is always related to this align point)

...

## effects (44)
* vol pan (1)
* equalizer (3) 3 band variable, 10 band fixed
* distortion
* VDF (3)
* echo (3)
* hall (9)
* stereo (3)
* flanger (9)
* phaser (3)
* overdrive (3)
* chorus (3)
* vibrato (2)
* waveshaper (2) (phase modulated) ??
...

## file (9)
* new (1)
* load (3)
* save (3)
* save as (1)
* export as wav (3)

## Settings (3)
* Recording / playback, device / samplerate / latency
* Persist (3)

## mix
* Volume and pitch? (1)
* Track filter (3)
* Extended Song infos? (1)
* Zoom x/y, Navigator (9)
* Timebar named section?
...

### track
* icon, index, name
* solo, mute, record
* curves (vol, pan, fx send, fx insert, eq, midi)
* context menu: color
* show content (wav / midi)

* Clip context menu (cut, copy, paste, reference, delete, color, edit content, edit clip)

* Audio clip: Align point

* Track types: master, audio, group, fx, midi, tempo, video
...

## mixer
* name
* route (master / group1-8)
* solo mute
* vol pan
* fx send (select, on/off, amount, pre/post)
* fx insert (on/off, fx-name, edit)
* eq (lo, mid, hi)
* record modus

## midi editor

## fx send

## fx insert

## synthesizer

## Additional
* vocoder



# TODO
* ui
    * tracks
    * help
    * time&tune
    * wave editor
    * midi editor
* What is solo plus?
* mixImpl -> engine

# Main
* undo / redo
* file new
* file open
* file save
* file export
* settings
* help
* time&tune
* wave-editor
* midi-editor

# Tracks
* takt
* bpm
* volpan
* pitch
* unit (bars / seconds / kilo samples)
* select mode
* cut mode
* zoom mode
* glue mode
* size mode
* loop
* play / stop / pause / record / skip
* clips (explorer)
* filter track type
* mini view
* scroll / zoom
* snap to grid mode

# Track
* solo, mute, activity flag, name
* toggle param lines

# Midi editor

# FX
* slot
* fx
    * hall
    * delay
    * phaser
    * flanger
    * equalizer
    * overdrive
    * distortion
    * vdf
    * compressor

# Options
* max undo/redo history size

# Todo
* Main nav bar: use icons
* command history: trace saved state
* save mix
* load mix
* export mix
* remove track
* mixer, track: icons per track
* mixer, track: drag/drop changes ordering
* keyboard shortcuts

## Mixer
* save visibility options from mixerService
* drag & drop