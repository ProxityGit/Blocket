export const extraerPlaceholders = (texto) => {
  const matches = texto.match(/{{(.*?)}}/g);
  return matches ? matches.map((x) => x.replace(/[{}]/g, "")) : [];
};
