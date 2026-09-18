import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { BasketProvider } from './hooks/useBasket';
import { ChatProvider } from './hooks/useChat';
import { LanguageProvider } from './hooks/useLanguage';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <BasketProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </BasketProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
