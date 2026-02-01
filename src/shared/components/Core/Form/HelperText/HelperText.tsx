import { Container } from "@shared/components/Core/Form/HelperText/HelperText.styles";

interface Props {
  className?: string;
  text: string;
  error?: boolean;
}

export function HelperText({ className, text, error }: Props) {
  return (
    <Container className={className} $error={error}>
      {text}
    </Container>
  );
}
