import { createElement } from "lwc";
import oppAssesment from "c/oppAssesment";
import { getRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import {
  getObjectInfo,
  getPicklistValuesByRecordType
} from "lightning/uiObjectInfoApi";

import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

// Mock realistic data
const mockGetRecord = require("./data/getRecord.json");
const mockGetObjInfo = require("./data/getObjectInfo.json");
const mockGetPicklistValue = require("./data/getPicklistValues.json");
const mockErrorResponse = require("./data/mockErrorResponse.json");

// Register as an LDS wire adapter
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
const getObjInfoAdapter = registerLdsTestWireAdapter(getObjectInfo);
const getPicklistValueAdapter = registerLdsTestWireAdapter(
  getPicklistValuesByRecordType
);

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
      getRecordAdapter.emit(mockGetRecord);
      getObjInfoAdapter.emit(mockGetObjInfo);
      getPicklistValueAdapter.emit(mockGetPicklistValue);

      return Promise.resolve().then(() => {
        const nameElement =
          element.shadowRoot.querySelector("tr>td:nth-child(2)");
        expect(nameElement.textContent).toBe(
          mockGetObjInfo.fields.Customer_Application_or_Project__c.label
        );
      });
    });
  });

  describe("oncilck event", () => {
    it("calls selected method after click", async () => {
      const target = {
        name: "Customer_Application_or_Project__c",
        value: "Defined",
        checked: false
      };
      const element = createElement("c-opp-Assesment", {
        is: oppAssesment
      });
      document.body.appendChild(element);

      getRecordAdapter.emit(mockGetRecord);
      getObjInfoAdapter.emit(mockGetObjInfo);
      getPicklistValueAdapter.emit(mockGetPicklistValue);
      await Promise.resolve();
      const input = element.shadowRoot.querySelectorAll("input");
      expect(input.length).toBe(60);
      input[0].dispatchEvent(
        new CustomEvent("click", {
          detail: target
        })
      );
      await Promise.resolve();
      const input1 = element.shadowRoot.querySelectorAll("input");
      expect(input1[0].checked).toBe(false);
    });
  });

  // describe("getObjectInfo @wire error", () => {
  //   it("shows error panel element", async () => {
  //     // Create initial element
  //     const element = createElement("c-opp-Assesment", {
  //       is: oppAssesment
  //     });
  //     document.body.appendChild(element);
  //     // getRecordAdapter.emit(mockGetRecord);
  //     // getObjInfoAdapter.emit(mockGetObjInfo);
  //     // getPicklistValueAdapter.emit(mockGetPicklistValue);
  //     // Emit error from @wire
  //     getObjInfoAdapter.emit(mockErrorResponse);

  //     return Promise.resolve().then(() => {
  //       const input = element.shadowRoot.handleError(mockErrorResponse);
  //       expect(input).toBe(0);
  //     });
  //   });
  // });
});
