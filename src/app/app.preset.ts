import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { Preset } from '@primeuix/themes/types';

export const appPreset: Preset = definePreset(Aura, {
  primitive: {
    indigo: {
      50: '#E8EAF6',
      100: '#C5CAE9',
      200: '#9FA8DA',
      300: '#7986CB',
      400: '#5C6BC0',
      500: '#3F51B5', // Primary Demy
      600: '#3949AB',
      700: '#303F9F',
      800: '#283593',
      900: '#1A237E',
      950: '#111756',
    },
    orange: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#F57C00', // Secondary Demy
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
      950: '#A33A00',
    },
    purple: {
      50: '#F3E5F5',
      100: '#E1BEE7',
      200: '#CE93D8',
      300: '#BA68C8',
      400: '#AB47BC', // Tertiary Demy
      500: '#9C27B0',
      600: '#8E24AA',
      700: '#7B1FA2',
      800: '#6A1B9A',
      900: '#4A148C',
      950: '#300D5E',
    },
    dark: {
      100: '#0A0D0E', // Black 1
      200: '#1A1C1E', // Black 2
      300: '#32393B', // Black 3
    },
    sand: {
      50: '#F7F5ED', // White (Off-white)
      100: '#E6E4D9', // Gray 5
      200: '#CDCBC0', // Gray 4
      300: '#B8B6AC',
      400: '#8C8A81', // Gray 3
      500: '#716F68',
      600: '#5C5B54', // Gray 2
      700: '#4D4C46',
      800: '#3D3C37', // Gray 1
    },
    sky: { 500: '#00B4D8' }, // Info
    emerald: { 500: '#3BC48E' }, // Success
    amber: { 500: '#FFAD33' }, // Warning
    red: { 500: '#EF5350' }, // Error
    neutral: {
      900: '#262522',
      800: '#25282A',
      700: '#A9A79E',
      600: '#DEDCD2',
    },
  },
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
    info: { color: '{sky.500}' },
    success: { color: '{emerald.500}' },
    warning: { color: '{amber.500}' },
    error: { color: '{red.500}' },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{sand.50}',
          100: '{sand.100}',
          200: '{sand.200}',
          300: '{sand.300}',
          400: '{sand.400}',
          500: '{sand.500}',
          600: '{sand.600}',
          700: '{sand.700}',
          800: '{sand.800}',
          900: '{neutral.900}',
          950: '{dark.100}',
        },
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        navigation: {
          item: {
            focusBackground: '{sand.100}',
            activeBackground: '{sand.200}',
          },
        },
        highlight: {
          background: '{indigo.50}',
          focusBackground: '{indigo.100}',
          color: '{indigo.700}',
          focusColor: '{indigo.800}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{dark.200}',
          100: '{neutral.800}',
          200: '{dark.300}',
          300: '{sand.800}',
          400: '{sand.600}',
          500: '{sand.400}',
          600: '{neutral.700}',
          700: '{sand.200}',
          800: '{neutral.600}',
          900: '{sand.100}',
          950: '{sand.50}',
        },
        primary: {
          color: '{primary.400}',
          contrastColor: '{primary.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        navigation: {
          item: {
            focusBackground: '{dark.300}',
            activeBackground: '{sand.800}',
          },
        },
        highlight: {
          background: 'rgba(245, 124, 0, 0.15)', // Usando el Secondary (Orange) para el highlight oscuro
          focusBackground: 'rgba(245, 124, 0, 0.25)',
          color: '{orange.300}',
          focusColor: '{orange.200}',
        },
      },
    },
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{orange.400}', // Anillo de foco usando el secundario (Naranja)
      offset: '2px',
    },
  },
});
