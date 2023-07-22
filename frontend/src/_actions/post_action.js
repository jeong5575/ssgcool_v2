import axios from "axios";
import {SELECT_POST} from "./types";

export function selectPost (post){
    return {
      type: SELECT_POST,
      payload: post,
    }
  };