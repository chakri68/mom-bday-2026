# Birthday Website Prototype Spec for Copilot

Build this birthday website for my mom.

## Goal

Create a small emotional interactive website with this exact flow:

1. **Landing screen** with a centered button or text saying **"Click to start"**
2. On click:
   - trigger a small **celebration moment**
   - show **popper / confetti**
   - play a short celebratory sound
   - display **"Happy Birthday Mom"**
3. After a short pause, **fade to an envelope scene**
4. Show a centered **closed envelope**
   - envelope has a **heart-shaped wax seal** in the middle
5. User clicks the heart seal
6. The seal animates and the **envelope opens**
7. A **letter slides out** from inside the envelope
8. Show the letter content in a **handwritten style**
9. At the bottom of the letter, show a few **polaroid-style family photos**
   - they should look like they are **attached to the letter**
   - use a **paper clip style detail**
10. End with a signature line:

- **With love**
- **Written by Bruhathi**
- **Directed by Chakri**

## Tech constraints

- Use **React**
- Use **Tailwind CSS**
- Use **Framer Motion** for animations if needed
- Keep the code clean and componentized
- Make it a **prototype**, not overengineered
- No backend needed
- Mobile-friendly is nice, but desktop-first is okay

## Visual style

The whole experience should feel:

- warm
- cute
- soft
- emotional
- handcrafted
- slightly scrapbook-like

### Color palette

Use soft colors like:

- cream
- warm white
- pastel pink
- muted red
- soft brown
- paper-like beige

Avoid anything too flashy or neon.

## Typography

Use:

- **Caveat** for the handwritten letter text and small captions
- A clean readable sans-serif for UI labels if needed

## Required screens / states

### 1. Start screen

- Minimal screen
- Centered call to action: **Click to start**
- Soft background
- Maybe subtle floating particles or glow, but very light

### 2. Celebration state

After clicking:

- show confetti/popper effect
- show **Happy Birthday Mom**
- optionally play a short sound
- keep this on screen for around 1.5 to 2.5 seconds
- then smoothly fade out

### 3. Envelope scene

- Center a beautiful envelope on screen
- Envelope should look paper-like
- Add a **heart-shaped seal** at the center flap
- The seal should look clickable
- Add hover/tap feedback

### 4. Opening animation

When the seal is clicked:

- heart seal gives a slight press animation
- envelope flap opens
- letter slides upward from inside the envelope
- animation should feel gentle and elegant, not too fast

### 5. Letter view

- Letter should look like textured paper
- Main content displayed in **Caveat**
- Text should be readable and centered within a realistic letter layout
- Add padding and spacing like a real handwritten letter
- Letter can animate in with fade + upward motion

## Sample placeholder letter content

Use this as placeholder text for now:

> Dear Mom,  
> Happy Birthday.  
> Thank you for always being there for us, for caring for us, and for making everything feel safe.  
> This little letter is just a small way of saying how much we love you.  
> You mean more to us than we can ever properly put into words.
>
> Love always,  
> Bruhathi

This should be easy to replace later with the real letter text.

## Polaroid photo section

At the bottom of the letter:

- show **3 to 5 polaroid-style photos**
- use placeholder images for now
- each photo should have:
  - white polaroid border
  - slightly thicker bottom margin
  - subtle shadow
  - slight random rotation for a casual natural look
- photos should overlap a little
- add a **paper clip effect** so they look attached to the letter
- optionally include tiny handwritten captions

### Important feel

The photos should look like:

- memories tucked into the letter
- not like a gallery section
- more scrapbook, less modern app UI

## Signature section

At the bottom of the letter, include:

With love,  
Bruhathi

And below or near it in a softer smaller way:

Directed by Chakri ❤️

## Motion guidelines

Keep animations:

- soft
- smooth
- emotional
- not bouncy-cartoonish except maybe the initial confetti

Suggested motion ideas:

- fade transitions
- scale on click for seal
- slide-up letter reveal
- slight stagger for polaroids

## Audio

Optional but supported:

- short celebration sound on first click
- subtle paper opening / rustle sound when envelope opens

Audio should be easy to disable.

## Suggested component structure

Use something like:

- `BirthdayExperience`
- `StartScreen`
- `CelebrationScreen`
- `EnvelopeScene`
- `Envelope`
- `Letter`
- `PolaroidPhotos`

## Implementation notes

- Use local component state to move through steps
- Keep state simple, something like:
  - `"start"`
  - `"celebrate"`
  - `"envelope"`
  - `"open"`
- Use placeholder assets where needed
- Make it easy to swap in:
  - real photos
  - real letter text
  - real audio files

## Nice small extras if easy

These are optional:

- subtle paper grain texture
- tiny shadow under envelope
- light vignette background
- hover effect on seal
- staggered photo reveal after the letter appears

## Avoid

- no complicated routing
- no dark theme
- no generic corporate UI look
- no heavy modal/app-style layout

## Deliverable

Generate a **working React prototype** in a single page that demonstrates the full interaction flow with placeholder assets.

The output should feel like a heartfelt digital birthday card / letter experience.
