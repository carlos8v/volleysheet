export const classnames = (props: Record<string, boolean>): string => {
  const classes = [];

  for (const [key, value] of Object.entries(props)) {
    if (value) classes.push(key);
  }

  return classes.join(" ");
};
