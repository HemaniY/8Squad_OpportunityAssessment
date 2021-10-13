import { createElement } from "lwc";
import oppAssesment from "c/oppAssesment";
// import { getRecord } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

// Mock realistic data
// const mockGetRecord = require("./data/getRecord.json");
const mockGetObjInfo = require("./data/getObjectInfo.json");

// Register as an LDS wire adapter
// const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getObjInfoAdapter = registerLdsTestWireAdapter(getObjectInfo);

describe("c-wire-l-d-s", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
  describe("getObject @wire data", () => {
    it("renders Opportunity Object details", () => {
      const element = createElement("c-opp-Assesment", {
        is: oppAssesment
      });
      document.body.appendChild(element);

      // Emit data from @wire
      // getRecordAdapter.emit(mockGetRecord);
      getObjInfoAdapter.emit(mockGetObjInfo);

      return Promise.resolve().then(() => {
        const nameElement = element.shadowRoot.querySelector("tr");
        expect(nameElement.textContent).toBe(
          mockGetObjInfo.fields.Customer_Application_or_Project__c.label
        );
      });
    });
  });
});
