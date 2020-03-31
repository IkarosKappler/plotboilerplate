
const getGlobal = () => {
    return (typeof window !== 'undefined' ? window : this);
};
