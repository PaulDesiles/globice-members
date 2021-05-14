import { Picker } from 'meteor/communitypackages:picker';
import bodyParser from 'body-parser';

export function setApiListeners() {
  Picker.middleware(bodyParser.json());

  var postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
  });

  postRoutes.route('/api/helloasso', function(params, req, res, next) {
    console.log("received post from helloasso");
    console.log(`${req.body.items.length} items received`);
    console.log(req.body.items[0]);
    res.end("ok");
  });
}