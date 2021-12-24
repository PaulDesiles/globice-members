import { Picker } from 'meteor/communitypackages:picker';
import bodyParser from 'body-parser';
import { HelloAssoCollection } from '../db/HelloAssoCollection';
import { addCreationDate } from './commonMethods';

export function setApiListeners() {
  Picker.middleware(bodyParser.json());
let postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
  });

  postRoutes.route('/api/helloasso', function(params, req, res, next) {
    console.log("received post from helloasso");

    if (req?.body && process.env.ACTIVATE_HA_RAW_SAVING) {
      HelloAssoCollection.insert(req.body);
    }

    /**** auto import deactivated for a semi-automated import, through app ui ****/
    
    res.end("ok");
  });
}