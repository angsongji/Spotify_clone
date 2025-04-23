// hooks/useColorUtils.js
export function useColorUtils() {
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        if (hex.length !== 6) {
            throw new Error("Mã màu HEX không hợp lệ");
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
    }

    function darkenColor(r, g, b, factor = 0.7) {
        return {
            r: Math.round(r * factor),
            g: Math.round(g * factor),
            b: Math.round(b * factor),
        };
    }

    function generateLinearGradient(hex, opacityStart = 1, opacityEnd = 0.5, angle = 50) {
        const { r, g, b } = hexToRgb(hex);
        const { r: dr, g: dg, b: db } = darkenColor(r, g, b, 0.8);
        return `linear-gradient(${angle}deg, 
        rgba(${r}, ${g}, ${b}, ${opacityStart}), 
        rgba(${dr}, ${dg}, ${db}, ${opacityEnd}))`;
    }

    return { hexToRgb, darkenColor, generateLinearGradient };
}
