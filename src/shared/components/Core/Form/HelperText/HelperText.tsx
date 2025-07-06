import { Container } from "@shared/components/Core/Form/HelperText/HelperText.styles";

interface Props {
  className?: string;
  text: string;
}

export function HelperText({ className, text }: Props) {
  return <Container className={className}>{text}</Container>;
}
