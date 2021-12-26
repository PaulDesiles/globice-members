import assert from "assert";

describe("Main", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "globice-members");
  });

  it("client is not server", function () {
    assert.strictEqual(Meteor.isServer, !Meteor.isClient);
  });
});

import './commonMethods.js';