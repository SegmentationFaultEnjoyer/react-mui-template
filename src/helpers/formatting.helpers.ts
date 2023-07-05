export function formatFileSize(sizeInBytes: number) {
  const kilobyte = 1024
  const megabyte = kilobyte * 1024

  if (sizeInBytes > megabyte) {
    return (sizeInBytes / megabyte).toFixed(2) + ' MB'
  } else if (sizeInBytes > kilobyte) {
    return (sizeInBytes / kilobyte).toFixed(2) + ' KB'
  } else {
    return sizeInBytes + ' bytes'
  }
}
