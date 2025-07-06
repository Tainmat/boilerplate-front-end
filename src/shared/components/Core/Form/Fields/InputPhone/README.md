# InputPhone Component

A comprehensive phone number input component with validation, formatting, and support for multiple countries.

## Features

- **Real-time formatting**: Applies phone number mask as the user types
- **Validation**: Validates phone numbers based on country-specific rules
- **Multiple countries**: Supports Brazilian (BR) and US phone number formats
- **Phone type detection**: Identifies mobile vs landline numbers
- **Visual feedback**: Shows validation icons and phone type information
- **Accessibility**: Proper ARIA labels and semantic HTML

## Usage

### Basic Usage

```tsx
import { InputPhone } from '@shared/components/Core/Form/Fields/InputPhone';

function MyForm() {
  const [phone, setPhone] = useState('');

  return (
    <InputPhone
      label="Telefone"
      name="phone"
      value={phone}
      onChange={(e, phoneData) => {
        setPhone(e.target.value);
        console.log('Phone data:', phoneData);
      }}
    />
  );
}
```

### With Validation

```tsx
<InputPhone
  label="Telefone"
  name="phone"
  country="BR"
  showValidation={true}
  showPhoneType={true}
  onValidationChange={(isValid, phoneData) => {
    console.log('Is valid:', isValid);
    console.log('Phone type:', phoneData.type);
  }}
/>
```

### US Phone Numbers

```tsx
<InputPhone
  label="Phone Number"
  name="phone"
  country="US"
  placeholder="(555) 123-4567"
  showValidation={true}
/>
```

### With Formik

```tsx
import { Field } from 'formik';

<Field
  as={InputPhone}
  label="Telefone"
  name="phone"
  country="BR"
  showValidation={true}
  showPhoneType={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `name` | `string` | - | Input name attribute |
| `value` | `string` | - | Input value |
| `country` | `'BR' \| 'US'` | `'BR'` | Country format for phone validation |
| `showValidation` | `boolean` | `true` | Show validation icons |
| `showPhoneType` | `boolean` | `false` | Show phone type in helper text |
| `placeholder` | `string` | - | Input placeholder |
| `error` | `boolean` | `false` | Show error state |
| `helperText` | `string` | - | Helper text below input |
| `readOnly` | `boolean` | `false` | Make input read-only |
| `disabled` | `boolean` | `false` | Disable input |
| `size` | `'sm' \| 'lg'` | `'lg'` | Input size |
| `onChange` | `function` | - | Change handler with phone data |
| `onValidationChange` | `function` | - | Validation change handler |

## Phone Data Object

The `onChange` and `onValidationChange` callbacks receive a phone data object:

```typescript
interface PhoneNumberResult {
  formatted: string;    // "(11) 99999-9999"
  raw: string;         // "11999999999"
  isValid: boolean;    // true/false
  type: PhoneType;     // "MOBILE" | "LANDLINE" | "UNKNOWN"
  country: CountryCode; // "BR" | "US"
}
```

## Validation Rules

### Brazilian Numbers
- **Mobile**: 11 digits, 3rd digit must be 9 (e.g., 11999999999)
- **Landline**: 10 digits (e.g., 1133334444)

### US Numbers
- **All numbers**: 10 digits (e.g., 5551234567)

## Styling

The component uses the same styling system as other form inputs and supports:
- Error states with red border and validation icons
- Success states with green validation icons
- Disabled and read-only states
- Size variants (sm, lg)

## Accessibility

- Proper `type="tel"` for mobile keyboards
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly validation messages