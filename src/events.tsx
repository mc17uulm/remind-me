import {View} from "./View";
import {Events} from "./sites/Events";
import React from "react";
import {__} from "@wordpress/i18n";

View.run(__("Events", 'wp-reminder'), <Events />);