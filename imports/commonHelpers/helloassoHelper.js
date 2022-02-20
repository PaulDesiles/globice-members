import { rawMemberFieldsConverters, normalize } from '../api/memberCreationHelper';
import { addCreationDate } from '../api/commonMethods';

export function getRawFormAnswer(formData, question) {
  if (!question)
    return undefined;

  const lowerQuestion = question.toLocaleLowerCase();
  var answer = formData.customFields
    .find(field => field.name?.toLocaleLowerCase() === lowerQuestion)
    ?.answer;

  return typeof answer === "string" ? answer.trim() : answer;
}

export function searchAndAddValueForKey(container, key, formData, parameters, converters = rawMemberFieldsConverters) {
  const rawAnswer = getRawFormAnswer(formData, parameters.newMemberForm[key]);
  if (rawAnswer) {
    const converter = converters[key];
    container[key] = converter ? converter(rawAnswer) : rawAnswer;
  }
}

export function createMemberFromHelloAssoForm(formData, parameters) {
  
  const member = {
    infos: {
      firstname: normalize(formData.user.firstName),
      lastname: normalize(formData.user.lastName)
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


// returns one or multiple computed data based on the raw entry's data
export function analyseEntry(data, encounteredIds, parameters) {
  if (encounteredIds.includes(data.id))
    return [{ isDuplicate: true }];
  
  encounteredIds.push(data.id);
  
  if (data.formType === 'PaymentForm') {
    let memberInfos = {
      firstName: data.payer.firstName.trim(),
      lastName: data.payer.lastName.trim()
    };

    if (data.formSlug.startsWith('carte-de-5'))
      return [{ memberInfos, tripBooks: 5 }];

    if (data.formSlug.startsWith('carte-de-10'))
      return [{ memberInfos, tripBooks: 10 }];
  } 
  else if (data.formType === 'Membership') {
    return data.items
      .filter(i => i.type === 'Membership')
      .map(i => {
        let tripBooks = 0;

        if (!i.customFields || !i.customFields.length) {
          return { warning: true };
        }

        if (i.options) {
          if (i.options.some(o => o.name?.startsWith('Carte de 5')))
            tripBooks = 5;
          else if (i.options.some(o => o.name?.startsWith('Carte de 10')))
            tripBooks = 10;
          else if (i.options.some(o => o.name?.toLocaleLowerCase()?.startsWith('carte de sortie')))
            tripBooks = 5;
        }

        let memberData = createMemberFromHelloAssoForm(i, parameters);

        return {
          memberInfos: { 
            firstName: i.user.firstName.trim(),
            lastName: i.user.lastName.trim()
          },
          renewMembership: true,
          memberData,
          tripBooks
        };
      });
    ;
  }
  else if (data.formType === 'Donation') {
    // we don't need donations to be shown
    return [];
  }

  return [{ warning: true }];
};

export function parseHelloAssoEntries(rawEntries, parameters) {
  let encounteredIds = [];

  return rawEntries
    .map(e => {
      var parsedEntries = analyseEntry(e.data, encounteredIds, parameters);

      return parsedEntries
        .map(parsed => ({
          sourceData: e,
          parsedData : parsed.warning ? undefined : parsed,
          date: e.data.date,
          resolved: false
        }));
    })
    .flat()
    .filter(e => !e.parsedData.isDuplicate);
}