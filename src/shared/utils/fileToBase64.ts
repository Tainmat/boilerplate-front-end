/**
 * Converte um arquivo File para base64
 * @param file - Arquivo a ser convertido
 * @returns Promise<string> - String base64 do arquivo
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Remove o prefixo "data:image/...;base64," para enviar apenas o base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Converte múltiplos arquivos File para base64
 * @param files - Array de arquivos a serem convertidos
 * @returns Promise<string[]> - Array de strings base64
 */
export const filesToBase64 = async (files: File[]): Promise<string[]> => {
  const base64Promises = files.map(file => fileToBase64(file));
  return Promise.all(base64Promises);
};