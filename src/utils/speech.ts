import { Language } from '../types';

export interface SpeechRecognitionResultCallback {
  (transcript: string, isFinal: boolean): void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: SpeechRecognitionResultCallback | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  // Check if browser supports Text To Speech
  public isTTSSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // Check if browser supports Speech Recognition
  public isSTTSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  // Map app language to standard BCP 47 language code
  public getLangCode(lang: Language): string {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'mr':
        return 'mr-IN';
      case 'ur':
        return 'ur-PK'; // or ur-IN
      case 'en':
      default:
        return 'en-IN';
    }
  }

  // Speak text in selected language
  public speak(text: string, lang: Language, rate: number = 0.9, onEnd?: () => void) {
    if (!this.synth) return;
    try {
      // Cancel previous utterances
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLangCode(lang);
      utterance.rate = rate;
      utterance.pitch = 1.0;

      // Try to find matching voice for selected language if available
      const voices = this.synth.getVoices();
      const langPrefix = lang === 'ur' ? 'ur' : lang === 'hi' ? 'hi' : lang === 'mr' ? 'mr' : 'en';
      const matchedVoice = voices.find(v => v.lang.startsWith(langPrefix));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Format table recitation sentence according to language
  public formatTableRecitation(table: number, multiplier: number, product: number, lang: Language): string {
    switch (lang) {
      case 'hi':
        return `${table} गुणा ${multiplier} बराबर ${product}`;
      case 'mr':
        return `${table} गुणिले ${multiplier} बरोबर ${product}`;
      case 'ur':
        return `${table} ضرب ${multiplier} برابر ${product}`;
      case 'en':
      default:
        return `${table} times ${multiplier} equals ${product}`;
    }
  }

  // Speak individual beat during rhythmic counting (Beat 1: Table, Beat 2: Multiplier, Beat 3: Product)
  public speakBeat(beat: 1 | 2 | 3, table: number, multiplier: number, product: number, lang: Language, rate: number = 1.0) {
    let word = '';
    if (beat === 1) {
      word = String(table);
    } else if (beat === 2) {
      word = String(multiplier);
    } else {
      word = String(product);
    }
    this.speak(word, lang, rate);
  }

  // Start listening to microphone for voice recitation
  public startListening(
    lang: Language,
    onResult: SpeechRecognitionResultCallback,
    onError?: (error: string) => void
  ) {
    if (!this.isSTTSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      this.stopListening();

      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.getLangCode(lang);

      this.onResultCallback = onResult;
      this.onErrorCallback = onError || null;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = (finalTranscript || interimTranscript).toLowerCase().trim();
        if (this.onResultCallback && text) {
          this.onResultCallback(text, !!finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };

      this.recognition.onend = () => {
        // Automatically restart if user hasn't explicitly stopped it
        if (this.isListening) {
          try {
            this.recognition?.start();
          } catch {
            // ignore
          }
        }
      };

      this.isListening = true;
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      if (onError) onError(err.message || 'Could not start microphone');
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
