export function formatName(name: string) {
  const formattedName = name.split(" ");
  return formattedName.length === 1
    ? name.substring(0, 2)?.toUpperCase()
    : `${formattedName[0]?.substring(0, 1)?.toUpperCase()}${formattedName[1]
        ?.substring(0, 1)
        ?.toUpperCase()}`;
}
