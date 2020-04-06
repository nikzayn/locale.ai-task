import React from 'react';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

const FileUploader = () => {
    const getUploadParams = () => {
        return { url: 'http://localhost:8080/upload' }
    }

    const handleChangeStatus = ({ meta, remove }, status) => {
        if (status === 'headers_received') {
            console.log(`${meta.name} uploaded!`)
            remove()
        } else if (status === 'aborted') {
            console.log(`${meta.name}, upload failed...`)
        }
    }

    return (
        <React.Fragment>
            <br />
            <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                maxFiles={1}
                accept='.csv'
                multiple={false}
                canCancel={false}
                inputContent="Drop A File"
                styles={{
                    dropzone: { width: 400, height: 200, overflow: 'hidden' },
                    dropzoneActive: { borderColor: 'green' },
                }}
            />
        </React.Fragment>
    )
}

export default FileUploader;