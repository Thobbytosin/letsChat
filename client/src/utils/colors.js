export const colors = [
  "border-[#ffa500] ",
  "border-[#e30b5d]",
  "border-[#1aa260] ",
  "border-[#0002ff]",
];
export const colorsBg = [
  "bg-[#ffa500] ",
  "bg-[#e30b5d]",
  "bg-[#1aa260] ",
  "bg-[#0002ff]",
];

export const colorsCodes = ["#ffa500 ", "#e30b5d", "#1aa260 ", "#0002ff"];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
};
