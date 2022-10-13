import sharp from "sharp"
import type { Sharp } from "sharp"

import has from "lodash/has"

interface IScalePercent {
    x: number,
    y: number
}

export default((buffer:Buffer, outPath:string, dimensions:IScalePercent, format:string, options: object) => {
    const image = sharp(buffer)
    return new Promise((resolve, reject) => {
        image.metadata((err, metadata) => {
            if (err) reject(err)
            if (!has(metadata, "width")) reject("No metadata on image")
            if (!has(metadata, "format")) reject("Format incompatible")
            let converted: Sharp = image
            const resized = image.resize({
                fit: sharp.fit.cover,
                width: Math.ceil(metadata.width! * dimensions.x * 0.01),
                height: Math.ceil(metadata.height! * dimensions.y * 0.01),
            })
            if (format === "jpeg" || format === "jpg")
                converted = resized.jpeg({...options, force:true})
            if (format === "png")
                converted = resized.png({...options, force:true})
            if (format === "webp")
                converted = resized.webp({...options, force:true})
            if (format === "gif")
                converted = resized.gif({...options, force:true})
            if (format === "jp2")
                converted = resized.jp2({...options, force:true})
            if (format === "tiff")
                converted = resized.tiff({...options, force:true})
            if (format === "avif")
                converted = resized.avif({...options, force:true})
            if (format === "tiff")
                converted = resized.tiff({...options, force:true})
            converted.toFile(outPath, (err, info) => {
                if (err) reject(err)
                if (info) resolve(info)
                reject("No info")
            })
        })
    })
})