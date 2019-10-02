import { checkValidity } from "./ContactData";

describe("Contact Form", () => {
  describe("checkValidity function", () => {
    it("gives true if no rules were given", () =>
      expect(checkValidity("", {})).toEqual(true));

    describe("isRequired rule", () => {
      it("gives false if `no value` is given", () =>
        expect(checkValidity("", { isRequired: true })).toEqual(false));

      it("gives true if not empty `value` is given", () =>
        expect(checkValidity("foo", { isRequired: true })).toEqual(true));
    });

    describe("minLength rule", () => {
      it("gives false if `value` len shorter than given", () => {
        expect(checkValidity("", { minLength: 3 })).toEqual(false);
        expect(checkValidity("a", { minLength: 3 })).toEqual(false);
        expect(checkValidity("ab", { minLength: 3 })).toEqual(false);
      });

      it("gives true if `value` len is longer than given", () => {
        expect(checkValidity("foo", { minLength: 3 })).toEqual(true);
        expect(checkValidity("foobar", { minLength: 3 })).toEqual(true);
      });
    });

    describe("maxLength rule", () => {
      it("gives false if `value` len is longer than given ", () =>
        expect(checkValidity("foo", { maxLength: 2 })).toEqual(false));

      it("gives true if value len is shorter than given", () =>
        expect(checkValidity("foo", { maxLength: 4 })).toEqual(true));
    });

    const specialSigns = "!@#$%^&*()<>?/.,;'|:[]{}_+`~\"".split();

    describe("nameType rule", () => {
      it("gives false if `value` is empty ", () =>
        expect(checkValidity("", { nameType: true })).toEqual(false));

      it.each(specialSigns)(
        "gives false if `value` contains special sign `%s`",
        v => expect(checkValidity(v, { nameType: true })).toEqual(false)
      );

      it("gives true if `value` is a word", () =>
        expect(checkValidity("foo", { nameType: true })).toEqual(true));

      it("gives true if `value` are two words", () =>
        expect(checkValidity("foo bar", { nameType: true })).toEqual(true));
    });

    describe("phoneType rule", () => {
      it("gives false if `value` is empty ", () =>
        expect(checkValidity("", { phoneType: true })).toEqual(false));

      test.each(specialSigns)(
        "gives false if `value` contains special sign `%s`",
        v => expect(checkValidity(v, { phoneType: true })).toEqual(false)
      );
    });
  });
});
