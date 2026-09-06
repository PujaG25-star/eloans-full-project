# public/

Files here are served from the site root, unprocessed.

## hero-banner.png

The dashboard hero artwork. Save the banner image here with exactly this
name and it appears automatically — no code change needed.

It is positioned to show its **right-hand side** (the illustration), because
the source artwork carries its own headline and buttons on the left, which
would collide with the live, translated hero text. If you swap in artwork
with a different composition, adjust `object-[86%_center]` on the hero
`<img>` in `src/main.tsx` to re-aim the crop.

The image is decorative (`alt=""`). If the file is missing the hero falls
back to the plain tinted panel, so nothing breaks.

It is hidden below a hero width of 640px, where there is no room beside
the copy.
