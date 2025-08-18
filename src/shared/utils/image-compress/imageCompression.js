import imageCompression from "browser-image-compression";

/**
 * Função universal para comprimir imagens
 * @param {File|string} input - Arquivo de imagem ou DataURI
 * @param {Object} options - Opções de compressão
 * @returns {Promise<string>} - DataURI da imagem comprimida
 */
export const comprimirImagem = async (input, options = {}) => {
  try {
    // Opções padrão otimizadas para mobile
    const defaultOptions = {
      maxSizeMB: 1, // Máximo 1MB
      maxWidthOrHeight: 1920, // Máximo 1920px na maior dimensão
      useWebWorker: true, // Usar worker para não travar UI
      quality: 0.8, // 80% de qualidade
      initialQuality: 0.8, // Qualidade inicial
      alwaysKeepResolution: false, // Permitir redimensionar
      exifOrientation: 1, // Manter orientação
      fileType: "image/jpeg", // Sempre salvar como JPEG
      ...options // Sobrescrever com opções customizadas
    };

    let fileToCompress;

    // Se input é um DataURI, converter para File
    if (typeof input === "string") {
      console.log("📸 Convertendo DataURI para File...");
      fileToCompress = await dataURItoFile(input);
    } else if (input instanceof File) {
      console.log("📁 Processando arquivo:", input.name);
      fileToCompress = input;
    } else {
      throw new Error("Input deve ser um File ou DataURI");
    }

    // Log do tamanho original
    const originalSizeMB = fileToCompress.size / 1024 / 1024;
    console.log(`🔍 Tamanho original: ${originalSizeMB.toFixed(2)} MB`);

    // Se já está menor que o limite, só otimizar qualidade
    if (originalSizeMB <= defaultOptions.maxSizeMB) {
      console.log("✅ Imagem já está no tamanho ideal, apenas otimizando...");
      defaultOptions.maxSizeMB = originalSizeMB * 0.8; // Reduzir um pouco
    }

    // Comprimir imagem
    console.log("⚡ Iniciando compressão...");
    const compressedFile = await imageCompression(
      fileToCompress,
      defaultOptions
    );

    // Log do resultado
    const compressedSizeMB = compressedFile.size / 1024 / 1024;
    const reduction =
      ((originalSizeMB - compressedSizeMB) / originalSizeMB) * 100;

    console.log(`✨ Compressão concluída!`);
    console.log(`📉 Tamanho final: ${compressedSizeMB.toFixed(2)} MB`);
    console.log(`🎯 Redução: ${reduction.toFixed(1)}%`);

    // Converter resultado para DataURI
    const dataURI = await fileToDataURI(compressedFile);

    console.log("🎉 Conversão para DataURI concluída");
    return dataURI;
  } catch (error) {
    console.error("❌ Erro na compressão:", error);

    // Se falhar, retornar original (se for DataURI) ou erro
    if (typeof input === "string") {
      console.log("🔄 Retornando imagem original devido ao erro");
      return input;
    }

    throw new Error(`Falha na compressão: ${error.message}`);
  }
};

/**
 * Converter DataURI para File
 * @param {string} dataURI
 * @param {string} filename
 * @returns {File}
 */
const dataURItoFile = (dataURI, filename = "image.jpg") => {
  const arr = dataURI.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

/**
 * Converter File para DataURI
 * @param {File} file
 * @returns {Promise<string>}
 */
const fileToDataURI = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ========== PRESETS DE USO ==========

/**
 * Preset para documentos (RG, CNH, etc.)
 */
export const comprimirDocumento = input => {
  return comprimirImagem(input, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1920,
    quality: 0.85,
    fileType: "image/jpeg"
  });
};

/**
 * Preset para foto de perfil
 */
export const comprimirFotoPerfil = input => {
  return comprimirImagem(input, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    quality: 0.8,
    fileType: "image/jpeg"
  });
};

/**
 * Preset para comprovante de residência
 */
export const comprimirComprovante = input => {
  return comprimirImagem(input, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    quality: 0.9, // Maior qualidade para textos
    fileType: "image/jpeg"
  });
};

/**
 * Preset para upload rápido (conexão lenta)
 */
export const comprimirUploadRapido = input => {
  return comprimirImagem(input, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1280,
    quality: 0.7,
    fileType: "image/jpeg"
  });
};
