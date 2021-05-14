import { Picker } from 'meteor/communitypackages:picker';
import bodyParser from 'body-parser';

export function setApiListeners() {
  Picker.middleware(bodyParser.json());

  var postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
  });

  postRoutes.route('/api/helloasso', function(params, req, res, next) {
    console.log("received post from helloasso");
    console.log({
      type: req?.body?.eventType,
      id: req?.body?.data?.id
    });
    
    console.log(typeof req?.body?.data?.items);
    console.log(req?.body?.data?.items?.length);
    console.log(req?.body?.data?.items);

    res.end("ok");
  });
}