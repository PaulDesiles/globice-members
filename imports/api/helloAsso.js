import { Picker } from 'meteor/communitypackages:picker';
import bodyParser from 'body-parser';
import { MembersCollection } from '../db/MembersCollection';
import { addCreationDate } from './commonMethods';

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

    if (req?.body?.eventType === 'Order') {
      const item = req?.body?.data?.items?.[0];
      if (item && item.type === 'Membership') {

        const member = {
          infos: {
            firstname: 'test',
            lastname: 'test'
          },
          abilities: {
            comment: JSON.stringify(item)
          }
        };
        
        addCreationDate(member);

        MembersCollection.insert(
          member, 
          (error) => {
            console.log(error ? 'failed to add new member' : 'new member added');
            console.log(error);
        });
      }
    }

    res.end("ok");
  });
}