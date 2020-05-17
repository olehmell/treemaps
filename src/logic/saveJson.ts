import { encodeBase64, saveAs } from "@progress/kendo-file-saver";

export const saveJson = (json: string) => {
  const dataURI = "data:text/json;base64," + encodeBase64(json);
  const fileName = `${new Date().toISOString()}.json`
  saveAs(dataURI, fileName)
}