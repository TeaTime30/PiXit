/******OPEN FILE*******/
/*Taken from: https://developers.google.com/drive/v3/web/integrate-open#open_and_convert_google_docs_in_your_app*/

var fileId = '1ZdR3L3qP4Bkq8noWLJHSr_iBau0DNT4Kli4SxNc2YEo';
var dest = fs.createWriteStream('/tmp/resume.pdf');
drive.files.export({
   fileId: fileId,
   mimeType: 'application/pdf'
})
.on('end', function() {
  console.log('Done');
})
.on('error', function(err) {
  console.log('Error during download', err);
})
.pipe(dest);

/*******INSERT FILE INTO APPLICATION DATA FOLDER********/
/*Taken from: https://developers.google.com/drive/v3/web/appdata#inserting_a_file_into_the_application_data_folder*/

var fileMetadata = {
  'name': 'config.json',
  'parents': [ 'appDataFolder']
};
var media = {
  mimeType: 'application/json',
  body: fs.createReadStream('files/config.json')
};
drive.files.create({
   resource: fileMetadata,
   media: media,
   fields: 'id'
}, function(err, file) {
  if(err) {
    // Handle error
    console.log(err);
  } else {
    console.log("Folder Id: ", file.id);
  }
});

/*******SAVE TO DRIVE BUTTON*******/
/*Taken from: https://developers.google.com/drive/v3/web/savetodrive#getting_started*/