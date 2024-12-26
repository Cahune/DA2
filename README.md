# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

chuyển images thành array trong mongodb
db["places"].find().forEach(function(doc) {
  // Kiểm tra xem trường images có tồn tại và không phải là undefined
  if (doc.images && typeof doc.images === 'string') {
    // Tách chuỗi URL thành mảng
    var imagesArray = doc.images.split(';').map(function(url) {
      return url.trim();
    });

    // Cập nhật tài liệu với trường images là mảng
    db["places"].updateOne(
      { _id: doc._id },
      { $set: { images: imagesArray } }
    );
  }
});

chuyển thành chuỗi cho subtitle
db.places.find().forEach(function(doc) {
  // Kiểm tra và tách 'subtitles' và 'subtitle descriptions' thành mảng
  var subtitlesArray = doc.subtitles ? doc.subtitles.split("; ").map(function(item) {
    return item.trim();
  }) : [];

  var subtitleDescriptionsArray = doc["subtitle descriptions"] ? doc["subtitle descriptions"].split("; ").map(function(item) {
    return item.trim();
  }) : [];

  // Kết hợp từng subtitle với description tương ứng
  var subtitles = subtitlesArray.map(function(subtitle, index) {
    return {
      subtitle: subtitle,
      description: subtitleDescriptionsArray[index] || ""  // Nếu không có description thì để trống
    };
  });

  // Cập nhật tài liệu trong collection và xóa trường 'subtitle descriptions'
  db.places.updateOne(
    { _id: doc._id },  // Tìm tài liệu theo _id
    { 
      $set: { subtitles: subtitles },  // Cập nhật trường subtitles với dữ liệu mới
      $unset: { "subtitle descriptions": "" }  // Xóa trường 'subtitle descriptions'
    }
  );
});

db["places"].find().forEach(function(doc) {
  // Kiểm tra xem trường images có tồn tại và không phải là undefined
  if (doc.geocode && typeof doc.geocode === 'string') {
    // Tách chuỗi URL thành mảng
    var geocodeArray = doc.geocode.split(',').map(function(url) {
      return url.trim();
    });

    // Cập nhật tài liệu với trường images là mảng
    db["places"].updateOne(
      { _id: doc._id },
      { $set: { geocode: geocodeArray } }
    );
  } });


db["taxis"].find().forEach(function(doc) {
  // Kiểm tra xem trường images có tồn tại và không phải là undefined
  if (doc.places && typeof doc.places === 'string') {
    // Tách chuỗi URL thành mảng
    var placesArray = doc.places.split(',').map(function(url) {
      return url.trim();
    });

    // Cập nhật tài liệu với trường images là mảng
    db["taxis"].updateOne(
      { _id: doc._id },
      { $set: { places: placesArray } }
    );
  }
});
