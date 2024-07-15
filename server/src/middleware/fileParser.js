import formidable from "formidable";

export const fileParser = async (req, res, next) => {
  const form = formidable();
  //   console.log(req);
  // get the file from the form
  const [fields, files] = await form.parse(req);

  //   console.log(files);

  //   to grab the file
  if (!req.files) req.files = {};

  // note: files is an object

  for (let key in files) {
    const filesNeeded = files[key]; // return array of each PersistentFile [PersistentFile, ....]

    // if thers is no file, break the loop[]
    if (!filesNeeded) break;

    // console.log(filesNeeded);

    if (filesNeeded.length > 1) {
      // for multiple files
      req.files[key] = filesNeeded;
      // i.e {avatar: [PersistentFile, PersistentFile, .....,....]}
    } else {
      // for single files
      req.files[key] = filesNeeded[0];
      // i.e {avatar: PersistentFile}
    }
  }

  next();
};

// FORMAT of Files
// {
//     avatar: [
//         PersistentFile{
//             ....IMAGE DETAILS 1ST
//         },
//         PersistentFile{
//             ....IMAGE DETAILS 2ND  depends on the number of images you are uploading
//         },
//     ]
// }
