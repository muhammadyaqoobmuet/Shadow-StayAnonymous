export const convertToMeters = (distance: number, unit: string) => {
  const conversions = {
    km: (d: number) => d * 1000,
    miles: (d: number) => d * 1609.34,
    meters: (d: number) => d,
    m: (d: number) => d
  };
  //@ts-ignore
  return conversions[unit] ? conversions[unit](distance) : distance;
};