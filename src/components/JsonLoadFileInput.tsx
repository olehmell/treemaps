import React from 'react';
import { FormLabel, FormControl, Button } from 'react-bootstrap';
import { parseJsonFromFile } from '../logic/parseInputData';

type Props = {
  onChange: (data: any) => any
}

const FileInput: React.FunctionComponent<Props> = ({ onChange }) => {
  const id = Math.ceil(Math.random() * 100);
    return <FormLabel htmlFor={"fileUpload-" + id} style={{ cursor: "pointer", marginBottom: '0' }}>
    <Button variant='light'>Import data</Button>
      <FormControl
          id={"fileUpload-" + id}
          type="file"
          accept=".json"
          onChange={async (e: any) => {
            const file = e.target.files[0];
            const res = await parseJsonFromFile(file)
            console.log(res)
            onChange(res)
          }}
          style={{ display: "none" }}
      />
  </FormLabel>
}

export default FileInput;