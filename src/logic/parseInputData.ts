import { InitialData } from "../types";

export const parseJsonFromFile = async (file: any) => {
  return new Promise(function(resolve) {
      const fileread = new FileReader();
        fileread.onload = function(e) {
        console.log(e)
        const content = e.target?.result;
        // console.log(content);
        const json = content && JSON.parse(content.toString()); // Array of Objects.
        console.log(json); // You can index every object
        resolve(json)
      };

      fileread.readAsText(file);
  })
}

export const parseInputJson = (json: InitialData) => {
  if (json.outputData) {
    return;
  }
}
