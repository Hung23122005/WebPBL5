export async function base64ToFile(
  base64: string,
  filename = "cropped.jpg",
): Promise<File> {
  const response = await fetch(`data:image/jpeg;base64,${base64}`);
  const blob = await response.blob();
  return new File([blob], filename, { type: "image/jpeg" });
}
