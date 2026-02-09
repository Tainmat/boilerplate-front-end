import {
  Container,
  DropZone,
  ImagePreview,
} from "@shared/components/Core/Form/Fields/InputFile/InputFile.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Label } from "@shared/components/Core/Form/Label";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

interface Props {
  size?: "sm" | "lg";
  label?: string;
  tooltip?: string;
  name: string;
  accept?: string;
  addonText?: string | number | ReactNode;
  addonPlacement?: "left" | "right";
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  placeholder?: string;
  value?: string;
}

export function InputFile({
  size,
  label,
  tooltip,
  name,
  accept = "image/*",
  addonText,
  addonPlacement,
  error,
  helperText,
  readOnly,
  disabled,
  multiple = false,
  onChange,
  onBlur,
  onRemove,
  placeholder = "Clique para selecionar ou arraste uma imagem",
  value,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const buildImageUrl = (imagePath: string): string => {
    // Se já é uma URL completa ou base64, usar diretamente
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    // Se contém o caminho completo do servidor, extrair apenas a parte relevante
    if (imagePath.includes("/assets/public/")) {
      const assetPath = imagePath.split("/assets/public/")[1];
      const url = `https://qas-usincheck.jometto.com.br/assets/public/${assetPath}`;
      return url;
    }

    // Fallback para outros casos
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    const url = `https://qas-usincheck.jometto.com.br${cleanPath}`;
    return url;
  };

  useEffect(() => {
    if (value && value.trim() !== "") {
      const imageUrl = buildImageUrl(value);
      setImagePreview(imageUrl);
      setFileName("Imagem carregada");
      setFileCount(1);
    } else {
      setImagePreview(null);
      setFileName("");
      setFileCount(0);
    }
  }, [value, name]);

  const handleFileSelect = useCallback(
    (files: FileList | File) => {
      if (multiple && files instanceof FileList) {
        const fileArray = Array.from(files);
        setFileCount(fileArray.length);
        setFileName(
          fileArray.length === 1 ? fileArray[0].name : `${fileArray.length} arquivos selecionados`,
        );

        // Create preview for first image if multiple
        if (fileArray[0] && fileArray[0].type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
          };
          reader.readAsDataURL(fileArray[0]);
        } else {
          setImagePreview(null);
        }
      } else if (!multiple && files instanceof File) {
        setFileName(files.name);
        setFileCount(1);

        // Create preview for images
        if (files.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
          };
          reader.readAsDataURL(files);
        } else {
          setImagePreview(null);
        }
      }
    },
    [multiple],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files);
      } else {
        setFileName("");
        setImagePreview(null);
        setFileCount(0);
      }
    } else {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      } else {
        setFileName("");
        setImagePreview(null);
        setFileCount(0);
      }
    }
    onChange?.(e);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || readOnly) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        if (inputRef.current) {
          const dt = new DataTransfer();
          if (multiple) {
            Array.from(files).forEach((file) => dt.items.add(file));
          } else {
            dt.items.add(files[0]);
          }
          inputRef.current.files = dt.files;

          const event = new Event("change", { bubbles: true });
          inputRef.current.dispatchEvent(event);
        }
        handleFileSelect(multiple ? files : files[0]);
      }
    },
    [disabled, readOnly, handleFileSelect, multiple],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled && !readOnly) {
        setIsDragging(true);
      }
    },
    [disabled, readOnly],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    if (!disabled && !readOnly) {
      inputRef.current?.click();
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    setImagePreview(null);
    setFileCount(0);
    if (inputRef.current) {
      inputRef.current.value = "";
      const event = new Event("change", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
    onRemove?.();
  };

  return (
    <Container
      size={size}
      addonPlacement={addonText ? addonPlacement || "left" : undefined}
      hasValue={!!fileName}
      error={error}
      readOnly={readOnly}
      disabled={disabled}
    >
      {label && (
        <Label htmlFor={name} tooltip={tooltip} size={size}>
          {label}
        </Label>
      )}

      <DropZone
        isDragging={isDragging}
        hasFile={!!fileName}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          id={v4()}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          readOnly={readOnly}
          ref={inputRef}
          onChange={handleChange}
          onBlur={onBlur}
          style={{ display: "none" }}
        />

        {imagePreview ? (
          <ImagePreview>
            <img src={imagePreview} alt="Preview" />
            <div className="overlay">
              <div className="file-info">
                <Icon icon="image" size="sm" />
                <span>{fileName}</span>
              </div>
              <button
                type="button"
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <Icon icon="close" size="sm" />
              </button>
            </div>
          </ImagePreview>
        ) : (
          <div className="drop-content">
            <Icon
              icon={isDragging ? "file_upload" : "cloud_upload"}
              size="lg"
              mode={isDragging ? "success" : "neutral"}
            />
            <div className="text">
              <span className="primary">
                {isDragging
                  ? multiple
                    ? "Solte as imagens aqui"
                    : "Solte a imagem aqui"
                  : placeholder}
              </span>
              <span className="secondary">
                Formatos aceitos: JPG, PNG, GIF (máx. 5MB{multiple ? " cada" : ""})
              </span>
              {multiple && fileCount > 1 && (
                <span className="secondary">
                  {fileCount} {fileCount === 1 ? "arquivo" : "arquivos"} selecionado
                  {fileCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="error-icon">
            <Icon size="sm" icon="error_outline" mode="warning" appearance="outlined" />
          </div>
        )}
      </DropZone>

      {helperText && <HelperText text={helperText} error={error} />}
    </Container>
  );
}
