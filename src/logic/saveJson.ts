import { encodeBase64, saveAs } from "@progress/kendo-file-saver";

export const saveJson = (data?: object, fileName?: string) => {
  if (!data) return;

  const json = JSON.stringify(data, null, '\t')
  const dataURI = "data:text/json;base64," + encodeBase64(json);
  const uniqueName = `${fileName ? (fileName + '-'): ''}${new Date().toISOString()}.json`
  saveAs(dataURI, uniqueName)
}