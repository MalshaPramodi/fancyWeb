import { paymentConfig } from '../config/payment.ts'

export function slipMime(file: Pick<File, 'name'>) {
  if (/\.jpe?g$/i.test(file.name)) return 'image/jpeg'
  if (/\.png$/i.test(file.name)) return 'image/png'
  if (/\.pdf$/i.test(file.name)) return 'application/pdf'
  return null
}
export function validateSlipFile(file: Pick<File, 'name' | 'size' | 'type'>) {
  const mime = slipMime(file)
  if (!mime || (file.type && file.type !== mime))
    return paymentConfig.errors.type
  if (file.size === 0) return paymentConfig.errors.empty
  if (file.size > paymentConfig.upload.maxInputBytes)
    return paymentConfig.errors.tooLarge
  if (
    mime === 'application/pdf' &&
    file.size > paymentConfig.upload.maxUploadBytes
  )
    return paymentConfig.errors.pdfLarge
  return null
}
export function validSlipHeader(bytes: Uint8Array, mime: string) {
  const expected =
    mime === 'image/jpeg'
      ? [0xff, 0xd8, 0xff]
      : mime === 'image/png'
        ? [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
        : mime === 'application/pdf'
          ? [0x25, 0x50, 0x44, 0x46, 0x2d]
          : []
  return expected.length > 0 && expected.every((byte, i) => bytes[i] === byte)
}
export const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.ceil(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`

export async function prepareSlip(file: File): Promise<File> {
  const error = validateSlipFile(file)
  if (error) throw new Error(error)
  const mime = slipMime(file)!
  if (
    !validSlipHeader(new Uint8Array(await file.slice(0, 8).arrayBuffer()), mime)
  )
    throw new Error(paymentConfig.errors.type)
  if (mime === 'application/pdf')
    return new File([file], file.name, {
      type: mime,
      lastModified: file.lastModified,
    })
  const source = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = source
    try {
      await image.decode()
    } catch {
      throw new Error(paymentConfig.errors.image)
    }
    if (!image.naturalWidth || !image.naturalHeight)
      throw new Error(paymentConfig.errors.image)
    if (file.size <= paymentConfig.upload.maxUploadBytes)
      return new File([file], file.name, {
        type: mime,
        lastModified: file.lastModified,
      })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error(paymentConfig.errors.compression)
    const original = Math.max(image.naturalWidth, image.naturalHeight)
    for (
      let dimension = Math.min(original, paymentConfig.upload.maxDimension);
      dimension >= Math.min(original, paymentConfig.upload.minDimension);
      dimension = Math.floor(dimension * paymentConfig.upload.resizeFactor)
    ) {
      canvas.width = Math.max(
        1,
        Math.round((image.naturalWidth * dimension) / original),
      )
      canvas.height = Math.max(
        1,
        Math.round((image.naturalHeight * dimension) / original),
      )
      context.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--slip-paper-color')
        .trim()
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      for (const quality of paymentConfig.upload.qualities) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', quality),
        )
        if (blob && blob.size <= paymentConfig.upload.maxUploadBytes)
          return new File(
            [blob],
            `${file.name.replace(/\.[^.]+$/, '')}-prepared.jpg`,
            { type: 'image/jpeg', lastModified: file.lastModified },
          )
      }
    }
    throw new Error(paymentConfig.errors.compression)
  } finally {
    URL.revokeObjectURL(source)
  }
}
