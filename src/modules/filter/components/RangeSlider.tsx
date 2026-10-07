import { useLingui } from '@lingui/react/macro';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';

import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue';
import { InputGroup, InputGroupInput } from '@/shared/ui/input-group';
import { Slider } from '@/shared/ui/slider';

import { MIN_DISTANCE } from '../constants';

type RangeValue = readonly [number, number];

export const RangeSlider = ({ min, max }: { min: number; max: number }) => {
  const { t } = useLingui();

  const [minPrice, setMinPrice] = useQueryState(
    'price_min',
    parseAsInteger
      .withDefault(min)
      .withOptions({ limitUrlUpdates: { method: 'debounce', timeMs: 500 } })
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    'price_max',
    parseAsInteger
      .withDefault(max)
      .withOptions({ limitUrlUpdates: { method: 'debounce', timeMs: 500 } })
  );

  const prevValues = useRef<RangeValue>([minPrice, maxPrice]);

  const [minInputVal, setMinInputVal] = useState(String(minPrice));
  const [maxInputVal, setMaxInputVal] = useState(String(maxPrice));

  const debouncedMin = useDebouncedValue(minInputVal, 300);
  const debouncedMax = useDebouncedValue(maxInputVal, 300);

  useEffect(() => {
    const rawVal = Number(debouncedMin);
    if (Number.isNaN(rawVal)) return;
    const clamped = Math.max(min, Math.min(rawVal, maxPrice - MIN_DISTANCE));
    prevValues.current = [clamped, maxPrice];
    setMinPrice(clamped);
  }, [debouncedMin]);

  useEffect(() => {
    const rawVal = Number(debouncedMax);
    if (Number.isNaN(rawVal)) return;
    const clamped = Math.min(max, Math.max(rawVal, minPrice + MIN_DISTANCE));
    prevValues.current = [minPrice, clamped];
    setMaxPrice(clamped);
  }, [debouncedMax]);

  const minFocused = useRef(false);
  const maxFocused = useRef(false);

  useEffect(() => {
    if (!minFocused.current) setMinInputVal(String(minPrice));
  }, [minPrice]);

  useEffect(() => {
    if (!maxFocused.current) setMaxInputVal(String(maxPrice));
  }, [maxPrice]);

  const handleChange = (value: number | readonly number[]) => {
    const [rawMin, rawMax] = value as RangeValue;

    let minVal = rawMin;
    let maxVal = rawMax;

    if (maxVal - minVal < MIN_DISTANCE) {
      if (prevValues.current[0] !== minVal) {
        minVal = maxVal - MIN_DISTANCE;
      } else {
        maxVal = minVal + MIN_DISTANCE;
      }
    }

    prevValues.current = [minVal, maxVal];
    setMinPrice(minVal);
    setMaxPrice(maxVal);
  };

  return (
    <div className='w-full space-y-2'>
      <h3 className='text-xs font-medium'>{t`Price`}</h3>

      <div className='grid grid-cols-2 mb-4 gap-2'>
        <p className='text-muted-foreground text-sm'>{t`from`}:</p>
        <p className='text-muted-foreground text-sm'>{t`to`}:</p>
        <InputGroup>
          <InputGroupInput
            className='[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            type='number'
            value={minInputVal}
            onBlur={() => {
              minFocused.current = false;
            }}
            onChange={(e) => setMinInputVal(e.target.value)}
            onFocus={() => {
              minFocused.current = true;
            }}
          />
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            className='[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
            type='number'
            value={maxInputVal}
            onBlur={() => {
              maxFocused.current = false;
            }}
            onChange={(e) => setMaxInputVal(e.target.value)}
            onFocus={() => {
              maxFocused.current = true;
            }}
          />
        </InputGroup>
      </div>

      <Slider
        className='w-full'
        max={max}
        min={min}
        step={MIN_DISTANCE}
        value={[minPrice, maxPrice]}
        onValueChange={handleChange}
      />
    </div>
  );
};
