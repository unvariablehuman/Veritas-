/**
 * icons.jsx — Centralized icon registry for Veritas+
 * Maps emoji / badge IDs → Lucide React components
 */
import React from 'react';
import {
  // KEPO_LIBRARY icons
  Coffee, Candy, Apple, Bird, Battery, Moon, Thermometer,
  Wifi, Utensils, Fish, Building2, ShowerHead,
  // KEPO_BADGES icons
  Rocket, HardDrive, Stethoscope, Flame, Zap, Landmark,
  Theater, Crown, Sparkles, Gem,
  // Filter / UI
  LayoutGrid, X, Check,
  // Category (re-export for consistency)
  Cpu, HeartPulse, FlaskConical, Palette,
} from 'lucide-react';

/** Library card icons keyed by the emoji string in data.js */
export const LIBRARY_ICON_MAP = {
  '☕': { Icon: Coffee,      color: '#a16207' },
  '🍫': { Icon: Candy,       color: '#b45309' },
  '🍎': { Icon: Apple,       color: '#dc2626' },
  '🐧': { Icon: Bird,        color: '#0284c7' },
  '🔋': { Icon: Battery,     color: '#16a34a' },
  '🌙': { Icon: Moon,        color: '#7c3aed' },
  '🌡️':{ Icon: Thermometer, color: '#ea580c' },
  '📶': { Icon: Wifi,        color: '#0891b2' },
  '🍜': { Icon: Utensils,    color: '#d97706' },
  '🦈': { Icon: Fish,        color: '#1d4ed8' },
  '🏛️':{ Icon: Building2,   color: '#92400e' },
  '🚿': { Icon: ShowerHead,  color: '#0e7490' },
};

/** Badge icons keyed by badge id in data.js */
export const BADGE_ICON_MAP = {
  first_step:   { Icon: Rocket,      color: '#00F0FF', glow: 'rgba(0,240,255,0.3)'  },
  tech_hunter:  { Icon: Cpu,         color: '#00F0FF', glow: 'rgba(0,240,255,0.3)'  },
  health_guru:  { Icon: Stethoscope, color: '#7CFFB2', glow: 'rgba(124,255,178,0.3)'},
  streak_5:     { Icon: Flame,       color: '#FF9500', glow: 'rgba(255,149,0,0.3)'  },
  streak_10:    { Icon: Zap,         color: '#FFD700', glow: 'rgba(255,215,0,0.3)'  },
  history_buff: { Icon: Landmark,    color: '#FFD700', glow: 'rgba(255,215,0,0.3)'  },
  culture_lover:{ Icon: Theater,     color: '#FF2A6D', glow: 'rgba(255,42,109,0.3)' },
  final_boss:   { Icon: Crown,       color: '#FFD700', glow: 'rgba(255,215,0,0.45)' },
  xp_500:       { Icon: Sparkles,    color: '#B892FF', glow: 'rgba(184,146,255,0.3)'},
  xp_1000:      { Icon: Gem,         color: '#00F0FF', glow: 'rgba(0,240,255,0.35)' },
};

/** Filter chip icons for Library filter bar */
export const FILTER_ICON_MAP = {
  all:     { Icon: LayoutGrid, color: '#94a3b8' },
  myth:    { Icon: X,          color: '#FF7095' },
  fact:    { Icon: Check,      color: '#7CFFB2' },
  tech:    { Icon: Cpu,          color: '#00F0FF' },
  health:  { Icon: HeartPulse,   color: '#7CFFB2' },
  science: { Icon: FlaskConical, color: '#B892FF' },
  history: { Icon: Landmark,     color: '#FFD700' },
  culture: { Icon: Palette,      color: '#FF2A6D' },
};

/**
 * Renders a library/featured card icon (replaces f.icon emoji)
 * @param {string} emoji - the emoji string from data.js
 * @param {boolean} isMyth - used to pick accent color ring
 */
export function CardIcon({ emoji, isMyth }) {
  const meta = LIBRARY_ICON_MAP[emoji];
  if (!meta) return <span style={{ fontSize: '2rem' }}>{emoji}</span>;
  const { Icon, color } = meta;
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '10px',
        borderRadius: '14px',
        background: `${color}18`,
        border: `1.5px solid ${color}33`,
        boxShadow: `0 0 14px ${color}28`,
      }}
    >
      <Icon size={26} color={color} strokeWidth={1.6} />
    </div>
  );
}

/**
 * Renders a badge icon (replaces b.icon emoji)
 * @param {string} badgeId - the badge id from data.js
 * @param {boolean} owned - whether badge is unlocked
 */
export function BadgeIcon({ badgeId, owned }) {
  const meta = BADGE_ICON_MAP[badgeId];
  if (!meta) return null;
  const { Icon, color, glow } = meta;
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '10px',
        borderRadius: '14px',
        background: owned ? `${color}18` : 'rgba(100,100,100,0.1)',
        border: `1.5px solid ${owned ? `${color}44` : 'rgba(100,100,100,0.2)'}`,
        boxShadow: owned ? `0 0 16px ${glow}` : 'none',
        filter: owned ? 'none' : 'grayscale(0.8) opacity(0.5)',
        transition: 'all 0.3s ease',
      }}
    >
      <Icon size={26} color={owned ? color : '#6b7280'} strokeWidth={1.6} />
    </div>
  );
}

/**
 * Renders a filter chip icon
 * @param {string} filterId - category/verdict/all id
 */
export function FilterIcon({ filterId }) {
  const meta = FILTER_ICON_MAP[filterId];
  if (!meta) return null;
  const { Icon, color } = meta;
  return <Icon size={13} color={color} strokeWidth={2} style={{ flexShrink: 0 }} />;
}
