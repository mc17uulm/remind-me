import {View} from "./View";
import {__} from "@wordpress/i18n";
import {Templates} from "./sites/Templates";
import React from "react";

View.run(__('Templates', 'wp-reminder'), <Templates />);