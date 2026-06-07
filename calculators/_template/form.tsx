'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { calculate } from './logic';

export function TemplateForm() {
  const [value, setValue] = React.useState(10);
  const result = calculate({ value });
  return (
    <div className="rounded-md border border-border-default bg-surface-1 p-5">
      <label htmlFor="tmpl-value" className="block text-sm text-ink-2">
        Valor de entrada
      </label>
      <NumberInput
        id="tmpl-value"
        value={value}
        onChange={setValue}
        className="mt-1.5"
      />
      <p className="tabular mt-4 text-sm text-ink-3">
        Resultado: <span className="text-ink-1">{result.result}</span>
      </p>
    </div>
  );
}
