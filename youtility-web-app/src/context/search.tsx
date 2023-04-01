import { useState } from "react";
import { contextStateFactory } from "./factory";

const useSearchValue = (init: string) => useState(init || "");

const [SearchProvider, useSearch] = contextStateFactory(useSearchValue);

export { SearchProvider, useSearch };