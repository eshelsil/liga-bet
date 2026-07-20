<?php

namespace App\Actions;

use App\Tournament;
use InvalidArgumentException;

/**
 * Apply a named congrats-animation preset (from config/congratsAnimations.php) to a tournament,
 * writing the full config into config->congratsAnimation — the same shape the admin dialog saves.
 *
 * Tinker:
 *   (new \App\Actions\SetCongratsAnimationConfig)->handle(\App\Tournament::find(5), 'carefam_cup_en');
 */
class SetCongratsAnimationConfig
{
    public function handle(Tournament $tournament, string $presetKey): array
    {
        $presets = config('congratsAnimations', []);

        if (!array_key_exists($presetKey, $presets)) {
            $available = implode(', ', array_keys($presets));
            throw new InvalidArgumentException(
                "Unknown congrats preset '{$presetKey}'. Available: {$available}"
            );
        }

        $payload = $presets[$presetKey];
        $tournament->update(["config->congratsAnimation" => $payload]);

        return $payload;
    }
}
