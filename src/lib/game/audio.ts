let context:AudioContext|null=null;let master:GainNode|null=null;let ambience:OscillatorNode|null=null;
export function startAmbience(volume=.2){if(!context){context=new AudioContext();master=context.createGain();master.connect(context.destination);ambience=context.createOscillator();ambience.type='sine';ambience.frequency.value=174;const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=260;ambience.connect(filter);filter.connect(master);ambience.start();}master!.gain.setTargetAtTime(volume,context.currentTime,.08);void context.resume();}
export function setVolume(volume:number){if(context&&master)master.gain.setTargetAtTime(volume,context.currentTime,.08);localStorage.setItem('nusantara-volume',String(volume));}
export function stopAmbience(){if(context&&master)master.gain.setTargetAtTime(0,context.currentTime,.08);}
export function savedVolume(){return Number(localStorage.getItem('nusantara-volume')??.2);}
