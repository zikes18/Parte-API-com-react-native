import { Platform } from 'react-native';

export const Colors = {
  light: {
    tint: '#00D8A2',
    inactive: '#888',
    text: '#000',
    placeholder: '#666',
    background: '#FFF',
    cardBackground: '#F5F5F5',
    border: '#D0D0D0',
  },
  dark: {
    tint: '#00D8A2',
    inactive: '#AAA',
    text: '#FFF',
    placeholder: '#999',
    background: '#1E1E1E',
    cardBackground: '#2A2A2A',
    border: '#444',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
