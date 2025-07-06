import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import * as S from "@shared/components/Core/Toast/Message/Message.styles";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { useToastContext } from "@shared/contexts/Toast";
import { IToastMessage, IToastType } from "@shared/contexts/Toast/Toast.interface";
import { useEffect } from "react";
import { SpringValue } from "react-spring";

interface Props {
  message: IToastMessage;
  style?: {
    opacity: SpringValue<string>;
  };
}

export function Message({ message, style }: Props) {
  const { removeToast } = useToastContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message, removeToast]);

  function handleIcon(icon: IToastType) {
    switch (icon) {
      case "success":
        return "done";

      case "helper":
        return "warning";

      case "warning":
        return "error";

      default:
        return "";
    }
  }

  return (
    <S.Container type={message.type} style={style}>
      <div className="icon">
        <span className="material-icons">{handleIcon(message.type)}</span>
      </div>

      <div className="text">
        <div className="heading">
          <Heading size="sm" className="text-neutral-high-pure">
            {message.title}
          </Heading>
        </div>

        {message.description && (
          <Paragraph size="sm" className="text-neutral-high-medium">
            {message.description}
          </Paragraph>
        )}
      </div>

      <div className="close">
        <ButtonIcon
          size="sm"
          icon="close"
          onClick={() => {
            removeToast(message.id);
          }}
        />
      </div>
    </S.Container>
  );
}
