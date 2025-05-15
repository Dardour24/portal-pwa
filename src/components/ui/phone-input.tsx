import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";
import { cn } from "@/lib/utils";

const countryCodes = [
  { code: "FR", dialCode: "+33", name: "France" },
  { code: "BE", dialCode: "+32", name: "Belgique" },
  { code: "CH", dialCode: "+41", name: "Suisse" },
  { code: "CA", dialCode: "+1", name: "Canada" },
  { code: "MA", dialCode: "+212", name: "Maroc" },
  { code: "SN", dialCode: "+221", name: "Sénégal" },
  { code: "CI", dialCode: "+225", name: "Côte d'Ivoire" },
  { code: "CM", dialCode: "+237", name: "Cameroun" },
  { code: "DZ", dialCode: "+213", name: "Algérie" },
  { code: "TN", dialCode: "+216", name: "Tunisie" },
];

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, defaultCountry = "FR", ...props }, ref) => {
    const [selectedCountry, setSelectedCountry] = React.useState(
      countryCodes.find((c) => c.code === defaultCountry) || countryCodes[0]
    );

    const handleCountryChange = (countryCode: string) => {
      const country = countryCodes.find((c) => c.code === countryCode);
      if (country) {
        setSelectedCountry(country);
        // Update the full phone number with new country code
        const numberWithoutCode = value.replace(/^\+\d+/, "");
        onChange(country.dialCode + numberWithoutCode);
      }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = e.target.value.replace(/\D/g, "");
      onChange(selectedCountry.dialCode + number);
    };

    // Extract the number part from the full phone number
    const numberValue = value.replace(selectedCountry.dialCode, "");

    return (
      <div className={cn("flex gap-2", className)}>
        <Select
          value={selectedCountry.code}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Pays" />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name} ({country.dialCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          {...props}
          ref={ref}
          type="tel"
          value={numberValue}
          onChange={handleNumberChange}
          className="flex-1"
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
