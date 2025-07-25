import { useRef, useState, useCallback } from "react";
import { v4 } from "uuid";
import { Container, DropZone, ImagePreview } from "@shared/components/Core/Form/Fields/InputFile/InputFile.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Label } from "@shared/components/Core/Form/Label";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { ReactNode } from "react";

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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
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
  onChange,
  onBlur,
  placeholder = "Clique para selecionar ou arraste uma imagem",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setFileName(file.name);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    } else {
      setFileName("");
      setImagePreview(null);
    }
    onChange?.(e);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled || readOnly) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (inputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        inputRef.current.files = dt.files;
        
        const event = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
      handleFileSelect(file);
    }
  }, [disabled, readOnly, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !readOnly) {
      setIsDragging(true);
    }
  }, [disabled, readOnly]);

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
    if (inputRef.current) {
      inputRef.current.value = "";
      const event = new Event('change', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
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
          disabled={disabled}
          readOnly={readOnly}
          ref={inputRef}
          onChange={handleChange}
          onBlur={onBlur}
          style={{ display: 'none' }}
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
                {isDragging ? "Solte a imagem aqui" : placeholder}
              </span>
              <span className="secondary">
                Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-icon">
            <Icon size="sm" icon="error_outline" mode="warning" appearance="outlined" />
          </div>
        )}
      </DropZone>

      {helperText && <HelperText text={helperText} />}
    </Container>
  );
}