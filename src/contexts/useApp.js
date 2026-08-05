import { useContext } from 'react';
import { AppContext } from './appContext';

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider.');
  return context;
}
