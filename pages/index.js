import React, { useEffect, useState, useCallback } from 'react';
import Router from 'next/router';
import { magic } from '../magic';
import Loading from '../components/loading';
import process from 'process'
import minimist from 'minimist'
import Dropzone from 'react-dropzone-uploader'


// Construct with token and endpoint
// const client = new Web3Storage({ token: apiToken });

const MyUploader = () => {
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
  
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*,audio/*,video/*"
    />
  )
}

function UploadForm() {
  const [data, setData] = React.useState('');
  const [metadata, setMetaData] = React.useState('');
  
  function handleSubmit(event) {
    event.preventDefault();
    console.log('name:', data);
    console.log('metadata:', metadata);
  return {
    props: { posts } // props will be passed to the page
  };
}


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="data">Data</label>
        <input
          id="data"
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="metadata">MetaData</label>
        <input
          id="metadata"
          value={metadata}
          onChange={(e) => setMetaData(e.target.value)}
          // interesting page for forms and upload image: https://hackernoon.com/permanent-file-storage-for-web3-apps-with-arweave-bundlr-nextjs-rainbowkit-and-wagmi    
        />
      </div>
      <MyUploader />
         <button type="submit">Submit</button>
    </form>
  );
}

export default function Index() {
  const [userMetadata, setUserMetadata] = useState();

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.
    magic.user.isLoggedIn().then((magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(setUserMetadata);
      } else {
        // If no user is logged in, redirect to `/login`
        Router.push('/login');
      }
    });
  }, []);

  /**
   * Perform logout action via Magic.
   */
  const logout = useCallback(() => {
    magic.user.logout().then(() => {
      Router.push('/login');
    });
  }, [Router]);

  return userMetadata ? (
    <div className='container'>
      <h1>Current user: {userMetadata.email}</h1>
      <button onClick={logout}>Logout</button>
      <UploadForm></UploadForm>     

      // also look at https://github.com/web3-storage/example-image-gallery/blob/main/src/js/upload.js
    </div>
  ) : (
    <Loading />
  );
}
