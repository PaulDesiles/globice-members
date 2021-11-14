import { Picker } from 'meteor/communitypackages:picker';
import bodyParser from 'body-parser';
import { HelloAssoCollection } from '../db/HelloAssoCollection';
import { MembersCollection } from '../db/MembersCollection';
import { getParameters } from '../db/ParametersCollection';
import { addCreationDate } from './commonMethods';

import { rawMemberFieldsConverters } from './memberCreationHelper';

function getRawFormAnswer(formData, question) {
  const lowerQuestion = question.toLocaleLowerCase();
  return formData.customFields
    .find(field => field.name.toLocaleLowerCase() === lowerQuestion)
    ?.answer
    ?.trim();
}

function searchAndAddValueForKey(container, key, formData, parameters) {
  const raw = getRawFormAnswer(formData, parameters.newMemberForm[key]);
  if (raw) {
    const converter = rawMemberFieldsConverters[key];
    container[key] = converter ? converter(raw) : raw;
  }
}

function createMember(formData, parameters) {
  
  const member = {
    infos: {
      firstname: formData.user.firstName,
      lastname: formData.user.lastName
    },
    abilities: {},
    membership: { 
      date: new Date()
    },
    trips: {
      purchases: [],
      confirmedTrips: [],
      refusedTrips: [],
    }
  };

  ['birthdate', 'email', 'phone', 'address', 'postCode', 'city']
    .forEach(k => searchAndAddValueForKey(member.infos, k, formData, parameters));

  ['boatLicense', 'captain', 'diving', 'photo']
    .forEach(k => searchAndAddValueForKey(member.abilities, k, formData, parameters));

  searchAndAddValueForKey(member.membership, 'isNewMember', formData, parameters);

  addCreationDate(member);

  return member;
}

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

    console.log({
      type: req?.body?.eventType,
      id: req?.body?.data?.id
    });

    if (req?.body?.eventType === 'Order') {
      const items = req?.body?.data?.items;
      if (items) {
        console.log(`order contains ${items.length} items`);

        items.forEach(item => {
          if (item.type === 'Membership' && process.env.ACTIVATE_HA_MEMBERS_IMPORT) {
            const parameters = getParameters();
    
            if (!parameters) {
              console.log('failed to retrieve parameters');
            } else {
              const member = createMember(item, parameters);
              MembersCollection.insert(
                member, 
                (error, memberId) => {
                  if (error) {
                    console.log('failed to add new member');
                    console.log(error);
                  } else {
                    console.log(`new member added : ${memberId}`);
                  }
              });
            }
          }
        });
      }
    }

    res.end("ok");
  });
}