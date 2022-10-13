export interface IFormat {
    name: string
    extensions: string[]
}
export const jpg:IFormat = {
    name: "JPEG",
    extensions: ["jpg", "jpeg"]
}
export const png:IFormat = {
    name: "PNG",
    extensions: ["png"]
}
export const webp:IFormat = {
    name: "WEBP",
    extensions: ["webp"]
}
export const gif:IFormat = {
    name: "GIF",
    extensions: ["gif"]
}
export const jp2:IFormat = {
    name: "JP2",
    extensions: ["jp2"]
}
export const tiff:IFormat = {
    name: "TIFF",
    extensions: ["tiff"]
}
export const avif:IFormat = {
    name: "AVIF",
    extensions: ["avif"]
}
export const heif:IFormat = {
    name: "HEIF",
    extensions: ["heif"]
}