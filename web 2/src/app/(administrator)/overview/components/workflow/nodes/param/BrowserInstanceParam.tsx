"use client";

import { ParamProps } from "@/types/workflow/appNode";
import React from "react";

export const BrowserInstanceParam = ({ param }: ParamProps) => {
  return <p className="text-xs">{param.name}</p>;
}
