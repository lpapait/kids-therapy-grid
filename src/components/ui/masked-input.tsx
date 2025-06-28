
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCPF, formatPhone, formatCEP } from "@/lib/inputMasks";

export interface MaskedInputProps
  extends React.ComponentProps<"input"> {
  mask: 'cpf' | 'phone' | 'cep';
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let formattedValue = e.target.value;
      
      switch (mask) {
        case 'cpf':
          formattedValue = formatCPF(e.target.value);
          break;
        case 'phone':
          formattedValue = formatPhone(e.target.value);
          break;
        case 'cep':
          formattedValue = formatCEP(e.target.value);
          break;
      }
      
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange?.(syntheticEvent);
    };

    return (
      <Input
        className={cn(className)}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
