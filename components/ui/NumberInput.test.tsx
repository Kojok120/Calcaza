import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { NumberInput } from './NumberInput';

afterEach(cleanup);

function Harness(
  props: Partial<React.ComponentProps<typeof NumberInput>> & {
    initial?: number;
    onChange?: (n: number) => void;
  }
) {
  const { initial = 0, onChange, ...rest } = props;
  const [value, setValue] = React.useState(initial);
  return (
    <NumberInput
      {...rest}
      value={value}
      onChange={(n) => {
        setValue(n);
        onChange?.(n);
      }}
    />
  );
}

describe('NumberInput', () => {
  it('formats value with locale grouping when blurred (pt-BR)', () => {
    render(<Harness initial={600000} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    expect(input.value).toBe('600.000');
  });

  it('switches to raw editable value on focus (no group separator)', () => {
    render(<Harness initial={600000} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    expect(input.value).toBe('600000');
  });

  it('shows empty when value is 0 and placeholder is set', () => {
    render(<Harness initial={0} placeholder="0" ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('shows "0" when value is 0 and no placeholder is set', () => {
    render(<Harness initial={0} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    expect(input.value).toBe('0');
  });

  it('updates parent on each keystroke without reformatting (no cursor jump)', () => {
    const onChange = vi.fn();
    render(<Harness initial={0} onChange={onChange} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1234' } });
    expect(input.value).toBe('1234');
    expect(onChange).toHaveBeenLastCalledWith(1234);
  });

  it('does not insert thousand separators while typing', () => {
    render(<Harness initial={0} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1000000' } });
    expect(input.value).toBe('1000000');
  });

  it('formats on blur', () => {
    render(<Harness initial={0} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1000000' } });
    fireEvent.blur(input);
    expect(input.value).toBe('1.000.000');
  });

  it('accepts a comma typed as decimal separator and parses correctly', () => {
    const onChange = vi.fn();
    render(<Harness initial={0} onChange={onChange} ariaLabel="rate" />);
    const input = screen.getByLabelText('rate') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '9,85' } });
    // pt-BR locale: comma is the decimal separator, period is the group separator.
    // "9,85" is parsed as 9.85.
    expect(onChange).toHaveBeenLastCalledWith(9.85);
  });

  it('strips invalid characters during typing', () => {
    render(<Harness initial={0} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '1abc23' } });
    expect(input.value).toBe('123');
  });

  it('rejects negative input when allowNegative is false (default)', () => {
    const onChange = vi.fn();
    render(<Harness initial={0} onChange={onChange} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '-50' } });
    expect(input.value).toBe('50');
    expect(onChange).toHaveBeenLastCalledWith(50);
  });

  it('keeps only the first decimal separator and ignores extras', () => {
    const onChange = vi.fn();
    render(<Harness initial={0} onChange={onChange} ariaLabel="rate" />);
    const input = screen.getByLabelText('rate') as HTMLInputElement;
    fireEvent.focus(input);
    // pt-BR: comma is the decimal separator. Extra commas after the first are ignored.
    fireEvent.change(input, { target: { value: '1,2,3' } });
    expect(onChange).toHaveBeenLastCalledWith(1.23);
  });

  it('strips period when decimals=0 (integer mode)', () => {
    const onChange = vi.fn();
    render(
      <Harness initial={0} onChange={onChange} decimals={0} ariaLabel="age" />
    );
    const input = screen.getByLabelText('age') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '25.7' } });
    expect(input.value).toBe('257');
    expect(onChange).toHaveBeenLastCalledWith(257);
  });

  it('clamps to min on blur', () => {
    const onChange = vi.fn();
    render(
      <Harness initial={0} onChange={onChange} min={10} ariaLabel="amount" />
    );
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it('clamps to max on blur', () => {
    const onChange = vi.fn();
    render(
      <Harness
        initial={0}
        onChange={onChange}
        max={100}
        ariaLabel="amount"
      />
    );
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '500' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it('does NOT clamp during typing (only on blur)', () => {
    const onChange = vi.fn();
    render(
      <Harness
        initial={0}
        onChange={onChange}
        max={100}
        ariaLabel="amount"
      />
    );
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '500' } });
    expect(onChange).toHaveBeenLastCalledWith(500);
    expect(input.value).toBe('500');
  });

  it('selects all text on focus (cursor convenience)', () => {
    render(<Harness initial={1234} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    const selectSpy = vi.spyOn(input, 'select');
    fireEvent.focus(input);
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        expect(selectSpy).toHaveBeenCalled();
        resolve();
      });
    });
  });

  it('normalizes Arabic-Indic digits to ASCII', () => {
    const onChange = vi.fn();
    render(<Harness initial={0} onChange={onChange} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '١٢٣' } });
    expect(onChange).toHaveBeenLastCalledWith(123);
  });

  it('normalizes fullwidth digits to ASCII', () => {
    const onChange = vi.fn();
    render(<Harness initial={0} onChange={onChange} ariaLabel="amount" />);
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '１２３' } });
    expect(onChange).toHaveBeenLastCalledWith(123);
  });

  it('renders prefix and suffix decorations', () => {
    render(
      <Harness initial={1000} prefix="$" suffix="円" ariaLabel="amount" />
    );
    expect(screen.getByText('$')).toBeDefined();
    expect(screen.getByText('円')).toBeDefined();
  });

  it('accepts legacy "unit" prop as suffix', () => {
    render(<Harness initial={1000} unit="円" ariaLabel="amount" />);
    expect(screen.getByText('円')).toBeDefined();
  });

  it('reformats with new precision when decimals prop limits fraction digits', () => {
    const onChange = vi.fn();
    render(
      <Harness
        initial={0}
        onChange={onChange}
        decimals={2}
        ariaLabel="rate"
      />
    );
    const input = screen.getByLabelText('rate') as HTMLInputElement;
    fireEvent.focus(input);
    // pt-BR: comma is the decimal separator. "9,876" rounds to 2 decimals → 9.88.
    fireEvent.change(input, { target: { value: '9,876' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenLastCalledWith(9.88);
    expect(input.value).toBe('9,88');
  });

  it('falls back to last valid value when blurred with empty input', () => {
    const onChange = vi.fn();
    render(
      <Harness initial={500} onChange={onChange} ariaLabel="amount" />
    );
    const input = screen.getByLabelText('amount') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    // 500 was the last valid, but we cleared mid-edit so onChange was not called during typing.
    // On blur with empty draft, we snap to current parent value (500).
    expect(input.value).toBe('500');
  });
});
