import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Standard, TenderBasketItem, BasketConflict } from '../types';

// ── State ───────────────────────────────────────────────────────────

interface BasketState {
  items: TenderBasketItem[];
  conflicts: BasketConflict[];
}

type BasketAction =
  | { type: 'ADD'; standard: Standard }
  | { type: 'REMOVE'; standardId: string }
  | { type: 'REORDER'; fromIndex: number; toIndex: number }
  | { type: 'UPDATE_NOTES'; standardId: string; notes: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: TenderBasketItem[] };

function detectConflicts(items: TenderBasketItem[]): BasketConflict[] {
  const conflicts: BasketConflict[] = [];
  const itemIds = new Set(items.map(i => i.standard.id));

  for (const item of items) {
    // Check for superseded standards
    for (const ref of item.standard.normativeReferences) {
      if (ref.relationship === 'superseded-by' && itemIds.has(ref.standardId)) {
        conflicts.push({
          type: 'superseded',
          standardId: item.standard.id,
          relatedStandardId: ref.standardId,
          message: `${item.standard.isNumber} is superseded by a newer standard in your basket`,
        });
      }
    }

    // Check if a superseded standard is in the basket alongside a current one
    if (item.standard.status === 'Superseded') {
      conflicts.push({
        type: 'superseded',
        standardId: item.standard.id,
        relatedStandardId: item.standard.id,
        message: `${item.standard.isNumber} has status "Superseded" — consider replacing with the current version`,
      });
    }

    // Check for missing normative references
    for (const ref of item.standard.normativeReferences) {
      if (ref.relationship === 'normative' && !itemIds.has(ref.standardId)) {
        conflicts.push({
          type: 'missing-reference',
          standardId: item.standard.id,
          relatedStandardId: ref.standardId,
          message: `${item.standard.isNumber} normatively references a standard not in your basket`,
        });
      }
    }
  }

  return conflicts;
}

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  let newItems: TenderBasketItem[];

  switch (action.type) {
    case 'ADD': {
      if (state.items.some(i => i.standard.id === action.standard.id)) return state;
      newItems = [...state.items, { standard: action.standard, addedAt: Date.now(), notes: '' }];
      break;
    }
    case 'REMOVE':
      newItems = state.items.filter(i => i.standard.id !== action.standardId);
      break;
    case 'REORDER': {
      newItems = [...state.items];
      const [moved] = newItems.splice(action.fromIndex, 1);
      newItems.splice(action.toIndex, 0, moved);
      break;
    }
    case 'UPDATE_NOTES':
      newItems = state.items.map(i =>
        i.standard.id === action.standardId ? { ...i, notes: action.notes } : i
      );
      break;
    case 'CLEAR':
      newItems = [];
      break;
    case 'HYDRATE':
      newItems = action.items;
      break;
    default:
      return state;
  }

  return { items: newItems, conflicts: detectConflicts(newItems) };
}

// ── Context ─────────────────────────────────────────────────────────

interface BasketContextValue {
  items: TenderBasketItem[];
  conflicts: BasketConflict[];
  addToBasket: (standard: Standard) => void;
  removeFromBasket: (standardId: string) => void;
  reorderBasket: (fromIndex: number, toIndex: number) => void;
  updateNotes: (standardId: string, notes: string) => void;
  clearBasket: () => void;
  isInBasket: (standardId: string) => boolean;
  itemCount: number;
}

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(basketReducer, { items: [], conflicts: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ss-basket');
      if (stored) {
        const parsed = JSON.parse(stored) as TenderBasketItem[];
        dispatch({ type: 'HYDRATE', items: parsed });
      }
    } catch {
      // ignore invalid data
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('ss-basket', JSON.stringify(state.items));
  }, [state.items]);

  const addToBasket = useCallback((standard: Standard) => {
    dispatch({ type: 'ADD', standard });
  }, []);

  const removeFromBasket = useCallback((standardId: string) => {
    dispatch({ type: 'REMOVE', standardId });
  }, []);

  const reorderBasket = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER', fromIndex, toIndex });
  }, []);

  const updateNotes = useCallback((standardId: string, notes: string) => {
    dispatch({ type: 'UPDATE_NOTES', standardId, notes });
  }, []);

  const clearBasket = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const isInBasket = useCallback(
    (standardId: string) => state.items.some(i => i.standard.id === standardId),
    [state.items]
  );

  return (
    <BasketContext.Provider
      value={{
        items: state.items,
        conflicts: state.conflicts,
        addToBasket,
        removeFromBasket,
        reorderBasket,
        updateNotes,
        clearBasket,
        isInBasket,
        itemCount: state.items.length,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket(): BasketContextValue {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be used within a BasketProvider');
  return ctx;
}
