import { Container } from "@shared/components/Core/Form/Label/Label.styles";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";

interface Props {
  htmlFor?: string;
  size?: "sm" | "lg";
  tooltip?: string;
  children: string;
}

export function Label({ htmlFor, size, tooltip, children }: Props) {
  return (
    <Container className="form-label" size={size} htmlFor={htmlFor}>
      {size === "sm" ? (
        <>
          <Paragraph size="sm">{children}</Paragraph>

          {tooltip && (
            <Tooltip place="top" title={tooltip}>
              <Icon size="sm" icon="info" />
            </Tooltip>
          )}
        </>
      ) : (
        <div>
          <Heading size="xs">{children}</Heading>

          {tooltip && (
            <Tooltip place="top" title={tooltip}>
              <Icon size="sm" icon="info" />
            </Tooltip>
          )}
        </div>
      )}
    </Container>
  );
}
