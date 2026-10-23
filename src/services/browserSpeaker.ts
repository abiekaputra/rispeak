export interface BrowserSpeaker {
  readonly supported: boolean;
  speak(message: string, volumePercent: number): Promise<void>;
  cancel(): void;
}

type SpeechWindow = Window &
  typeof globalThis & {
    speechSynthesis?: SpeechSynthesis;
    SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
  };

function findIndonesianVoice(synthesis: SpeechSynthesis): SpeechSynthesisVoice | undefined {
  return synthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('id'));
}

export function createBrowserSpeaker(
  browser: SpeechWindow = window,
  timeoutMs = 15_000,
): BrowserSpeaker {
  const synthesis = browser.speechSynthesis;
  const Utterance = browser.SpeechSynthesisUtterance;
  const supported = Boolean(synthesis && Utterance);

  return {
    supported,
    cancel: () => synthesis?.cancel(),
    speak: (message, volumePercent) => {
      if (!synthesis || !Utterance) {
        return Promise.reject(new Error('Browser ini belum mendukung simulasi suara.'));
      }

      return new Promise<void>((resolve, reject) => {
        const utterance = new Utterance(message);
        let completed = false;
        const finish = (callback: () => void) => {
          if (completed) return;
          completed = true;
          browser.clearTimeout(timeout);
          callback();
        };
        const timeout = browser.setTimeout(() => {
          synthesis.cancel();
          finish(() =>
            reject(new Error('Browser tidak menyelesaikan pemutaran suara. Coba Chrome.')),
          );
        }, timeoutMs);

        utterance.lang = 'id-ID';
        utterance.rate = 0.94;
        utterance.pitch = 1;
        utterance.volume = Math.min(1, Math.max(0, volumePercent / 100));
        utterance.voice = findIndonesianVoice(synthesis) ?? null;
        utterance.onend = () => finish(resolve);
        utterance.onerror = () =>
          finish(() => reject(new Error('Suara gagal diputar. Coba lagi atau ganti browser.')));
        synthesis.speak(utterance);
      });
    },
  };
}
