import { WebContainer } from '@webcontainer/api';

let webcontainerInstance = null;
let isInitializing = false;

export const getWebContainer = async () => {
    if (isInitializing) {
        // Wait for initialization to complete
        while (isInitializing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return webcontainerInstance;
    }
 
    if (!webcontainerInstance) {
        isInitializing = true;
        try {
            webcontainerInstance = await WebContainer.boot();
            console.log("WebContainer booted successfully");
        } catch (error) {
            console.error("Error booting WebContainer:", error);
            webcontainerInstance = null;
            throw error;
        } finally {
            isInitializing = false;
        }
    }
    return webcontainerInstance;
};
