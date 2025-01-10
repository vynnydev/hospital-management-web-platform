// Verifica se a string base64 é válida
export const isValidBase64Image = (url: string) => {
    if (!url) return false;

    // Verifica se é uma URL de dados válida
    if (!url.startsWith('data:')) return false;

    // Verifica se tem o formato correto
    const matches = url.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return false;

    // Verifica se o tipo MIME é válido
    const validMimeTypes = [
        'application/octet-stream',
        'image/png',
        'image/jpeg',
        'image/jpg'
    ];

    return validMimeTypes.includes(matches[1]);
};
    
// Converte octet-stream para image/png
export const convertToImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (!isValidBase64Image(url)) {
        console.error('URL inválida recebida:', url.substring(0, 100) + '...');
        return '';
    }

    try {
        // Remove o prefixo atual e adiciona o novo
        const base64Data = url.replace(/^data:.*?;base64,/, '');
        const newUrl = `data:image/png;base64,${base64Data}`;
        
        // Verifica se a URL convertida é válida
        if (!isValidBase64Image(newUrl)) {
        throw new Error('URL convertida inválida');
        }
        
        return newUrl;
    } catch (error) {
        console.error('Erro ao converter URL:', error);
        return '';
    }
};

// Converte Blob para base64
export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
            resolve(reader.result as string); // A string base64 será retornada
        };
        
        reader.onerror = (error) => {
            reject(error); // Em caso de erro, o erro é retornado
        };
        
        reader.readAsDataURL(blob); // Lê o Blob e converte para base64
    });
};
