import type { Dispatch, SetStateAction } from 'react';

import { useHotkey } from '@tanstack/react-hotkeys';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const areSameIds = (left: string[], right: string[]) => {
  if (left.length !== right.length) return false;
  return left.every((id, index) => id === right[index]);
};

interface SelectionClickEvent {
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

interface GridSelectStartEvent {
  inputEvent?: MouseEvent | TouchEvent;
}

interface GridSelectEvent {
  selected: Array<HTMLElement | SVGElement>;
}

interface GridSelectionDragConditionEvent {
  inputEvent?: Event;
}

interface UseSelectableListOptions {
  orderedVisibleIds: string[];
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  isTypingTarget: (target: EventTarget | null) => boolean;
  onDeleteRequest?: () => void;
  onVisibleSelectedIdsChange?: (ids: string[]) => void;
  dragSelection?: {
    selectableIdAttr: string;
    selectableSelector: string;
    selectionContainer: HTMLDivElement | null;
  };
}

export const useSelectableList = ({
  orderedVisibleIds,
  selectedIds,
  setSelectedIds,
  isTypingTarget,
  onDeleteRequest,
  onVisibleSelectedIdsChange,
  dragSelection
}: UseSelectableListOptions) => {
  const [anchorId, setAnchorId] = useState<string | null>(null);
  const dragSelectionStateRef = useRef<{ additive: boolean; baseSelectedIds: string[] } | null>(
    null
  );

  const orderedVisibleIdSet = useMemo(() => new Set(orderedVisibleIds), [orderedVisibleIds]);

  const visibleSelectedIds = useMemo(
    () => selectedIds.filter((id) => orderedVisibleIdSet.has(id)),
    [orderedVisibleIdSet, selectedIds]
  );
  const visibleSelectedIdSet = useMemo(() => new Set(visibleSelectedIds), [visibleSelectedIds]);
  const selectedItemsLength = visibleSelectedIds.length;

  const allVisibleSelected =
    orderedVisibleIds.length > 0 && orderedVisibleIds.every((id) => visibleSelectedIdSet.has(id));
  const someVisibleSelected = orderedVisibleIds.some((id) => visibleSelectedIdSet.has(id));

  useEffect(() => {
    if (!onVisibleSelectedIdsChange) return;
    onVisibleSelectedIdsChange(visibleSelectedIds);
  }, [onVisibleSelectedIdsChange, visibleSelectedIds]);

  const applyRangeSelection = useCallback(
    (targetId: string, additive: boolean) => {
      const currentIndex = orderedVisibleIds.indexOf(targetId);
      if (currentIndex === -1) return;

      const baseId = anchorId && orderedVisibleIdSet.has(anchorId) ? anchorId : targetId;
      const baseIndex = orderedVisibleIds.indexOf(baseId);
      if (baseIndex === -1) return;

      const start = Math.min(baseIndex, currentIndex);
      const end = Math.max(baseIndex, currentIndex);
      const rangeIds = orderedVisibleIds.slice(start, end + 1);

      setSelectedIds((prev) => {
        if (!additive) return rangeIds;
        const next = Array.from(new Set([...prev, ...rangeIds]));
        return areSameIds(prev, next) ? prev : next;
      });
      setAnchorId(baseId);
    },
    [anchorId, orderedVisibleIds, orderedVisibleIdSet, setSelectedIds]
  );

  const handleItemClick = useCallback(
    (clickedId: string, event: SelectionClickEvent) => {
      const additive = event.ctrlKey || event.metaKey;

      if (event.shiftKey) {
        applyRangeSelection(clickedId, additive);
        return;
      }

      if (additive) {
        setSelectedIds((prev) =>
          prev.includes(clickedId) ? prev.filter((id) => id !== clickedId) : [...prev, clickedId]
        );
        setAnchorId(clickedId);
        return;
      }

      setSelectedIds([clickedId]);
      setAnchorId(clickedId);
    },
    [applyRangeSelection, setSelectedIds]
  );

  const getSelectedIdsFromElements = useCallback(
    (elements: Array<HTMLElement | SVGElement>) => {
      if (!dragSelection) return [];

      const draggedIdSet = new Set<string>();

      for (const element of elements) {
        const id = element.getAttribute(dragSelection.selectableIdAttr);
        if (id && orderedVisibleIdSet.has(id)) draggedIdSet.add(id);
      }

      return orderedVisibleIds.filter((id) => draggedIdSet.has(id));
    },
    [dragSelection, orderedVisibleIdSet, orderedVisibleIds]
  );

  const setSelectionFromDrag = useCallback(
    (elements: Array<HTMLElement | SVGElement>, additive: boolean, baseSelectedIds: string[]) => {
      const draggedIds = getSelectedIdsFromElements(elements);

      if (!additive) {
        setSelectedIds(draggedIds);
        if (draggedIds.length > 0) setAnchorId(draggedIds[draggedIds.length - 1]);
        return;
      }

      const combinedIdSet = new Set([...baseSelectedIds, ...draggedIds]);
      const next = orderedVisibleIds.filter((id) => combinedIdSet.has(id));
      setSelectedIds(next);
      if (draggedIds.length > 0) setAnchorId(draggedIds[draggedIds.length - 1]);
    },
    [getSelectedIdsFromElements, orderedVisibleIds, setSelectedIds]
  );

  const handleSelectStart = useCallback(
    (event: GridSelectStartEvent) => {
      if (!dragSelection) return;

      const inputEvent = event.inputEvent;
      const additive =
        !!inputEvent &&
        'ctrlKey' in inputEvent &&
        (inputEvent.ctrlKey || inputEvent.metaKey || inputEvent.shiftKey);

      dragSelectionStateRef.current = {
        additive,
        baseSelectedIds: additive ? visibleSelectedIds : []
      };
    },
    [dragSelection, visibleSelectedIds]
  );

  const handleSelect = useCallback(
    (event: GridSelectEvent) => {
      if (!dragSelection) return;

      const dragState = dragSelectionStateRef.current;
      if (!dragState) return;
      setSelectionFromDrag(event.selected, dragState.additive, dragState.baseSelectedIds);
    },
    [dragSelection, setSelectionFromDrag]
  );

  const handleSelectEnd = useCallback(
    (event: GridSelectEvent) => {
      if (!dragSelection) return;

      const dragState = dragSelectionStateRef.current;
      if (!dragState) return;
      setSelectionFromDrag(event.selected, dragState.additive, dragState.baseSelectedIds);
      dragSelectionStateRef.current = null;
    },
    [dragSelection, setSelectionFromDrag]
  );

  const canStartDragSelection = useCallback(
    (event: GridSelectionDragConditionEvent) => {
      if (!dragSelection) return true;

      const inputEvent = event.inputEvent;
      if (!(inputEvent?.target instanceof HTMLElement)) return true;
      if (!dragSelection.selectionContainer?.contains(inputEvent.target)) return false;
      return !inputEvent.target.closest(dragSelection.selectableSelector);
    },
    [dragSelection]
  );

  useHotkey(
    'Mod+A',
    (event) => {
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      setSelectedIds(orderedVisibleIds);
      if (orderedVisibleIds.length > 0) setAnchorId(orderedVisibleIds[0]);
    },
    {
      enabled: orderedVisibleIds.length > 0,
      preventDefault: false
    }
  );

  useHotkey('Escape', (event) => {
    if (isTypingTarget(event.target)) return;
    event.preventDefault();
    setSelectedIds([]);
    setAnchorId(null);
  });

  useHotkey(
    'Delete',
    (event) => {
      if (!onDeleteRequest) return;
      if (isTypingTarget(event.target)) return;
      if (selectedItemsLength === 0) return;
      event.preventDefault();
      onDeleteRequest();
    },
    {
      enabled: !!onDeleteRequest && selectedItemsLength > 0,
      preventDefault: false
    }
  );

  return {
    allVisibleSelected,
    canStartDragSelection,
    handleItemClick,
    handleSelect,
    handleSelectEnd,
    handleSelectStart,
    orderedVisibleIdSet,
    selectedItemsLength,
    setAnchorId,
    someVisibleSelected,
    visibleSelectedIds,
    visibleSelectedIdSet
  };
};
