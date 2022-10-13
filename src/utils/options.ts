
export type ChromaOpts = "4:4:4" | "4:2:0"


/////////////// JPG
export interface IJPEG_Opts {
    quality: number //1-100
    mozjpeg: boolean
    chromaSubsampling: ChromaOpts
}
export const JPEG_Defaults:IJPEG_Opts = {
    quality: 80,
    mozjpeg: true,
    chromaSubsampling: "4:2:0"
}
export const JPEG_Ranges = {
    quality: { min: 1, max: 100 }
}


/////////////// PNG
export interface IPNG_Opts {
    compressionLevel: number //0-9
    quality: number //1-100
    effort: number //1-10
    dither: number //0-1
}
export const PNG_Defaults:IPNG_Opts = {
    compressionLevel: 9,
    quality: 90,
    effort: 9,
    dither: 0
}
export const PNG_Ranges = {
    compressionLevel: { min: 0, max:9 },
    quality: { min: 1, max: 100 },
    effort: { min:1, max: 10 },
    dither: { min:0, max: 1 }
}


/////////////// WEBP
export interface IWEBP_Opts {
    quality: number //1-100
    alphaQuality: number //0-100
    lossless: boolean //default false
    effort: number //0-6
}
export const WEBP_Defaults:IWEBP_Opts = {
    quality: 90,
    alphaQuality: 90,
    lossless: false,
    effort: 5
}
export const WEBP_Ranges = {
    quality: { min: 1, max: 100 },
    alphaQuality: { min: 1, max: 100 },
    effort: { min: 0, max: 6 }
}


/////////////// GIF
export interface IGIF_Opts {
    effort: number //1-10
    dither: number //0-1
}
export const GIF_Defaults:IGIF_Opts = {
    effort: 9,
    dither: 0.5
}
export const GIF_Ranges = {
    effort: { min: 1, max: 10 },
    dither: { min: 0, max: 1 }
}


/////////////// JP2
export interface IJP2_Opts {
    quality: number //1-100
    lossless: boolean //default false
    chromaSubsampling: ChromaOpts //default 4:4:4, 4:2:0 means "on"
}
export const JP2_Defaults:IJP2_Opts = {
    quality: 90,
    lossless: false,
    chromaSubsampling: "4:2:0"
}
export const JP2_Ranges = {
    quality: { min: 1, max: 100 },
}


/////////////// TIFF
export interface ITIFF_Opts {
    quality: number //1-100
    compression: 
    "none"
    |
    "jpeg"
    |
    "deflate"
    |
    "packbits"
    |
    "ccittfax4"
    |
    "lzw"
    |
    "webp"
    |
    "zstd"
    |
    "jp2k"
}
export const TIFF_Defaults:ITIFF_Opts = {
    quality: 90,
    compression: "jpeg"
}
export const TIFF_Ranges = {
    quality: { min:1, max: 100 },
    compression: [
        "none",
        "jpeg",
        "deflate",
        "packbits",
        "ccittfax4",
        "lzw",
        "webp",
        "zstd",
        "jp2k"
    ]
}


/////////////// AVIF
export interface IAVIF_Opts {
    quality: number //1-100
    lossless: boolean //default false
    effort: number //0-9
    chromaSubsampling: ChromaOpts //default 4:4:4, 4:2:0 means "on"
}
export const AVIF_Defaults:IAVIF_Opts = {
    quality: 90,
    lossless: false,
    effort: 9,
    chromaSubsampling: "4:2:0"
}
export const AVIF_Ranges = {
    quality: { min:1, max: 100 },
    effort: { min:1, max: 9 }
}


/////////////// HEIF
export interface IHEIF_Opts {
    quality: number //1-100
    lossless: boolean //default false
    effort: number //0-9
    compression: "av1" | "hevc"
    chromaSubsampling: ChromaOpts //default 4:4:4, 4:2:0 means "on"
}
export const HEIF_Defaults:IHEIF_Opts = {
    quality: 90,
    lossless: false,
    effort: 9,
    compression: "av1",
    chromaSubsampling: "4:2:0"
}
export const HEIF_Ranges = {
    quality: { min: 0, max: 100 },
    effort: { min: 0, max: 9 },
    compression: ["av1", "hevc"]
}
