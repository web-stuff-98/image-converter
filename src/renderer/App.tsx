import './globals.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import {
  jpg,
  png,
  webp,
  gif,
  jp2,
  tiff,
  avif,
  heif,
  IFormat,
} from 'utils/formats';

import {
  JPEG_Defaults,
  JPEG_Ranges,
  PNG_Defaults,
  PNG_Ranges,
  WEBP_Defaults,
  WEBP_Ranges,
  GIF_Defaults,
  GIF_Ranges,
  JP2_Defaults,
  JP2_Ranges,
  TIFF_Defaults,
  TIFF_Ranges,
  AVIF_Defaults,
  AVIF_Ranges,
  HEIF_Defaults,
  HEIF_Ranges,
} from 'utils/options';

import capitalize from 'lodash/capitalize';

import classes from './App.module.scss';

interface IFile {
  file: File;
  id: string;
}

interface IConverting {
  converting: boolean;
  converted: string[];
}

const App = () => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [outputDir, setOutputDir] = useState<string>('./out/');

  const [converting, setConverting] = useState<IConverting>({
    converting: false,
    converted: [],
  });
  const [resMsg, setResMsg] = useState({ msg: '', err: false, pending: false });

  useEffect(() => {
    if (!window) return;
    window.electron.ipcRenderer.on('ipc', (args: any) => {
      if (args.action === 'image-converted') {
        setConverting((old: any) => ({
          converted: [...old.converted, args.data.id],
          converting: old.converted.length !== files.length,
        }));
      }
      if (args.action === 'error') {
        setResMsg({msg:args.data.msg,err:true,pending:false})
        setConverting({
          converted: [],
          converting: false,
        });
      }
    });
  }, [window]);

  const fileListItem = (
    fileData: IFile,
    index: number,
    converting: boolean
  ) => {
    return (
      <>
        {index + 1} | {fileData.file.name}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {converting && 'Converting image...'}
          <input
            checked={selected.includes(fileData.id)}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (!selected.includes(fileData.id))
                setSelected([...selected, fileData.id]);
              else
                setSelected(
                  selected.filter((id: string) => id !== fileData.id)
                );
            }}
            type="checkbox"
          />
        </div>
      </>
    );
  };

  const convertImages = () => {
    window.electron.ipcRenderer.sendMessage('ipc', {
      action: 'files',
      data: {
        options: formatOptions.options,
        format: formatString,
        dimensions: dimensionsPercent,
        // @ts-ignore-error
        fileData: files
          .filter((fileData: IFile) => selected.includes(fileData.id))
          .map((fileData: IFile) => ({
            filePath: String(fileData.file?.path),
            id: fileData.id,
          })),
        outputDir,
      },
    });
    setConverting({ converting: true, converted: [] });
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files![0]) return;
    const out: IFile[] = Array.from(e.target.files!).map((file: File) => ({
      file,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    }));
    setFiles((old) => [
      ...old,
      ...out.filter((fileData: IFile) => !old.includes(fileData)),
    ]);
  };
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const [formatString, setFormatString] = useState('jpg');
  const [format, setFormat] = useState<IFormat>(jpg);
  const handleFormat = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setFormatString(e.target.value);
    if (e.target.value === 'jpg') {
      setFormat(jpg);
      setFormatOptions({ options: JPEG_Defaults, ranges: JPEG_Ranges });
    }
    if (e.target.value === 'png') {
      setFormat(png);
      setFormatOptions({ options: PNG_Defaults, ranges: PNG_Ranges });
    }
    if (e.target.value === 'webp') {
      setFormat(webp);
      setFormatOptions({ options: WEBP_Defaults, ranges: WEBP_Ranges });
    }
    if (e.target.value === 'gif') {
      setFormat(gif);
      setFormatOptions({ options: GIF_Defaults, ranges: GIF_Ranges });
    }
    if (e.target.value === 'jp2') {
      setFormat(jp2);
      setFormatOptions({ options: JP2_Defaults, ranges: JP2_Ranges });
    }
    if (e.target.value === 'tiff') {
      setFormat(tiff);
      setFormatOptions({ options: TIFF_Defaults, ranges: TIFF_Ranges });
    }
    if (e.target.value === 'avif') {
      setFormat(avif);
      setFormatOptions({ options: AVIF_Defaults, ranges: AVIF_Ranges });
    }
    if (e.target.value === 'heif') {
      setFormat(heif);
      setFormatOptions({ options: HEIF_Defaults, ranges: HEIF_Ranges });
    }
  };

  const [dimensionsPercent, setDimensionsPercent] = useState({
    x: 100,
    y: 100,
  });
  const [fitString, setFitString] = useState('cover');
  const handleX = (e: ChangeEvent<HTMLInputElement>) =>
    setDimensionsPercent({
      x: Math.min(1000, Math.max(Number(e.target.value), 0)),
      y: dimensionsPercent.y,
    });
  const handleY = (e: ChangeEvent<HTMLInputElement>) =>
    setDimensionsPercent({
      x: dimensionsPercent.x,
      y: Math.min(1000, Math.max(Number(e.target.value), 0)),
    });
  const handleFit = (e: ChangeEvent<HTMLSelectElement>) =>
    setFitString(e.target.value);

  const [formatOptions, setFormatOptions] = useState<any>({
    options: JPEG_Defaults,
    ranges: JPEG_Ranges,
  });
  const renderFormatOptions = (key: string, type: any) => {
    const renderInput = () => {
      if (key === 'chromaSubsampling') {
        return (
          <select
            value={formatOptions.options[key]}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setFormatOptions({
                options: { ...formatOptions.options, [key]: e.target.value },
                ranges: { ...formatOptions.ranges },
              });
            }}
          >
            <option value="4:4:4">Off (4:4:4)</option>
            <option value="4:2:0">On (4:2:0)</option>
          </select>
        );
      }
      switch (type) {
        case 'number':
          return (
            <input
              value={formatOptions.options[key]}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const range = formatOptions.ranges[key];
                setFormatOptions({
                  options: {
                    ...formatOptions.options,
                    [key]: Math.max(
                      Math.min(Number(e.target.value!), range.max),
                      range.min
                    ),
                  },
                  ranges: { ...formatOptions.ranges },
                });
              }}
              type="number"
            />
          );
        case 'boolean':
          return (
            <input
              type="checkbox"
              value={formatOptions.options[key]}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormatOptions({
                  options: {
                    ...formatOptions.options,
                    [key]: Boolean(e.target.value),
                  },
                  ranges: { ...formatOptions.ranges },
                })
              }
            />
          );
        case 'string':
          return (
            <select
              value={formatOptions.options[key]}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setFormatOptions({
                  options: {
                    ...formatOptions.options,
                    [key]: e.target.value,
                  },
                  ranges: { ...formatOptions.ranges },
                });
              }}
            >
              {formatOptions.ranges[key].map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        default:
          return `unknown input type + ${type}`;
      }
    };
    return (
      <div className={classes.optionInput}>
        {/* regex adds spaces before capital letters, camelcase */}
        <label>
          {capitalize(key.replace(/([A-Z])/g, ' $1').trim())}
          {type === 'number' &&
            ` (${formatOptions.ranges[key].min} - ${formatOptions.ranges[key].max})`}
        </label>
        {renderInput()}
      </div>
    );
  };
  const renderOptions = () => {
    const keys = Object.keys(formatOptions.options);
    const types = keys.map((key: string) => typeof formatOptions.options[key]);
    return (
      <>
        {keys.map((key: string, i: number) => (
          <div key={key}>{renderFormatOptions(key, types[i])}</div>
        ))}
      </>
    );
  };

  return (
    <div className={classes.container}>
            {resMsg.msg && <div className={classes.responseModal}>
          <h1>{resMsg.msg}</h1>
          <button onClick={() => setResMsg({msg:'', err:false, pending:false})}>Close</button>
      </div>}
      <div className={classes.fileListInput}>
        <div className={classes.fileList}>
          <div className={classes.fileTopMenu}>
            <label htmlFor="selectDeselectAll">Select/Deselect all</label>
            <input
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelected(
                  selected.length === files.length
                    ? []
                    : files.map((file: IFile) => file.id)
                );
              }}
              name="selectDeselectAll"
              id="selectDeselectAll"
              type="checkbox"
            />
          </div>
          {files.length === 0 && (
            <p style={{ padding: 'var(--padding-base)', margin: 'auto' }}>
              No files selected
            </p>
          )}
          {files.map((fileData: IFile, i: number) => (
            <div key={fileData.file.path} className={classes.file}>
              {fileListItem(
                fileData,
                i,
                !converting.converted.includes(fileData.id) &&
                  converting.converting &&
                  selected.includes(fileData.id)
              )}
            </div>
          ))}
        </div>
        <input
          id="file"
          name="file"
          ref={hiddenFileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInput}
          type="file"
          accept=".jpeg,.jpg,.png,.webp,.gif,.jp2,.tiff,.avif,.heif"
          multiple
        />
        <div className={classes.buttons}>
          <button onClick={() => hiddenFileInputRef.current?.click()}>
            Select file(s)
          </button>
          <button onClick={() => convertImages()}>Convert selected</button>
        </div>
      </div>
      <div className={classes.outputOptions}>
        <div className={classes.side}>
          <label htmlFor="format">Output format: {format.name}</label>
          <select
            onChange={handleFormat}
            value={formatString}
            name="format"
            id="format"
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
            <option value="gif">GIF</option>
            {/*<option value="jp2">JP2</option> jp2 removed because i dont know how to get it to work*/}
            {/*<option value="tiff">TIFF</option> tiff doesn't work properly either*/}
            <option value="avif">AVIF</option>
            <option value="heif">HEIF</option>
          </select>
          <div>
            <label>Dimensions (percent)</label>
            <div className={classes.dimensions}>
              <input
                onChange={handleX}
                value={dimensionsPercent.x}
                type="number"
              />
              X
              <input
                onChange={handleY}
                value={dimensionsPercent.y}
                type="number"
              />
            </div>
          </div>
          <div>
            <label htmlFor="fit">Image fit</label>
            <select onChange={handleFit} value={fitString} name="fit" id="fit">
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>
          {renderOptions()}
        </div>
        <hr />
        <label htmlFor="outputDir">Output directory</label>
        <input
          value={outputDir}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setOutputDir(e.target.value)
          }
          id="outputDir"
          name="outputDir"
          type="text"
        />
      </div>
    </div>
  );
};

export default App;
