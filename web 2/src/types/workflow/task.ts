/* eslint-disable @typescript-eslint/no-explicit-any */
export enum ETaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
    FILL_INPUT = "FILL_INPUT",
    CLICK_ELEMENT = "CLICK_ELEMENT",
    WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
    DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
    EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
    READ_PROPERTY_FROM_JSON = "READ_PROPERTY_FROM_JSON",
    ADD_PROPERTY_TO_JSON = "ADD_PROPERTY_TO_JSON",
    NAVIGATE_URL = "NAVIGATE_URL",
    SCROLL_TO_ELEMENT = "SCROLL_TO_ELEMENT",
    NETWORK = "NETWORK",
    HOSPITAL = "HOSPITAL",
    DEPARTMENT = "DEPARTMENT"
  }
  
  export enum ETaskParamType {
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    SELECT = "SELECT",
    CREDENTIAL = "CREDENTIAL",
    ARRAY = "ARRAY",
    NUMBER = "NUMBER"
  }
  
  export interface ITaskParam {
    name: string;
    type: ETaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    value?: string;
    [key: string]: any;
  }
  