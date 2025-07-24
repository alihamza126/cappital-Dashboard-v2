// localStorage load in reudx to persist the user data
export const loadLocalStorageState = () => {
    try {
        const serializedState = localStorage.getItem('user');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

