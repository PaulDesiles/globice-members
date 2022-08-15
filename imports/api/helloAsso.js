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
    try {
      if (process.env.ACTIVATE_HA_RAW_SAVING
        && req?.body?.data && req?.body?.eventType
        && (!process.env.HA_MEMBERS_IMPORT_KEY || params?.key === process.env.HA_MEMBERS_IMPORT_KEY))
      {
        console.log("received post from helloasso from " + req.headers.host);

        var insertId= HelloAssoCollection.insert(
          {
            data: req.body.data,
            eventType: req.body.eventType,
            resolved: false
          },
          { bypassCollection2: true }
        );

        console.log(`inserted helloAsso entry : ${insertId}`);
      }
      
      res.end("ok");
    }
    catch (error) {
      console.log(error);
      res.end("KO");
    }
  });
}