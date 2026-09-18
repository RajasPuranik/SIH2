import { useState } from 'react';
import { GripVertical, X, Download, ShoppingBag } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBasket } from '../../hooks/useBasket';
import { ConflictAlert } from './ConflictAlert';
import { ExportDialog } from './ExportDialog';
import { EmptyState } from '../common/EmptyState';
import type { TenderBasketItem } from '../../types';

function SortableItem({ item, onRemove }: { item: TenderBasketItem; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.standard.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mb-3 shadow-sm ${
        isDragging ? 'opacity-50 ring-2 ring-indigo-500' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base truncate" title={item.standard.isNumber}>
          {item.standard.isNumber}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate" title={item.standard.title}>
          {item.standard.title}
        </p>
      </div>
      <button
        onClick={() => onRemove(item.standard.id)}
        className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
        aria-label="Remove item"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

export function BasketPanel() {
  const { items, conflicts, reorderBasket, removeFromBasket, clearBasket } = useBasket();
  const [exportOpen, setExportOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.standard.id === active.id);
      const newIndex = items.findIndex(i => i.standard.id === over.id);
      reorderBasket(oldIndex, newIndex);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <EmptyState icon={ShoppingBag} title="Your tender basket is empty" description="Search for standards and add them to your basket to create a standards schedule." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tender Basket</h1>
        <div className="flex gap-2">
          <button
            onClick={() => clearBasket()}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Clear
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="flex flex-col gap-2">
          {conflicts.map((conflict, i) => (
            <ConflictAlert key={`${conflict.standardId}-${i}`} conflict={conflict} />
          ))}
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.standard.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {items.map(item => (
              <SortableItem key={item.standard.id} item={item} onRemove={removeFromBasket} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ExportDialog isOpen={exportOpen} onClose={() => setExportOpen(false)} items={items} />
    </div>
  );
}
