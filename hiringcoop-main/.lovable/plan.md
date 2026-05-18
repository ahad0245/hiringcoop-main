## Why your app feels slow

I audited the project. Three concrete causes, ranked by impact:

### 1. The homepage downloads ~81 MB of video on first load (biggest issue)
`src/components/home/Hero.tsx` autoplays two large MP4s from `public/videos/`:
- `c-suite-interview.mp4` — **39 MB**
- `blue-collar-interview.mp4` — **42 MB**

Both have `autoPlay` with no `preload="metadata"` and no `poster`, so every visitor (including mobile) downloads the full files before the page feels usable. This alone explains "slow homepage" complaints.

### 2. Every page is eagerly imported in `src/App.tsx`
~40 page components (admin pages, employer pages, candidate pages, legal pages) are all `import`-ed at the top of `App.tsx`. A first-time visitor to `/` downloads JS for the admin dashboard, video recorder, FFmpeg type surface, etc. — none of which they need.

### 3. The `@ffmpeg/ffmpeg` dependency is still installed
`src/utils/videoUtils.ts` references it but nothing in the app imports `videoUtils` anymore (we moved to segmented uploads per the architecture memory). It's dead weight in `node_modules` and gets pulled into the bundle if anything ever references it.

---

## Plan

### Fix 1 — Shrink and lazy-load the hero videos
- Re-encode both MP4s to ~720p H.264, target ≤ 4 MB each (≈95% size reduction). Use `ffmpeg` in the sandbox, commit the smaller files in place.
- Generate a poster JPG for each (first frame).
- Update `Hero.tsx`:
  - add `poster="..."`, `preload="metadata"`
  - keep `autoPlay muted loop playsInline`
  - add `width`/`height` attributes to prevent CLS

### Fix 2 — Code-split routes in `App.tsx`
- Convert all page imports to `React.lazy(() => import(...))`.
- Wrap `<Routes>` in `<Suspense fallback={<minimal loader/>}>`.
- Keep `Index`, `LoginPage`, `SignupPage`, `NotFound` eager (common entry points) — everything else lazy. Expected first-load JS reduction: ~60–70%.

### Fix 3 — Remove dead FFmpeg dependency
- Delete `src/utils/videoUtils.ts` and `src/types/ffmpeg.d.ts`.
- Run `bun remove @ffmpeg/ffmpeg @ffmpeg/util`.

### Out of scope (mention only)
- If complaints are specifically about the **dashboard** being slow under load (not first-paint), that's a Lovable Cloud compute sizing question, not a code fix. Tell me if that's the symptom and I'll point you to the upgrade path.

---

## Files touched
| File | Change |
|------|--------|
| `public/videos/*.mp4` | Re-encode to ≤4 MB each |
| `public/videos/*.jpg` | New poster frames |
| `src/components/home/Hero.tsx` | Add poster, preload=metadata, dimensions |
| `src/App.tsx` | Convert page imports to `React.lazy` + `Suspense` |
| `src/utils/videoUtils.ts` | Delete |
| `src/types/ffmpeg.d.ts` | Delete |
| `package.json` | Remove `@ffmpeg/*` |

No DB migrations. No behavior changes.