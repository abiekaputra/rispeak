import { describe, expect, it, vi } from 'vitest';
import { createBrowserSpeaker } from '../src/services/browserSpeaker';

class FakeUtterance {
  lang = '';
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(readonly text: string) {}
}

describe('createBrowserSpeaker', () => {
  it('resolves only after the browser finishes speaking', async () => {
    let activeUtterance: FakeUtterance | undefined;
    const cancel = vi.fn();
    const synthesis = {
      cancel,
      getVoices: () => [],
      speak: (utterance: FakeUtterance) => {
        activeUtterance = utterance;
      },
    };
    const browser = {
      clearTimeout,
      setTimeout,
      speechSynthesis: synthesis,
      SpeechSynthesisUtterance: FakeUtterance,
    } as unknown as Window & typeof globalThis;
    const speaker = createBrowserSpeaker(browser);

    let finished = false;
    const playback = speaker.speak('Pembayaran diterima.', 64).then(() => {
      finished = true;
    });

    expect(finished).toBe(false);
    expect(activeUtterance?.lang).toBe('id-ID');
    expect(activeUtterance?.volume).toBe(0.64);
    activeUtterance?.onend?.();
    await playback;
    expect(finished).toBe(true);
  });

  it('rejects playback when speech synthesis is unavailable', async () => {
    const browser = {} as Window & typeof globalThis;
    const speaker = createBrowserSpeaker(browser);

    await expect(speaker.speak('Pembayaran diterima.', 80)).rejects.toThrow('belum mendukung');
  });

  it('cancels speech that never reports completion', async () => {
    vi.useFakeTimers();
    const cancel = vi.fn();
    const browser = {
      clearTimeout,
      setTimeout,
      speechSynthesis: { cancel, getVoices: () => [], speak: () => undefined },
      SpeechSynthesisUtterance: FakeUtterance,
    } as unknown as Window & typeof globalThis;
    const speaker = createBrowserSpeaker(browser, 100);
    const playback = speaker.speak('Pembayaran diterima.', 80);
    const rejection = expect(playback).rejects.toThrow('tidak menyelesaikan');

    await vi.advanceTimersByTimeAsync(100);
    await rejection;
    expect(cancel).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
