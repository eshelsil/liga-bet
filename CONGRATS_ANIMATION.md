# Congrats Animation — setting the config on a tournament

The congrats animation (end-of-tournament celebration + replay button) is driven by
`tournament.config.congratsAnimation`. Three ways to set it.

## Config shape
```jsonc
{
  "enabled": true,
  "lang": "he",                 // "he" | "en" — drives direction + fixed button labels
  "ranks": [                    // per finishing-rank content (optional)
    { "rank": 1, "type": "confetti", "title": "...", "msg": "..." }
  ],
  "default": { "type": "one_bag", "title": "...", "msg": "..." } // fallback for any rank not listed
}
```
- `type`: `confetti | two_bags | one_bag | single_dollar | none` (`Tournament::CONGRATS_ANIM_TYPES`).
- Prize claim ("Take the prize") shows for `rank <= 4`.

## 1. Admin UI (per tournament, free-form)
Admin tools → tournament → Congrats dialog (`CongratsAnimationDialog.tsx`).
`POST /admin/update-congrats-animation/{tournamentId}` → `AdminController::updateCongratsAnimation`
(validates + writes `config->congratsAnimation`).

## 2. Named preset (tinker / seeding)
Presets live in `config/congratsAnimations.php` (keyed by name). Apply one:
```php
(new \App\Actions\SetCongratsAnimationConfig)->handle(\App\Tournament::find(5), 'carefam_cup_en');
```
Writes the same shape as the admin dialog. Throws on an unknown preset key.
Add a new preset by adding a key to `config/congratsAnimations.php`.

## 3. Raw / toggle
```php
$t->update(["config->congratsAnimation" => $payload]);  // set directly
$t->disableCongratsAnimation();                          // enabled=false, keeps texts
```

## When it shows (FE)
Gated by `congratsAnimation.ts` selectors: `enabled` + tournament done (MVP answered) + viewing
the latest leaderboard + the user has a rank. Auto-plays once (until `congrats_seen_at` is set via
`POST .../congrats-seen`); afterwards the corner replay button re-triggers it. The dismiss "×" hides
the button for the current app session only (returns on refresh).
