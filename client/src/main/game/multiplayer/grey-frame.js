// The canvas renderer can't tint, so build a greyscale copy of an atlas frame once
// and return its texture key.
export default function getGreyFrame(scene, atlas, frame_name) {
  const key = `grey:${atlas}:${frame_name}`
  if (scene.textures.exists(key)) return key

  const frame = scene.textures.getFrame(atlas, frame_name)
  const { cutX, cutY, cutWidth, cutHeight } = frame
  const texture = scene.textures.createCanvas(key, cutWidth, cutHeight)
  const context = texture.getContext()
  context.drawImage(frame.source.image, cutX, cutY, cutWidth, cutHeight, 0, 0, cutWidth, cutHeight)

  const image_data = context.getImageData(0, 0, cutWidth, cutHeight)
  const pixels = image_data.data
  for (let i = 0; i < pixels.length; i += 4) {
    const grey = 0.3 * pixels[i] + 0.59 * pixels[i + 1] + 0.11 * pixels[i + 2]
    pixels[i] = pixels[i + 1] = pixels[i + 2] = grey
  }
  context.putImageData(image_data, 0, 0)
  texture.refresh()

  return key
}
