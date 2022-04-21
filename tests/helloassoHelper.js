import assert from "assert";
import * as helper from '../imports/commonHelpers/helloassoHelper';

let sampleFormData = {
  customFields: [
    { name: 'Field 1', answer: ' answer 1  ' },
    { name: 'field 2', answer: 'Answer 2' },
    { name: 'FielD 3', answer: 'answer 3' },
    { answer: 'unreachable answer' },
    { name: 'field 5' }
  ]
};

describe("helloasoHelper.getRawFormAnswer", function () {
  it("finds existing answer", function () {
    assert.strictEqual(helper.getRawFormAnswer(sampleFormData, 'field 2'), 'Answer 2');
  });
  
  it("is case insensitive", function () {
    assert.strictEqual(helper.getRawFormAnswer(sampleFormData, 'field 3'), 'answer 3');
  });

  it("trims result", function () {
    assert.strictEqual(helper.getRawFormAnswer(sampleFormData, 'Field 1'), 'answer 1');
  });

  it("returns undefined when question is not found", function () {
    assert.strictEqual(helper.getRawFormAnswer(sampleFormData, 'Field 4'), undefined);
  });
  
  it("returns undefined when question is undefined", function () {
    assert.strictEqual(helper.getRawFormAnswer(sampleFormData, undefined), undefined);
  });

  it("returns undefined when answer is not found", function () {
    assert.strictEqual(helper.getRawFormAnswer(sampleFormData, 'field 5'), undefined);
  });
});


describe("helloasoHelper.searchAndAddValueForKey", function () {
  it("finds existing answer", function () {
    let container = {};
    helper.searchAndAddValueForKey(
      container,
      'key',
      sampleFormData,
      { newMemberForm: { key: 'Field 1' } },
      {}
    );

    assert.deepEqual(container, { key: 'answer 1'});
  });

  it("overrides previous container data with new answer", function () {
    let container = { key: 'previous answer' };
    helper.searchAndAddValueForKey(
      container,
      'key',
      sampleFormData,
      { newMemberForm: { key: 'Field 1' } },
      {}
    );

    assert.deepEqual(container, { key: 'answer 1'});
  });
  
  it("keeps previous answer if a question is not found", function () {
    let container = { key: 'previous answer' };
    helper.searchAndAddValueForKey(
      container,
      'unknownKey',
      sampleFormData,
      { newMemberForm: { key: 'Field 1' } },
      {}
    );

    assert.deepEqual(container, { key: 'previous answer'});
  });
  
  it("keeps previous answer if the answer is not found", function () {
    let container = { key: 'previous answer' };
    helper.searchAndAddValueForKey(
      container,
      'key',
      sampleFormData,
      { newMemberForm: { key: 'unknown' } },
      {}
    );

    assert.deepEqual(container, { key: 'previous answer'});
  });

  it("converts answer", function () {
    let container = {};
    helper.searchAndAddValueForKey(
      container,
      'key',
      sampleFormData,
      { newMemberForm: { key: 'Field 1' } },
      { key: (x) => x.slice(0, 3) }
    );

    assert.deepEqual(container, { key: 'ans'});
  });
});


let parameters = {
  newMemberForm: {
    email: 'someKeyMeaningEmail'
  }
};

describe("helloasoHelper.analyseEntry - edgeCases", function () {
  it("finds duplicates", function () {
    let computed = helper.analyseEntry({ id: '123'}, [ '123' ], parameters);
    assert.equal(computed.length, 1);
    assert.equal(computed[0].isDuplicate, true);
  });

  it("exclude donations", function () {
    let computed = helper.analyseEntry({ id: '123', formType: 'Donation' }, [], parameters);
    assert.deepEqual(computed, []);
  });

  it("alert when type is unknown", function () {
    let computed = helper.analyseEntry({ id: '123', formType: 'SomeUnkwonType' }, [], parameters);
    assert.equal(computed.length, 1);
    assert.equal(computed[0].warning, true);
  });
});


describe("helloassoHelper.createMemberFromHelloAssoForm", function () {
  it("finds answer inside customFields", function () {
    let member = helper.createMemberFromHelloAssoForm(
      { 
        user: { firstName: 'first', lastName: 'last' },
        customFields: [
          { name: 'someKeyMeaningEmail', answer: 'email-value' }
        ]
      },
      parameters
    );

    assert.equal(member.infos.email, 'email-value');
  });
});

describe("helloasoHelper.analyseEntry - tripbooks", function () {
  it("recognizes tripbooks of 5", function () {
    let computed = helper.analyseEntry(
      { 
        id: '123', 
        formType: 'PaymentForm' ,
        payer: {
          firstName: 'first',
          lastName: 'last'
        },
        formSlug: 'carte-de-5'
      },
      [],
      parameters
    );

    assert.equal(computed.length, 1);
    assert.deepEqual(computed[0].memberInfos, { firstName: 'first', lastName: 'last' });
    assert.equal(computed[0].tripBooks, 5);
  });
  
  it("recognizes tripbooks of 10", function () {
    let computed = helper.analyseEntry(
      { 
        id: '123', 
        formType: 'PaymentForm' ,
        payer: {
          firstName: 'first',
          lastName: 'last'
        },
        formSlug: 'carte-de-10'
      },
      [],
      parameters
    );

    assert.equal(computed.length, 1);
    assert.deepEqual(computed[0].memberInfos, { firstName: 'first', lastName: 'last' });
    assert.equal(computed[0].tripBooks, 10);
  });

  it("rejects tripbooks of unknown size", function () {
    let computed = helper.analyseEntry(
      { 
        id: '123', 
        formType: 'PaymentForm' ,
        payer: {
          firstName: 'first',
          lastName: 'last'
        },
        formSlug: 'carte-unknown'
      },
      [],
      parameters
    );

    assert.equal(computed.length, 1);
    assert.equal(computed[0].warning, true);
  });
});

let sampleItem1 = {
  type: 'Membership',
  user: {
    firstName: 'first1',
    lastName: 'last1'
  },
  customFields: [ { name: 'someKeyMeaningEmail', answer: 'email-value1' } ]
};

let sampleItem2 = {
  type: 'Membership',
  user: {
    firstName: 'first2',
    lastName: 'last2'
  },
  customFields: [ { name: 'someKeyMeaningEmail', answer: 'email-value2' } ]
};

let sampleItem3 = {
  type: 'Membership',
  user: {
    firstName: 'first3',
    lastName: 'last3'
  },
  customFields: [ { name: 'someKeyMeaningEmail', answer: 'email-value3' } ]
};

describe("helloasoHelper.analyseEntry - membership", function () {
  it("recognizes membership", function () {
    let computed = helper.analyseEntry(
      { 
        id: '123', 
        formType: 'Membership',
        items: [ sampleItem1 ]
      },
      [],
      parameters
    );

    assert.equal(computed.length, 1);
    assert.deepEqual(computed[0].memberInfos, { firstName: 'first1', lastName: 'last1' });
    assert.equal(computed[0].renewMembership, true);
    assert.equal(computed[0].tripBooks, 0);
    assert.equal(computed[0].memberData.infos.firstname, 'First1');
    assert.equal(computed[0].memberData.infos.lastname, 'Last1');
    assert.equal(computed[0].memberData.infos.email, 'email-value1');
  });

  it("recognizes multiple memberships", function () {
    let data = { 
      id: '123', 
      formType: 'Membership',
      items: [ sampleItem1, sampleItem2, sampleItem3 ]
    };
    let computed = helper.analyseEntry(data, [], parameters);

    assert.equal(computed.length, 3);
    computed.forEach((x, i) => {
      var n = i + 1;
      assert.deepEqual(x.memberInfos, { firstName: 'first' + n, lastName: 'last' + n });
      assert.equal(x.renewMembership, true);
      assert.equal(x.tripBooks, 0);
      assert.equal(x.memberData.infos.firstname, 'First' + n);
      assert.equal(x.memberData.infos.lastname, 'Last' + n);
      assert.equal(x.memberData.infos.email, 'email-value' + n);
    });
  });

  it("ignores non membership items", function () {
    let data = { 
      id: '123', 
      formType: 'Membership',
      items: [ sampleItem1, sampleItem2, { type: 'Something' } ]
    };
    let computed = helper.analyseEntry(data, [], parameters);

    assert.equal(computed.length, 2);
    assert.deepEqual(computed[0].memberInfos, { firstName: 'first1', lastName: 'last1' });
    assert.deepEqual(computed[1].memberInfos, { firstName: 'first2', lastName: 'last2' });
    computed.forEach((x, i) => {
      var n = i + 1;
      assert.equal(x.renewMembership, true);
      assert.equal(x.tripBooks, 0);
      assert.equal(x.memberData.infos.firstname, 'First' + n);
      assert.equal(x.memberData.infos.lastname, 'Last' + n);
      assert.equal(x.memberData.infos.email, 'email-value' + n);
    });
  });
  
  it("alerts when membership data is not found", function () {
    let data = { 
      id: '123', 
      formType: 'Membership',
      items: [ {...sampleItem1, customFields: undefined }, {...sampleItem2, customFields: [] } ]
    };
    let computed = helper.analyseEntry(data, [], parameters);

    assert.equal(computed.length, 2);
    assert.equal(computed[0].warning, true);
    assert.equal(computed[1].warning, true);
  });

  it("recognizes tripbooks with memberships", function () {
    let data = { 
      id: '123', 
      formType: 'Membership',
      items: [ 
        {...sampleItem1, options: [] },
        {...sampleItem2, options: [ { someProp: 'someValue' }, { name: 'Carte de 5' } ] },
        {...sampleItem3, options: [ { name: 'Carte de 10' }] },
      ]
    };
    let computed = helper.analyseEntry(data, [], parameters);

    assert.equal(computed.length, 3);
    computed.forEach((x, i) => {
      var n = i + 1;
      assert.deepEqual(x.memberInfos, { firstName: 'first' + n, lastName: 'last' + n });
      assert.equal(x.renewMembership, true);
      assert.equal(x.memberData.infos.firstname, 'First' + n);
      assert.equal(x.memberData.infos.lastname, 'Last' + n);
      assert.equal(x.memberData.infos.email, 'email-value' + n);
    });
    assert.equal(computed[0].tripBooks, 0);
    assert.equal(computed[1].tripBooks, 5);
    assert.equal(computed[2].tripBooks, 10);
  });
  
});



// describe("helloassoHelper.parseHelloAssoEntries", function () {
//   it("")
// });