export const colors = {
  bg: '#0A2818',
  bgAlt: '#0F3320',
  bgCard: '#123D26',
  surface: '#164A2E',

  lime: '#A8FF3D',
  limeDark: '#8FE01F',
  limeMuted: 'rgba(168, 255, 61, 0.16)',

  paleMint: '#EAF7E4',
  paleMintText: '#0A2818',

  white: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.64)',
  textFaint: 'rgba(255, 255, 255, 0.36)',
  border: 'rgba(255, 255, 255, 0.12)',

  error: '#FF6B5E',
  success: '#A8FF3D',
} as const;

export type ColorToken = keyof typeof colors;
