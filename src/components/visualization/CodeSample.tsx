import styles from "./VisualizationPrimitives.module.css";
import { parseKeyValueSource, renderVizWithContract } from "./_shared/viz-contract";

type CodeSampleModel = {
  title?: string;
  language?: string;
  code: string;
};

function isCodeSampleMetadataBlock(source: string) {
  const lines = source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return false;
  }

  return lines.every((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 1) {
      return false;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    return ["title", "lang", "language"].includes(key) && Boolean(value);
  });
}

export function parseCodeSampleSource(source: string): CodeSampleModel {
  const [metadataBlock, ...codeParts] = source.split(/\n\s*\n/);
  const trimmedMetadata = metadataBlock.trim();

  if (!codeParts.length || !isCodeSampleMetadataBlock(trimmedMetadata)) {
    return { code: source.trim() };
  }

  const values = parseKeyValueSource(trimmedMetadata);
  return {
    title: values.title?.trim(),
    language: values.lang?.trim() ?? values.language?.trim(),
    code: codeParts.join("\n\n").trim(),
  };
}

export function CodeSample({ source }: { source: string }) {
  return renderVizWithContract(source, parseCodeSampleSource, (sample) => (
    <figure className={styles.codeSample} data-viz="code-sample">
      {sample.title ? <figcaption className={styles.codeCaption}>{sample.title}</figcaption> : null}
      <pre className={styles.codeBlock}>
        <code data-lang={sample.language}>{sample.code}</code>
      </pre>
    </figure>
  ));
}
