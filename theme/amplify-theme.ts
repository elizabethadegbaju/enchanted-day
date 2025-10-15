import { createTheme } from '@aws-amplify/ui-react'

export const amplifyTheme = createTheme({
  name: 'enchanted-day-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#fdf2f8',
          20: '#fce7f3',
          40: '#fbcfe8',
          60: '#f9a8d4',
          80: '#f472b6',
          90: '#ec4899',
          100: '#db2777',
        },
      },
      // Override the default teal colors that Amplify uses
      teal: {
        10: '#fdf2f8',
        20: '#fce7f3',
        40: '#fbcfe8',
        60: '#f9a8d4',
        80: '#f472b6',
        90: '#ec4899',
        100: '#db2777',
      },
    },
  },
  overrides: [
    {
      colorMode: 'light',
      tokens: {
        components: {
          authenticator: {
            router: {
              borderWidth: '0',
              boxShadow: '{shadows.medium}',
            },
          },
          button: {
            primary: {
              backgroundColor: '{colors.brand.primary.90}',
              borderColor: '{colors.brand.primary.90}',
              color: '{colors.white}',
              _hover: {
                backgroundColor: '{colors.brand.primary.100}',
                borderColor: '{colors.brand.primary.100}',
              },
              _focus: {
                backgroundColor: '{colors.brand.primary.100}',
                borderColor: '{colors.brand.primary.100}',
              },
            },
            link: {
              color: '{colors.brand.primary.90}',
              _hover: {
                color: '{colors.brand.primary.100}',
              },
            },
          },
          tabs: {
            item: {
              color: '{colors.neutral.60}',
              _active: {
                color: '{colors.brand.primary.90}',
                borderColor: '{colors.brand.primary.90}',
              },
            },
          },
          fieldcontrol: {
            _focus: {
              borderColor: '{colors.brand.primary.90}',
            },
          },
        },
      },
    },
  ],
})