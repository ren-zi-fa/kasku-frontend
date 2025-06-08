import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Control, FieldPath, FieldValues } from "react-hook-form";

type FieldSelectProps<TFormValues extends FieldValues, TItem, TValue = string | number> = {
  name: FieldPath<TFormValues>;
  control: Control<TFormValues>;
  label: string;
  data: TItem[];
  getValue: (item: TItem) => TValue;
  getLabel: (item: TItem) => string;
  placeholder?: string;
  disabled?: boolean;
};

export function FieldSelect<
  TFormValues extends FieldValues,
  TItem,
  TValue = string | number
>({
  name,
  control,
  label,
  data,
  getValue,
  getLabel,
  placeholder = "Pilih opsi",
  disabled = false,
}: FieldSelectProps<TFormValues, TItem, TValue>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={String(field.value)}
            onValueChange={(val) => {
              // Temukan item berdasarkan value string yang dipilih
              const selected = data.find((item) => String(getValue(item)) === val);
              if (selected) {
                field.onChange(getValue(selected));
              }
            }}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item, index) => {
                const value = getValue(item);
                return (
                  <SelectItem key={index} value={String(value)}>
                    {getLabel(item)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

