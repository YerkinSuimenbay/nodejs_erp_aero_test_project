export function getFileExtension(fullName: string) {
  const parts = fullName.split(".");
  return parts[parts.length - 1];
}
