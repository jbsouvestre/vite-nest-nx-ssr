import { ThemeProvider } from '@emotion/react'
import type { Theme } from "@emotion/react";
import App from './app/app';

declare module '@emotion/react' {
  export interface Theme {
    color: {
      primary: string
      positive: string
      negative: string
    }
  }
}

const theme: Theme = {
  color: {
    primary: 'navy',
    positive: 'green',
    negative: 'red',
  }
}

export default function Main() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}
