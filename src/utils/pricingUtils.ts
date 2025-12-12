export const calculateFinalPrice = (basePrice: number): number => {
    let rate = 0.10;
    if (basePrice >= 10000) {
        rate = 0.07;
    }
    const withMarkup = basePrice * (1 + rate);
    // Logic: Floor to nearest 10, then add 9. (e.g., 5500 -> 5509, 5504 -> 5509)
    return Math.floor(withMarkup / 10) * 10 + 9;
};