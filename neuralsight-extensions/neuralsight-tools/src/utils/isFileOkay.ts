/**
 * Test if the file is accepted
 * @param {File} file File To Pass Through The Checks
 * @param  {string[]} validExtensions Array of valid extensions e.g ["jpg", "png"]
 * @returns {boolean}
 */
export function isFileTypeOkay(
  filename: string | undefined,
  validExtensions: string[]
): boolean {
  try {
    console.log('filename', filename);
    if (!filename) {
      throw new Error('filename is undefined');
    }
    let fileName = '';
    const fileNameArr = filename.split('.');

    for (let i = 0; i < fileNameArr.length - 1; i++) {
      fileName.concat(fileNameArr[i]);
    }
    const fileExtension = fileNameArr[fileNameArr.length - 1];

    if (validExtensions.length > 0) {
      // check if the file okay to display default state of the is function
      // Only do for corret splitted files
      if (fileNameArr.length > 1) {
        return validExtensions
          .map(item => item.toLocaleLowerCase())
          .includes(fileExtension.toLocaleLowerCase());
      } else {
        return true; //We assume that is not a file since it does have an extension e.g .zip .png e.t.c
      }
    } else {
      throw new Error('valid extension can not be an empty array');
    }
  } catch (error) {
    console.log(error); // print error message
    return false;
  }
}
