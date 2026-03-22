# Phonics Miner ⛏️

A Minecraft-themed phonics webapp designed to help 5-year-olds master vowel sounds, with a focus on **middle (medial) vowel discrimination** in CVC (consonant-vowel-consonant) words.

## Why This Exists

Identifying the middle vowel in words like **cat vs cut vs cot** is one of the hardest skills in early phonics. This app makes that practice feel like a game — not a lesson.

## Features

### Sound Explorer
Tap vowel ore blocks to hear each short vowel sound. Each vowel is a different Minecraft ore type (diamond, emerald, gold, redstone, lapis).

### Mine the Sound
Hear a CVC word spoken aloud. Tap the correct middle vowel block to "mine" it. Correct answers trigger a pickup sound and fill an XP bar.

### Build the Word
Three block slots show a CVC word with the vowel missing. A picture is displayed. The child taps the correct vowel block to complete the word.

### Sound Sort
CVC words appear as falling blocks. The child drags/taps them into the correct chest sorted by middle vowel sound.

## Tech Stack

- **React + TypeScript** (via Vite)
- **Tailwind CSS** — styled with a blocky Minecraft pixel aesthetic
- **ElevenLabs TTS** — pre-generated audio files for accurate phoneme pronunciation
- **Supabase** — progress persistence (optional, via Lovable integration)
- **Lovable** — deployment and hosting

## Word Bank

| Short A | Short E | Short I | Short O | Short U |
|---------|---------|---------|---------|---------|
| cat     | bed     | pig     | dog     | bug     |
| hat     | hen     | sit     | pot     | cup     |
| bat     | net     | dig     | log     | sun     |
| map     | jet     | hit     | box     | run     |
| pan     | red     | pin     | fox     | hut     |

## Audio Strategy

All audio is pre-generated using ElevenLabs and stored as static `.mp3` files in `/public/audio/`. This gives:

- **Zero latency** — instant playback, critical for 5-year-old attention spans
- **Consistent voice** — same friendly voice throughout
- **Accurate phonemes** — ElevenLabs handles isolated vowel sounds much better than browser TTS
- **Minimal API usage** — ~200 characters total, well within the 10,000 free credit limit

### Audio file structure

```
public/audio/
  phonemes/       # isolated sounds: a.mp3, e.mp3, i.mp3, o.mp3, u.mp3
  words/          # full CVC words: cat.mp3, bed.mp3, pig.mp3, ...
  feedback/       # pickup.mp3, oof.mp3, levelup.mp3
```

## Design Principles

- **No reading required** — all interaction is tap/click + audio
- **Letter sounds, not letter names** — "ah" not "ay", "ih" not "eye"
- **Immediate feedback** — every tap produces a response
- **Short sessions** — 3-5 minute activities
- **No penalties** — wrong answers get a gentle "try again", never punishment

## Screen Flow

```
Home (Steve says "Let's mine some sounds!")
  ├── Sound Explorer (tap vowel blocks, hear sounds)
  ├── Mine the Sound (identify middle vowel)
  ├── Build the Word (pick vowel to complete CVC)
  └── Sound Sort (categorize by middle vowel)
```

## Getting Started

```bash
npm install
npm run dev
```

## License

MIT
