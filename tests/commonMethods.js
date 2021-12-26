import assert from "assert";
import * as methods from '../imports/api/commonMethods';

describe("CommonMethods.isArray", function () {
  it("recognizes empty array", function () {
    assert.strictEqual(methods.isArray([]), true);
  });
  it("recognizes simple array", function () {
    assert.strictEqual(methods.isArray([1, 2]), true);
  });
  it("recognizes nested array", function () {
    assert.strictEqual(methods.isArray([1, [3,5], { prop: 6}]), true);
  });
  it("recognizes that an object is not an array", function () {
    assert.strictEqual(methods.isArray({ prop: 6, otherProp: [3,5]}), false);
  });
});

describe("CommonMethods.ensureContainsUpdates", function () {
  it("throws with undefined", function () {
    assert.throws(() => methods.ensureContainsUpdates(undefined), 'No values to update');
  });
  it("throws with empty array", function () {
    assert.throws(() => methods.ensureContainsUpdates([]), 'No values to update');
  });
  it("throws with empty object", function () {
    assert.throws(() => methods.ensureContainsUpdates({}), 'No values to update');
  });

  it("ok with non-empty array", function () {
    assert.doesNotThrow(() => methods.ensureContainsUpdates([ 2 ]));
  });
  it("ok with array of objects", function () {
    assert.doesNotThrow(() => methods.ensureContainsUpdates([{ key: 'prop', value: '2' }, { key: 'other', value: '6' }]));
  });
  it("ok with one prop objects", function () {
    assert.doesNotThrow(() => methods.ensureContainsUpdates({ prop: 2 }));
  });
  it("ok with multi prop objects", function () {
    assert.doesNotThrow(() => methods.ensureContainsUpdates({ prop: 2, other: 6 }));
  });
});


describe("CommonMethods.addKeyValue", function () {
  it("adds value to empty array", function () {
    const container = [];
    methods.addKeyValue(container, "prop", "value");
    assert.deepEqual(container, [{ key: "prop", value: "value" }]);
  });
  it("adds value to array", function () {
    const container = ["somePreviousContent"];
    methods.addKeyValue(container, "prop", "value");
    assert.deepEqual(container, ["somePreviousContent", { key: "prop", value: "value" }]);
  });

  it("adds value to empty object", function () {
    const container = {};
    methods.addKeyValue(container, "prop", "value");
    assert.deepEqual(container, { prop: "value" });
  });
  it("adds value to object", function () {
    const container = { init: "withSomething" };
    methods.addKeyValue(container, "prop", "value");
    assert.deepEqual(container, { init: "withSomething", prop: "value" });
  });
  it("adds nested value to object", function () {
    const container = {};
    methods.addKeyValue(container, "nested.prop", "value");
    assert.deepEqual(container, { nested: { prop: "value" } });
  });
  it("adds a 3 level nested value to object with existing path", function () {
    const container = { very: { nested: { init: "withSomething" } } };
    methods.addKeyValue(container, "very.nested.prop", "value");
    assert.deepEqual(container, { very: { nested: { prop: "value", init: "withSomething" } } });
  });
  it("adds a 3 levels nested value to empty object", function () {
    const container = {};
    methods.addKeyValue(container, "very.nested.prop", "value");
    assert.deepEqual(container, { very: { nested: { prop: "value" } } });
  });
});

describe("CommonMethods.getValue", function () {
  it("doesn't fail with empty array", function () {
    assert.equal(methods.getValue([], "nested.prop"), undefined);
  });
  it("doesn't fail with empty object", function () {
    assert.equal(methods.getValue({}, "nested.prop"), undefined);
  });
  it("doesn't fail with unexisting array prop", function () {
    assert.equal(methods.getValue([{ key: "init", value: "value" }], "nested.prop"), undefined);
  });
  it("doesn't fail with unexisting object prop", function () {
    assert.equal(methods.getValue({ init: "value" }, "nested.prop"), undefined);
  });
  it("doesn't fail with unexisting object nested prop", function () {
    assert.equal(methods.getValue({ nested: { init: "value"} }, "nested.prop"), undefined);
  });


  it("retrieves value from array of key-values", function () {
    const container = [ { key: "prop", value: "value" }, { key: "otherProp", value: "otherValue" } ];
    assert.equal(methods.getValue(container, "prop"), "value");
  });
  it("retrieves nested value from array of key-values", function () {
    const container = [ { key: "nested.prop", value: "value" }, { key: "nested.otherProp", value: "otherValue" } ];
    assert.equal(methods.getValue(container, "nested.prop"), "value");
  });

  it("retrieves value from object", function () {
    const container = { prop: "value", otherProp: "otherValue" };
    assert.equal(methods.getValue(container, "prop"), "value");
  });
  it("retrieves nested value from array of key-values", function () {
    const container = { nested: { prop: "value" } };
    assert.equal(methods.getValue(container, "nested.prop"), "value");
  });
  it("retrieves 3 levels nested value from array of key-values", function () {
    const container = { very: { nested: { prop: "value" } } };
    assert.equal(methods.getValue(container, "very.nested.prop"), "value");
  });
});

describe("CommonMethods.addCreationDate", function () {
  it("adds creation date to empty array", function () {
    const container = [];
    methods.addCreationDate(container);
    const date = (new Date()).getDate();
    const storedValue = container.filter(kv => kv.key == '_creationDate').map(kv => kv.value)[0];

    assert.notEqual(storedValue, undefined);
    assert.notEqual(storedValue.getDate(), undefined);
    assert.equal(storedValue.getDate() < (date + 1000), true);
    assert.equal(storedValue.getDate() > (date - 1000), true);
  });
  it("replaces creation date in array", function () {
    const container = [ { key: '_creationDate', value: new Date(1990, 5, 1) } ];
    methods.addCreationDate(container);
    const date = (new Date()).getDate();
    const storedValue = container.filter(kv => kv.key == '_creationDate').map(kv => kv.value)[0];

    assert.notEqual(storedValue, undefined);
    assert.notEqual(storedValue.getDate(), undefined);
    assert.equal(storedValue.getDate() < (date + 1000), true);
    assert.equal(storedValue.getDate() > (date - 1000), true);
  });
  it("keeps existing array properties", function () {
    const container = [
      { key: 'prop', value: 'value'},
      { key: 'very.nested.prop', value: 'otherValue'}
    ];

    methods.addCreationDate(container);
    const storedValue = container.filter(kv => kv.key == '_creationDate').map(kv => kv.value)[0];

    assert.deepEqual(container, [
      { key: 'prop', value: 'value' },
      { key: 'very.nested.prop', value: 'otherValue' },
      { key: '_creationDate', value: storedValue }
    ]);
  });


  it("adds creation date to empty object", function () {
    const container = {};
    methods.addCreationDate(container);
    const date = (new Date()).getDate();
    assert.notEqual(container['_creationDate'], undefined);
    assert.notEqual(container['_creationDate'].getDate(), undefined);
    assert.equal(container['_creationDate'].getDate() < (date + 1000), true);
    assert.equal(container['_creationDate'].getDate() > (date - 1000), true);
  });
  it("replaces creation date in object", function () {
    const container = { _creationDate: new Date(1990, 5, 1) };
    methods.addCreationDate(container);
    const date = (new Date()).getDate();
    assert.notEqual(container['_creationDate'], undefined);
    assert.notEqual(container['_creationDate'].getDate(), undefined);
    assert.equal(container['_creationDate'].getDate() < (date + 1000), true);
    assert.equal(container['_creationDate'].getDate() > (date - 1000), true);
  });
  it("keeps existing object properties", function () {
    const container = { prop: "value", very: { nested: { prop: "value" } } };
    methods.addCreationDate(container);
    assert.deepEqual(container, { _creationDate: container._creationDate, prop: "value", very: { nested: { prop: "value" } } });
  });
});

//dumb copy of addCreationDate
describe("CommonMethods.addModificationDate", function () {
  it("adds creation date to empty array", function () {
    const container = [];
    methods.addModificationDate(container);
    const date = (new Date()).getDate();
    const storedValue = container.filter(kv => kv.key == '_modificationDate').map(kv => kv.value)[0];

    assert.notEqual(storedValue, undefined);
    assert.notEqual(storedValue.getDate(), undefined);
    assert.equal(storedValue.getDate() < (date + 1000), true);
    assert.equal(storedValue.getDate() > (date - 1000), true);
  });
  it("replaces creation date in array", function () {
    const container = [ { key: '_modificationDate', value: new Date(1990, 5, 1) } ];
    methods.addModificationDate(container);
    const date = (new Date()).getDate();
    const storedValue = container.filter(kv => kv.key == '_modificationDate').map(kv => kv.value)[0];

    assert.notEqual(storedValue, undefined);
    assert.notEqual(storedValue.getDate(), undefined);
    assert.equal(storedValue.getDate() < (date + 1000), true);
    assert.equal(storedValue.getDate() > (date - 1000), true);
  });
  it("keeps existing array properties", function () {
    const container = [
      { key: 'prop', value: 'value'},
      { key: 'very.nested.prop', value: 'otherValue'}
    ];

    methods.addModificationDate(container);
    const storedValue = container.filter(kv => kv.key == '_modificationDate').map(kv => kv.value)[0];

    assert.deepEqual(container, [
      { key: 'prop', value: 'value' },
      { key: 'very.nested.prop', value: 'otherValue' },
      { key: '_modificationDate', value: storedValue }
    ]);
  });


  it("adds creation date to empty object", function () {
    const container = {};
    methods.addModificationDate(container);
    const date = (new Date()).getDate();
    assert.notEqual(container['_modificationDate'], undefined);
    assert.notEqual(container['_modificationDate'].getDate(), undefined);
    assert.equal(container['_modificationDate'].getDate() < (date + 1000), true);
    assert.equal(container['_modificationDate'].getDate() > (date - 1000), true);
  });
  it("replaces creation date in object", function () {
    const container = { _modificationDate: new Date(1990, 5, 1) };
    methods.addModificationDate(container);
    const date = (new Date()).getDate();
    assert.notEqual(container['_modificationDate'], undefined);
    assert.notEqual(container['_modificationDate'].getDate(), undefined);
    assert.equal(container['_modificationDate'].getDate() < (date + 1000), true);
    assert.equal(container['_modificationDate'].getDate() > (date - 1000), true);
  });
  it("keeps existing object properties", function () {
    const container = { prop: "value", very: { nested: { prop: "value" } } };
    methods.addModificationDate(container);
    assert.deepEqual(container, { _modificationDate: container._modificationDate, prop: "value", very: { nested: { prop: "value" } } });
  });
});

describe("CommonMethods.addSearchChanges", function () {
  it("adds nothing to an empty array", function () {
    const container = [];
    methods.addSearchChanges(container);
    assert.deepEqual(container, []);
  });
  it("adds nothing to an empty object", function () {
    const container = {};
    methods.addSearchChanges(container);
    assert.deepEqual(container, {});
  });

  
  it("keeps existing array properties", function () {
    const container = [
      { key: 'prop', value: 'value'},
      { key: 'very.nested.prop', value: 'otherValue'}
    ];

    methods.addSearchChanges(container);

    assert.deepEqual(container, [
      { key: 'prop', value: 'value' },
      { key: 'very.nested.prop', value: 'otherValue' }
    ]);
  });
  it("keeps existing object properties", function () {
    const container = { prop: "value", very: { nested: { prop: "value" } } };
    methods.addSearchChanges(container);
    assert.deepEqual(container, { prop: "value", very: { nested: { prop: "value" } } });
  });

  ['firstname', 'lastname', 'email'].forEach(key => {
    it(`adds search.${key} if infos.${key} is defined`, function () {
      const container = [
        { key: 'prop', value: 'value'},
        { key: `infos.${key}`, value: 'otherValuéé'}
      ];
  
      methods.addSearchChanges(container);
  
      assert.deepEqual(container, [
        { key: 'prop', value: 'value' },
        { key: `infos.${key}`, value: 'otherValuéé'},
        { key: `search.${key}`, value: 'othervaluee'}
      ]);
    });

    it("keeps existing object properties", function () {
      const container = { prop: "value", infos: { [key]: 'otherValuéé' } };
      methods.addSearchChanges(container);
      assert.deepEqual(container, {
        prop: "value",
        infos: { [key]: 'otherValuéé' },
        search: { [key]: 'othervaluee' }
      });
    });
  });
});

describe("CommonMethods.arrayToObject", function () {
  it("converts empty array to empty object", function () {
    assert.deepEqual(methods.arrayToObject([]), {});
  });

  it("converts nested-properties array to object", function () {
    const array = [
      { key: 'prop', value: 'value' },
      { key: `infos.someProp`, value: 'someValue'},
      { key: `super.nested.prop`, value: 'nestedValue'},
      { key: `super.nested.otherprop`, value: 'othervalue'}
    ];
    assert.deepEqual(methods.arrayToObject(array), {
      prop: 'value',
      'infos.someProp': 'someValue',
      'super.nested.prop': 'nestedValue',
      'super.nested.otherprop': 'othervalue'
    });
    
    // assert.deepEqual(methods.arrayToObject(array), {
    //   prop: 'value',
    //   infos: { someProp: 'someValue' },
    //   super: { nested: { prop: 'nestedValue', otherprop: 'othervalue' } }
    // });
  });
});