export class ColorUtils {
  public static getContrastYIQ(hexcolor: string) {
    const r = parseInt(hexcolor?.substring(1, 3), 16);
    const g = parseInt(hexcolor?.substring(3, 5), 16);
    const b = parseInt(hexcolor?.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? '#000' : '#fff';
  }

  public hexToHSL(hex: string): [number, number, number] {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const normalizedR = r / 255;
    const normalizedG = g / 255;
    const normalizedB = b / 255;
    const max = Math.max(normalizedR, normalizedG, normalizedB);
    const min = Math.min(normalizedR, normalizedG, normalizedB);
    const lightness = (max + min) / 2;
    let saturation = 0;
    if (max !== min) {
      saturation =
        lightness <= 0.5
          ? (max - min) / (max + min)
          : (max - min) / (2.0 - max - min);
    }
    let hue = 0;
    if (max !== min) {
      if (max === normalizedR) {
        hue =
          (normalizedG - normalizedB) / (max - min) +
          (normalizedG < normalizedB ? 6 : 0);
      } else if (max === normalizedG) {
        hue = (normalizedB - normalizedR) / (max - min) + 2;
      } else {
        hue = (normalizedR - normalizedG) / (max - min) + 4;
      }

      hue *= 60;
    }

    return [
      Math.round(hue),
      Math.round(saturation * 100),
      Math.round(lightness * 100),
    ];
  }
}
