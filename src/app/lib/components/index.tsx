import { JSX } from "react";
import DataNotFound, { DataNotFoundProps } from "./dataNotFound";
import Loading from "./loading";

export class LibComponents {
    static DataNotFound: ({ message }: DataNotFoundProps) => JSX.Element = DataNotFound;
    static Loading: () => JSX.Element = Loading;
}